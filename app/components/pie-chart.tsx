'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface PieChartProps {
  data: Array<{
    cardType: string | null;
    count: number;
  }>;
  totalUsers: number;
}

export default function PieChart({ data, totalUsers }: PieChartProps) {
  const cardTypeColorMap: Record<string, string> = {
    Platinum: 'rgba(147, 51, 234, 0.8)', // Purple
    Gold: 'rgba(245, 158, 11, 0.8)',     // Yellow
    Silver: 'rgba(156, 163, 175, 0.8)',  // Gray
    Reject: 'rgba(239, 68, 68, 0.8)',    // Red
    Unknown: 'rgba(107, 114, 128, 0.8)', // Default Gray
  };
  const cardTypeBorderColorMap: Record<string, string> = {
    Platinum: 'rgba(147, 51, 234, 1)',
    Gold: 'rgba(245, 158, 11, 1)',
    Silver: 'rgba(156, 163, 175, 1)',
    Reject: 'rgba(239, 68, 68, 1)',
    Unknown: 'rgba(107, 114, 128, 1)',
  };

  const chartData = {
    labels: data.map(item => item.cardType || 'Unknown'),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: data.map(item => cardTypeColorMap[item.cardType || 'Unknown'] || cardTypeColorMap['Unknown']),
        borderColor: data.map(item => cardTypeBorderColorMap[item.cardType || 'Unknown'] || cardTypeBorderColorMap['Unknown']),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = totalUsers > 0 ? ((value / totalUsers) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
} 