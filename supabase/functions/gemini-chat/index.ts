
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, dashboardContext } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Create enhanced prompt with dashboard context
    const systemPrompt = `You are an energy efficiency expert assistant for a NILM (Non-Intrusive Load Monitoring) dashboard. 
    Help users understand their energy consumption, provide tips for reducing energy costs, and explain appliance efficiency. 
    Keep responses concise and practical. 

    ${dashboardContext ? `Current Dashboard Data: ${dashboardContext}` : ''}
    
    Use the dashboard data to provide specific recommendations and insights about the user's current energy usage.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser message: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate response');
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return new Response(
      JSON.stringify({ response: generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
