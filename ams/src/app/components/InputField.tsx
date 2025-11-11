"use client";

import React from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  register: any;
  error?: FieldError;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  register,
  error,
  placeholder,
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      type={type}
      placeholder={placeholder}
      {...register(name)}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
  </div>
);

export default InputField;
