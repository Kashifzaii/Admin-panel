"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";

// Type definition for the fetched data
interface CountData {
  totalProduct: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

// Function to fetch counts data from Sanity
const fetchCounts = async (): Promise<CountData> => {
  const productCount = await client.fetch(`*[_type == "product"]`);
  const orderCount = await client.fetch(`*[_type == "order"]`);
  const userCount = await client.fetch(`*[_type == "customer"]`);

  // Calculate total revenue by summing the 'total' field from each order
  const totalRevenue = orderCount.reduce((acc: number, order: any) => acc + (order.total || 0), 0);

  return {
    totalProduct: productCount.length,
    totalOrders: orderCount.length,
    totalUsers: userCount.length,
    totalRevenue: totalRevenue,
  };
};

export default function CountMeter() {
  const [data, setData] = useState<CountData>({
    totalProduct: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });

  // Fetch data on component mount
  useEffect(() => {
    const getData = async () => {
      const counts = await fetchCounts();
      setData(counts);
    };

    getData();
  }, []);

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <CountCard
        imgURL="/box.png"
        title="Products"
        value={data.totalProduct}
      />
      <CountCard
        imgURL="/received.png"
        title="Orders"
        value={data.totalOrders}
      />
      <CountCard
        imgURL="/profit-up.png"
        title="Revenue"
        value={`₹ ${(data.totalRevenue / 100).toFixed(2)}`} // Format revenue
      />
      <CountCard
        imgURL="/team.png"
        title="Customers"
        value={data.totalUsers}
      />
    </section>
  );
}

// Card component to display count data
interface CountCardProps {
  title: string;
  value: number | string;
  imgURL: string;
}

function CountCard({ title, value, imgURL }: CountCardProps) {
  return (
    <div className="flex gap-4 px-6 py-4 bg-white shadow-lg rounded-xl justify-between items-center">
      <div className="flex flex-col">
        <h1 className="font-semibold text-2xl text-primary">{value}</h1>
        <h1 className="text-sm text-gray-700">{title}</h1>
      </div>
      <img className="h-12" src={imgURL} alt={title} />
    </div>
  );
}
