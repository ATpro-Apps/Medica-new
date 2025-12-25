import React from 'react';
import { UserProfile } from '../types';
import { CreditCard, Calendar, Shield, LogOut, XCircle } from 'lucide-react';

interface AccountDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onCancelSubscription: () => void;
  onClose: () => void;
}

export const AccountDashboard: React.FC<AccountDashboardProps> = ({ 
  user, 
  onLogout, 
  onCancelSubscription,
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">Account Management</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XCircle className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{user.name}</h3>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Plan</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                user.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 capitalize">
                {user.plan || 'Free'} Plan
              </span>
            </div>

            {user.status === 'active' && (
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Next billing: <strong>{user.nextBillingDate}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Payment method: •••• 4242</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {user.status === 'active' && (
              <button 
                onClick={onCancelSubscription}
                className="w-full py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm transition-all"
              >
                Cancel Subscription
              </button>
            )}
            
            <button 
              onClick={onLogout}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Secure Member Area
          </p>
        </div>
      </div>
    </div>
  );
};