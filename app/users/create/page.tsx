import UserForm from './create-user-form';

export default function CreateUserPage() {
  return (
    <div className="min-h-screen p-8">
      <main className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            Tạo người dùng mới
          </h1>
          <p className="text-gray-400 mt-2">
            Nhập thông tin để tạo người dùng mới
          </p>
        </div>

        <UserForm mode="create" />
      </main>
    </div>
  );
} 