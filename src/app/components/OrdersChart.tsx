"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register chart components to make them available in the chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define a type for the order data
interface OrderItem {
  date: string;
  totalOrders: number;
}

// Default chart options with a generic type of "bar"
const defaultChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Total Orders Chart", // Chart title
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Hide grid lines on x-axis
      },
    },
    y: {
      beginAtZero: true, // Start y-axis from 0
    },
  },
};

// OrdersChart component
export default function OrdersChart({ items }: { items: OrderItem[] }) {
  // Prepare the data for the chart
  const chartData = {
    labels: items.map((item) => item.date),
    datasets: [
      {
        label: "Orders",
        data: items.map((item) => item.totalOrders), // Ensures correct data
        backgroundColor: "rgba(135, 159, 255, 0.2)",
        borderColor: "rgba(135, 159, 255, 0.8)",
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  return (
    <section className="bg-white p-5 rounded-xl shadow w-full h-[430px]">
      {/* Render the Bar chart with provided data and options */}
      <Bar data={chartData} options={defaultChartOptions} />
    </section>
  );
}
