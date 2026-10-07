import React, { useState } from 'react';
import { X, Shield, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../data/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      if (cleanUser === ADMIN_CREDENTIALS.username && cleanPass === ADMIN_CREDENTIALS.password) {
        onSuccess();
        onClose();
        setUsername('');
        setPassword('');
      } else {
        setError('Credenziali non valide. Usa nome utente "admin" e password "admin".');
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-[#faf8f5] rounded-2xl shadow-2xl border border-[#e7e2d8] overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e7e2d8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-200 flex items-center justify-center">
              <Shield className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
                Pannello Gestionale
              </div>
              <h3 className="font-serif text-lg font-normal text-stone-900">
                Accesso Admin
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-[#f2eee7] border border-[#e2dcce] rounded-xl p-3 text-xs text-stone-700 space-y-1">
            <div className="font-medium text-stone-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              Credenziali di accesso richieste:
            </div>
            <div className="font-mono text-[11px] text-stone-800 bg-white/70 px-2 py-1 rounded border border-stone-200/60">
              Nome utente: <span className="font-bold text-black">admin</span>
              <br />
              Password: <span className="font-bold text-black">admin</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">
                Nome Utente
              </label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg bg-white font-mono text-stone-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg bg-white font-mono text-stone-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1a1816] hover:bg-[#332f2b] text-white rounded-lg font-medium transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verifica credenziali...</span>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Accedi come Amministratore</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
