'use client';

import '../../globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import { AIService, PredictionResponse } from '@/lib/services/ai-service';

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
      });

      // Load existing AI prediction if available
      if (user.cardType && user.creditLimit) {
        setPrediction({
          cardType: user.cardType,
          creditLimit: user.creditLimit,
          confidence: (user.confidence || 0) / 100,
          reasons: user.predictionReasons ? JSON.parse(user.predictionReasons) : [],
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
      try {
        result = await AIService.predict({
          ...formData,
          salary: parseInt(formData.salary),
        });
      } catch (error) {
        console.log('AI API failed, using mock data:', error);
        result = await AIService.predictMock({
          ...formData,
          salary: parseInt(formData.salary),
        });
      }
      
      setPrediction(result);
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
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
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
                prediction.cardType === 'Platinum' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                prediction.cardType === 'Gold' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                prediction.cardType === 'Silver' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                'bg-gradient-to-r from-blue-500 to-green-500'
              }`}>
                {prediction.cardType}
              </div>
            </div>

            {/* Credit Limit */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Credit Limit</p>
              <p className="text-2xl font-bold text-green-600">
                {prediction.creditLimit.toLocaleString('en-US')} VND
              </p>
            </div>

            {/* Confidence Score */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Confidence Level</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${prediction.confidence * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Math.round(prediction.confidence * 100)}%
              </p>
            </div>

            {/* Reasons */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Approval Reasons:</p>
              <ul className="space-y-1">
                {prediction.reasons.map((reason, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
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