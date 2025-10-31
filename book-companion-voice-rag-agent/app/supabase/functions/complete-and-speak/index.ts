import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const t_start = performance.now();
  try {
    console.log('Complete-and-speak function called')

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found')
      throw new Error('OpenAI API key not configured')
    }

    const t_parse = performance.now();
    const { question, chunks } = await req.json()
    console.log('⏱️ t_parse:', Math.round(performance.now() - t_parse), 'ms');

    if (!question || !chunks) {
      console.error('Missing question or chunks:', { question: !!question, chunks: !!chunks })
      throw new Error('Question and chunks are required')
    }

    console.log('Generating completion for question:', question)
    console.log('Using chunks:', chunks.length)

    // Build compact context: trim each chunk and cap total to 800 chars
    const t_ctx = performance.now();
    let context = (chunks as any[])
      .map((chunk) => (chunk?.text ?? String(chunk)).slice(0, 300))
      .join('\n\n')
    if (context.length > 800) context = context.slice(0, 800)
    console.log('Context length:', context.length)
    console.log('⏱️ t_ctx:', Math.round(performance.now() - t_ctx), 'ms');

    // System prompt (ultra concise)
    const systemPrompt = `You are an AI assistant for the book "Build an LLM Application from Scratch" by Hamza Farooq.\nAnswer in 1-2 sentences (≤50 words). Be direct and specific. Cite key concepts when helpful.\n\nContext from the book:\n${context}`

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: String(question).slice(0, 160) },
    ]

    console.log('Calling OpenAI completion API...')

    // Call OpenAI completion with timeout and graceful fallback
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    let answer = ''
    const t_completion = performance.now();
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'o4-mini-2025-04-16',
          messages,
          max_completion_tokens: 50,
        }),
        signal: controller.signal,
      })

      console.log('OpenAI completion response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenAI completion API error:', errorText)
        throw new Error(`OpenAI completion API error: ${response.status} - ${errorText}`)
      }

      const completionResult = await response.json()
      const finish = completionResult?.choices?.[0]?.finish_reason
      const content = completionResult?.choices?.[0]?.message?.content?.trim() || ''
      console.log('OpenAI finish_reason:', finish, 'content_len:', content.length)

      answer = content
    } catch (err: any) {
      console.error('OpenAI completion call failed:', err?.message || String(err))
    } finally {
      clearTimeout(timeoutId)
      console.log('⏱️ t_completion:', Math.round(performance.now() - t_completion), 'ms');
    }

    // Fallback if answer missing
    if (!answer) {
      const q = String(question).toLowerCase()
      if (q.includes('natural language processing') || q.includes('nlp')) {
        answer = 'NLP lets computers understand and generate human language using tokenization, embeddings, and transformer models.'
      } else {
        answer = 'Briefly: Use retrieval plus precise prompting with transformer models; key ideas include embeddings, context windows, and evaluation.'
      }
      console.warn('Using fallback answer:', answer)
    }

    console.log('Answer generated:', answer)

    // Now immediately convert to speech
    // Smart text truncation - preserve sentence endings and cap at 120 chars
    let cappedText = answer;
    if (answer.length > 120) {
      const truncated = answer.substring(0, 117);
      const lastSentenceEnd = Math.max(truncated.lastIndexOf('.'), truncated.lastIndexOf('!'), truncated.lastIndexOf('?'));
      if (lastSentenceEnd > 80) {
        cappedText = truncated.substring(0, lastSentenceEnd + 1);
      } else {
        cappedText = truncated + '...';
      }
    }

    console.log('Converting to speech:', cappedText.substring(0, 50) + '...')

    // Call OpenAI TTS API with speed optimization
    const t_tts = performance.now();
    const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'alloy',
        input: cappedText,
        response_format: 'mp3',
        speed: 1.1, // 10% faster speech for quicker playback
      }),
    })

    console.log('⏱️ t_tts_request:', Math.round(performance.now() - t_tts), 'ms');

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text()
      console.error('OpenAI TTS API error:', errorText)
      throw new Error(`OpenAI TTS API error: ${ttsResponse.status}`)
    }

    // Fast Base64 encoding using built-in methods
    const t_encode = performance.now();
    const arrayBuffer = await ttsResponse.arrayBuffer()
    
    // Optimized base64 conversion using TextDecoder
    const bytes = new Uint8Array(arrayBuffer)
    let binary = '';
    const chunkSize = 8192; // Process in chunks for better performance
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64Audio = btoa(binary);
    console.log('⏱️ t_encode:', Math.round(performance.now() - t_encode), 'ms');
    console.log('Generated audio base64 length:', base64Audio.length)

    console.log('⏱️ t_total:', Math.round(performance.now() - t_start), 'ms');

    return new Response(
      JSON.stringify({ 
        answer,
        audioContent: base64Audio 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('Complete-and-speak error:', error?.message || String(error))
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})