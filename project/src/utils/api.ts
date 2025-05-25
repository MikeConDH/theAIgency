/**
 * Handles API requests to the chat service
 */

// Function to create a unique ID for messages
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Initial POST request for the first message
export const sendInitialMessage = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<{ runId: string; context: Message['context'] }> => {
  try {
    const response = await fetch(
      'https://agents.toolhouse.ai/a4120ff7-4cb9-4d07-83dd-989638cfc3fc',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer th-e7W4QEN4MJYaSC42KmQC9I65vGI_cCP_OccSKqkTbOE'
        },
        body: JSON.stringify({
          vars: {
            role: "AI Engineer",
            focus_area: "LLM deployment & optimization"
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Get the run ID from the header
    const runId = response.headers.get('X-Toolhouse-Run-ID');
    
    if (!runId) {
      throw new Error('No run ID found in response headers');
    }

    const data = await response.json();
    onChunk(data.question); // Send the question as the first chunk

    return { 
      runId,
      context: {
        question: data.question,
        answers: data.answers,
        input: data.input,
        previous: data.previous,
        explain: data.explain,
        score: data.score,
        evaluation: data.evaluation
      }
    };
  } catch (error) {
    console.error('Error sending initial message:', error);
    throw error;
  }
};

// PUT request for subsequent messages
export const sendFollowUpMessage = async (
  runId: string,
  message: string,
  onChunk: (chunk: string) => void
): Promise<{ context: Message['context'] }> => {
  try {
    const response = await fetch(
      `https://agents.toolhouse.ai/a4120ff7-4cb9-4d07-83dd-989638cfc3fc/${runId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer th-e7W4QEN4MJYaSC42KmQC9I65vGI_cCP_OccSKqkTbOE'
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    onChunk(data.question); // Send the question as the first chunk

    return {
      context: {
        question: data.question,
        answers: data.answers,
        input: data.input,
        previous: data.previous,
        explain: data.explain,
        score: data.score,
        evaluation: data.evaluation
      }
    };
  } catch (error) {
    console.error('Error sending follow-up message:', error);
    throw error;
  }
};