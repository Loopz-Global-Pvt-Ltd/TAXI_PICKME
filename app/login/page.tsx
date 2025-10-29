'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setCustomer } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (data) {
        setStep('otp');
        toast({
          title: 'OTP Sent',
          description: `Demo OTP: 123456 sent to ${phone}`,
        });
      } else {
        setStep('register');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify phone number',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp !== '123456') {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the correct OTP',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (data) {
        setCustomer(data);
        toast({
          title: 'Welcome Back!',
          description: `Logged in as ${data.name}`,
        });
        router.push('/booking');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify OTP',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // if (!name || !phone) {
    //   toast({
    //     title: 'Missing Information',
    //     description: 'Please fill in all required fields',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    // setLoading(true);
    // try {
    //   const { data, error } = await supabase
    //     .from('customers')
    //     .insert([{ name, phone, email: email || null }])
    //     .select()
    //     .single();

    //   if (error) throw error;

    //   setCustomer(data);
    //   toast({
    //     title: 'Registration Successful!',
    //     description: 'Welcome to Taxi Pickme',
    //   });
      router.push('/booking');
    // } catch (error) {
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to create account',
    //     variant: 'destructive',
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-500 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-white/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Taxi Pickme</CardTitle>
            <CardDescription>
              {step === 'phone' && 'Enter your phone number to continue'}
              {step === 'otp' && 'Enter the OTP sent to your phone'}
              {step === 'register' && 'Complete your registration'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex mt-2">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +94
                    </span>
                    <Input
                      id="phone"
                      placeholder="77 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                <Button onClick={handleSendOTP} disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Continue'}
                </Button>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-2"
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Demo OTP: <span className="font-semibold">123456</span>
                  </p>
                </div>
                <Button onClick={handleVerifyOTP} disabled={loading} className="w-full">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button variant="outline" onClick={() => setStep('phone')} className="w-full">
                  Change Number
                </Button>
              </div>
            )}

            {step === 'register' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <div className="flex mt-2">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +94
                    </span>
                    <Input value={phone} disabled className="rounded-l-none" />
                  </div>
                </div>
                <Button onClick={handleRegister} disabled={loading} className="w-full">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <Button variant="outline" onClick={() => setStep('phone')} className="w-full">
                  Back
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
