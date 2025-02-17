'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";

// ✅ آرڈر کی قسم کی تعریف
interface Order {
  _id: string;
  total: number;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  products: { productTitle: string; price: number; quantity: number }[];
}

export default function ListView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pageLimit, setPageLimit] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
          _id,
          total,
          paymentMethod,
          "customerName": customer->name,
          "customerEmail": customer->email,
          products[] {
            productTitle,
            price,
            quantity
          }
        } | order(_createdAt desc) [0...$pageLimit]`;

        const data: Order[] = await client.fetch(query, { pageLimit });
        setOrders(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [pageLimit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-red-600 text-lg p-10">
        <span>{error.message}</span>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-4 p-5 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
      </div>

      <div className="flex-1 flex flex-col gap-3 md:px-5 rounded-xl bg-white shadow-lg overflow-x-auto">
        <table className="table-auto w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="font-semibold py-3 px-4 border text-left">SN</th>
              <th className="font-semibold py-3 px-4 border text-left">Customer</th>
              <th className="font-semibold py-3 px-4 border text-left">Total Price</th>
              <th className="font-semibold py-3 px-4 border text-left">Payment Mode</th>
              <th className="font-semibold py-3 px-4 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((item, index) => (
              <Row key={item._id} index={index + 1} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="flex justify-between text-sm py-3">
        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="px-4 py-2 border rounded-md"
          name="perpage"
          id="perpage"
        >
          <option value={3}>3 Items</option>
          <option value={5}>5 Items</option>
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={100}>100 Items</option>
        </select>
      </div>
    </main>
  );
}

// ✅ Row
function Row({ item, index }: { item: Order; index: number }) {
  return (
    <tr className="border-b hover:bg-gray-50 transition-all">
      <td className="py-3 px-4 border text-center">{index}</td>
      <td className="py-3 px-4 border">
        <div>
          <h1 className="font-medium text-gray-800">{item.customerName}</h1>
          <h1 className="text-xs text-gray-600">{item.customerEmail}</h1>
        </div>
      </td>
      <td className="py-3 px-4 border">&#163;{item.total}</td>
      <td className="py-3 px-4 border">
        <span className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
          {item.paymentMethod}
        </span>
      </td>
      <td className="py-3 px-4 border text-center">
        <Link href={`/Admin/Orders/${item._id}`}>
          <button className="bg-black text-white px-3 py-2 rounded-lg text-xs">
            View
          </button>
        </Link>
      </td>
    </tr>
  );
}
