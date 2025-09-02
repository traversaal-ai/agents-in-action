import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Realtime chat function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  try {
    console.log('Upgrading to WebSocket...');
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment');
      socket.close(1000, 'Configuration error');
      return response;
    }

    console.log('OPENAI_API_KEY found, connecting to OpenAI...');
    
    // Import WebSocket with proper error handling
    let WebSocketClass;
    try {
      const wsModule = await import('npm:ws@8.18.0');
      WebSocketClass = wsModule.default;
      console.log('Successfully imported ws module');
    } catch (importError) {
      console.error('Failed to import ws module:', importError);
      socket.close(1000, 'Failed to load WebSocket module');
      return response;
    }

    // Create WebSocket connection to OpenAI with headers
    const openAIUrl = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17";
    let openAISocket: any = null;
    
    try {
      openAISocket = new WebSocketClass(openAIUrl, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      });
      console.log('Created OpenAI WebSocket connection');
    } catch (connectionError) {
      console.error('Failed to create OpenAI WebSocket:', connectionError);
      socket.close(1011, 'Failed to connect to OpenAI');
      return response;
    }

    let sessionId = crypto.randomUUID();
    let clientSessionId: string | null = null;
    let handledToolThisTurn = false;
    let responseInProgress = false;
    console.log('Generated session ID:', sessionId);

    openAISocket.on('open', () => {
      console.log('Connected to OpenAI Realtime API');
    });

    openAISocket.on('message', async (raw: any) => {
      try {
        // Handle different message types from ws library
        let text: string;
        if (typeof raw === 'string') {
          text = raw;
        } else if (raw instanceof ArrayBuffer) {
          text = new TextDecoder().decode(new Uint8Array(raw));
        } else if (raw instanceof Uint8Array) {
          text = new TextDecoder().decode(raw);
        } else {
          // For other types, try to convert to string
          text = String(raw);
        }

        console.log('📨 Raw OpenAI message received, length:', text.length);
        console.log('📨 First 200 chars:', text.substring(0, 200));
        
        const data = JSON.parse(text);
        console.log('📋 OpenAI message type:', data.type);
        console.log('📋 Full message data:', JSON.stringify(data, null, 2));

        // Reset per-turn tool flag when a response starts or completes
        if (data.type === 'response.created') {
          handledToolThisTurn = false;
          responseInProgress = true;
        } else if (data.type === 'response.done') {
          handledToolThisTurn = false;
          responseInProgress = false;
        }

        // Send session.update after session.created
        if (data.type === 'session.created') {
          console.log('🎉 Session created, sending configuration...');
          const sessionUpdate = {
            type: 'session.update',
            session: {
              modalities: ["text", "audio"],
              instructions: "You are a strict Book Companion for 'Build an LLM Application from Scratch' by Hamza Farooq. IMPORTANT RULES: 1) ALWAYS call query_rag for ANY user question - no exceptions. 2) ONLY answer questions if RAG returns relevant book content. 3) If RAG returns no results or irrelevant content, politely refuse: 'I can only help with questions about the book Build an LLM Application from Scratch. Please ask something related to the book content.' 4) If you detect abusive, inappropriate, or harmful content, immediately end the conversation: 'I cannot continue this conversation. Please reach out to support if needed.' 5) Never answer general knowledge questions like capitals of countries, math problems, etc. - always use RAG first to check if it's in the book.",
              voice: "sage",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500
              },
              tools: [
                {
                  type: "function",
                  name: "query_rag",
                  description: "Search the knowledge base for relevant information to help answer user questions. Use this when you need context to provide accurate answers.",
                  parameters: {
                    type: "object",
                    properties: {
                      question: { 
                        type: "string",
                        description: "The user's question or query to search for"
                      },
                      session_id: { 
                        type: "string",
                        description: "The current session ID for the conversation"
                      }
                    },
                    required: ["question", "session_id"]
                  }
                }
              ],
              tool_choice: "auto",
              temperature: 0.8,
              max_response_output_tokens: "inf"
            }
          };

          console.log('📤 Sending session update:', JSON.stringify(sessionUpdate, null, 2));
          openAISocket.send(JSON.stringify(sessionUpdate));
        }

        // Handle function calls
        if (data.type === 'response.function_call_arguments.done') {
          console.log('🔧 Function call completed:', JSON.stringify(data, null, 2));

          // Prevent duplicate tool calls within the same turn
          if (handledToolThisTurn) {
            console.warn('⚠️ Duplicate tool call detected for this turn. Ignoring.');
            return;
          }

          if (data.name === 'query_rag') {
            try {
              const args = JSON.parse(data.arguments);
              console.log('🔍 RAG query args:', JSON.stringify(args, null, 2));

              // Get RAG endpoint URL from environment
              const N8N_RAG_URL = Deno.env.get('N8N_RAG_URL');
              if (!N8N_RAG_URL) {
                console.error('❌ N8N_RAG_URL not found in environment');
                throw new Error('RAG endpoint not configured');
              }

              // Call your n8n RAG endpoint
              console.log('📡 Calling RAG endpoint...');
              const ragResponse = await fetch(N8N_RAG_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  question: args.question,
                  sessionId: clientSessionId || args.session_id || sessionId
                })
              });

              if (!ragResponse.ok) {
                console.error('❌ RAG endpoint error:', ragResponse.status, ragResponse.statusText);
                throw new Error(`RAG endpoint returned ${ragResponse.status}`);
              }

              const ragData = await ragResponse.json();
              console.log('✅ RAG response received:', JSON.stringify(ragData, null, 2));

              // Build robust context text
              const texts: string[] = Array.isArray(ragData)
                ? ragData.flatMap((item: any) => {
                    if (typeof item?.text === 'string') return [item.text];
                    if (Array.isArray(item?.chunks)) return item.chunks.map((c: any) => c?.text).filter((t: any) => typeof t === 'string');
                    return [];
                  })
                : [];

              const hasContent = texts.length > 0;
              const outputPayload = hasContent
                ? { success: true, chunks: ragData, context: texts.join('\n\n') }
                : { success: false, error: 'no_results' };

              // Send function output back to OpenAI
              const functionOutput = {
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: data.call_id,
                  output: JSON.stringify(outputPayload)
                }
              };

              console.log('📤 Sending function output back to OpenAI');
              openAISocket.send(JSON.stringify(functionOutput));
              handledToolThisTurn = true;
              
              // Only trigger response if none is in progress
              if (!responseInProgress) {
                console.log('🎯 Triggering response generation');
                openAISocket.send(JSON.stringify({ type: 'response.create' }));
              } else {
                console.log('⚠️ Response already in progress, skipping response.create');
              }
            } catch (error) {
              console.error('❌ Error calling RAG:', error);

              // Send error response
              const errorOutput = {
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: data.call_id,
                  output: JSON.stringify({
                    success: false,
                    error: 'Failed to retrieve context from knowledge base'
                  })
                }
              };

              openAISocket.send(JSON.stringify(errorOutput));
              handledToolThisTurn = true;
              
              // Only trigger response if none is in progress
              if (!responseInProgress) {
                console.log('🎯 Triggering error response generation');
                openAISocket.send(JSON.stringify({ type: 'response.create' }));
              } else {
                console.log('⚠️ Response already in progress, skipping error response.create');
              }
            }
          }
        }

        // Forward all messages to client
        if (socket.readyState === WebSocket.OPEN) {
          console.log('📤 Forwarding message to client');
          socket.send(text);
        } else {
          console.warn('⚠️ Client socket not open, readyState:', socket.readyState);
        }
      } catch (e) {
        console.error('❌ Error processing OpenAI message:', e);
        console.error('❌ Raw message that caused error:', typeof raw, raw);
      }
    });

    openAISocket.on('error', (error: any) => {
      console.error('OpenAI WebSocket error:', error);
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1011, 'OpenAI upstream error');
      }
    });

    openAISocket.on('close', (code: number, reason: string) => {
      console.log('OpenAI WebSocket closed:', code, reason);
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, 'OpenAI connection closed');
      }
    });

    // Handle client messages – check for control messages or forward to OpenAI
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle client control messages
        if (message.type === 'client.set_session') {
          clientSessionId = message.sessionId;
          console.log('Client session ID set:', clientSessionId);
          return;
        }
      } catch (e) {
        // Not a JSON message, treat as normal message
      }
      
      // Forward all other messages to OpenAI
      if (openAISocket.readyState === 1 /* OPEN */) {
        openAISocket.send(event.data);
      }
    };

    socket.onclose = () => {
      console.log('Client disconnected');
      try { openAISocket.close(); } catch (_) {/* ignore */}
    };

    socket.onerror = (error) => {
      console.error('Client WebSocket error:', error);
    };

    return response;

  } catch (error) {
    console.error('WebSocket setup error:', error);
    return new Response('WebSocket setup failed', { status: 500, headers: corsHeaders });
  }
});