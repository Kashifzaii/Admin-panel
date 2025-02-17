'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  name: string;
  slug: string;
}

export default function CategoryForm() {
  const [data, setData] = useState<Category>({ name: '', slug: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const categoryId = params.get('id');
      setId(categoryId);
    }
  }, []);

  const fetchData = async () => {
    if (id) {
      const response = await fetch('/api/categories');
      const categories: Category[] = await response.json();
      const category = categories.find((cat: any) => cat._id === id);
      setData(category || { name: '', slug: '' });
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key: string, value: string) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: data.name, slug: data.slug }),
        headers: { 'Content-Type': 'application/json' },
      });
      setData({ name: '', slug: '' });
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/categories', {
        method: 'PUT',
        body: JSON.stringify({ id, name: data.name, slug: data.slug }),
        headers: { 'Content-Type': 'application/json' },
      });
      router.push('/Admin/Categories');
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        {id ? 'Update' : 'Create'} Category
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          id ? handleUpdate() : handleCreate();
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="category-name" className="text-gray-700 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            placeholder="Enter Name"
            value={data.name}
            onChange={(e) => handleData('name', e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="category-slug" className="text-gray-700 text-sm">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="category-slug"
            type="text"
            placeholder="Enter Slug"
            value={data.slug}
            onChange={(e) => handleData('slug', e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 mt-4 rounded-lg bg-blue-600 text-white font-semibold transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' : id ? 'Update Category' : 'Create Category'}
        </button>
      </form>
    </div>
  );
}
