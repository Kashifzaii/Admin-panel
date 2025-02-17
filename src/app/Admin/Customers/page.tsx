'use client';

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function ListView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const GetCustomers = async () => {
      try {
        const query = `*[_type == "customer"]{ 
          _id,
          name,
          email,
          phone
        }`;
        const fetchedCustomers = await client.fetch(query);
        setCustomers(fetchedCustomers);
      } catch (error) {
        setError(error as Error);
      }
    };
    GetCustomers();
  }, []);

  if (error) return (
    <div className="flex justify-center items-center text-red-600 text-xl p-10">
      <span>{error instanceof Error ? error.message : "An unknown error occurred"}</span>
    </div>
  );

  return (
    <main className="flex flex-col gap-4 p-6 bg-gray-50 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Customer List</h1>
      </div>

      <div className="flex-1 flex flex-col gap-4 md:px-5 rounded-xl bg-white shadow-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="font-semibold text-gray-600 px-4 py-3 border-b border-l rounded-l-lg">SN</th>
              <th className="font-semibold text-gray-600 px-4 py-3 border-b">Name</th>
              <th className="font-semibold text-gray-600 px-4 py-3 border-b">Email</th>
              <th className="font-semibold text-gray-600 px-4 py-3 border-b border-r rounded-r-lg">Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((item, index) => (
              <Row index={index} item={item} key={item._id} />
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Row({ item, index }: { item: Customer; index: number }) {
  return (
    <tr className="hover:bg-gray-50 transition-all">
      <td className="px-4 py-3 border-b border-l text-center">{index + 1}</td>
      <td className="px-4 py-3 border-b">{item.name}</td>
      <td className="px-4 py-3 border-b">{item.email}</td>
      <td className="px-4 py-3 border-b border-r text-center">
        {item.phone || "N/A"}
      </td>
    </tr>
  );
}
