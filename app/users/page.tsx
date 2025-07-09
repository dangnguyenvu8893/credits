import { getUsers } from '@/lib/db/queries';
import Link from 'next/link';

export default async function UsersPage() {
  const users = await getUsers();

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Danh sách người dùng</h1>
          <Link
            href="/users/create"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Thêm người dùng
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin cơ bản
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin tài chính
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kết quả AI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-800">
                              {user.fullname.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">Lương: {formatCurrency(user.salary)}</div>
                        <div>CIC Rank: <span className="font-medium">{user.cicRank}</span></div>
                        <div>Nghề nghiệp: {user.occupation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.cardType ? (
                        <div className="space-y-2">
                          <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getCardTypeColor(user.cardType)}`}>
                            {user.cardType}
                          </div>
                          <div className="text-sm text-gray-900">
                            Hạn mức: {formatCurrency(user.creditLimit)}
                          </div>
                          {user.confidence && (
                            <div className="text-sm text-gray-600">
                              Độ tin cậy: {user.confidence}%
                            </div>
                          )}
                          {user.predictedAt && (
                            <div className="text-xs text-gray-500">
                              Phân tích: {new Date(user.predictedAt).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Chưa phân tích
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/users/${user.id}`}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Xem chi tiết
                      </Link>
                      <Link
                        href={`/users/${user.id}?edit=true`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có người dùng nào</h3>
            <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm người dùng đầu tiên.</p>
            <Link
              href="/users/create"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Thêm người dùng
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 