// src/components/login/TwoFactorLoginModal.jsx
import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import OtpCodeInput from '../common/OtpCodeInput';

const CODE_LENGTH = 6;
const emptyDigits = () => Array(CODE_LENGTH).fill('');

const TwoFactorLoginModal = ({ pendingToken, allowedRoles = null, verify, onVerified, onCancel }) => {
  const { completeTwoFactorLogin } = useAuth();
  // `verify` lets a caller point this at a different completion call (e.g.
  // AdminLogin passes adminCompleteTwoFactorLogin, which goes through the
  // separate admin-only service/axios instance instead of the shared one).
  // Defaults to the shared customer/vendor completion used everywhere else.
  const verifyFn = verify || completeTwoFactorLogin;
  const [digits, setDigits] = useState(emptyDigits);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!pendingToken) return null;

  const submitCode = async (code) => {
    if (busy) return;
    setBusy(true);
    setError('');
    const res = await verifyFn(pendingToken, code, allowedRoles);
    setBusy(false);
    if (!res?.success) {
      setError(res?.error?.message || 'Invalid authentication code');
      if (!recoveryMode) setDigits(emptyDigits());
      return;
    }
    onVerified();
  };

  const switchMode = () => {
    setRecoveryMode((prev) => !prev);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recoveryMode) {
      const code = recoveryCode.trim();
      if (!code) {
        setError('Enter one of your recovery codes');
        return;
      }
      submitCode(code);
      return;
    }
    if (digits.some((d) => !d)) {
      setError('Enter all 6 digits');
      return;
    }
    submitCode(digits.join(''));
  };

  const submitDisabled = busy || (recoveryMode ? !recoveryCode.trim() : digits.some((d) => !d));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade p-4">
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-6 py-5 flex items-center justify-between">
          <h2 className="text-white text-lg font-bold flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            Two-Factor Verification
          </h2>
          <button type="button" onClick={onCancel} className="text-white/80 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 bg-gray-50">
          {recoveryMode ? (
            <>
              <p className="text-sm text-gray-700">Enter one of the recovery codes you saved when you turned on two-factor authentication.</p>
              <input
                type="text"
                autoFocus
                autoComplete="off"
                maxLength={9}
                value={recoveryCode}
                onChange={(e) => {
                  setRecoveryCode(e.target.value);
                  setError('');
                }}
                placeholder="XXXX-XXXX"
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 tracking-widest text-center uppercase"
              />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-700">Enter the 6-digit code from your authenticator app.</p>
              <OtpCodeInput
                digits={digits}
                disabled={busy}
                onChange={(next) => {
                  setDigits(next);
                  setError('');
                }}
                onComplete={submitCode}
              />
            </>
          )}

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full py-3 rounded-2xl text-white text-sm font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] shadow-lg disabled:opacity-60"
          >
            {busy ? 'Verifying...' : 'Verify and sign in'}
          </button>

          <div className="text-center">
            <button type="button" onClick={switchMode} className="text-xs font-semibold text-[#00695C] hover:underline">
              {recoveryMode ? 'Use an authenticator code instead' : 'Use a recovery code instead'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TwoFactorLoginModal;
