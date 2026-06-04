'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    // If user is logged in, redirect to dashboard
    if (mounted && token && user) {
      router.push('/dashboard');
    }
  }, [mounted, token, user, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚖️</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Legal Prep Studio</h2>
          <p className="text-gray-600 mb-8">
            AI-powered study material generation for legal professionals
          </p>

          <div className="space-y-3">
            <Link href="/login" className="block w-full">
              <Button variant="primary" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/register" className="block w-full">
              <Button variant="secondary" className="w-full">
                Register
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>✓ 20 Indian Law Subjects</li>
              <li>✓ 6 Study Modes (Notes, Worksheets, Q&A, etc.)</li>
              <li>✓ 4 Difficulty Levels</li>
              <li>✓ AI-powered Generation</li>
              <li>✓ Save & Manage Materials</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
