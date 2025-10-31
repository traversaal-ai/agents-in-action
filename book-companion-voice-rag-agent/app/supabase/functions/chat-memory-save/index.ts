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
    const { sessionId, messages } = await req.json();
    
    if (!sessionId || !messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Session ID and messages array are required' }), {
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

    console.log(`Saving ${messages.length} messages for session: ${sessionId}`);

    // Prepare messages for insertion
    const messagesToInsert = messages.map(msg => ({
      session_id: sessionId,
      message: {
        role: msg.role || msg.type, // Support both 'role' and 'type' fields
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString()
      }
    }));

    // Insert messages in batch
    const { data, error } = await supabase
      .from('n8n_chat_histories')
      .insert(messagesToInsert)
      .select();

    if (error) {
      console.error('Error saving chat memory:', error);
      return new Response(JSON.stringify({ error: 'Failed to save chat memory' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Successfully saved ${data?.length || 0} messages for session ${sessionId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      saved: data?.length || 0,
      sessionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-memory-save function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});