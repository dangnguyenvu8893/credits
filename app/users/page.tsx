import { getUsers } from '@/lib/db/queries';
import Link from 'next/link';
import UserActions from './user-actions';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <main className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">
            Danh sách người dùng
          </h1>
          <Link 
            href="/users/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Thêm người dùng
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              Chưa có người dùng nào
            </div>
            <Link 
              href="/users/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Thêm người dùng đầu tiên
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Thông tin cơ bản
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Công việc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.fullname.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-100">
                              {user.fullname}
                            </div>
                            <div className="text-sm text-gray-400">
                              ID: {user.idNumber}
                            </div>
                            <div className="text-sm text-gray-400">
                              {new Date(user.birthdate).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-100">{user.email}</div>
                        <div className="text-sm text-gray-400">{user.phoneNumber}</div>
                        <div className="text-sm text-gray-400">{user.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-100">{user.occupation}</div>
                        <div className="text-sm text-gray-400">
                          {user.salary.toLocaleString('vi-VN')} VND
                        </div>
                        <div className="text-sm text-gray-400">
                          CIC: {user.cicRank}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <UserActions userId={user.id} userName={user.fullname} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </main>
    </div>
  );
} 