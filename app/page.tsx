import { getDashboardStats } from '@/lib/db/queries';
import Link from 'next/link';

// Force dynamic rendering to prevent build issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const stats = await getDashboardStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' VND';
  };

  const getCardTypeColor = (cardType: string) => {
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

  const getCicRankColor = (cicRank: string) => {
    switch (cicRank) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Thống kê tổng quan về hệ thống tín dụng</p>
          </div>
          <Link
            href="/users"
            className="bg-green-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Xem Danh Sách Users
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng số Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Analyzed Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Đã Phân Tích AI</p>
                <p className="text-2xl font-bold text-gray-900">{stats.analyzedUsers}</p>
                <p className="text-sm text-gray-500">
                  {stats.totalUsers > 0 ? Math.round((stats.analyzedUsers / stats.totalUsers) * 100) : 0}% tổng số
                </p>
              </div>
            </div>
          </div>

          {/* Total Credit Limit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tổng Hạn Mức Tín Dụng</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCreditLimit)}</p>
              </div>
            </div>
          </div>

          {/* Average Credit Limit */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hạn Mức Trung Bình</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(Math.round(stats.avgCreditLimit))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users by Card Type */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân Bố Theo Loại Thẻ</h3>
            <div className="space-y-3">
              {stats.usersByCardType.length > 0 ? (
                stats.usersByCardType.map((item) => (
                  <div key={item.cardType} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${getCardTypeColor(item.cardType || '')} mr-3`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.cardType}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({stats.analyzedUsers > 0 ? Math.round((item.count / stats.analyzedUsers) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Chưa có dữ liệu phân tích</p>
              )}
            </div>
          </div>

          {/* Users by CIC Rank */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân Bố Theo CIC Rank</h3>
            <div className="space-y-3">
              {stats.usersByCicRank.length > 0 ? (
                stats.usersByCicRank.map((item) => (
                  <div key={item.cicRank} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCicRankColor(item.cicRank)} mr-3`}>
                        {item.cicRank}
                      </span>
                      <span className="text-sm font-medium text-gray-700">Rank {item.cicRank}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({stats.totalUsers > 0 ? Math.round((item.count / stats.totalUsers) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao Tác Nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/users/create"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Thêm User Mới</p>
                <p className="text-sm text-gray-500">Tạo user và phân tích tín dụng</p>
              </div>
            </Link>

            <Link
              href="/users"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Xem Danh Sách</p>
                <p className="text-sm text-gray-500">Quản lý tất cả users</p>
              </div>
            </Link>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Báo Cáo Chi Tiết</p>
                <p className="text-sm text-gray-500">Xuất báo cáo thống kê</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
