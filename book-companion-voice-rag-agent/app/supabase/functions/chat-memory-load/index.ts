import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, limit = 20 } = await req.json();
    
    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with service role key for full access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log(`Loading chat memory for session: ${sessionId}, limit: ${limit}`);

    // Query chat history for this session, ordered by timestamp (most recent first)
    const { data: messages, error } = await supabase
      .from('n8n_chat_histories')
      .select('*')
      .eq('session_id', sessionId)
      .order('id', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error loading chat memory:', error);
      return new Response(JSON.stringify({ error: 'Failed to load chat memory' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Reverse to get chronological order (oldest first)
    const chronologicalMessages = messages ? messages.reverse() : [];

    console.log(`Loaded ${chronologicalMessages.length} messages for session ${sessionId}`);

    return new Response(JSON.stringify({ 
      messages: chronologicalMessages,
      count: chronologicalMessages.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-memory-load function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});