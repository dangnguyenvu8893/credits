import Link from 'next/link';
import CreateUserForm from './create-user-form';

export default function CreateUserPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <main className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/users" 
            className="text-gray-400 hover:text-gray-300 transition-colors flex items-center"
          >
            ← Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-bold text-gray-100 mt-4">
            Thêm người dùng mới
          </h1>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <CreateUserForm />
        </div>
      </main>
    </div>
  );
} 