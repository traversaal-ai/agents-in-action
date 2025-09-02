import { supabase } from '@/integrations/supabase/client';

// Cache for intro audio - preload immediately
let cachedIntroAudio: string | null = null;
let introLoadingPromise: Promise<void> | null = null;

// Preload intro audio immediately when module loads
const preloadIntroAudio = async () => {
  if (cachedIntroAudio || introLoadingPromise) return;
  
  introLoadingPromise = (async () => {
    try {
      console.log('🎵 Preloading intro audio...');
      const { data, error } = await supabase.functions.invoke('generate-intro-audio');
      if (data?.audioContent) {
        cachedIntroAudio = data.audioContent;
        console.log('✅ Intro audio preloaded');
      } else {
        console.error('Failed to preload intro audio:', error);
      }
    } catch (error) {
      console.error('Error preloading intro audio:', error);
    }
  })();
};

// Start preloading immediately
preloadIntroAudio();

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isMuted = false;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        // Don't send audio when muted (AI is speaking)
        if (!this.isMuted) {
          const inputData = e.inputBuffer.getChannelData(0);
          this.onAudioData(new Float32Array(inputData));
        }
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  mute() {
    console.log('🔇 Muting microphone (AI speaking)');
    this.isMuted = true;
  }

  unmute() {
    console.log('🎤 Unmuting microphone (AI finished)');
    this.isMuted = false;
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

const createWavFromPCM = (pcmData: Uint8Array): Uint8Array => {
  // Convert bytes to 16-bit samples (little endian)
  const int16Data = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < pcmData.length; i += 2) {
    int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
  }
  
  // Create WAV header
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // WAV header parameters
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + int16Data.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, int16Data.byteLength, true);

  // Combine header and data
  const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
  
  return wavArray;
};

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;
  private currentSource: AudioBufferSourceNode | null = null;
  private onIdleCallback?: () => void;
  private idleTimeout?: number;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  setOnIdle(callback?: () => void) {
    this.onIdleCallback = callback;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  stop() {
    this.queue = [];
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = undefined;
    }
    this.isPlaying = false;
    // Call onIdle for cleanup
    if (this.onIdleCallback) {
      this.onIdleCallback();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      this.currentSource = null;
      
      // Add small debounce before calling onIdle to avoid clipping
      if (this.onIdleCallback && !this.idleTimeout) {
        this.idleTimeout = window.setTimeout(() => {
          console.log('🔇 Audio queue idle - calling onIdle callback');
          this.onIdleCallback?.();
          this.idleTimeout = undefined;
        }, 100);
      }
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      this.currentSource = this.audioContext.createBufferSource();
      this.currentSource.buffer = audioBuffer;
      this.currentSource.connect(this.audioContext.destination);
      
      this.currentSource.onended = () => this.playNext();
      this.currentSource.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }
}

let audioQueueInstance: AudioQueue | null = null;
let pendingOnIdleCallback: (() => void) | undefined;

export const setAudioQueueOnIdle = (callback?: () => void) => {
  if (audioQueueInstance) {
    audioQueueInstance.setOnIdle(callback);
  } else {
    // Store callback to be applied when queue is created
    pendingOnIdleCallback = callback;
  }
};

export const playAudioData = async (audioContext: AudioContext, audioData: Uint8Array) => {
  if (!audioQueueInstance) {
    audioQueueInstance = new AudioQueue(audioContext);
    // Apply any pending callback
    if (pendingOnIdleCallback) {
      audioQueueInstance.setOnIdle(pendingOnIdleCallback);
      pendingOnIdleCallback = undefined;
    }
  }
  await audioQueueInstance.addToQueue(audioData);
};

export class RealtimeChat {
  private ws: WebSocket | null = null;
  private recorder: AudioRecorder | null = null;
  private audioContext: AudioContext;
  private isConnected = false;
  private isConnecting = false;
  private isIntentionalDisconnect = false;
  private introPlayed = false;
  private introPlaying = false;
  private introSource: AudioBufferSourceNode | null = null;
  private receivedAudioForResponse = false;
  private aiResponseInProgress = false;
  private sessionId: string;
  private messageBuffer: Array<{role: string, content: string, timestamp: string}> = [];

  constructor(
    private onMessage: (message: any) => void,
    private onConnectionChange: (connected: boolean) => void,
    private onStatusChange?: (status: 'listening' | 'processing' | 'speaking' | 'error') => void,
    private onTranscriptUpdate?: (transcript: string) => void,
    sessionId?: string
  ) {
    this.audioContext = new AudioContext();
    // Use provided sessionId or get from localStorage, or generate new one
    this.sessionId = sessionId || this.getOrCreateSessionId();
    console.log('RealtimeChat initialized with session ID:', this.sessionId);
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('realtime-session-id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('realtime-session-id', sessionId);
    }
    return sessionId;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public resetSession(): string {
    this.sessionId = crypto.randomUUID();
    localStorage.setItem('realtime-session-id', this.sessionId);
    this.messageBuffer = []; // Clear message buffer for new session
    console.log('Session reset, new ID:', this.sessionId);
    return this.sessionId;
  }

  private bufferMessageIfNeeded(data: any) {
    // Buffer user transcriptions and AI responses for saving to memory later
    if (data.type === 'conversation.item.input_audio_transcription.completed') {
      this.messageBuffer.push({
        role: 'user',
        content: data.transcript,
        timestamp: new Date().toISOString()
      });
    } else if (data.type === 'response.audio_transcript.done' && data.transcript?.trim()) {
      this.messageBuffer.push({
        role: 'assistant',
        content: data.transcript,
        timestamp: new Date().toISOString()
      });
    }
  }

  public async loadChatMemory(): Promise<void> {
    try {
      console.log('🧠 Loading chat memory for session:', this.sessionId);
      const { data, error } = await supabase.functions.invoke('chat-memory-load', {
        body: { sessionId: this.sessionId }
      });

      if (error) {
        console.error('❌ Error loading chat memory:', error);
        return;
      }

      const messages = data?.messages || [];
      console.log(`✅ Loaded ${messages.length} messages from memory`);

      // Emit loaded messages to UI for display
      for (const msg of messages) {
        this.onMessage({
          type: 'memory.message',
          role: msg.message.role,
          content: msg.message.content,
          timestamp: msg.message.timestamp
        });
      }
    } catch (error) {
      console.error('❌ Failed to load chat memory:', error);
    }
  }

  public async saveChatMemory(): Promise<void> {
    if (this.messageBuffer.length === 0) {
      console.log('📝 No messages to save');
      return;
    }

    try {
      console.log(`💾 Saving ${this.messageBuffer.length} messages to memory`);
      
      // Save in background without waiting
      supabase.functions.invoke('chat-memory-save', {
        body: {
          sessionId: this.sessionId,
          messages: this.messageBuffer
        }
      }).then(({ error }) => {
        if (error) {
          console.error('❌ Error saving chat memory:', error);
        } else {
          console.log('✅ Chat memory saved successfully');
        }
      }).catch(error => {
        console.error('❌ Failed to save chat memory:', error);
      });

      // Clear buffer after initiating save
      this.messageBuffer = [];
    } catch (error) {
      console.error('❌ Failed to initiate chat memory save:', error);
    }
  }

  private async playIntroAudio(): Promise<void> {
    if (!cachedIntroAudio || this.introPlayed || this.introPlaying) return;
    this.introPlaying = true;
    this.introPlayed = true;
    
    try {
      console.log('🎵 Playing intro audio...');
      // Notify UI and ensure mic is muted during intro
      this.onMessage({ type: 'client.intro.started' });
      if (this.recorder) {
        this.recorder.mute();
      }
      // Convert base64 to array buffer
      const binaryString = atob(cachedIntroAudio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decode and play using the shared audioContext
      const audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer);
      await new Promise<void>((resolve) => {
        this.introSource = this.audioContext.createBufferSource();
        this.introSource.buffer = audioBuffer;
        this.introSource.connect(this.audioContext.destination);
        this.introSource.onended = () => {
          this.introPlaying = false;
          this.introSource = null;
          // Unmute only if AI isn't currently speaking/responding
          if (!this.aiResponseInProgress && !this.receivedAudioForResponse) {
            this.recorder?.unmute();
          }
          // Inform UI that intro finished
          this.onMessage({ type: 'client.intro.ended' });
          resolve();
        };
        this.introSource.start(0);
      });
      console.log('✅ Intro audio finished');
    } catch (error) {
      console.error('Error playing intro audio:', error);
      this.introPlaying = false;
    }
  }

  async connect() {
    try {
      if (this.isConnecting || this.isConnected) {
        console.log('⚠️ Already connecting/connected, ignoring duplicate start');
        return;
      }
      this.isConnecting = true;
      console.log('🔄 Starting realtime chat connection...');

      // Load chat memory before connecting
      await this.loadChatMemory();
      
      // Start WebSocket connection immediately - don't wait for intro
      const wsUrl = `wss://atbrijpjxwklqtkgkast.functions.supabase.co/functions/v1/realtime-chat`;
      console.log('📡 Connecting to:', wsUrl);
      
      this.ws = new WebSocket(wsUrl);

      // Play intro audio in parallel (non-blocking)
      if (introLoadingPromise) {
        introLoadingPromise.then(() => {
          if (cachedIntroAudio && !this.introPlayed) {
            this.playIntroAudio().catch(error => 
              console.error('Error playing intro audio:', error)
            );
          }
        });
      }

      this.ws.onopen = async () => {
        console.log('✅ Connected to realtime chat');
        this.isConnected = true;
        this.isConnecting = false;
        this.onConnectionChange(true);

        // Send session ID to the edge function
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'client.set_session',
            sessionId: this.sessionId
          }));
          console.log('📤 Sent session ID to server:', this.sessionId);
        }

        try {
          // Start recording audio AFTER intro to avoid self-capture
          console.log('🎤 Starting audio recorder...');
          this.recorder = new AudioRecorder((audioData) => {
            if (this.ws?.readyState === WebSocket.OPEN) {
              const encodedAudio = encodeAudioForAPI(audioData);
              this.ws.send(JSON.stringify({
                type: 'input_audio_buffer.append',
                audio: encodedAudio
              }));
            }
          });

          await this.recorder.start();
          console.log('✅ Audio recorder started');
          if (this.introPlaying) {
            console.log('🔇 Intro still playing - keep microphone muted');
            this.recorder.mute();
          }
          
          // Set up audio queue idle callback to unmute when AI truly finishes speaking
          setAudioQueueOnIdle(() => {
            console.log('🎤 Audio queue idle - unmuting microphone');
            this.recorder?.unmute();
            // Inform UI that playback has fully finished
            this.onMessage({ type: 'client.audio.playback_idle' });
          });
        } catch (audioError) {
          console.error('❌ Audio recorder error:', audioError);
          throw audioError;
        }
      };

      this.ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 Received message:', data.type);
        
        // Buffer messages for chat memory
        this.bufferMessageIfNeeded(data);
        
        // Track responses and mute microphone when AI starts responding
        if (data.type === 'response.created') {
          console.log('🔇 AI response started - muting microphone');
          this.receivedAudioForResponse = false;
          this.aiResponseInProgress = true;
          this.recorder?.mute();
        }
        
        // Track when we receive first audio chunk for this response
        if (data.type === 'response.audio.delta') {
          if (!this.receivedAudioForResponse) {
            console.log('🎵 First audio chunk received - AI speaking');
            this.receivedAudioForResponse = true;
          }
          
          // Convert base64 to Uint8Array and play
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await playAudioData(this.audioContext, bytes);
        }
        
        // Handle response completion - unmute if no audio was received (text-only or error)
        if (data.type === 'response.done') {
          this.aiResponseInProgress = false;
          if (!this.receivedAudioForResponse && !this.introPlaying) {
            console.log('🎤 Response done with no audio - unmuting immediately');
            this.recorder?.unmute();
          }
          // If audio was received, unmuting will happen via onIdle callback
        }

        this.onMessage(data);
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket closed. Code:', event.code, 'Reason:', event.reason);
        this.isConnected = false;
        this.isConnecting = false;
        this.onConnectionChange(false);
        this.recorder?.stop();
        
        // Only show error toast for unexpected disconnections
        if (!this.isIntentionalDisconnect && event.code !== 1000) {
          import('@/hooks/use-toast').then(({ toast }) => {
            toast({
              title: "Connection Lost",
              description: `WebSocket closed unexpectedly (Code: ${event.code})`,
              variant: "destructive",
            });
          });
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error details:', {
          error,
          readyState: this.ws?.readyState,
          url: wsUrl,
          timestamp: new Date().toISOString()
        });
        this.isConnected = false;
        this.isConnecting = false;
        this.onConnectionChange(false);
        
        // Show toast notification for WebSocket errors
        import('@/hooks/use-toast').then(({ toast }) => {
          toast({
            title: "Connection Error",
            description: "Failed to connect to realtime chat. Please try again.",
            variant: "destructive",
          });
        });
      };

    } catch (error) {
      console.error('❌ Connection setup error:', error);
      throw error;
    }
  }

  sendTextMessage(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.ws.send(JSON.stringify(event));
    this.ws.send(JSON.stringify({type: 'response.create'}));
  }

  disconnect() {
    this.isIntentionalDisconnect = true;
    
    // Save chat memory before disconnecting
    this.saveChatMemory();
    
    // Clear onIdle callback to prevent unwanted unmuting
    setAudioQueueOnIdle(undefined);
    
    // Stop all audio immediately
    if (this.introSource) {
      this.introSource.stop();
      this.introSource = null;
    }
    if (audioQueueInstance) {
      audioQueueInstance.stop();
    }
    
    this.recorder?.stop();
    this.ws?.close();
    this.isConnected = false;
    this.isConnecting = false;
    this.introPlayed = false;
    this.introPlaying = false;
    this.onConnectionChange(false);
  }

  get connected() {
    return this.isConnected;
  }
}