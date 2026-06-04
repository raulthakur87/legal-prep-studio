'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, Alert, Select } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';

const TARGET_EXAMS = [
  { value: 'Scale AI', label: 'Scale AI' },
  { value: 'Outlier AI', label: 'Outlier AI' },
  { value: 'Mark', label: 'Mark' },
  { value: 'Tiering', label: 'Tiering' },
  { value: 'Higher Judiciary', label: 'Higher Judiciary' },
  { value: 'Civil Service', label: 'Civil Service' },
  { value: 'General Practice', label: 'General Practice' },
];

const BACKGROUNDS = [
  { value: 'practicing-lawyer', label: 'Practicing Lawyer' },
  { value: 'law-student', label: 'Law Student' },
  { value: 'graduate', label: 'Law Graduate' },
  { value: 'other', label: 'Other' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken, setLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    background: 'practicing-lawyer',
    targetExams: [] as string[],
    aiProvider: 'claude' as 'claude' | 'openai',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleExamToggle = (exam: string) => {
    setFormData((prev) => ({
      ...prev,
      targetExams: prev.targetExams.includes(exam)
        ? prev.targetExams.filter((e) => e !== exam)
        : [...prev.targetExams, exam],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        background: formData.background,
        targetExams: formData.targetExams,
        aiProvider: formData.aiProvider,
      });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      setSuccessMessage('Registration successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 py-12 px-4">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
        <p className="text-gray-600 mb-6">Join Legal Prep Studio and start generating study materials</p>

        {successMessage && <Alert type="success" message={successMessage} />}
        {errors.submit && <Alert type="error" message={errors.submit} onClose={() => setErrors({ ...errors, submit: '' })} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="name"
              label="Full Name"
              placeholder="John Lawyer"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={isLoading}
            />
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={isLoading}
            />
            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={isLoading}
            />
          </div>

          {/* Background and AI Provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              name="background"
              label="Professional Background"
              options={BACKGROUNDS}
              value={formData.background}
              onChange={handleChange}
              disabled={isLoading}
            />
            <Select
              name="aiProvider"
              label="Preferred AI Provider"
              options={[
                { value: 'claude', label: 'Claude (Anthropic)' },
                { value: 'openai', label: 'OpenAI (GPT)' },
              ]}
              value={formData.aiProvider}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Target Exams */}
          <div>
            <label className="label">Target Exams (Select at least one)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TARGET_EXAMS.map((exam) => (
                <label key={exam.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.targetExams.includes(exam.value)}
                    onChange={() => handleExamToggle(exam.value)}
                    disabled={isLoading}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{exam.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
