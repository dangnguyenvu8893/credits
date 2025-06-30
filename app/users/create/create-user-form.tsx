'use client';

import '../../globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';

interface FormData {
  email: string;
  fullname: string;
  birthdate: string;
  idNumber: string;
  address: string;
  maritalStatus: string;
  phoneNumber: string;
  occupation: string;
  salary: string;
  cicRank: string;
}

const initialFormData: FormData = {
  email: '',
  fullname: '',
  birthdate: '',
  idNumber: '',
  address: '',
  maritalStatus: '',
  phoneNumber: '',
  occupation: '',
  salary: '',
  cicRank: '',
};

const maritalStatusOptions = [
  { value: 'Single', label: 'Độc thân' },
  { value: 'Married', label: 'Đã kết hôn' },
  { value: 'Divorced', label: 'Đã ly hôn' },
  { value: 'Widowed', label: 'Góa' },
];

const cicRankOptions = [
  { value: 'A', label: 'A - Tốt' },
  { value: 'B', label: 'B - Khá' },
  { value: 'C', label: 'C - Trung bình' },
  { value: 'D', label: 'D - Kém' },
];

interface UserFormProps {
  user?: User;
  mode?: 'create' | 'update';
}

export default function UserForm({ user, mode = 'create' }: UserFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Initialize form data when user prop changes (for update mode)
  useEffect(() => {
    if (user && mode === 'update') {
      setFormData({
        email: user.email,
        fullname: user.fullname,
        birthdate: new Date(user.birthdate).toISOString().split('T')[0],
        idNumber: user.idNumber,
        address: user.address,
        maritalStatus: user.maritalStatus,
        phoneNumber: user.phoneNumber,
        occupation: user.occupation,
        salary: user.salary.toString(),
        cicRank: user.cicRank,
      });
    }
  }, [user, mode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Fullname validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Họ và tên là bắt buộc';
    }

    // Birthdate validation
    if (!formData.birthdate) {
      newErrors.birthdate = 'Ngày sinh là bắt buộc';
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthdate = 'Ngày sinh không thể trong tương lai';
      }
    }

    // ID Number validation
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'Số CMND/CCCD là bắt buộc';
    } else if (formData.idNumber.length < 9 || formData.idNumber.length > 12) {
      newErrors.idNumber = 'Số CMND/CCCD phải từ 9-12 ký tự';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    // Marital Status validation
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'Tình trạng hôn nhân là bắt buộc';
    }

    // Phone Number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!/^(\+84|84|0)[0-9]{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (VD: 0123456789)';
    }

    // Occupation validation
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Nghề nghiệp là bắt buộc';
    }

    // Salary validation
    if (!formData.salary) {
      newErrors.salary = 'Lương là bắt buộc';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Lương phải là số dương';
    }

    // CIC Rank validation
    if (!formData.cicRank) {
      newErrors.cicRank = 'CIC Rank là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const url = mode === 'update' ? `/api/users/${user?.id}` : '/api/users';
      const method = mode === 'update' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salary: parseInt(formData.salary),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const message = mode === 'update' ? 'Cập nhật người dùng thành công!' : 'Tạo người dùng thành công!';
        alert(message);
        
        if (mode === 'update') {
          router.refresh(); // Refresh current page for update
        } else {
          router.push('/'); // Go to home page for create
        }
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      const message = mode === 'update' ? 'Có lỗi xảy ra khi cập nhật người dùng' : 'Có lỗi xảy ra khi tạo người dùng';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    if (mode === 'update') {
      // Reset form data to original values for update mode
      if (user) {
        setFormData({
          email: user.email,
          fullname: user.fullname,
          birthdate: new Date(user.birthdate).toISOString().split('T')[0],
          idNumber: user.idNumber,
          address: user.address,
          maritalStatus: user.maritalStatus,
          phoneNumber: user.phoneNumber,
          occupation: user.occupation,
          salary: user.salary.toString(),
          cicRank: user.cicRank,
        });
      }
    } else {
      // Reset to initial values for create mode
      setFormData(initialFormData);
    }
    setErrors({});
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-start">
      {/* Form bên trái */}
      <div className="w-full bg-white rounded-xl p-8 shadow-md border border-gray-200" style={{ minWidth: '350px' }}>
        {/* Header with buttons for update mode */}
        {mode === 'update' && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Chỉnh sửa thông tin người dùng
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="user@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Fullname */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              id="fullname"
              value={formData.fullname}
              onChange={(e) => handleInputChange('fullname', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.fullname ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
          </div>

          {/* Birthdate */}
          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh *
            </label>
            <input
              type="date"
              id="birthdate"
              value={formData.birthdate}
              onChange={(e) => handleInputChange('birthdate', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.birthdate ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
            />
            {errors.birthdate && <p className="mt-1 text-sm text-red-500">{errors.birthdate}</p>}
          </div>

          {/* ID Number */}
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Số CMND/CCCD *
            </label>
            <input
              type="text"
              id="idNumber"
              value={formData.idNumber}
              onChange={(e) => handleInputChange('idNumber', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.idNumber ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="123456789012"
            />
            {errors.idNumber && <p className="mt-1 text-sm text-red-500">{errors.idNumber}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ *
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="123 Nguyễn Trãi, Hà Nội"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>

          {/* Marital Status */}
          <div>
            <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Tình trạng hôn nhân *
            </label>
            <select
              id="maritalStatus"
              value={formData.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
            >
              <option value="">Chọn tình trạng hôn nhân</option>
              {maritalStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.maritalStatus && <p className="mt-1 text-sm text-red-500">{errors.maritalStatus}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="0123456789"
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>

          {/* Occupation */}
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
              Nghề nghiệp *
            </label>
            <input
              type="text"
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.occupation ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="Software Engineer"
            />
            {errors.occupation && <p className="mt-1 text-sm text-red-500">{errors.occupation}</p>}
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
              Lương (VND) *
            </label>
            <input
              type="number"
              id="salary"
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.salary ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="20000000"
              min="0"
            />
            {errors.salary && <p className="mt-1 text-sm text-red-500">{errors.salary}</p>}
          </div>

          {/* CIC Rank */}
          <div>
            <label htmlFor="cicRank" className="block text-sm font-medium text-gray-700 mb-2">
              CIC Rank *
            </label>
            <select
              id="cicRank"
              value={formData.cicRank}
              onChange={(e) => handleInputChange('cicRank', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.cicRank ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
            >
              <option value="">Chọn CIC Rank</option>
              {cicRankOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.cicRank && <p className="mt-1 text-sm text-red-500">{errors.cicRank}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-full font-medium transition-colors text-lg shadow-md"
            >
              {isSubmitting ? 'Đang xử lý...' : mode === 'update' ? 'Cập nhật người dùng' : 'Check Account'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Kết quả bên phải */}
      <div className="w-full md:w-1/2 bg-white rounded-xl p-8 shadow-md border border-gray-200 flex flex-col" style={{ minWidth: '350px' }}>
        <h2 className="text-xl font-bold mb-4 text-green-600">Eligibility Results</h2>
        <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
          [Chart Placeholder]
        </div>
        <div className="text-gray-700 text-sm overflow-y-auto">
          <p>We are pleased to inform you that you are now eligible to apply for a credit card with the following benefits:</p>
          <ul className="list-disc ml-5 my-2">
            <li><b>Card Type:</b> Platinum</li>
            <li><b>Credit Limit:</b> 200,000,000 VND</li>
          </ul>
          <b>Why You Qualified:</b>
          <ul className="list-disc ml-5 my-2">
            <li>Strong Credit Score (CIC Rating: 1 – Excellent)</li>
            <li>Stable Monthly Income</li>
            <li>Low Debt-to-Income Ratio</li>
            <li>Consistent Employment</li>
            <li>No Red Flags in Current Debt</li>
          </ul>
          <p>With these factors combined, you meet all criteria required for Platinum tier membership, which offers premium benefits and higher credit flexibility.</p>
        </div>
      </div>
    </div>
  );
} 