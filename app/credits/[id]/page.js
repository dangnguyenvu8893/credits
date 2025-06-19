'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';

export default function CreditDetail() {
  const params = useParams();
  const router = useRouter();
  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchCreditDetail();
    }
  }, [params.id]);

  const fetchCreditDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/credits/${params.id}`);
      const data = await response.json();

      if (data.credit) {
        setCredit(data.credit);
        setStatus(data.credit.status);
        setNotes(data.credit.notes || '');
      } else {
        console.error('Credit not found');
      }
    } catch (error) {
      console.error('Error fetching credit detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/credits/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          notes,
        }),
      });

      const data = await response.json();

      if (data.credit) {
        setCredit(data.credit);
        alert('Cập nhật thành công!');
      } else {
        alert('Có lỗi xảy ra khi cập nhật');
      }
    } catch (error) {
      console.error('Error updating credit:', error);
      alert('Có lỗi xảy ra khi cập nhật');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/credits/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Xóa thành công!');
        router.push('/credits');
      } else {
        const data = await response.json();
        alert(data.error || 'Có lỗi xảy ra khi xóa');
      }
    } catch (error) {
      console.error('Error deleting credit:', error);
      alert('Có lỗi xảy ra khi xóa');
    }
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
    if (!dateString) return 'N/A';
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

  if (!credit) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy khách hàng</h2>
          <p className="text-gray-600 mt-2">Khách hàng bạn đang tìm kiếm không tồn tại.</p>
          <Link href="/credits" className="btn-primary mt-4">
            Quay lại danh sách
          </Link>
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
            <div className="flex items-center space-x-2">
              <Link href="/credits" className="text-blue-600 hover:text-blue-900">
                ← Quay lại danh sách
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              Chi tiết khách hàng #{credit.id}
            </h1>
            <p className="text-gray-600 mt-2">
              Thông tin chi tiết về khoản tín dụng
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/credits/${credit.id}/edit`}
              className="btn-secondary"
            >
              Chỉnh sửa
            </Link>
            {credit.status === 'pending' && (
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credit Details */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khoản tín dụng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số tiền</label>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(credit.amount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lãi suất</label>
                  <p className="text-lg font-semibold text-gray-900">{credit.interestRate}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kỳ hạn</label>
                  <p className="text-lg font-semibold text-gray-900">{credit.term} tháng</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trả hàng tháng</label>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(credit.monthlyPayment)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tổng tiền phải trả</label>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(credit.totalAmount)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mục đích</label>
                  <p className="text-lg font-semibold text-gray-900">{credit.purpose}</p>
                </div>
              </div>
            </div>

            {/* User Information */}
            {credit.user && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <p className="text-lg font-semibold text-gray-900">{credit.user.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-lg font-semibold text-gray-900">{credit.user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="text-lg font-semibold text-gray-900">{credit.user.username}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment History */}
            {credit.payments && credit.payments.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch sử thanh toán</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="table-header">Ngày</th>
                        <th className="table-header">Số tiền</th>
                        <th className="table-header">Phương thức</th>
                        <th className="table-header">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {credit.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="table-cell">{formatDate(payment.paymentDate)}</td>
                          <td className="table-cell">{formatCurrency(payment.amount)}</td>
                          <td className="table-cell">{payment.paymentMethod}</td>
                          <td className="table-cell">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quản lý trạng thái</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái hiện tại
                  </label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(credit.status)}`}>
                    {credit.status}
                  </span>
                </div>
                
                {credit.status === 'pending' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cập nhật trạng thái
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-select"
                      >
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Duyệt</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="form-textarea"
                        placeholder="Nhập ghi chú..."
                      />
                    </div>
                    
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updating}
                      className="btn-primary w-full"
                    >
                      {updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tạo khoản tín dụng</p>
                    <p className="text-xs text-gray-500">{formatDate(credit.createdAt)}</p>
                  </div>
                </div>
                
                {credit.approvedAt && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Được duyệt</p>
                      <p className="text-xs text-gray-500">{formatDate(credit.approvedAt)}</p>
                      {credit.approver && (
                        <p className="text-xs text-gray-500">Bởi: {credit.approver.fullName}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {credit.startDate && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Bắt đầu</p>
                      <p className="text-xs text-gray-500">{formatDate(credit.startDate)}</p>
                    </div>
                  </div>
                )}
                
                {credit.endDate && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Kết thúc dự kiến</p>
                      <p className="text-xs text-gray-500">{formatDate(credit.endDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 