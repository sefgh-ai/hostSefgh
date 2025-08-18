import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const fileId = url.pathname.split('/').pop();

    if (!fileId) {
      return new Response(JSON.stringify({ error: 'File ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching link for fileId: ${fileId}`);

    // Fetch the shareable link
    const { data: link, error } = await supabase
      .from('shareable_links')
      .select('*')
      .eq('file_id', fileId)
      .eq('status', 'active')
      .single();

    if (error || !link) {
      console.error('Link not found:', error);
      return new Response(JSON.stringify({ error: 'Link not found or expired' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if link has expired
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      console.log('Link has expired');
      return new Response(JSON.stringify({ error: 'Link has expired' }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check view limit
    if (link.max_views && link.current_views >= link.max_views) {
      console.log('Link view limit exceeded');
      return new Response(JSON.stringify({ error: 'Link view limit exceeded' }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get client info for analytics
    const userAgent = req.headers.get('user-agent') || '';
    const referer = req.headers.get('referer') || '';
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Record analytics
    await supabase.from('link_analytics').insert({
      link_id: link.id,
      visitor_ip: clientIP,
      user_agent: userAgent,
      referrer: referer,
    });

    // Increment view count
    await supabase.rpc('increment_link_views', { link_file_id: fileId });

    console.log(`Successfully served link ${fileId}, views: ${link.current_views + 1}`);

    // Return content based on type
    if (link.content_type === 'text/html') {
      return new Response(link.content.html || JSON.stringify(link.content), {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      });
    } else if (link.content_type === 'text/plain') {
      return new Response(link.content.text || JSON.stringify(link.content), {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    } else {
      // Default to JSON
      return new Response(JSON.stringify({
        title: link.title,
        description: link.description,
        type: link.link_type,
        content: link.content,
        created_at: link.created_at,
        expires_at: link.expires_at,
        views: link.current_views + 1,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in share-link function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});