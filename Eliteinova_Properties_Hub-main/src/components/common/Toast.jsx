// src/components/common/Toast.jsx
// Presentational piece of the useToast hook. Position/theme are lifted from
// the profile pages' toast (top-right, teal gradient card) so every toast in
// the app shares one look; the icon-per-type + message content is unchanged.
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const THEMES = {
  success: {
    icon: FiCheckCircle,
    title: 'Success!',
    iconBox: 'from-[#00695C] to-[#26A69A]',
    card: 'from-[#00695C]/10 to-[#26A69A]/10 border-[#00695C]/30',
    text: 'text-[#00695C]',
    subtext: 'text-[#00695C]/80',
    close: 'text-[#00695C] hover:text-[#004D40]',
  },
  error: {
    icon: FiXCircle,
    title: 'Error!',
    iconBox: 'from-red-600 to-red-400',
    card: 'from-red-500/10 to-red-400/10 border-red-500/30',
    text: 'text-red-600',
    subtext: 'text-red-600/80',
    close: 'text-red-600 hover:text-red-800',
  },
  warning: {
    icon: FiAlertTriangle,
    title: 'Warning!',
    iconBox: 'from-amber-600 to-amber-400',
    card: 'from-amber-500/10 to-amber-400/10 border-amber-500/30',
    text: 'text-amber-600',
    subtext: 'text-amber-600/80',
    close: 'text-amber-600 hover:text-amber-800',
  },
  info: {
    icon: FiInfo,
    title: 'Info',
    iconBox: 'from-blue-600 to-blue-400',
    card: 'from-blue-500/10 to-blue-400/10 border-blue-500/30',
    text: 'text-blue-600',
    subtext: 'text-blue-600/80',
    close: 'text-blue-600 hover:text-blue-800',
  },
};

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const theme = THEMES[toast.type] || THEMES.success;
  const Icon = theme.icon;

  return (
    <div
      className={`fixed top-20 sm:top-24 md:top-28 right-2 sm:right-4 z-[100] bg-gradient-to-r ${theme.card} border-2 rounded-2xl p-2 sm:p-3 flex items-center gap-3 sm:gap-4 shadow-xl animate-dropdown max-w-xs sm:max-w-md backdrop-blur-sm`}
    >
      <div className={`bg-gradient-to-r ${theme.iconBox} p-2 sm:p-3 rounded-2xl`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div>
        <p className={`${theme.text} font-bold text-base sm:text-lg`}>{theme.title}</p>
        <p className={`${theme.subtext} text-[10px] sm:text-sm`}>{toast.message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${theme.close} ml-auto hover:rotate-90 transition-transform duration-300 hover:scale-110`}
        >
          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
};

export default Toast;
