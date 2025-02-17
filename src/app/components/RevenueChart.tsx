"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Define the data structure for revenue items
interface RevenueItem {
  date: string;
  totalRevenue: number; // Flattened structure
}

// Define Props Interface for the RevenueChart component
interface RevenueChartProps {
  items: RevenueItem[];
}

// Main component function
export default function RevenueChart({ items }: RevenueChartProps) {
  // Prepare chart data with mapped revenue values
  const data = {
    labels: items.map(item => item.date),
    datasets: [
      {
        label: "Revenue",
        data: items.map(item => item.totalRevenue || 0), // Handle potential undefined values
        backgroundColor: "rgba(135, 159, 255, 0.2)", // Light color for background
        borderColor: "rgba(135, 159, 255, 0.8)", // Darker border color for visibility
        borderWidth: 2, // Border width adjustment for clearer lines
        tension: 0.4, // Smoother lines
        pointRadius: 5, // Show points on the line
        pointHoverRadius: 7, // Larger points on hover
      },
    ],
  };

  // Chart options for responsive design and styling
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Revenue Over Time",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true, // Ensure the y-axis starts from 0
        ticks: {
          stepSize: 1000, // Adjust step size for better readability
        },
      },
    },
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-md w-full h-[430px]">
      <Line data={data} options={options} />
    </section>
  );
}
