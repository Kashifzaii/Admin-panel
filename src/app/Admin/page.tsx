"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import CountMeter from "@/app/components/CountMeter";
import OrdersChart from "@/app/components/OrdersChart";
import RevenueChart from "@/app/components/RevenueChart";

export default function Page() {
  const [data, setData] = useState<
    { date: string; totalOrders: number; totalRevenue: number }[] // Updated type
  >([]);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  // ✅ Fetching Orders & Revenue Data
  const fetchOrdersData = async () => {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 6);

      const startDate = lastWeek.toISOString().split("T")[0];
      const endDate = today.toISOString().split("T")[0];

      // ✅ Updated Query for fetching orders without sum
      const query = `*[_type == "order" && date >= $startDate && date <= $endDate] {
        date,
        orderId,
        orderAmount
      } | order(date asc)`;

      const result = await client.fetch(query, { startDate, endDate });

      console.log("Fetched Data:", result); // 🛠️ Debugging Line

      // Manually calculate totalOrders and totalRevenue
      const processedData = result.reduce((acc: any[], order: any) => {
        const existingData = acc.find((item) => item.date === order.date);
        if (existingData) {
          existingData.totalOrders += 1;
          existingData.totalRevenue += order.orderAmount || 0;
        } else {
          acc.push({
            date: order.date,
            totalOrders: 1,
            totalRevenue: order.orderAmount || 0,
          });
        }
        return acc;
      }, []);

      setData(processedData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <main className="flex flex-col gap-6 p-5">
      <CountMeter />
      <div className="flex flex-col md:flex-row gap-5">
        <RevenueChart items={data} />
        <OrdersChart items={data.map((item) => ({ date: item.date, totalOrders: item.totalOrders }))} />
      </div>
    </main>
  );
}

