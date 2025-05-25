export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  isStreaming?: boolean;
  context?: {
    question: string;
    answers: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    input: string;
    previous: string;
    explain: string;
    score: number;
    evaluation: string;
    total: number;
  };
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  runId: string | null;
  error: string | null;
}