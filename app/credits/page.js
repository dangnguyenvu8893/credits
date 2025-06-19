'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function CreditsList() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    userId: '',
  });

  useEffect(() => {
    fetchCredits();
  }, [pagination.page, filters]);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      const response = await fetch(`/api/credits?${params}`);
      const data = await response.json();

      if (data.credits) {
        setCredits(data.credits);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách khách hàng</h1>
            <p className="text-gray-600 mt-2">Quản lý tất cả khách hàng tín dụng</p>
          </div>
          <Link
            href="/credits/new"
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tạo khách hàng mới
          </Link>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
                <option value="active">Đang hoạt động</option>
                <option value="completed">Hoàn thành</option>
                <option value="defaulted">Vỡ nợ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm theo ID, tên khách hàng..."
                className="form-input"
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ status: '', userId: '', search: '' });
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="btn-secondary w-full"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Credits Table */}
        <div className="card">
          {credits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">Khách hàng</th>
                    <th className="table-header">Mục đích</th>
                    <th className="table-header">Số tiền</th>
                    <th className="table-header">Lãi suất</th>
                    <th className="table-header">Kỳ hạn</th>
                    <th className="table-header">Trạng thái</th>
                    <th className="table-header">Ngày tạo</th>
                    <th className="table-header">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {credits.map((credit) => (
                    <tr key={credit.id} className="hover:bg-gray-50">
                      <td className="table-cell">#{credit.id}</td>
                      <td className="table-cell">
                        {credit.user ? (
                          <div>
                            <div className="font-medium text-gray-900">{credit.user.fullName}</div>
                            <div className="text-sm text-gray-500">{credit.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Không có thông tin</span>
                        )}
                      </td>
                      <td className="table-cell">{credit.purpose}</td>
                      <td className="table-cell font-medium">{formatCurrency(credit.amount)}</td>
                      <td className="table-cell">{credit.interestRate}%</td>
                      <td className="table-cell">{credit.term} tháng</td>
                      <td className="table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(credit.status)}`}>
                          {credit.status}
                        </span>
                      </td>
                      <td className="table-cell">{formatDate(credit.createdAt)}</td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <Link
                            href={`/credits/${credit.id}`}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có khách hàng nào</h3>
              <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo khách hàng mới.</p>
              <div className="mt-6">
                <Link href="/credits/new" className="btn-primary">
                  Tạo khách hàng mới
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số{' '}
              {pagination.total} khách hàng
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 