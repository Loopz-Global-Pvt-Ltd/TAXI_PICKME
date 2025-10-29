'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, Save } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { customer, isAuthenticated, setCustomer } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (customer) {
      setName(customer.name);
      setEmail(customer.email || '');
    }
  }, [isAuthenticated, customer]);

  const handleUpdateProfile = async () => {
    if (!customer) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({ name, email: email || null })
        .eq('id', customer.id)
        .select()
        .single();

      if (error) throw error;

      setCustomer(data);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !customer) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground mb-8">Manage your account information</p>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="flex gap-2 mt-2">
                  <User className="h-10 w-10 text-muted-foreground flex items-center justify-center" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2 mt-2">
                  <Phone className="h-10 w-10 text-muted-foreground flex items-center justify-center" />
                  <Input
                    id="phone"
                    value={customer.phone}
                    disabled
                    className="flex-1 bg-slate-100"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Phone number cannot be changed
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2 mt-2">
                  <Mail className="h-10 w-10 text-muted-foreground flex items-center justify-center" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleUpdateProfile} disabled={loading} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
