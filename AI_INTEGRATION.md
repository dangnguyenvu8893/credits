# AI Integration Guide

## Cấu hình AI_URL

Để sử dụng AI API thực tế, bạn cần tạo file `.env.local` trong thư mục gốc của dự án:

```bash
# AI API Configuration
AI_URL=http://your-ai-server.com

# Database Configuration (nếu cần)
DATABASE_URL=postgresql://postgres:password@localhost:5432/credits2
```

## Cách hoạt động

1. **AI Service** (`lib/services/ai-service.ts`):
   - Thử gọi AI API thực tế trước (nếu AI_URL được cấu hình)
   - Nếu thất bại, fallback về mock data
   - Mock data dựa trên salary và CIC rank để đưa ra dự đoán

2. **API Route** (`app/api/predict/route.ts`):
   - Xử lý request từ client
   - Validate dữ liệu đầu vào
   - Gọi AI service và trả về kết quả

3. **Form Component** (`app/users/create/create-user-form.tsx`):
   - Thêm nút "Phân tích tín dụng"
   - Hiển thị kết quả với UI đẹp
   - Loading state và error handling

## Cấu trúc dữ liệu

### Request Format
```typescript
{
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
```

### Response Format
```typescript
{
  cardType: string;        // 'Platinum', 'Gold', 'Silver', 'Standard'
  creditLimit: number;     // VND amount
  confidence: number;      // 0-1 score
  reasons: string[];       // Array of reasons
}
```

## Mock Logic

Khi không có AI_URL hoặc API thất bại, hệ thống sẽ sử dụng logic mock:

- **Platinum**: Salary >= 50M VND + CIC Rank A
- **Gold**: Salary >= 30M VND + CIC Rank A/B
- **Silver**: Salary >= 15M VND + CIC Rank A/B/C
- **Standard**: Các trường hợp còn lại

## Testing

1. Chạy development server:
```bash
npm run dev
```

2. Truy cập form tạo user: `http://localhost:3000/users/create`

3. Điền thông tin và nhấn "Phân tích tín dụng"

4. Xem kết quả hiển thị bên phải

## Production Deployment

Để deploy với AI API thực tế:

1. Set environment variable `AI_URL` trong production
2. Đảm bảo AI server có endpoint `/predict`
3. AI server phải trả về response format như trên
4. CORS configuration nếu cần thiết 