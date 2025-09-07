'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

export function ProtectedRoute({ children, requireProfile = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (requireProfile && !user.role) {
        router.push('/onboarding');
      }
    }
  }, [user, loading, router, requireProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}