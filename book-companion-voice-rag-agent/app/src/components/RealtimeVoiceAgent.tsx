import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Mic, MicOff, MessageSquare, BookOpen, Sparkles, Download, Linkedin, Github } from 'lucide-react';
import { RealtimeChat } from '@/utils/RealtimeAudio';

interface Message {
  id: string;
  type: string;
  content?: string;
  timestamp: Date;
}

export default function RealtimeVoiceAgent() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'listening' | 'processing' | 'speaking' | 'disconnected'>('disconnected');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const [conversationEnded, setConversationEnded] = useState(false);
  const [awaitingFirstAudio, setAwaitingFirstAudio] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const addMessage = (type: string, content?: string) => {
    // Skip system messages from UI
    if (type === 'system' || !content?.trim()) return;
    
    const message: Message = {
      id: crypto.randomUUID(),
      type,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
  };

  const handleMessage = (data: any) => {
    console.log('🔍 Processing message:', data.type, data);

    switch (data.type) {
      case 'memory.message':
        // Memory messages loaded silently - don't display in UI to avoid clutter
        console.log('🧠 Loaded message from memory:', data.role, data.content);
        break;

      case 'session.created':
        console.log('✅ Session created');
        setCurrentStatus('listening');
        // Preemptively mute mic in case AI starts with intro message
        setIsMicMuted(true);
        break;
      
      case 'session.updated':
        console.log('⚙️ Session updated');
        break;

      case 'client.intro.started':
        console.log('🎬 Intro started - muting mic');
        setIsMicMuted(true);
        setCurrentStatus('speaking');
        break;

      case 'client.intro.ended':
        console.log('🏁 Intro ended');
        if (!isAISpeaking) {
          setIsMicMuted(false);
          setCurrentStatus('listening');
        }
        break;

      case 'input_audio_buffer.speech_started':
        console.log('🎤 Speech started');
        setCurrentTranscript('Speech detected...');
        setCurrentStatus('processing');
        break;

      case 'input_audio_buffer.speech_stopped':
        console.log('⏹️ Speech stopped');
        setCurrentTranscript('Processing your question...');
        setCurrentStatus('processing');
        break;

      case 'conversation.item.input_audio_transcription.completed':
        console.log('📝 Transcription completed:', data.transcript);
        setCurrentTranscript('');
        addMessage('user', data.transcript);
        break;

      case 'response.function_call_arguments.delta':
        if (data.name === 'query_rag') {
          console.log('🔍 RAG function call in progress');
        }
        break;

      case 'response.function_call_arguments.done':
        if (data.name === 'query_rag') {
          console.log('✅ RAG function completed');
        }
        break;

      case 'response.created':
        console.log('🤖 AI response started');
        // Keep processing state until first audio chunk
        setAwaitingFirstAudio(true);
        setIsMicMuted(true);
        setCurrentAIMessage('');
        break;

      case 'response.audio.delta':
        console.log('🔊 Audio chunk received');
        setAwaitingFirstAudio(false);
        setIsAISpeaking(true);
        setCurrentStatus('speaking');
        break;

      case 'response.audio_transcript.delta':
        console.log('📝 AI transcript delta:', data.delta);
        setCurrentAIMessage(prev => prev + data.delta);
        break;

      case 'response.audio_transcript.done':
        console.log('📝 AI transcript complete:', data.transcript);
        // Use data.transcript directly instead of stale currentAIMessage
        if (data.transcript?.trim()) {
          addMessage('assistant', data.transcript);
          setCurrentAIMessage('');
        }
        break;

      case 'response.audio.done':
        console.log('🔊 Audio response complete (stream ended)');
        // Do not unmute here; wait for client.audio.playback_idle from AudioQueue
        break;

      case 'client.audio.playback_idle':
        console.log('🏁 Playback fully finished');
        setIsAISpeaking(false);
        setIsMicMuted(false);
        setCurrentStatus('listening');
        break;

      case 'response.done':
        console.log('✅ Full response complete');
        setCurrentTranscript('');
        // Only switch to listening if we're not still waiting for audio
        if (!awaitingFirstAudio) {
          setCurrentStatus('listening');
        } else {
          // If no audio was received, emit idle event to clean up
          console.log('🔇 Response complete but no audio received, cleaning up');
          setAwaitingFirstAudio(false);
          setIsAISpeaking(false);
          setIsMicMuted(false);
          setCurrentStatus('listening');
        }
        break;

      case 'error':
        console.error('❌ Realtime API error:', data);
        setCurrentStatus('listening');
        toast({
          title: "Error",
          description: data.error?.message || 'An error occurred',
          variant: "destructive",
        });
        break;

      default:
        console.log('❓ Unknown message type:', data.type, data);
        break;
    }
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
    setIsConnecting(false);
    if (connected) {
      toast({
        title: "Connected",
        description: "Realtime voice chat with RAG is ready",
      });
    }
    // Remove disconnection toast - user doesn't need notification when they end chat
  };

  const startChat = async () => {
    try {
      setIsConnecting(true);
      chatRef.current = new RealtimeChat(handleMessage, handleConnectionChange);
      await chatRef.current.connect();
    } catch (error) {
      console.error('Error starting chat:', error);
      setIsConnecting(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start voice chat',
        variant: "destructive",
      });
    }
  };

  const endChat = () => {
    // Capture any partial AI message before clearing state
    if (currentAIMessage.trim()) {
      addMessage('assistant', `${currentAIMessage} (partial response - chat ended)`);
    }
    
    chatRef.current?.disconnect();
    setIsConnecting(false);
    setCurrentTranscript('');
    setIsAISpeaking(false);
    setIsMicMuted(false);
    setCurrentAIMessage('');
    setCurrentStatus('disconnected');
    setConversationEnded(messages.length > 0 || currentAIMessage.trim().length > 0);
  };

  const downloadConversation = () => {
    // Include any pending AI message in the download
    const allMessages = [...messages];
    if (currentAIMessage.trim()) {
      allMessages.push({
        id: crypto.randomUUID(),
        type: 'assistant',
        content: currentAIMessage,
        timestamp: new Date()
      });
    }
    
    const conversationText = allMessages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationEnded(false);
    startChat();
  };

  // Initialize on mount
  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background font-inter">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--accent)_0%,_transparent_50%)] opacity-10" />
        
        <div className="relative z-10 container mx-auto px-6 pt-2 pb-1">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="px-3 py-1 text-sm bg-card/50 border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              AI Book Companion
            </Badge>
          </div>

          {/* Main Title */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex flex-col items-center justify-center mb-8">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
                Build an LLM Application (from Scratch)
              </h1>
            </div>
            
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative mb-3">
                <img 
                  src="/lovable-uploads/2b71a32c-d783-46a8-80fe-ed099cd25f69.png" 
                  alt="Hamza Farooq - Author" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-light mb-1">
                  by
                </p>
                <p className="text-lg text-primary font-medium">
                  Hamza Farooq
                </p>
              </div>
            </div>
            
            
            {/* Get the book link */}
            <div className="flex justify-center mb-4">
              <a 
                href="https://www.manning.com/books/build-an-llm-application-from-scratch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:scale-105 transition-transform shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                Get the book
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Interface Section */}
      <div className="relative z-10 container mx-auto px-6 pb-6 mt-4">
        <div className="max-w-md mx-auto">
          {/* Glass Card */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-card/60 to-secondary/40 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden">
            <div className="relative z-10 text-center">
              {/* Status Display */}
              {!isConnected ? (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">Ready to start voice chat</p>
                  <p className="text-sm text-muted-foreground">
                    Click below to begin real-time conversation
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Ambient glow rings when AI is speaking (scoped to mic area) */}
                  <div className="relative mx-auto w-full max-w-[240px] py-4 overflow-hidden rounded-2xl">
                    {isAISpeaking && (
                      <>
                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/15 animate-pulse z-0" />
                        <div className="pointer-events-none absolute inset-1 rounded-2xl ring-1 ring-primary/20 animate-[ping_1.5s_ease-out_infinite] z-0" />
                        <div className="pointer-events-none absolute inset-2 rounded-2xl ring-1 ring-primary/15 animate-[ping_2s_ease-out_infinite] [animation-delay:400ms] z-0" />
                      </>
                    )}
                    {/* Processing glow when thinking */}
                    {(currentStatus === 'processing' || awaitingFirstAudio) && (
                      <>
                        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-yellow-500/15 animate-pulse z-0" />
                        <div className="pointer-events-none absolute inset-2 rounded-2xl ring-1 ring-yellow-500/25 animate-[ping_1s_ease-out_infinite] z-0" />
                      </>
                    )}
                    <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-500 ${
                      isAISpeaking
                        ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 scale-110' 
                        : (currentStatus === 'processing' || awaitingFirstAudio)
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25 animate-pulse'
                        : isMicMuted
                        ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                        : 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                    }`}>
                      {isMicMuted ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                    </div>
                  </div>
                  <p className="text-lg font-medium text-foreground">
                    {isAISpeaking ? 'AI is speaking...' : 
                     (currentStatus === 'processing' || awaitingFirstAudio) ? 'Processing...' : 
                     isMicMuted ? 'Mic muted' :
                     'Listening...'}
                  </p>
                  {currentTranscript && (
                    <p className="text-sm text-muted-foreground italic">
                      {currentTranscript}
                    </p>
                  )}
                  {/* Loading dots animation when processing */}
                  {(currentStatus === 'processing' || awaitingFirstAudio) && (
                    <div className="flex justify-center items-center mt-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="flex gap-4 justify-center mt-6">
                {conversationEnded ? (
                  <div className="flex gap-3">
                    <Button 
                      onClick={downloadConversation}
                      variant="outline"
                      size="lg"
                      className="px-6 border-primary/50 text-primary hover:bg-primary/10"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Conversation
                    </Button>
                    <Button 
                      onClick={startNewChat}
                      size="lg"
                      className="px-6 bg-gradient-to-br from-primary to-accent text-primary-foreground hover:scale-105"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      New Chat
                    </Button>
                  </div>
                ) : !isConnected ? (
                  <Button 
                    onClick={startChat}
                    size="icon"
                    disabled={isConnecting}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground hover:scale-105 shadow-lg shadow-primary/25"
                  >
                    <Mic className="w-10 h-10" />
                  </Button>
                ) : (
                  <Button 
                    onClick={endChat}
                    variant="outline"
                    size="lg"
                    className="px-8 border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <MicOff className="w-5 h-5 mr-2" />
                    End Chat
                  </Button>
                )}
              </div>

              {/* Features */}
              <div className="text-center text-sm text-muted-foreground space-y-1 mt-6">
                <p>🎤 Real-time voice conversation</p>
                <p>🧠 Persistent chat memory across sessions</p>
                <p>⚡ Ultra-fast streaming responses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Footer */}
      <div className="relative z-10 container mx-auto px-6 pb-4 mt-2">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Built by Yousuf Alvi — Engineering Lead | Applied AI builder
          </p>
          <div className="flex justify-center items-center gap-1">
            <a 
              href="https://www.linkedin.com/in/yousufalvi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://github.com/traversaal-ai/agents-in-action" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
              aria-label="GitHub Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}