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
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
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
            ← Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-bold text-green-600 mt-4">
            Chi tiết người dùng
          </h1>
          <p className="text-gray-400 mt-2">
            {user.fullname} - {user.email}
          </p>
        </div>

        {/* AI Results Summary */}
        {user.cardType && (
          <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Kết quả phân tích AI</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg ${getCardTypeColor(user.cardType)}`}>
                  {user.cardType}
                </div>
                <p className="text-sm text-gray-600 mt-2">Loại thẻ</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(user.creditLimit)}
                </div>
                <p className="text-sm text-gray-600 mt-2">Hạn mức tín dụng</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {user.confidence || 0}%
                </div>
                <p className="text-sm text-gray-600 mt-2">Độ tin cậy</p>
              </div>
            </div>
            {user.predictionReasons && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Lý do được chấp thuận:</h3>
                <ul className="space-y-1">
                  {JSON.parse(user.predictionReasons).map((reason: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {user.predictedAt && (
              <div className="mt-4 text-xs text-gray-500">
                Phân tích lần cuối: {new Date(user.predictedAt).toLocaleString('vi-VN')}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <UserForm user={user} mode="update" />
        </div>
      </main>
    </div>
  );
} 