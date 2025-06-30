# Hệ thống quản lý người dùng

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)

## Tính năng

- Quản lý danh sách người dùng
- Thêm người dùng mới với thông tin đầy đủ
- Xem và chỉnh sửa thông tin người dùng
- Xóa người dùng
- Tìm kiếm người dùng

## Getting Started

```bash
git clone <repository-url>
cd credits2
pnpm install
```

## Running Locally

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Then, run the database migrations and seed the database:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.
