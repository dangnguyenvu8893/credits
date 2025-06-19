# PostgreSQL Setup Guide

## Chuyển đổi từ MySQL sang PostgreSQL

Dự án đã được chuyển đổi từ MySQL sang PostgreSQL. Dưới đây là hướng dẫn setup:

### 1. Cài đặt Dependencies

```bash
yarn install
```

### 2. Khởi động PostgreSQL với Docker

```bash
docker-compose up -d
```

### 3. Tạo Database (nếu cần)

```bash
node scripts/init-db.js
```

### 4. Chạy Migrations

```bash
yarn db:migrate
```

### 5. Chạy Seeders (nếu cần)

```bash
yarn db:seed
```

### 6. Reset Database (nếu cần)

```bash
yarn db:reset
```

## Environment Variables

Cập nhật file `.env` với các thông tin sau:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=credits_db
DB_USER=credits_user
DB_PASSWORD=credits_password

# Sequelize Configuration
DB_DIALECT=postgres
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

## Kết nối Database

- **Host**: localhost
- **Port**: 5432
- **Database**: credits_db
- **Username**: credits_user
- **Password**: credits_password

## Các thay đổi chính

1. **Dependencies**: Thay thế `mysql2` bằng `pg` và `pg-hstore`
2. **Docker**: Sử dụng PostgreSQL 15 thay vì MySQL 8.0
3. **Cấu hình**: Cập nhật dialect từ `mysql` sang `postgres`
4. **Port**: Thay đổi từ 3306 (MySQL) sang 5432 (PostgreSQL)

## Troubleshooting

### Lỗi kết nối
- Đảm bảo PostgreSQL container đang chạy: `docker-compose ps`
- Kiểm tra logs: `docker-compose logs postgres`

### Lỗi migration
- Xóa database cũ và tạo lại: `yarn db:reset`
- Kiểm tra cấu hình trong `config/database.js`

### Lỗi authentication
- Đảm bảo thông tin đăng nhập trong `.env` khớp với cấu hình Docker 