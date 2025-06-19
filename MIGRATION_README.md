# Hướng dẫn sử dụng Migration và Seed

## Cấu trúc thư mục

```
credits/
├── migrations/          # Chứa các file migration
├── seeders/            # Chứa các file seed
└── .sequelizerc        # Cấu hình Sequelize CLI
```

## Các lệnh Migration

### 1. Tạo migration mới
```bash
npx sequelize-cli migration:generate --name tên-migration
```

### 2. Chạy migration
```bash
npm run db:migrate
# hoặc
npx sequelize-cli db:migrate
```

### 3. Hoàn tác migration cuối cùng
```bash
npx sequelize-cli db:migrate:undo
```

### 4. Hoàn tác tất cả migration
```bash
npx sequelize-cli db:migrate:undo:all
```

## Các lệnh Seed

### 1. Tạo seed mới
```bash
npx sequelize-cli seed:generate --name tên-seed
```

### 2. Chạy tất cả seed
```bash
npm run db:seed
# hoặc
npx sequelize-cli db:seed:all
```

### 3. Chạy seed cụ thể
```bash
npx sequelize-cli db:seed --seed tên-file-seed
```

### 4. Hoàn tác seed cuối cùng
```bash
npx sequelize-cli db:seed:undo
```

### 5. Hoàn tác tất cả seed
```bash
npx sequelize-cli db:seed:undo:all
```

## Lệnh tiện ích

### Reset toàn bộ database
```bash
npm run db:reset
# Lệnh này sẽ: drop database -> create database -> migrate -> seed
```

## Dữ liệu mẫu

### Users
- **admin**: admin@example.com / password123 (role: admin)
- **john_doe**: john.doe@example.com / password123 (role: user)
- **jane_smith**: jane.smith@example.com / password123 (role: user)
- **mike_wilson**: mike.wilson@example.com / password123 (role: user)

### Credits
1. **Khoản vay mua xe máy** (John Doe): 5 triệu VND, 12 tháng, lãi suất 12.5%
2. **Khoản vay sửa chữa nhà** (Jane Smith): 10 triệu VND, 24 tháng, lãi suất 15% (pending)
3. **Khoản vay kinh doanh** (Mike Wilson): 20 triệu VND, 36 tháng, lãi suất 18%
4. **Khoản vay học phí** (John Doe): 3 triệu VND, 6 tháng, lãi suất 10% (completed)

### Payments
- Các khoản thanh toán mẫu cho các khoản vay trên
- Bao gồm thanh toán đúng hạn và các phương thức thanh toán khác nhau

## Lưu ý quan trọng

1. **Thứ tự chạy**: Luôn chạy migration trước, sau đó mới chạy seed
2. **Backup**: Nên backup database trước khi chạy migration trên production
3. **Environment**: Đảm bảo cấu hình database đúng trong file config
4. **Dependencies**: Seed phụ thuộc vào migration, nên chạy theo thứ tự

## Troubleshooting

### Lỗi thường gặp

1. **Database connection failed**
   - Kiểm tra cấu hình database trong `config/database.js`
   - Đảm bảo MySQL server đang chạy

2. **Migration already exists**
   - Xóa file migration cũ nếu không cần thiết
   - Hoặc đổi tên file migration

3. **Seed data conflicts**
   - Xóa dữ liệu cũ trước khi chạy seed
   - Hoặc sử dụng `db:reset` để reset toàn bộ

### Kiểm tra trạng thái

```bash
# Xem migration đã chạy
npx sequelize-cli db:migrate:status

# Xem seed đã chạy
npx sequelize-cli db:seed:status
``` 