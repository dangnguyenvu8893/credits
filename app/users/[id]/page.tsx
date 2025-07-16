import { getUserById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import UserForm from '../create/create-user-form';

const getCardTypeColor = (cardType: string | null) => {
  switch (cardType) {
    case 'Platinum':
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    case 'Gold':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    case 'Silver':
      return 'bg-gradient-to-r from-gray-400 to-gray-600';
    case 'Standard':
      return 'bg-gradient-to-r from-blue-500 to-green-500';
    default:
      return 'bg-gray-200';
  }
};

const formatCurrency = (amount: number | null) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US').format(amount) + ' VND';
};

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
            href="/users" 
            className="text-gray-400 hover:text-gray-300 transition-colors flex items-center"
          >
            ← Back to list
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <UserForm user={user} mode="update" />
        </div>
      </main>
    </div>
  );
} 