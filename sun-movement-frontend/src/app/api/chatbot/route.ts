import { NextRequest, NextResponse } from 'next/server';

const RASA_SERVER_URL = 'http://localhost:5005';
const RASA_WEBHOOK_URL = `${RASA_SERVER_URL}/webhooks/rest/webhook`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If this is a connection test, try to ping the webhook directly
    if (body.sender === 'connection_test' && body.message === 'ping') {
      try {
        // Test the webhook endpoint with a simple ping
        const webhookTest = await fetch(RASA_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: 'health_check',
            message: 'ping'
          }),
          signal: AbortSignal.timeout(8000),
        });
        
        if (webhookTest.ok) {
          const testData = await webhookTest.json();
          return NextResponse.json([{ text: "Connection successful" }]);
        } else {
          throw new Error(`Webhook returned status: ${webhookTest.status}`);
        }
      } catch (healthError) {
        console.error("Rasa connection test failed:", healthError);
        return NextResponse.json(
          { error: 'Rasa server is not available or not ready yet. Please wait a moment and try again.' },
          { status: 503 }
        );
      }
    }

    // Forward the request to Rasa server
    const response = await fetch(RASA_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Set a reasonable timeout
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Rasa server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we always return an array
    if (!Array.isArray(data)) {
      return NextResponse.json([{ text: "I received your message but couldn't process it properly." }]);
    }
    
    // If empty response, provide a default message
    if (data.length === 0) {
      return NextResponse.json([{ text: "I'm not sure how to respond to that. Could you try rephrasing your question?" }]);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to Rasa:', error);
    
    // Check if it's a timeout error
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Request to chat service timed out. The server might be starting up.' },
        { status: 504 }
      );
    }
    
    // Check if it's a network error (connection refused)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Cannot connect to chat service. Please make sure Rasa server is running.' },
        { status: 503 }
      );
    }
    
    // General server error
    return NextResponse.json(
      { error: 'Failed to connect to chat service. Please try again later.' },
      { status: 500 }
    );
  }
}
