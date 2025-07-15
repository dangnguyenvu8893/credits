export interface PredictionRequest {
  email: string;
  fullname: string;
  birthdate: string;
  idNumber: string;
  address: string;
  maritalStatus: string;
  phoneNumber: string;
  occupation: string;
  salary: number;
  cicRank: string;
}

export interface PredictionResponse {
  cardType: string;
  creditLimit: number;
  confidence: number;
  reasons: string[];
}

export class AIService {
  private static baseUrl = process.env.AI_URL || 'http://localhost:8000';

  static async predict(data: PredictionRequest): Promise<PredictionResponse> {
    try {
      // First try to call external AI API if AI_URL is configured
      if (this.baseUrl !== 'http://localhost:8000') {
        try {
          const response = await fetch(`${this.baseUrl}/predict`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const result = await response.json();
            return result;
          }
        } catch (error) {
          console.log('External AI API failed, falling back to internal API');
        }
      }

      // Fallback to internal API route
      const response = await fetch('/api/predict', {
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

  // Mock data for development/testing
  static async predictMock(data: PredictionRequest): Promise<PredictionResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock logic based on salary and CIC rank
    const salary = data.salary;
    const cicRank = data.cicRank;

    let cardType = 'Standard';
    let creditLimit = 50000000; // 50M VND default
    let confidence = 0.7;
    let reasons: string[] = [];

    // Determine card type and credit limit based on salary and CIC rank
    if (salary >= 50000000 && cicRank === 'A') {
      cardType = 'Platinum';
      creditLimit = 200000000; // 200M VND
      confidence = 0.95;
      reasons = [
        'High income (above 50M VND/month)',
        'Excellent CIC Rating (A)',
        'Low debt-to-income ratio',
        'Good credit history'
      ];
    } else if (salary >= 30000000 && (cicRank === 'A' || cicRank === 'B')) {
      cardType = 'Gold';
      creditLimit = 100000000; // 100M VND
      confidence = 0.85;
      reasons = [
        'Stable income (above 30M VND/month)',
        'Good CIC Rating (A or B)',
        'Stable employment status'
      ];
    } else if (salary >= 15000000 && (cicRank === 'A' || cicRank === 'B' || cicRank === 'C')) {
      cardType = 'Silver';
      creditLimit = 75000000; // 75M VND
      confidence = 0.75;
      reasons = [
        'Qualified income (above 15M VND/month)',
        'Acceptable CIC Rating',
        'No risk indicators'
      ];
    } else {
      cardType = 'Standard';
      creditLimit = 50000000; // 50M VND
      confidence = 0.6;
      reasons = [
        'Basic income',
        'CIC Rating needs improvement',
        'Basic credit limit'
      ];
    }

    return {
      cardType,
      creditLimit,
      confidence,
      reasons
    };
  }
} 