import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { User, DEMO_CUSTOMER, DEMO_ADMIN } from '../data/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onOpenAdminDirectly?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenAdminDirectly,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Milano (MI)');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const socialUser: User = {
        id: `usr-${provider}-${Date.now()}`,
        name: provider === 'google' ? 'Marco Antonacci (Google)' : 'Marco Antonacci (Apple)',
        email: provider === 'google' ? 'marco.antonacci@gmail.com' : 'marco.antonacci@icloud.com',
        avatar: provider === 'google'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: 'customer',
        provider,
        address: {
          street: 'Via Tortona 24',
          city: 'Milano (MI)',
          postalCode: '20144',
          phone: '+39 340 123 4567',
        },
      };
      onLoginSuccess(socialUser);
      onClose();
    }, 350);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const customUser: User = {
        id: `usr-email-${Date.now()}`,
        name: name || (email.split('@')[0] || 'Cliente'),
        email: email || 'cliente@pugliainscatola.it',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'customer',
        provider: 'email',
        address: {
          street: 'Via Principale 10',
          city: city || 'Milano (MI)',
          postalCode: '20100',
          phone: '+39 340 000 0000',
        },
      };
      onLoginSuccess(customUser);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-[#faf8f5] rounded-2xl shadow-xl border border-[#e7e2d8] overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e7e2d8] flex items-center justify-between bg-white">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
              Area Riservata
            </div>
            <h3 className="font-serif text-xl font-normal text-stone-900">
              Accedi al Profilo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#e7e2d8] bg-white text-xs">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
              tab === 'signin'
                ? 'text-black border-b border-black font-medium'
                : 'text-stone-400 hover:text-stone-700 font-light'
            }`}
          >
            Accedi
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
              tab === 'signup'
                ? 'text-black border-b border-black font-medium'
                : 'text-stone-400 hover:text-stone-700 font-light'
            }`}
          >
            Nuovo Account
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Social Logins */}
          <div className="space-y-2">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continua con Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-black hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.05-7.74-7.89-12.14-14.53-7.5-11.33-13.04-24.34-16.63-39.02-3.59-14.67-5.38-28.52-5.38-41.53 0-16.71 4.17-30.82 12.51-42.33 8.34-11.52 18.9-17.38 31.67-17.58 5.03 0 10.87 1.34 17.52 4.02 6.64 2.68 10.88 4.07 12.72 4.18 1.54 0 5.92-1.45 13.14-4.35 7.22-2.9 13.06-4.13 17.52-3.69 13.43 1.05 24.31 6.32 32.63 15.82-11.75 7.15-17.47 16.94-17.16 29.37.31 10.66 4.3 19.46 11.97 26.4 7.67 6.94 16.92 10.97 27.75 12.09-2.35 7.37-5.24 14.73-8.68 22.09zM119.22 33.15c0-7.38 2.66-14.4 7.98-21.05 5.32-6.65 11.98-10.98 19.98-13 1.02 7.82-1.12 15.22-6.42 22.21-5.3 6.99-12.48 11.19-21.54 12.6-.08-.26-.0-.52-.0-.76z"/>
              </svg>
              <span>Continua con Apple</span>
            </button>
          </div>

          <div className="relative text-center my-3">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 bg-[#faf8f5] px-2 font-medium">
              oppure email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
            {tab === 'signup' && (
              <div>
                <label className="block text-stone-600 mb-1 font-light">Nome e Cognome</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                />
              </div>
            )}

            <div>
              <label className="block text-stone-600 mb-1 font-light">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@dominio.it"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-light">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1a1816] hover:bg-[#332f2b] text-white rounded-full font-medium transition-colors cursor-pointer mt-1"
            >
              {tab === 'signin' ? 'Accedi' : 'Crea Account'}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
            <button
              type="button"
              onClick={() => {
                onLoginSuccess(DEMO_CUSTOMER);
                onClose();
              }}
              className="hover:text-black underline cursor-pointer"
            >
              Demo Cliente
            </button>

            <button
              type="button"
              onClick={() => {
                onLoginSuccess(DEMO_ADMIN);
                onClose();
                if (onOpenAdminDirectly) onOpenAdminDirectly();
              }}
              className="hover:text-black underline cursor-pointer"
            >
              Accesso Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
