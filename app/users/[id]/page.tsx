import { getUserById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import UserForm from '../create/create-user-form';

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const users = await getUserById(id);
  
  if (!users || users.length === 0) {
    notFound();
  }

  const user = users[0];

  return (
    <div className="min-h-screen p-8">
      <main className="mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-gray-300 transition-colors flex items-center"
          >
            ← Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-bold text-green-600 mt-4">
            Chi tiết người dùng
          </h1>
          <p className="text-gray-400 mt-2">
            {user.fullname} - {user.email}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <UserForm user={user} mode="update" />
        </div>
      </main>
    </div>
  );
} 