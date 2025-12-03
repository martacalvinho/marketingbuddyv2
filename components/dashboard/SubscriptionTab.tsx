"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { 
  CheckCircle2, 
  CreditCard, 
  Loader2,
  ExternalLink,
  AlertCircle,
  Sparkles
} from "lucide-react"

interface SubscriptionTabProps {
  user: any
}

interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_end: string | null
  created_at: string
}

const PLANS = {
  free: {
    name: 'Free Trial',
    price: '$0',
    period: '14 days',
    features: [
      'AI Content Generation (5/day)',
      'Basic Strategy',
      'Task Management',
    ],
    limitations: [
      'Limited AI generations',
      'No priority support',
    ]
  },
  pro: {
    name: 'Pro',
    price: '$9',
    period: '/month',
    features: [
      'Unlimited AI Content Generation',
      'Advanced Strategy & Analytics',
      'Priority Support',
      'Custom Integrations',
      'Weekly Strategy Updates',
    ],
    limitations: []
  }
}

export default function SubscriptionTab({ user }: SubscriptionTabProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadSubscription()
  }, [user.id])

  const loadSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading subscription:', error)
      }
      
      setSubscription(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setIsProcessing(true)
    try {
      // Call API to create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          email: user.email,
          plan: 'pro'
        })
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      toast.error('Failed to start checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManageSubscription = async () => {
    setIsProcessing(true)
    try {
      // Call API to create Stripe customer portal session
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to open billing portal')
      }
    } catch (error) {
      console.error('Error opening portal:', error)
      toast.error('Failed to open billing portal. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
      </div>
    )
  }

  const currentPlan = subscription?.plan || 'free'
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'
  const isPro = currentPlan === 'pro' && isActive

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">Subscription Plan</h3>

      {/* Current Plan Card */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold text-white">
              {isPro ? PLANS.pro.name : PLANS.free.name}
            </h4>
            <p className="text-zinc-400 text-sm">
              {isPro ? `${PLANS.pro.price}${PLANS.pro.period}` : PLANS.free.period}
            </p>
          </div>
          <Badge className={`px-3 py-1 ${
            isActive 
              ? 'bg-lime-500/20 text-lime-400 border-lime-500/30' 
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {subscription?.status === 'trialing' ? 'Trial' : 
             subscription?.status === 'active' ? 'Active' :
             subscription?.status === 'past_due' ? 'Past Due' :
             subscription?.status === 'canceled' ? 'Canceled' : 'Free'}
          </Badge>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {(isPro ? PLANS.pro.features : PLANS.free.features).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-lime-500" />
              <span>{feature}</span>
            </div>
          ))}
          {!isPro && PLANS.free.limitations.map((limitation, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-500">
              <AlertCircle className="h-4 w-4 text-zinc-600" />
              <span>{limitation}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {isPro ? (
          <Button 
            onClick={handleManageSubscription}
            disabled={isProcessing}
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700 font-bold"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4 mr-2" />
            )}
            Manage Subscription
          </Button>
        ) : (
          <Button 
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full bg-lime-400 text-black hover:bg-lime-500 font-bold"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Upgrade to Pro - $9/month
          </Button>
        )}

        {/* Billing Info */}
        {subscription?.current_period_end && isActive && (
          <p className="text-xs text-zinc-500 text-center mt-3">
            {subscription.status === 'trialing' ? 'Trial ends' : 'Next billing date'}: {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Pro Plan Comparison (only show if on free) */}
      {!isPro && (
        <div className="p-6 bg-gradient-to-br from-lime-500/10 to-emerald-500/10 border border-lime-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-lime-400" />
            <h4 className="text-lg font-bold text-white">Unlock Pro Features</h4>
          </div>
          <ul className="space-y-2 mb-4">
            {PLANS.pro.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-lime-200">
                <CheckCircle2 className="h-4 w-4 text-lime-400" />
                {feature}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-400">
            Cancel anytime. No questions asked.
          </p>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-zinc-500 text-center">
        Questions about billing? Email us at{' '}
        <a href="mailto:support@marketingbuddy.ai" className="text-lime-400 hover:underline">
          support@marketingbuddy.ai
        </a>
      </p>
    </div>
  )
}
