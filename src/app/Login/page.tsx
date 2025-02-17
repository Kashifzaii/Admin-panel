"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// Define types for the form state
interface LoginState {
  email: string;
  password: string;
  message: string;
  passwordVisible: boolean;
  isLoggedIn: boolean;
}

const LoginPage = () => {
  const [formState, setFormState] = useState<LoginState>({
    email: "",
    password: "",
    message: "",
    passwordVisible: false,
    isLoggedIn: false,
  });

  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      router.push("/Admin"); // Redirect to Admin page if already logged in
    }
  }, [router]);

  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL_ADDRESS;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (formState.email === adminEmail && formState.password === adminPassword) {
      setFormState((prevState) => ({
        ...prevState,
        message: "Login successful",
        isLoggedIn: true,
      }));
      localStorage.setItem("isLoggedIn", "true");
      router.push("/Admin");
    } else {
      setFormState((prevState) => ({
        ...prevState,
        message: formState.email !== adminEmail ? "Invalid email address" : "Invalid password",
      }));
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setFormState((prevState) => ({
      ...prevState,
      passwordVisible: !prevState.passwordVisible,
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-200 to-yellow-400">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Admin Login</h2>

        {formState.message && (
          <div
            className={`mb-4 p-2 text-center text-lg ${
              formState.message.includes("Invalid") ? "text-red-500" : "text-green-500"
            }`}
          >
            {formState.message}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-blue-600 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formState.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-blue-600 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={formState.passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formState.password}
              onChange={handleInputChange}
              required
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {formState.passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;