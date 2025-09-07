'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Activity, Users, Trophy, Calendar, BarChart3, Share2, ArrowRight, 
  Sparkles, Star, Zap, Shield, Target, TrendingUp, Award, Timer, 
  MapPin, ChevronRight, Rocket, Globe, Heart, PlayCircle, CheckCircle,
  Smartphone, Clock, DollarSign, UserCheck, MessageSquare, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { signInWithGoogle } from '@/lib/utils/auth';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/utils/auth';
import { cn } from '@/lib/utils';
import { WobbleText } from '@/components/ui/wobble-text';
import { FlipWords } from '@/components/ui/flip-words';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Background Components
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-primary/10" />
            <circle cx="22" cy="22" r="1" className="fill-primary/10" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-chart-2/10 to-chart-4/10 rounded-full blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

// Hero Components
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}</span>;
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="relative p-6 h-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </motion.div>
              
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              
              <div className="mt-4 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </Card>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{feature.title} Details</h4>
          <p className="text-sm text-muted-foreground">
            {feature.details || "Advanced features to help you manage your cricket team more effectively."}
          </p>
          <div className="flex items-center pt-2">
            <CheckCircle className="h-4 w-4 text-primary mr-2" />
            <span className="text-xs text-muted-foreground">Available in all plans</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return unsubscribe;
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
      icon: Clock,
      title: 'No More Waiting',
      description: 'Teams ready before you arrive at the ground',
      details: 'Everyone knows their team and batting order before match day. Start playing immediately when you arrive.'
    },
    {
      icon: UserCheck,
      title: 'Instant RSVPs',
      description: 'Know who\'s playing days in advance',
      details: 'One-tap RSVP system that sends automatic reminders. No more last-minute "who\'s coming?" messages.'
    },
    {
      icon: Target,
      title: 'Fair Teams in Seconds',
      description: 'AI balances teams based on actual skill levels',
      details: 'No arguments, no bias. Our algorithm creates perfectly balanced teams that everyone agrees with.'
    },
    {
      icon: Share2,
      title: 'WhatsApp Ready',
      description: 'Share everything with one tap',
      details: 'Match details, teams, venue - all formatted perfectly for WhatsApp. Your group stays informed.'
    },
    {
      icon: Bell,
      title: 'Smart Reminders',
      description: 'Players never forget match day',
      details: 'Automatic reminders 2 days and 1 day before. Weather alerts if conditions change.'
    },
    {
      icon: Trophy,
      title: 'Track Everything',
      description: 'Stats that motivate improvement',
      details: 'Personal scorecards, team performance, season records - all updated automatically after each match.'
    },
  ];

  const testimonials = [
    {
      name: "Raj Kumar",
      role: "Weekend Warriors Captain",
      avatar: "RK",
      text: "Game changer! No more WhatsApp chaos for team selection. The AI balance is spot on.",
      rating: 5,
      team: "Mumbai Mavericks"
    },
    {
      name: "Sarah Chen",
      role: "Club Organizer",
      avatar: "SC",
      text: "The auto-balance feature ensures every match is competitive. Our group loves it!",
      rating: 5,
      team: "Sydney Strikers"
    },
    {
      name: "Mike Johnson",
      role: "Player",
      avatar: "MJ",
      text: "Love tracking my stats and seeing improvement. The app motivates me to play better!",
      rating: 5,
      team: "London Lions"
    },
    {
      name: "Ahmed Ali",
      role: "Team Manager",
      avatar: "AA",
      text: "RSVP management is a breeze now. I can plan matches knowing exactly who's coming.",
      rating: 5,
      team: "Dubai Dynamos"
    },
    {
      name: "Priya Patel",
      role: "All-rounder",
      avatar: "PP",
      text: "Fair captain rotation means everyone gets a chance to lead. Really appreciate this feature!",
      rating: 5,
      team: "Bangalore Blazers"
    }
  ];

  const stats = [
    { value: "30min", label: "Saved Per Match", icon: Clock },
    { value: "95%", label: "RSVP Rate", icon: UserCheck },
    { value: "2min", label: "To Create Teams", icon: Timer },
    { value: "4.9★", label: "Player Satisfaction", icon: Star }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <GridBackground />
      <FloatingShapes />
      
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav 
          className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Activity className="h-6 w-6 text-primary-foreground" />
                </motion.div>
                <span className="text-2xl font-bold text-foreground">
                  Wicket Love
                </span>
              </div>
              
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary to-chart-1 p-6">
                            <Activity className="h-10 w-10 text-primary-foreground mb-2" />
                            <div className="mb-2 text-lg font-medium text-primary-foreground">
                              Wicket Love
                            </div>
                            <p className="text-sm leading-tight text-primary-foreground/90">
                              Complete cricket management solution for casual groups
                            </p>
                          </div>
                        </li>
                        <li>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium">Team Balance</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              AI-powered team creation for fair matches
                            </p>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium">Live Scoring</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Real-time match updates and statistics
                            </p>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium">Analytics</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Detailed performance tracking
                            </p>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                      About
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary bg-primary/5">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Beta
                </Badge>
                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              style={{ y, opacity }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20"
              >
                <Timer className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Save 30+ minutes every match day
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-foreground">
                  Cricket Made{" "}
                  <WobbleText className="bg-gradient-to-r from-primary via-chart-1 to-primary bg-clip-text text-transparent">
                    Simple
                  </WobbleText>
                </span>
                <br />
                <span className="text-foreground text-4xl md:text-6xl lg:text-7xl">
                  <FlipWords 
                    words={["Quick Teams", "Easy RSVPs", "Fair Play", "More Cricket"]} 
                    className="text-primary font-bold"
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Create balanced teams, get RSVPs, and share everything with your WhatsApp group. 
                <span className="text-primary font-semibold"> All in under 2 minutes.</span>
              </motion.p>

              {/* Stats Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                    className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <stat.icon className="h-8 w-8 text-primary mb-2 mx-auto" />
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  size="lg"
                  className="group px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-primary to-chart-1 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-6 w-6 border-3 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Start Your Next Match
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg rounded-2xl border-2 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </motion.div>
              
              <motion.div 
                className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-chart-3" />
                  Setup in 30 seconds
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  Free forever
                </span>
              </motion.div>
            </motion.div>

            {/* Hero Image/Animation */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative max-w-6xl mx-auto"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-chart-1/10 rounded-3xl shadow-2xl overflow-hidden border border-border/50">
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-center"
                  >
                    <PlayCircle className="h-20 w-20 text-primary mb-4 mx-auto" />
                    <p className="text-foreground font-semibold">See Wicket Love in Action</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 px-4 py-1 bg-chart-3/10 text-chart-3 border border-chart-3/20">
                Why Players Love Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Finally, 
                <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent"> Cricket Without the Hassle</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything that used to take hours now takes minutes
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 px-4 py-1 bg-chart-2/10 text-chart-2 border border-chart-2/20">
                Testimonials
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Loved by 
                <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent"> Cricket Communities</span>
              </h2>
            </motion.div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="max-w-5xl mx-auto"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-1"
                    >
                      <Card className="p-6 h-full bg-card/80 backdrop-blur-sm border-border/50">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-chart-1 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <p className="text-foreground/80 italic">"{testimonial.text}"</p>
                        <p className="text-xs text-muted-foreground/70 mt-4">{testimonial.team}</p>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 px-4 py-1 bg-chart-4/10 text-chart-4 border border-chart-4/20">
                How It Works
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Get Started in 
                <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent"> 3 Simple Steps</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { 
                  step: 1, 
                  title: "Create Your Group", 
                  desc: "Set up your cricket group and invite players via WhatsApp or link", 
                  icon: Users,
                  color: "from-purple-500 to-pink-600"
                },
                { 
                  step: 2, 
                  title: "Schedule Matches", 
                  desc: "Pick a date, venue, and let players RSVP with a single tap", 
                  icon: Calendar,
                  color: "from-chart-3 to-chart-5"
                },
                { 
                  step: 3, 
                  title: "Auto-Balance Teams", 
                  desc: "Our AI creates fair teams and tracks everyone's performance", 
                  icon: Target,
                  color: "from-primary to-chart-1"
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 * index }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="text-8xl font-bold text-muted/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {item.step}
                      </div>
                      <motion.div
                        className={`w-20 h-20 mx-auto bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl relative z-10`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="h-10 w-10 text-primary-foreground" />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Final CTA */}
        <motion.section 
          className="py-20 px-4 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-1" />
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-10">
              <pattern id="pattern2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#pattern2)" />
            </svg>
          </div>
          
          <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Award className="h-16 w-16 text-primary-foreground/90 mx-auto" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
              Your Next Match Starts in <WobbleText>2 Minutes</WobbleText>
            </h2>
            <p className="text-primary-foreground/90 mb-8 text-xl max-w-2xl mx-auto">
              Join 10,000+ players who now spend more time playing and less time organizing
            </p>
            
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              size="lg"
              className="bg-background text-foreground hover:bg-muted px-10 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold border-2 border-background"
            >
              <Zap className="mr-2 h-5 w-5" />
              Create Your First Match
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-primary-foreground/80">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Secure & Private
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Works Everywhere
              </span>
              <span className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Made with Love
              </span>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-card border-t border-border text-muted-foreground py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-1 rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-foreground font-semibold">Wicket Love</span>
                </div>
                <p className="text-sm">The future of cricket management for casual groups.</p>
              </div>
              <div>
                <h4 className="text-foreground font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Demo</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Updates</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-foreground transition">About</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-foreground transition">Twitter</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Facebook</a></li>
                  <li><a href="#" className="hover:text-foreground transition">Instagram</a></li>
                  <li><a href="#" className="hover:text-foreground transition">WhatsApp</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm">
              <p>© 2024 Wicket Love. Made with ❤️ for cricket lovers worldwide.</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
}