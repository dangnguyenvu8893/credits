'use client';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCredits: 0,
    pendingCredits: 0,
    approvedCredits: 0,
    totalAmount: 0,
  });
  const [recentCredits, setRecentCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch credits for statistics
      const creditsResponse = await fetch('/api/credits?limit=100');
      const creditsData = await creditsResponse.json();
      
      if (creditsData.credits) {
        const credits = creditsData.credits;
        
        const totalCredits = credits.length;
        const pendingCredits = credits.filter(c => c.status === 'pending').length;
        const approvedCredits = credits.filter(c => c.status === 'approved').length;
        const totalAmount = credits.reduce((sum, credit) => sum + parseFloat(credit.amount), 0);
        
        setStats({
          totalCredits,
          pendingCredits,
          approvedCredits,
          totalAmount: totalAmount.toFixed(2),
        });
        
        // Get recent credits
        setRecentCredits(credits.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Đang tải...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Tổng quan hệ thống quản lý tín dụng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCredits}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingCredits}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approvedCredits}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng tiền</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Credits */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Khách hàng gần đây</h2>
          {recentCredits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">Mục đích</th>
                    <th className="table-header">Số tiền</th>
                    <th className="table-header">Trạng thái</th>
                    <th className="table-header">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentCredits.map((credit) => (
                    <tr key={credit.id} className="hover:bg-gray-50">
                      <td className="table-cell">#{credit.id}</td>
                      <td className="table-cell">{credit.purpose}</td>
                      <td className="table-cell">{formatCurrency(credit.amount)}</td>
                      <td className="table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(credit.status)}`}>
                          {credit.status}
                        </span>
                      </td>
                      <td className="table-cell">
                        {new Date(credit.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Chưa có khách hàng nào</p>
          )}
        </div>
      </div>
    </Layout>
  );
} 