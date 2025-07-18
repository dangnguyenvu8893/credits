'use client';

import '../../globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import { AIService, PredictionResponse } from '@/lib/services/ai-service';
import ImageUpload from '@/app/components/image-upload';

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
  profileImage: string | null;
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
  profileImage: null,
};

const maritalStatusOptions = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
];

const cicRankOptions = [
  { value: 'A', label: 'A - Excellent' },
  { value: 'B', label: 'B - Good' },
  { value: 'C', label: 'C - Average' },
  { value: 'D', label: 'D - Poor' },
];

const occupationOptions = [
  { value: 'Bác sĩ', label: 'Bác sĩ' },
  { value: 'Bác sĩ nha khoa', label: 'Bác sĩ nha khoa' },
  { value: 'Chuyên viên AI', label: 'Chuyên viên AI' },
  { value: 'Chuyên viên Content', label: 'Chuyên viên Content' },
  { value: 'Chuyên viên Data', label: 'Chuyên viên Data' },
  { value: 'Chuyên viên Data Analyst', label: 'Chuyên viên Data Analyst' },
  { value: 'Chuyên viên HR', label: 'Chuyên viên HR' },
  { value: 'Chuyên viên Logistics', label: 'Chuyên viên Logistics' },
  { value: 'Chuyên viên Marketing', label: 'Chuyên viên Marketing' },
  { value: 'Chuyên viên PR', label: 'Chuyên viên PR' },
  { value: 'Chuyên viên QA', label: 'Chuyên viên QA' },
  { value: 'Chuyên viên SEO', label: 'Chuyên viên SEO' },
  { value: 'Chuyên viên bảo mật', label: 'Chuyên viên bảo mật' },
  { value: 'Chuyên viên chăm sóc khách hàng', label: 'Chuyên viên chăm sóc khách hàng' },
  { value: 'Chuyên viên chăm sóc sắc đẹp', label: 'Chuyên viên chăm sóc sắc đẹp' },
  { value: 'Chuyên viên content', label: 'Chuyên viên content' },
  { value: 'Chuyên viên kinh doanh', label: 'Chuyên viên kinh doanh' },
  { value: 'Chuyên viên logistics', label: 'Chuyên viên logistics' },
  { value: 'Chuyên viên marketing', label: 'Chuyên viên marketing' },
  { value: 'Chuyên viên nghiên cứu AI', label: 'Chuyên viên nghiên cứu AI' },
  { value: 'Chuyên viên nghiên cứu thị trường', label: 'Chuyên viên nghiên cứu thị trường' },
  { value: 'Chuyên viên pháp lý', label: 'Chuyên viên pháp lý' },
  { value: 'Chuyên viên phát triển backend', label: 'Chuyên viên phát triển backend' },
  { value: 'Chuyên viên phát triển frontend', label: 'Chuyên viên phát triển frontend' },
  { value: 'Chuyên viên phát triển game', label: 'Chuyên viên phát triển game' },
  { value: 'Chuyên viên phát triển mobile', label: 'Chuyên viên phát triển mobile' },
  { value: 'Chuyên viên phát triển sản phẩm', label: 'Chuyên viên phát triển sản phẩm' },
  { value: 'Chuyên viên quản lý chất lượng', label: 'Chuyên viên quản lý chất lượng' },
  { value: 'Chuyên viên thiết kế UI/UX', label: 'Chuyên viên thiết kế UI/UX' },
  { value: 'Chuyên viên thiết kế nội thất', label: 'Chuyên viên thiết kế nội thất' },
  { value: 'Chuyên viên thiết kế web', label: 'Chuyên viên thiết kế web' },
  { value: 'Chuyên viên tài chính', label: 'Chuyên viên tài chính' },
  { value: 'Chuyên viên tư vấn tài chính', label: 'Chuyên viên tư vấn tài chính' },
  { value: 'Chuyên viên xuất nhập khẩu', label: 'Chuyên viên xuất nhập khẩu' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Giám đốc kinh doanh', label: 'Giám đốc kinh doanh' },
  { value: 'Giám đốc sản xuất', label: 'Giám đốc sản xuất' },
  { value: 'Giáo viên', label: 'Giáo viên' },
  { value: 'Giáo viên mầm non', label: 'Giáo viên mầm non' },
  { value: 'Giáo viên tiểu học', label: 'Giáo viên tiểu học' },
  { value: 'Kế toán trưởng', label: 'Kế toán trưởng' },
  { value: 'Kỹ sư cơ khí', label: 'Kỹ sư cơ khí' },
  { value: 'Kỹ sư hóa học', label: 'Kỹ sư hóa học' },
  { value: 'Kỹ sư phần mềm', label: 'Kỹ sư phần mềm' },
  { value: 'Kỹ sư xây dựng', label: 'Kỹ sư xây dựng' },
  { value: 'Kỹ sư điện', label: 'Kỹ sư điện' },
  { value: 'Luật sư', label: 'Luật sư' },
  { value: 'Lập trình viên', label: 'Lập trình viên' },
  { value: 'Nhân viên Marketing', label: 'Nhân viên Marketing' },
  { value: 'Nhân viên bán hàng', label: 'Nhân viên bán hàng' },
  { value: 'Nhân viên kế toán', label: 'Nhân viên kế toán' },
  { value: 'Nhân viên thu ngân', label: 'Nhân viên thu ngân' },
  { value: 'Nhân viên thư viện', label: 'Nhân viên thư viện' },
  { value: 'Nhân viên văn phòng', label: 'Nhân viên văn phòng' },
  { value: 'Quản lý dự án', label: 'Quản lý dự án' },
  { value: 'Sinh viên', label: 'Sinh viên' },
  { value: 'Thiết kế web', label: 'Thiết kế web' },
  { value: 'Thiết kế đồ họa', label: 'Thiết kế đồ họa' },
  { value: 'Thợ cơ khí', label: 'Thợ cơ khí' },
  { value: 'Thợ may', label: 'Thợ may' },
  { value: 'Thợ sửa máy tính', label: 'Thợ sửa máy tính' },
  { value: 'Thợ sửa xe', label: 'Thợ sửa xe' },
  { value: 'Thợ điện', label: 'Thợ điện' },
  { value: 'Y tá', label: 'Y tá' },
  { value: 'Y tá trưởng', label: 'Y tá trưởng' },
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
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

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
        profileImage: user.profileImage,
      });

      // Load existing AI prediction if available
      if (user.cardType && user.creditLimit) {
        setPrediction({
          data: {
            age: new Date().getFullYear() - new Date(user.birthdate).getFullYear(),
            cic: user.cicRank,
            job: user.occupation,
            married: user.maritalStatus,
            predicted_card_type: user.cardType,
            predicted_credit_limit: user.creditLimit,
            predicted_credit_limit_formatted: user.creditLimit.toLocaleString('en-US'),
            salary: user.salary,
            success: true,
          },
          success: true,
        });
      }
    }
  }, [user, mode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Fullname validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    // Birthdate validation
    if (!formData.birthdate) {
      newErrors.birthdate = 'Birth date is required';
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthdate = 'Birth date cannot be in the future';
      }
    }

    // ID Number validation
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    } else if (formData.idNumber.length < 9 || formData.idNumber.length > 12) {
      newErrors.idNumber = 'ID number must be 9-12 characters';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Marital Status validation
    if (!formData.maritalStatus) {
      newErrors.maritalStatus = 'Marital status is required';
    }

    // Phone Number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+84|84|0)[0-9]{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number (e.g., 0123456789)';
    }

    // Occupation validation
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }

    // Salary validation
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number';
    }

    // CIC Rank validation
    if (!formData.cicRank) {
      newErrors.cicRank = 'CIC Rank is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePredict = async () => {
    if (!validateForm()) {
      return;
    }

    setIsPredicting(true);
    try {
      // Try real AI API first, fallback to mock if fails
      let result: PredictionResponse;
      const age = new Date().getFullYear() - new Date(formData.birthdate).getFullYear();
      try {
        result = await AIService.predict({
          age: age,
          married: formData.maritalStatus,
          salary: parseInt(formData.salary),
          cic: formData.cicRank,
          job: formData.occupation,
        });
        setPrediction(result);
      } catch (error) {
        console.log('AI API failed, using mock data:', error);
        // result = await AIService.predict({
        //   ...formData,
        //   salary: parseInt(formData.salary),
        // });
      }
    } catch (error) {
      alert('An error occurred during prediction. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if AI analysis result exists (only for create mode)
    if (mode === 'create' && !prediction) {
      alert('Please perform credit analysis before saving information!');
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
          profileImage: formData.profileImage,
          // Include AI prediction if available
          getPrediction: !!prediction,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const message = mode === 'update' ? 'User updated successfully!' : 'User created successfully!';
        alert(message);
        
        if (mode === 'update') {
          router.refresh(); // Refresh current page for update
        } else {
          router.push('/'); // Go to home page for create
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      const message = mode === 'update' ? 'An error occurred while updating user' : 'An error occurred while creating user';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDelete = async () => {
    if (!user || mode !== 'update') {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('User deleted successfully!');
        router.push('/users'); // Redirect to users list
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('An error occurred while deleting user');
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
          profileImage: user.profileImage,
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
      {/* Left Form */}
      <div className="w-full bg-white rounded-xl p-8 shadow-md border border-gray-200" style={{ minWidth: '350px' }}>
        {/* Header with buttons for update mode */}
        {mode === 'update' && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Edit User Information
            </h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete User
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

          {/* Profile Image */}
          <ImageUpload
            onImageChange={(base64Image) => handleInputChange('profileImage', base64Image)}
            currentImage={formData.profileImage}
          />

          {/* Fullname */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullname"
              value={formData.fullname}
              onChange={(e) => handleInputChange('fullname', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.fullname ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="John Doe"
            />
            {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
          </div>

          {/* Birthdate */}
          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date *
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
              ID Number *
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
              Address *
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
              placeholder="123 Main Street, City, Country"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>

          {/* Marital Status */}
          <div>
            <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-2">
              Marital Status *
            </label>
            <select
              id="maritalStatus"
              value={formData.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
            >
              <option value="">Select marital status</option>
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
              Phone Number *
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
              Occupation *
            </label>
            <select
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.occupation ? 'border-red-500' : 'border-gray-300'
              } text-gray-900`}
            >
              <option value="">Select occupation</option>
              {occupationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.occupation && <p className="mt-1 text-sm text-red-500">{errors.occupation}</p>}
          </div>

          {/* Salary */}
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
              Salary (VND) *
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
              <option value="">Select CIC Rank</option>
              {cicRankOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.cicRank && <p className="mt-1 text-sm text-red-500">{errors.cicRank}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handlePredict}
              disabled={isPredicting || isSubmitting}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-full font-medium transition-colors text-lg shadow-md"
            >
              {isPredicting ? 'Analyzing...' : 'Credit Analysis'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isPredicting || (mode === 'create' && !prediction)}
              className={`flex-1 py-3 px-4 rounded-full font-medium transition-colors text-lg shadow-md ${
                isSubmitting || isPredicting || (mode === 'create' && !prediction)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isSubmitting ? 'Processing...' : mode === 'update' ? 'Update User' : 'Save Information'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Right Results */}
      <div className="w-full md:w-1/2 bg-white rounded-xl p-8 shadow-md border border-gray-200 flex flex-col" style={{ minWidth: '350px' }}>
        <h2 className="text-xl font-bold mb-4 text-green-600">Credit Analysis Results</h2>
        
        {isPredicting ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600">Analyzing information...</p>
          </div>
        ) : prediction ? (
          <div className="space-y-4">
            {/* Card Type Badge */}
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-full text-white font-bold text-lg ${
                prediction.data.predicted_card_type === 'Reject' ? 'bg-gradient-to-r from-red-500 to-red-700' :
                prediction.data.predicted_card_type === 'Platinum' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                prediction.data.predicted_card_type === 'Gold' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                prediction.data.predicted_card_type === 'Silver' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                'bg-gradient-to-r from-blue-500 to-green-500'
              }`}>
                {prediction.data.predicted_card_type}
              </div>
            </div>

            {/* Credit Limit */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
              <p className={`text-2xl font-bold ${
                prediction.data.predicted_card_type === 'Reject' ? 'text-red-600' : 'text-green-600'
              }`}>
                {prediction.data.predicted_card_type === 'Reject' ? '0 VND' : `${prediction.data.predicted_credit_limit_formatted} VND`}
              </p>
            </div>

            {/* User Information Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Analysis Summary:</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Age:</span>
                  <span className="font-medium">{prediction.data.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Job:</span>
                  <span className="font-medium">{prediction.data.job}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salary:</span>
                  <span className="font-medium">{prediction.data.salary.toLocaleString('en-US')} VND</span>
                </div>
                <div className="flex justify-between">
                  <span>CIC Rank:</span>
                  <span className="font-medium">{prediction.data.cic}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marital Status:</span>
                  <span className="font-medium">{prediction.data.married}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-full font-medium transition-colors text-lg shadow-md"
            >
              {isSubmitting ? 'Processing...' : mode === 'update' ? 'Update Information' : 'Apply for Credit Card'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">No analysis results yet</p>
            <p className="text-sm text-gray-500">Please fill in all information and click "Credit Analysis"</p>
          </div>
        )}
      </div>
    </div>
  );
} 