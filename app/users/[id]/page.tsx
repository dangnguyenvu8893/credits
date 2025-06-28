import { getUserById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import UserDetailForm from './user-detail-form';

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const users = await getUserById(params.id);
  
  if (!users || users.length === 0) {
    notFound();
  }

  const user = users[0];

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
            Chi tiết người dùng
          </h1>
          <p className="text-gray-400 mt-2">
            {user.fullname} - {user.email}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <UserDetailForm user={user} />
        </div>
      </main>
    </div>
  );
} 