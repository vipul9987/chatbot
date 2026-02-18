
const WEBHOOK_URL =
  "https://9020-2409-40d4-1065-6de9-da2-2a49-536a-8198.ngrok-free.app/webhook/3bc31bb3-d1cd-42cd-b7c2-440f3e42434e";

/**
 * Sends the user message to the webhook and handles the response.
 * Guaranteed to return a string to avoid React 'Minified error #31'.
 */
export async function getChatResponse(userMessage: string, history: any[] = []): Promise<string> {
  try {
    const payload = {
      requirements: userMessage,
      context: history.slice(-5).map(m => `${m.role}: ${m.content}`).join(' | ')
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return `Error: Server responded with status ${response.status}`;
    }

    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === "") {
      return "The server sent an empty response. Please try again.";
    }

    try {
      const data = JSON.parse(responseText);
      
      /**
       * Deeply searches for the most likely string response in a JSON structure.
       * Handles nested objects, arrays, and common AI platform keys.
       */
      const findResponseString = (obj: any, depth = 0): string | null => {
        // Prevent infinite recursion in case of circular references
        if (depth > 6 || !obj) return null;
        
        // Direct hits
        if (typeof obj === 'string' && obj.trim().length > 0) return obj;
        
        // Common keys used by n8n, Flowise, Make, LangChain, etc.
        const priorityKeys = [
          'reply', 'output', 'message', 'text', 
          'response', 'content', 'answer', 'result', 
          'data', 'fulfillmentText'
        ];
        
        if (typeof obj === 'object') {
          // 1. If it's an array, look for a string in each item recursively
          if (Array.isArray(obj)) {
            for (const item of obj) {
              const found = findResponseString(item, depth + 1);
              if (found) return found;
            }
            return null;
          }
          
          // 2. Check for priority keys at the current level
          for (const key of priorityKeys) {
            if (obj[key] !== undefined && obj[key] !== null) {
              const found = findResponseString(obj[key], depth + 1);
              if (found) return found;
            }
          }
          
          // 3. Fallback: If no priority keys, check every key for a simple string
          for (const key in obj) {
            if (typeof obj[key] === 'string' && obj[key].trim().length > 0) {
              return obj[key];
            }
          }

          // 4. Deeper recursion if still nothing (for structures like { payload: { body: { text: '...' } } })
          for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const found = findResponseString(obj[key], depth + 1);
              if (found) return found;
            }
          }
        }
        
        return null;
      };

      const extractedString = findResponseString(data);
      
      // If we found a string, return it. If not, only then fallback to stringifying the whole object.
      if (extractedString) return extractedString;
      
      return typeof data === 'object' ? JSON.stringify(data) : String(data);

    } catch (e) {
      // If parsing fails, it's likely already a plain text response
      return responseText.trim();
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    return "Failed to connect to the assistant. Please check your connection.";
  }
}
