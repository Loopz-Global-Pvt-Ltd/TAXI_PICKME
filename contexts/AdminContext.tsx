"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminUser {
  id: number
  username: string
  email: string
  fullName: string
}

interface AdminContextType {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  verifyAuth: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify')
      const data = await response.json()

      if (data.success) {
        setUser(data.data.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth verification failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Login failed')
    }

    setUser(data.data.user)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    setUser(null)
    setIsAuthenticated(false)
  }

  useEffect(() => {
    verifyAuth()
  }, [])

  return (
    <AdminContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, verifyAuth }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
