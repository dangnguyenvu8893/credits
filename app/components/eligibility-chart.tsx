'use client';

interface EligibilityFactor {
  name: string;
  value: number;
  maxValue: number;
  isPositive: boolean;
  description: string;
}

interface EligibilityChartProps {
  age: number;
  salary: number;
  cicRank: string;
  maritalStatus: string;
  occupation: string;
}

export default function EligibilityChart({
  age,
  salary,
  cicRank,
  maritalStatus,
  occupation
}: EligibilityChartProps) {
  // Calculate eligibility factors
  const getCicScore = (cic: string): number => {
    switch (cic) {
      case 'A': return 100;
      case 'B': return 75;
      case 'C': return 50;
      case 'D': return 25;
      default: return 0;
    }
  };

  const getSalaryScore = (salary: number): number => {
    if (salary >= 50000000) return 100;
    if (salary >= 30000000) return 85;
    if (salary >= 20000000) return 70;
    if (salary >= 15000000) return 55;
    if (salary >= 10000000) return 40;
    if (salary >= 5000000) return 25;
    return 10;
  };

  const getAgeScore = (age: number): number => {
    if (age >= 25 && age <= 55) return 100;
    if (age >= 22 && age <= 60) return 80;
    if (age >= 18 && age <= 65) return 60;
    return 30;
  };

  const getMaritalScore = (status: string): number => {
    switch (status) {
      case 'Married': return 90;
      case 'Single': return 70;
      case 'Divorced': return 60;
      case 'Widowed': return 80;
      default: return 50;
    }
  };

  const getOccupationScore = (job: string): number => {
    const highValueJobs = [
      'Bác sĩ', 'Bác sĩ nha khoa', 'Luật sư', 'Kỹ sư phần mềm', 
      'Chuyên viên AI', 'Giám đốc kinh doanh', 'Kế toán trưởng'
    ];
    const mediumValueJobs = [
      'Chuyên viên', 'Kỹ sư', 'Giáo viên', 'Y tá', 'Nhân viên'
    ];
    
    if (highValueJobs.some(jobType => job.includes(jobType))) return 90;
    if (mediumValueJobs.some(jobType => job.includes(jobType))) return 70;
    return 50;
  };

  const factors: EligibilityFactor[] = [
    {
      name: 'CIC Score',
      value: getCicScore(cicRank),
      maxValue: 100,
      isPositive: cicRank === 'A' || cicRank === 'B',
      description: cicRank === 'A' ? 'Excellent credit history' : 
                   cicRank === 'B' ? 'Good credit history' :
                   cicRank === 'C' ? 'Average credit history' : 'Poor credit history'
    },
    {
      name: 'Salary Level',
      value: getSalaryScore(salary),
      maxValue: 100,
      isPositive: salary >= 20000000,
      description: salary >= 50000000 ? 'Very high income' :
                   salary >= 30000000 ? 'High income' :
                   salary >= 20000000 ? 'Good income' :
                   salary >= 15000000 ? 'Average income' : 'Low income'
    },
    {
      name: 'Age Factor',
      value: getAgeScore(age),
      maxValue: 100,
      isPositive: age >= 25 && age <= 55,
      description: age >= 25 && age <= 55 ? 'Optimal age range' :
                   age >= 22 && age <= 60 ? 'Good age range' : 'Limited age range'
    },
    {
      name: 'Marital Status',
      value: getMaritalScore(maritalStatus),
      maxValue: 100,
      isPositive: maritalStatus === 'Married',
      description: maritalStatus === 'Married' ? 'Stable marital status' :
                   maritalStatus === 'Single' ? 'Single status' : 'Other status'
    },
    {
      name: 'Occupation',
      value: getOccupationScore(occupation),
      maxValue: 100,
      isPositive: getOccupationScore(occupation) >= 70,
      description: getOccupationScore(occupation) >= 90 ? 'High-value profession' :
                   getOccupationScore(occupation) >= 70 ? 'Stable profession' : 'Basic profession'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Eligibility Factors</h3>
      
      <div className="space-y-4">
        {factors.map((factor, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                {factor.isPositive && (
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">{factor.value}/{factor.maxValue}</span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    factor.isPositive 
                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }`}
                  style={{ width: `${(factor.value / factor.maxValue) * 100}%` }}
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 italic">{factor.description}</p>
          </div>
        ))}
      </div>

      {/* Overall Score */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Overall Eligibility Score</span>
          <span className="text-lg font-bold text-green-600">
            {Math.round(factors.reduce((sum, factor) => sum + factor.value, 0) / factors.length)}%
          </span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
              style={{ 
                width: `${(factors.reduce((sum, factor) => sum + factor.value, 0) / factors.length)}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 