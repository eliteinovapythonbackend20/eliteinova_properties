// src/components/login/ForgotPasswordModal.jsx
// Three steps: email -> OTP (emailed code, 30s resend cooldown) -> new password.
// Reuses OtpCodeInput (the same 6-box widget TwoFactorLoginModal uses) and the
// same show/hide password pattern as CustomerLogin.
import React, { useEffect, useRef, useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { requestPasswordReset, verifyResetOtp, resetPassword } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import OtpCodeInput from '../common/OtpCodeInput';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
const AUTO_CLOSE_SECONDS = 5;
const emptyDigits = () => Array(CODE_LENGTH).fill('');

const errorMessage = (err, fallback) =>
  err?.detail || err?.message || (typeof err === 'string' ? err : fallback);

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('email'); // email -> otp -> reset -> done
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(emptyDigits);
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [closeCountdown, setCloseCountdown] = useState(AUTO_CLOSE_SECONDS);
  const { toast, showToast } = useToast();
  const timerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const resetLocalState = () => {
    setStep('email');
    setEmail('');
    setDigits(emptyDigits());
    setResetToken(null);
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setBusy(false);
    setError('');
    setSecondsLeft(0);
    setCloseCountdown(AUTO_CLOSE_SECONDS);
  };

  const handleClose = () => {
    resetLocalState();
    onClose();
  };

  // Countdown for the resend-OTP cooldown. The server enforces the real
  // cooldown independently (see AuthService.request_password_reset_otp) -
  // this is just the matching UI timer.
  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [secondsLeft > 0]);

  // Once the password is actually reset, the modal closes itself - nothing
  // left for the user to do here but go sign in with the new password.
  useEffect(() => {
    if (step !== 'done') {
      clearInterval(closeTimerRef.current);
      return;
    }
    setCloseCountdown(AUTO_CLOSE_SECONDS);
    closeTimerRef.current = setInterval(() => {
      setCloseCountdown((s) => {
        if (s <= 1) {
          clearInterval(closeTimerRef.current);
          handleClose();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(closeTimerRef.current);
  }, [step]);

  useEffect(() => {
    if (isOpen) resetLocalState();
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  if (!isOpen) return null;

  const sendCode = async (isResend) => {
    if (busy || secondsLeft > 0) return;
    setBusy(true);
    setError('');
    try {
      await requestPasswordReset(email);
      setSecondsLeft(RESEND_SECONDS);
      if (isResend) {
        setDigits(emptyDigits());
        showToast('A new code has been sent.', 'success');
      } else {
        setStep('otp');
      }
    } catch (err) {
      const message = errorMessage(err, 'Could not send the code. Please try again.');
      setError(message);
      showToast(message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    sendCode(false);
  };

  const submitOtp = async (code) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await verifyResetOtp(email, code);
      setResetToken(res.resetToken || res.data?.resetToken);
      setStep('reset');
    } catch (err) {
      const message = errorMessage(err, 'Invalid code. Please try again.');
      setError(message);
      showToast(message, 'error');
      setDigits(emptyDigits());
    } finally {
      setBusy(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError('Password must contain an uppercase letter, a lowercase letter, and a number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      await resetPassword({ token: resetToken, new_password: newPassword });
      setStep('done');
    } catch (err) {
      const message = errorMessage(err, 'Could not reset your password. Please try again.');
      setError(message);
      showToast(message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-dropdown">
        <div className="relative bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C] px-6 py-6">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group z-20"
          >
            <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Reset Password</h2>
              <p className="text-white/80 text-sm">
                {step === 'email' && 'Enter your email to get a verification code'}
                {step === 'otp' && 'Enter the code we emailed you'}
                {step === 'reset' && 'Choose a new password'}
                {step === 'done' && 'All set'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoFocus
                    className="w-full pl-10 pr-3 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-semibold rounded-xl hover:from-[#004D40] hover:to-[#00695C] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
              >
                {busy ? 'Sending...' : (<>Send Code <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                We sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span>
              </p>
              <OtpCodeInput digits={digits} disabled={busy} onChange={setDigits} onComplete={submitOtp} />
              <div className="text-center">
                {secondsLeft > 0 ? (
                  <span className="text-xs text-gray-400">Resend code in {secondsLeft}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => sendCode(true)}
                    disabled={busy}
                    className="text-xs font-semibold text-[#00695C] hover:underline disabled:opacity-60"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoFocus
                    className="w-full pl-10 pr-12 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#26A69A] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#26A69A]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-12 py-3 bg-[#E8F5E9]/30 border-2 border-[#26A69A]/20 rounded-xl focus:outline-none focus:border-[#26A69A] focus:ring-2 focus:ring-[#26A69A]/20 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#26A69A] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-semibold rounded-xl hover:from-[#004D40] hover:to-[#00695C] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
              >
                {busy ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="text-center space-y-4 py-2">
              <CheckCircle2 className="w-12 h-12 text-[#00695C] mx-auto" />
              <p className="text-sm text-gray-700">
                Your password has been reset. You can now sign in with your new password.
              </p>
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-semibold rounded-xl hover:from-[#004D40] hover:to-[#00695C] transition-all duration-300 shadow-lg"
              >
                Back to Login
              </button>
              <p className="text-xs text-gray-400">Closing automatically in {closeCountdown}s...</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-6px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-dropdown { animation: dropdown 0.2s ease-out forwards; }
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade { animation: fade 0.25s ease-out forwards; }
      `}</style>
      <Toast toast={toast} />
    </div>
  );
};

export default ForgotPasswordModal;
