'use client';

import { Trash2, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  productCount: number;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setIsLoading(true);
    try {
      await fetch('/api/categories', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchCategories(); // Refresh categories after delete
    } catch (error) {
      console.error('Error deleting category:', error);
    }
    setIsLoading(false);
  };

  const handleUpdate = (id: string) => {
    router.push(`/Admin/Categories?id=${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 md:px-10 px-4 py-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold text-sm text-gray-600 border-y bg-gray-50 px-4 py-2 border-l rounded-l-lg">SN</th>
            <th className="font-semibold text-sm text-gray-600 border-y bg-gray-50 px-4 py-2">Name</th>
            <th className="font-semibold text-sm text-gray-600 border-y bg-gray-50 px-4 py-2 text-left">Slug</th>
            <th className="font-semibold text-sm text-gray-600 border-y bg-gray-50 px-4 py-2">Products</th>
            <th className="font-semibold text-sm text-gray-600 border-y bg-gray-50 px-4 py-2 border-r rounded-r-lg text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((item, index) => (
            <tr key={item._id} className="hover:bg-gray-100 transition-all">
              <td className="text-center border-y bg-white px-4 py-2 border-l rounded-l-lg">{index + 1}</td>
              <td className="border-y bg-white px-4 py-2">{item.name}</td>
              <td className="border-y bg-white px-4 py-2">{item.slug.current}</td>
              <td className="text-center border-y bg-white px-4 py-2">{item.productCount}</td>
              <td className="border-y bg-white px-4 py-2 border-r rounded-r-lg text-center">
                <div className="flex gap-4 justify-center">
                  <button onClick={() => handleUpdate(item._id)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
