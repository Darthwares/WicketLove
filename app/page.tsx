'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Trophy, Calendar, BarChart3, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { signInWithGoogle } from '@/lib/utils/auth';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/utils/auth';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    const timer = setInterval(() => {
      setMatchCount((prev) => {
        if (prev < 1247) return prev + Math.floor(Math.random() * 10) + 1;
        return prev;
      });
    }, 100);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (result.isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign in error:', error?.message || error);
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: 'Smart Team Balance',
      description: 'AI-powered team selection based on player ratings and roles',
    },
    {
      icon: Calendar,
      title: 'Easy Match Organization',
      description: 'Create matches in seconds, manage RSVPs effortlessly',
    },
    {
      icon: Trophy,
      title: 'Performance Tracking',
      description: 'Track your cricket journey with detailed statistics',
    },
    {
      icon: Share2,
      title: 'WhatsApp Integration',
      description: 'Share match details instantly with your cricket group',
    },
    {
      icon: BarChart3,
      title: 'Fair Play System',
      description: 'Automatic captain rotation and position preferences',
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Connect with cricket lovers in your area',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">Wicket Love</span>
          </div>
        </nav>

        <section className="text-center mb-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Organize Cricket.
              <br />
              <span className="text-green-600">Build Teams.</span>
              <br />
              Track Stats.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The ultimate platform for casual cricket groups. Create balanced teams,
              manage matches, and track your cricket journey - all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">
              {matchCount.toLocaleString()}+
            </div>
            <div className="text-gray-600">Matches Organized</div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-6 w-6 border-3 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Start Playing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-4">Free forever. No credit card required.</p>
          </motion.div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your cricket experience?</h2>
          <p className="text-gray-600 mb-8">Join thousands of cricket enthusiasts already using Wicket Love</p>
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full"
          >
            Get Started Now
          </Button>
        </section>
      </motion.div>
    </div>
  );
}