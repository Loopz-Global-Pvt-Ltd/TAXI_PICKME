"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Currency = 'USD' | 'EUR' | 'LKR'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (priceInUSD: number) => string
  rates: Record<string, number>
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD')
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1, EUR: 0.9, LKR: 300 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load persisted currency
    const stored = localStorage.getItem('selected_currency') as Currency
    if (stored && ['USD', 'EUR', 'LKR'].includes(stored)) {
      setCurrencyState(stored)
    }

    // Fetch live rates
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/currency/rates')
        const data = await res.json()
        if (data.success && data.data) {
          setRates(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch currency rates', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRates()
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('selected_currency', newCurrency)
  }

  const formatPrice = (priceInUSD: number) => {
    const rate = rates[currency] || 1
    const converted = priceInUSD * rate

    return new Intl.NumberFormat(currency === 'LKR' ? 'en-LK' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'LKR' ? 0 : 2,
      maximumFractionDigits: currency === 'LKR' ? 0 : 2
    }).format(converted)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
