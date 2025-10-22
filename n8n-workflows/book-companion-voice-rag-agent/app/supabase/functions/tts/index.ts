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
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const { text } = await req.json()
    
    if (!text) {
      throw new Error('Text is required')
    }

    // Smart text truncation - preserve sentence endings and cap at 120 chars
    let cappedText = text;
    if (text.length > 120) {
      const truncated = text.substring(0, 117);
      const lastSentenceEnd = Math.max(truncated.lastIndexOf('.'), truncated.lastIndexOf('!'), truncated.lastIndexOf('?'));
      if (lastSentenceEnd > 80) {
        cappedText = truncated.substring(0, lastSentenceEnd + 1);
      } else {
        cappedText = truncated + '...';
      }
    }

    console.log('Converting text to speech:', cappedText.substring(0, 100) + '...')

    // Call OpenAI TTS API with speed optimization
    const t_openai = performance.now();
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
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

    console.log('⏱️ t_openai:', Math.round(performance.now() - t_openai), 'ms');

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    // Fast Base64 encoding using built-in methods
    const t_encode = performance.now();
    const arrayBuffer = await response.arrayBuffer()
    
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

    return new Response(JSON.stringify({ audioContent: base64Audio }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    })
  } catch (error) {
    console.error('TTS error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      },
    )
  }
})