import { NextRequest, NextResponse } from 'next/server';

const RASA_SERVER_URL = 'http://localhost:5005';
const RASA_WEBHOOK_URL = `${RASA_SERVER_URL}/webhooks/rest/webhook`;

export async function GET(request: NextRequest) {
  const checks = {
    webhook: false,
    timestamp: new Date().toISOString(),
    error: null as string | null
  };

  try {
    // Check webhook endpoint (this is the main Rasa endpoint)
    try {
      const webhookResponse = await fetch(RASA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'status_check',
          message: 'ping'
        }),
        signal: AbortSignal.timeout(8000),
      });
      
      if (webhookResponse.ok) {
        checks.webhook = true;
        // Try to read response to ensure it's working properly
        const data = await webhookResponse.json();
      } else {
        checks.error = `Webhook returned status: ${webhookResponse.status}`;
      }
    } catch (webhookError) {
      const errorMessage = webhookError instanceof Error ? webhookError.message : 'Unknown error';
      console.log('Webhook check failed:', errorMessage);
      checks.error = errorMessage;
    }

    const overallStatus = checks.webhook ? 'online' : 'offline';
    
    return NextResponse.json({
      status: overallStatus,
      checks,
      message: overallStatus === 'online' 
        ? 'Rasa server is operational' 
        : `Rasa server is not ready: ${checks.error || 'Unable to connect'}`
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error checking Rasa status:', errorMessage);
    return NextResponse.json({
      status: 'offline',
      checks: {
        ...checks,
        error: errorMessage
      },
      message: 'Unable to reach Rasa server. Make sure it is running on port 5005.'
    });
  }
}
