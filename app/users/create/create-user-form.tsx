'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function CreateUserForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

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
      const response = await fetch('/api/users', {
        method: 'POST',
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
        alert('Tạo người dùng thành công!');
        router.push('/users');
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi tạo người dùng');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="user@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>

      {/* Fullname */}
      <div>
        <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-2">
          Họ và tên *
        </label>
        <input
          type="text"
          id="fullname"
          value={formData.fullname}
          onChange={(e) => handleInputChange('fullname', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fullname ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Nguyễn Văn A"
        />
        {errors.fullname && <p className="mt-1 text-sm text-red-400">{errors.fullname}</p>}
      </div>

      {/* Birthdate */}
      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-300 mb-2">
          Ngày sinh *
        </label>
        <input
          type="date"
          id="birthdate"
          value={formData.birthdate}
          onChange={(e) => handleInputChange('birthdate', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.birthdate ? 'border-red-500' : 'border-gray-600'
          }`}
        />
        {errors.birthdate && <p className="mt-1 text-sm text-red-400">{errors.birthdate}</p>}
      </div>

      {/* ID Number */}
      <div>
        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-300 mb-2">
          Số CMND/CCCD *
        </label>
        <input
          type="text"
          id="idNumber"
          value={formData.idNumber}
          onChange={(e) => handleInputChange('idNumber', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.idNumber ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="123456789012"
        />
        {errors.idNumber && <p className="mt-1 text-sm text-red-400">{errors.idNumber}</p>}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
          Địa chỉ *
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.address ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="123 Nguyễn Trãi, Hà Nội"
        />
        {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
      </div>

      {/* Marital Status */}
      <div>
        <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-300 mb-2">
          Tình trạng hôn nhân *
        </label>
        <select
          id="maritalStatus"
          value={formData.maritalStatus}
          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.maritalStatus ? 'border-red-500' : 'border-gray-600'
          }`}
        >
          <option value="">Chọn tình trạng hôn nhân</option>
          {maritalStatusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.maritalStatus && <p className="mt-1 text-sm text-red-400">{errors.maritalStatus}</p>}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
          Số điện thoại *
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="0123456789"
        />
        {errors.phoneNumber && <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>}
      </div>

      {/* Occupation */}
      <div>
        <label htmlFor="occupation" className="block text-sm font-medium text-gray-300 mb-2">
          Nghề nghiệp *
        </label>
        <input
          type="text"
          id="occupation"
          value={formData.occupation}
          onChange={(e) => handleInputChange('occupation', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.occupation ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Software Engineer"
        />
        {errors.occupation && <p className="mt-1 text-sm text-red-400">{errors.occupation}</p>}
      </div>

      {/* Salary */}
      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-2">
          Lương (VND) *
        </label>
        <input
          type="number"
          id="salary"
          value={formData.salary}
          onChange={(e) => handleInputChange('salary', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.salary ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="20000000"
          min="0"
        />
        {errors.salary && <p className="mt-1 text-sm text-red-400">{errors.salary}</p>}
      </div>

      {/* CIC Rank */}
      <div>
        <label htmlFor="cicRank" className="block text-sm font-medium text-gray-300 mb-2">
          CIC Rank *
        </label>
        <select
          id="cicRank"
          value={formData.cicRank}
          onChange={(e) => handleInputChange('cicRank', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cicRank ? 'border-red-500' : 'border-gray-600'
          }`}
        >
          <option value="">Chọn CIC Rank</option>
          {cicRankOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.cicRank && <p className="mt-1 text-sm text-red-400">{errors.cicRank}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo người dùng'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/users')}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
} 