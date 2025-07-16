'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CicRankData {
  cicRank: string;
  count: number;
}

interface CicRankBarChartProps {
  data: CicRankData[];
  totalUsers: number;
}

export default function CicRankBarChart({ data, totalUsers }: CicRankBarChartProps) {
  const getCicRankColor = (cicRank: string) => {
    switch (cicRank) {
      case 'A':
        return 'rgba(34, 197, 94, 0.8)'; // green
      case 'B':
        return 'rgba(59, 130, 246, 0.8)'; // blue
      case 'C':
        return 'rgba(234, 179, 8, 0.8)'; // yellow
      case 'D':
        return 'rgba(239, 68, 68, 0.8)'; // red
      default:
        return 'rgba(156, 163, 175, 0.8)'; // gray
    }
  };

  const chartData = {
    labels: data.map(item => `Rank ${item.cicRank}`),
    datasets: [
      {
        label: 'Số lượng',
        data: data.map(item => item.count),
        backgroundColor: data.map(item => getCicRankColor(item.cicRank)),
        borderColor: data.map(item => getCicRankColor(item.cicRank).replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const count = context.parsed.y;
            const percentage = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
            return `Số lượng: ${count} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Số lượng người dùng'
        }
      },
      x: {
        title: {
          display: true,
          text: 'CIC Rank'
        }
      }
    },
  };

  return (
    <div className="w-full h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
} 