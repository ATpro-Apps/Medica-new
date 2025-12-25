import React, { useState } from 'react';
import { Check, Star, Zap, Shield, Loader2, Crown } from 'lucide-react';

interface PricingSectionProps {
  onSubscribe: (plan: 'monthly' | 'yearly') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSubscribe }) => {
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    setProcessingPlan(plan);
    // Simulate payment processing delay
    setTimeout(() => {
      setProcessingPlan(null);
      onSubscribe(plan);
    }, 1500);
  };

  const features = [
    "Unlimited AI Assessments",
    "Deep Cognitive Analysis",
    "Export Questions to PDF",
    "Priority Processing Speed",
    "24/7 Expert Support"
  ];

  return (
    <div className="space-y-12 animate-slide-up pb-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-wider mb-2">
          <Crown className="w-4 h-4" />
          Premium Access
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Invest in Your <span className="text-indigo-600">Medical Mastery</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Unlock the full potential of Medica AI. Choose the plan that fits your study schedule.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan */}
        <div className="relative bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-indigo-200 transition-all group">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wide">Monthly</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">200</span>
                <span className="text-xl font-bold text-slate-500">EGP</span>
                <span className="text-slate-400 font-medium">/month</span>
              </div>
              <p className="text-sm text-slate-500 mt-2 font-medium">Flexible learning for short-term goals.</p>
            </div>

            <ul className="space-y-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="p-1 rounded-full bg-indigo-50 text-indigo-600">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe('monthly')}
              disabled={!!processingPlan}
              className="w-full py-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-200"
            >
              {processingPlan === 'monthly' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Started Monthly"
              )}
            </button>
          </div>
        </div>

        {/* Yearly Plan */}
        <div className="relative bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 border border-slate-800 transform md:-translate-y-4">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wide">
              <Star className="w-3 h-3 fill-white" />
              Best Value
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-indigo-200 uppercase tracking-wide">Yearly</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white">1,800</span>
                <span className="text-xl font-bold text-slate-400">EGP</span>
                <span className="text-slate-500 font-medium">/year</span>
              </div>
              <p className="text-sm text-indigo-200 mt-2 font-medium bg-indigo-900/50 inline-block px-3 py-1 rounded-lg">
                Save 25% compared to monthly
              </p>
            </div>

            <div className="h-px bg-slate-800" />

            <ul className="space-y-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="p-1 rounded-full bg-indigo-500 text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  {feature}
                </li>
              ))}
              <li className="flex items-center gap-3 text-white font-bold">
                <div className="p-1 rounded-full bg-yellow-500 text-white">
                  <Zap className="w-3 h-3 stroke-[3] fill-white" />
                </div>
                Early Access to New Models
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe('yearly')}
              disabled={!!processingPlan}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
               {processingPlan === 'yearly' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                "Subscribe Yearly & Save"
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
              <Shield className="w-3 h-3" />
              Secure Payment via Stripe Encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};