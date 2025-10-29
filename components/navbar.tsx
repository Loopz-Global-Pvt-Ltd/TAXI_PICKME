'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const { customer, isAuthenticated, logout } = useAuthStore();
  const isAdmin = pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (isAdmin) {
    return (
      <nav className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Taxi Pickme Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                Customer Portal
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">Taxi Pickme</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            href="/booking"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith('/booking') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Book Now
          </Link>
          <Link
            href="/#routes"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Popular Routes
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {customer?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookings">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
