import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Phone, MapPin, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, getRegisteredUsers, saveRegisteredUser } from '../data/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onOpenAdminLogin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenAdminLogin,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPostalCode, setRegPostalCode] = useState('');

  // Custom Social Prompt State (when clicking Google or Apple)
  const [socialPromptProvider, setSocialPromptProvider] = useState<'google' | 'apple' | null>(null);
  const [socialPromptEmail, setSocialPromptEmail] = useState('');
  const [socialPromptName, setSocialPromptName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Open prompt for custom Google/Apple credentials
  const initiateSocialLogin = (provider: 'google' | 'apple') => {
    setError(null);
    setSocialPromptProvider(provider);
    setSocialPromptEmail('');
    setSocialPromptName('');
  };

  const handleConfirmSocialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialPromptProvider) return;
    if (!socialPromptEmail.trim()) {
      setError('Inserisci il tuo indirizzo email.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanEmail = socialPromptEmail.trim().toLowerCase();
      const cleanName = socialPromptName.trim() || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : 'Utente');

      // Check if user already registered before to preserve address
      const existing = getRegisteredUsers().find(u => u.email.toLowerCase() === cleanEmail);

      const avatar =
        socialPromptProvider === 'google'
          ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=4285f4&textColor=ffffff`
          : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=000000&textColor=ffffff`;

      const socialUser: User = {
        id: existing?.id || `usr-${socialPromptProvider}-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar: existing?.avatar || avatar,
        role: 'customer',
        provider: socialPromptProvider,
        address: existing?.address || {
          street: '',
          city: '',
          postalCode: '',
          phone: '',
        },
      };

      saveRegisteredUser(socialUser);
      onLoginSuccess(socialUser);
      setSocialPromptProvider(null);
      onClose();
    }, 250);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const cleanEmail = loginEmail.trim().toLowerCase();
      const cleanPass = loginPassword.trim();

      const registered = getRegisteredUsers();
      const found = registered.find((u) => u.email.toLowerCase() === cleanEmail);

      if (found) {
        if (found.passwordHash && found.passwordHash !== cleanPass) {
          setError('Password non corretta. Verifica le credenziali inserite.');
          return;
        }
        onLoginSuccess(found);
        onClose();
      } else {
        // If not explicitly found in registered list, create an active session for the customer
        const newUser: User = {
          id: `usr-mail-${Date.now()}`,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}&backgroundColor=1c1a17&textColor=ffffff`,
          role: 'customer',
          provider: 'email',
          address: {
            street: '',
            city: '',
            postalCode: '',
            phone: '',
          },
        };
        saveRegisteredUser({ ...newUser, passwordHash: cleanPass });
        onLoginSuccess(newUser);
        onClose();
      }
    }, 300);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword.length < 4) {
      setError('La password deve contenere almeno 4 caratteri.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const cleanEmail = regEmail.trim().toLowerCase();
      const cleanName = regName.trim();

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=1c1a17&textColor=ffffff`,
        role: 'customer',
        provider: 'email',
        address: {
          street: regStreet.trim(),
          city: regCity.trim(),
          postalCode: regPostalCode.trim(),
          phone: regPhone.trim(),
        },
      };

      saveRegisteredUser({
        ...newUser,
        passwordHash: regPassword.trim(),
      });

      onLoginSuccess(newUser);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-[#faf8f5] rounded-2xl shadow-2xl border border-[#e7e2d8] overflow-hidden my-6 animate-in fade-in zoom-in-98 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e7e2d8] flex items-center justify-between bg-white">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
              Area Clienti
            </div>
            <h3 className="font-serif text-xl font-normal text-stone-900">
              {socialPromptProvider
                ? `Accedi con ${socialPromptProvider === 'google' ? 'Google' : 'Apple'}`
                : tab === 'signin'
                ? 'Accedi al tuo Profilo'
                : 'Registrazione Nuovo Utente'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Chiudi finestra"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Tab switch (only if not in social prompt) */}
        {!socialPromptProvider && (
          <div className="flex border-b border-[#e7e2d8] bg-white text-xs">
            <button
              onClick={() => {
                setTab('signin');
                setError(null);
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                tab === 'signin'
                  ? 'text-black border-b-2 border-black font-semibold'
                  : 'text-stone-400 hover:text-stone-700 font-light'
              }`}
            >
              Accedi
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setError(null);
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                tab === 'signup'
                  ? 'text-black border-b-2 border-black font-semibold'
                  : 'text-stone-400 hover:text-stone-700 font-light'
              }`}
            >
              Nuova Registrazione
            </button>
          </div>
        )}

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {socialPromptProvider ? (
            /* Dedicated interactive Google / Apple connection form with the USER'S OWN identity */
            <div className="space-y-4">
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-2 font-medium text-stone-900">
                  {socialPromptProvider === 'google' ? (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  ) : (
                    <span className="w-4 h-4 shrink-0 font-bold"></span>
                  )}
                  <span>Accesso con il tuo account {socialPromptProvider === 'google' ? 'Google' : 'Apple'}</span>
                </div>
                <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                  Inserisci la tua email {socialPromptProvider === 'google' ? 'Google (Gmail o Google Workspace)' : 'Apple'} e il tuo nome per accedere con la tua reale identità, senza utenti fittizi preimpostati.
                </p>
              </div>

              <form onSubmit={handleConfirmSocialLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">
                    Il tuo Nome e Cognome *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      autoFocus
                      value={socialPromptName}
                      onChange={(e) => setSocialPromptName(e.target.value)}
                      placeholder="Es. Mario Rossi"
                      className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">
                    Il tuo indirizzo {socialPromptProvider === 'google' ? 'Google / Gmail' : 'Apple ID'} *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={socialPromptEmail}
                      onChange={(e) => setSocialPromptEmail(e.target.value)}
                      placeholder={socialPromptProvider === 'google' ? 'nome.cognome@gmail.com' : 'nome@icloud.com'}
                      className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSocialPromptProvider(null);
                      setError(null);
                    }}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 py-2.5 bg-[#1a1816] hover:bg-[#332f2b] text-white rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    {loading ? 'Accesso in corso...' : `Accedi con ${socialPromptProvider === 'google' ? 'Google' : 'Apple'}`}
                  </button>
                </div>
              </form>
            </div>
          ) : tab === 'signin' ? (
            /* Sign In Tab */
            <div className="space-y-4">
              {/* Social Logins */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => initiateSocialLogin('google')}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-99 shadow-2xs"
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
                  <span>Accedi con il tuo account Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => initiateSocialLogin('apple')}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-black hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-99 shadow-2xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.05-7.74-7.89-12.14-14.53-7.5-11.33-13.04-24.34-16.63-39.02-3.59-14.67-5.38-28.52-5.38-41.53 0-16.71 4.17-30.82 12.51-42.33 8.34-11.52 18.9-17.38 31.67-17.58 5.03 0 10.87 1.34 17.52 4.02 6.64 2.68 10.88 4.07 12.72 4.18 1.54 0 5.92-1.45 13.14-4.35 7.22-2.9 13.06-4.13 17.52-3.69 13.43 1.05 24.31 6.32 32.63 15.82-11.75 7.15-17.47 16.94-17.16 29.37.31 10.66 4.3 19.46 11.97 26.4 7.67 6.94 16.92 10.97 27.75 12.09-2.35 7.37-5.24 14.73-8.68 22.09zM119.22 33.15c0-7.38 2.66-14.4 7.98-21.05 5.32-6.65 11.98-10.98 19.98-13 1.02 7.82-1.12 15.22-6.42 22.21-5.3 6.99-12.48 11.19-21.54 12.6-.08-.26-.0-.52-.0-.76z" />
                  </svg>
                  <span>Accedi con il tuo account Apple</span>
                </button>
              </div>

              <div className="relative text-center my-3">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 bg-[#faf8f5] px-2 font-medium">
                  oppure con email e password
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="tua.email@esempio.it"
                      className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#1a1816] hover:bg-[#332f2b] text-white rounded-lg font-medium transition-colors cursor-pointer mt-2"
                >
                  {loading ? 'Accesso in corso...' : 'Accedi al Profilo'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="text-stone-600 hover:text-black text-xs underline cursor-pointer"
                >
                  Non hai ancora un account? Registrati qui
                </button>
              </div>
            </div>
          ) : (
            /* Sign Up Tab */
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Nome e Cognome *</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Mario Rossi"
                    className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Email *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="mario.rossi@email.it"
                      className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Password *</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 4 caratteri"
                      className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address fields */}
              <div className="pt-2 border-t border-stone-200/80">
                <div className="text-[11px] font-medium text-stone-800 flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3 h-3 text-stone-500" />
                  <span>Indirizzo di Spedizione Preferito</span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-stone-500 mb-1">Via e Numero Civico *</label>
                    <input
                      type="text"
                      required
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      placeholder="Es. Via Roma 15"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-500 mb-1">Città e Provincia *</label>
                      <input
                        type="text"
                        required
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        placeholder="Es. Milano (MI)"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 mb-1">CAP *</label>
                      <input
                        type="text"
                        required
                        value={regPostalCode}
                        onChange={(e) => setRegPostalCode(e.target.value)}
                        placeholder="Es. 20121"
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-500 mb-1">Telefono (per il corriere) *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+39 340 123 4567"
                        className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg bg-white font-light focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#1a1816] hover:bg-[#332f2b] text-white rounded-lg font-medium transition-colors cursor-pointer mt-3"
              >
                {loading ? 'Creazione account in corso...' : 'Registrati e Accedi'}
              </button>
            </form>
          )}

          {/* Admin link at bottom */}
          {!socialPromptProvider && onOpenAdminLogin && (
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
              <span>Sei un gestore dello shop?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="font-medium text-stone-800 hover:text-black flex items-center gap-1 underline cursor-pointer"
              >
                <Shield className="w-3 h-3 text-stone-600" />
                <span>Accesso Admin (admin/admin)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
