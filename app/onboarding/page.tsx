'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUserProfile, getCurrentUser } from '@/lib/utils/auth';
import { useStore } from '@/lib/store';
import { UserRole, BattingStyle, BowlingStyle, PreferredPosition } from '@/types';

const steps = [
  { id: 1, title: 'Profile Photo' },
  { id: 2, title: 'Playing Role' },
  { id: 3, title: 'Batting Style' },
  { id: 4, title: 'Bowling Style' },
  { id: 5, title: 'Position Preference' },
];

export default function Onboarding() {
  const router = useRouter();
  const { user } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    photoURL: user?.photoURL || '',
    role: 'batsman' as UserRole,
    battingStyle: 'right' as BattingStyle,
    bowlingStyle: 'none' as BowlingStyle,
    preferredPosition: 'middle' as PreferredPosition,
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        await updateUserProfile(currentUser.uid, formData);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage src={formData.photoURL} />
                <AvatarFallback>
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">
                Add a profile photo to help your teammates recognize you
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label>What's your primary playing role?</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="batsman" id="batsman" />
                  <Label htmlFor="batsman" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Batsman</p>
                      <p className="text-sm text-muted-foreground">I focus on scoring runs</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="bowler" id="bowler" />
                  <Label htmlFor="bowler" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Bowler</p>
                      <p className="text-sm text-muted-foreground">I focus on taking wickets</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="all-rounder" id="all-rounder" />
                  <Label htmlFor="all-rounder" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">All-rounder</p>
                      <p className="text-sm text-muted-foreground">I can bat and bowl equally well</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="wicket-keeper" id="wicket-keeper" />
                  <Label htmlFor="wicket-keeper" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Wicket-keeper</p>
                      <p className="text-sm text-muted-foreground">I keep wickets and bat</p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label>Batting Style</Label>
            <RadioGroup
              value={formData.battingStyle}
              onValueChange={(value) => setFormData({ ...formData, battingStyle: value as BattingStyle })}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="right" id="right" />
                  <Label htmlFor="right" className="flex-1 cursor-pointer">
                    Right-handed
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="left" id="left" />
                  <Label htmlFor="left" className="flex-1 cursor-pointer">
                    Left-handed
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Label>Bowling Style</Label>
            <Select
              value={formData.bowlingStyle}
              onValueChange={(value) => setFormData({ ...formData, bowlingStyle: value as BowlingStyle })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bowling style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast">Fast</SelectItem>
                <SelectItem value="medium">Medium pace</SelectItem>
                <SelectItem value="spin">Spin</SelectItem>
                <SelectItem value="none">I don't bowl</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Label>Preferred Batting Position</Label>
            <RadioGroup
              value={formData.preferredPosition}
              onValueChange={(value) => setFormData({ ...formData, preferredPosition: value as PreferredPosition })}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="opening" id="opening" />
                  <Label htmlFor="opening" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Opening</p>
                      <p className="text-sm text-muted-foreground">I like to face the new ball</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="middle" id="middle" />
                  <Label htmlFor="middle" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Middle Order</p>
                      <p className="text-sm text-muted-foreground">I stabilize and build innings</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value="lower" id="lower" />
                  <Label htmlFor="lower" className="flex-1 cursor-pointer">
                    <div>
                      <p className="font-medium">Lower Order</p>
                      <p className="text-sm text-muted-foreground">I can hit big shots at the end</p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                      step.id <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="min-h-[200px]"
            >
              {renderStep()}
            </motion.div>

            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={loading}
              >
                Skip for now
              </Button>
              <Button
                onClick={handleNext}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {currentStep === steps.length ? 'Complete' : 'Next'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}