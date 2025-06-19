# Deployment Guide

## Build và Push lên Git

Để build ứng dụng ở local và push toàn bộ source code (bao gồm cả build files) lên git:

### Cách 1: Sử dụng npm script
```bash
yarn build-and-push
```

### Cách 2: Sử dụng script trực tiếp
```bash
chmod +x scripts/build-and-push.sh
./scripts/build-and-push.sh "Your commit message"
```

### Cách 3: Build thủ công và push
```bash
# Build ứng dụng
yarn build
yarn next export

# Add và commit
git add .
git commit -m "Build and deploy $(date)"
git push origin main
```

## Các file build được include

Sau khi build, các file sau sẽ được push lên git:
- `.next/` - Next.js build files
- `out/` - Static export files
- Tất cả source code khác

## Lưu ý

1. **File .gitignore đã được cập nhật** để không ignore các file build
2. **Script sẽ tự động**:
   - Clean previous builds
   - Install dependencies
   - Build application
   - Export static files
   - Add all files to git
   - Commit với timestamp
   - Push lên remote repository

3. **Trên server**, bạn có thể:
   - Clone repository
   - Chạy `yarn install --production`
   - Chạy `yarn start` để start ứng dụng

## Environment Variables

Đảm bảo setup các environment variables trên server:
- `DATABASE_URL`
- `JWT_SECRET`
- Các biến môi trường khác cần thiết

## Port Configuration

Ứng dụng chạy trên port 3000 mặc định. Đảm bảo port này được mở và accessible trên server. 