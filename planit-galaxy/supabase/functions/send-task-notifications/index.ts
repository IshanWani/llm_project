
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get tasks that need notifications today
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // For demonstration, we'll query tasks that have notifications enabled and scheduled for today
    const { data: tasks, error } = await supabaseClient
      .from('tasks')
      .select('*')
      .eq('notifications_enabled', true)
      .eq('scheduled_date', today)
      .not('email_notification', 'is', null);
    
    if (error) throw error;

    // For each task, we'd typically send a notification
    // In a real implementation, you'd integrate with an email service like SendGrid, Resend, etc.
    const sentNotifications = [];
    
    for (const task of tasks) {
      // Here we're just logging, but you'd send an actual email
      console.log(`Sending notification for task ${task.id} to ${task.email_notification}`);
      
      // In a production app, you'd implement actual email sending here:
      /*
      await emailService.send({
        to: task.email_notification,
        subject: `Task Reminder: ${task.title}`,
        body: `Don't forget your task "${task.title}" scheduled for today!`
      });
      */
      
      sentNotifications.push({
        taskId: task.id,
        email: task.email_notification,
        taskTitle: task.title
      });
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${tasks.length} notifications`,
        sentNotifications
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
