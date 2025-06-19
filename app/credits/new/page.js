'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../components/Layout';

export default function NewCredit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '0',
    term: '',
    purpose: '',
    userId: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    }

    if (!formData.term || parseInt(formData.term) <= 0) {
      newErrors.term = 'Kỳ hạn phải lớn hơn 0';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Mục đích là bắt buộc';
    }

    if (parseFloat(formData.interestRate) < 0 || parseFloat(formData.interestRate) > 100) {
      newErrors.interestRate = 'Lãi suất phải từ 0% đến 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          interestRate: parseFloat(formData.interestRate),
          term: parseInt(formData.term),
          userId: formData.userId || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Tạo khách hàng thành công!');
        router.push('/credits');
      } else {
        alert(data.error || 'Có lỗi xảy ra khi tạo khách hàng');
      }
    } catch (error) {
      console.error('Error creating credit:', error);
      alert('Có lỗi xảy ra khi tạo khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const calculateMonthlyPayment = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.interestRate) || 0;
    const term = parseInt(formData.term) || 0;

    if (amount <= 0 || term <= 0) return 0;

    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) {
      return amount / term;
    }

    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    return Math.round(monthlyPayment * 100) / 100;
  };

  const calculateTotalAmount = () => {
    const monthlyPayment = calculateMonthlyPayment();
    const term = parseInt(formData.term) || 0;
    return monthlyPayment * term;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/credits" className="text-blue-600 hover:text-blue-900">
              ← Quay lại danh sách
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Tạo khách hàng mới</h1>
          <p className="text-gray-600 mt-2">Thêm khách hàng tín dụng mới vào hệ thống</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số tiền vay <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
                        placeholder="Nhập số tiền..."
                        step="0.01"
                        min="0"
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lãi suất (%)
                      </label>
                      <input
                        type="number"
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={handleInputChange}
                        className={`form-input ${errors.interestRate ? 'border-red-500' : ''}`}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        max="100"
                      />
                      {errors.interestRate && (
                        <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kỳ hạn (tháng) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="term"
                        value={formData.term}
                        onChange={handleInputChange}
                        className={`form-input ${errors.term ? 'border-red-500' : ''}`}
                        placeholder="Nhập số tháng..."
                        min="1"
                        max="360"
                      />
                      {errors.term && (
                        <p className="text-red-500 text-sm mt-1">{errors.term}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Khách hàng (tùy chọn)
                      </label>
                      <input
                        type="number"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Nhập ID khách hàng..."
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mục đích vay <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    rows={3}
                    className={`form-textarea ${errors.purpose ? 'border-red-500' : ''}`}
                    placeholder="Mô tả mục đích vay..."
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Link href="/credits" className="btn-secondary">
                    Hủy
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Đang tạo...' : 'Tạo khách hàng'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền vay:</span>
                  <span className="font-semibold">{formatCurrency(formData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lãi suất:</span>
                  <span className="font-semibold">{formData.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kỳ hạn:</span>
                  <span className="font-semibold">{formData.term} tháng</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-600">Trả hàng tháng:</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(calculateMonthlyPayment())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền phải trả:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(calculateTotalAmount())}
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                  <p>Số tiền vay phải lớn hơn 0</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                  <p>Kỳ hạn từ 1 đến 360 tháng</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                  <p>Lãi suất từ 0% đến 100%</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                  <p>ID khách hàng là tùy chọn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 