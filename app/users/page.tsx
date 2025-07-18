import { getUsers } from '@/lib/db/queries';
import Link from 'next/link';

// Force dynamic rendering to prevent build issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      case 'Reject':
        return 'bg-gradient-to-r from-red-500 to-red-700';
      default:
        return 'bg-gray-200';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US').format(amount) + ' VND';
  };

  const getStatusText = (cardType: string | null) => {
    if (!cardType) return 'Pending';
    if (cardType === 'Reject') return 'Rejected';
    return 'Approved';
  };

  const getStatusColor = (cardType: string | null) => {
    if (!cardType) return 'text-gray-500';
    if (cardType === 'Reject') return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User List</h1>
          <Link
            href="/users/create"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add User
          </Link>
        </div>

        {users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                {/* User Information Section */}
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 h-12 w-12">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={`${user.fullname} profile`}
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-green-800">
                          {user.fullname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="text-lg font-semibold text-gray-900 truncate">
                      {user.fullname}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-2 mb-6">
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">Credit Score:</span> {user.cicRank || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-1 ${getStatusColor(user.cardType)}`}>
                      {getStatusText(user.cardType)}
                    </span>
                  </div>
                  {user.cardType && (
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">Credit Limit:</span> {formatCurrency(user.creditLimit)}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/users/${user.id}?edit=true`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/users/${user.id}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first user.</p>
            <Link
              href="/users/create"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add User
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 