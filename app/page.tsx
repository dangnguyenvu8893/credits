import { getUsers } from '@/lib/db/queries';
import Link from 'next/link';
import UserActions from './users/user-actions';

// This will be replaced by 'use cache' soon
export const dynamic = 'force-dynamic';

export default async function Home() {
  const users = await getUsers();

  return (
    <div className="min-h-screen p-8 bg-white">
      <main className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            User Lists
          </h1>
          <Link 
            href="/users/create" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add User
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              No users found
            </div>
            <Link 
              href="/users/create" 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Add First User
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Basic Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Work
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.fullname.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullname}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.idNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(user.birthdate).toLocaleDateString('en-US')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                        <div className="text-sm text-gray-500">{user.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.occupation}</div>
                        <div className="text-sm text-gray-500">
                          {user.salary.toLocaleString('en-US')} VND
                        </div>
                        <div className="text-sm text-gray-500">
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
      </main>
    </div>
  );
}
