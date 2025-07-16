export interface PredictionRequest {
  age: number;
  married: string;
  salary: number;
  cic: string;
  job: string;
}

export interface PredictionResponse {
  data: {
    age: number;
    cic: string;
    job: string;
    married: string;
    predicted_card_type: string;
    predicted_credit_limit: number;
    predicted_credit_limit_formatted: string;
    salary: number;
    success: boolean;
  };
  success: boolean;
}

export class AIService {
  // Server-side environment variable (not exposed to client)
  private static baseUrl = process.env.NEXT_PUBLIC_AI_URL;

  static async predict(data: PredictionRequest): Promise<PredictionResponse> {
    try {

      
      if (this.baseUrl === undefined) {
        throw new Error('External AI API is not configured');
      }

      // Fallback to internal API route
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error calling AI API:', error);
      throw new Error('Unable to connect to AI service. Please try again later.');
    }
  }
} 