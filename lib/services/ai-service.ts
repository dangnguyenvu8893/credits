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
      throw new Error('Không thể kết nối đến AI service. Vui lòng thử lại sau.');
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
        'Thu nhập cao (trên 50M VND/tháng)',
        'CIC Rating xuất sắc (A)',
        'Tỷ lệ nợ/thu nhập thấp',
        'Lịch sử tín dụng tốt'
      ];
    } else if (salary >= 30000000 && (cicRank === 'A' || cicRank === 'B')) {
      cardType = 'Gold';
      creditLimit = 100000000; // 100M VND
      confidence = 0.85;
      reasons = [
        'Thu nhập ổn định (trên 30M VND/tháng)',
        'CIC Rating tốt (A hoặc B)',
        'Tình trạng việc làm ổn định'
      ];
    } else if (salary >= 15000000 && (cicRank === 'A' || cicRank === 'B' || cicRank === 'C')) {
      cardType = 'Silver';
      creditLimit = 75000000; // 75M VND
      confidence = 0.75;
      reasons = [
        'Thu nhập đủ điều kiện (trên 15M VND/tháng)',
        'CIC Rating chấp nhận được',
        'Không có dấu hiệu rủi ro'
      ];
    } else {
      cardType = 'Standard';
      creditLimit = 50000000; // 50M VND
      confidence = 0.6;
      reasons = [
        'Thu nhập cơ bản',
        'Cần cải thiện CIC Rating',
        'Hạn mức tín dụng cơ bản'
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