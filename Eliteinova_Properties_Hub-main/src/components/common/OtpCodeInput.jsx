// src/components/common/OtpCodeInput.jsx
import React, { useRef } from 'react';

// Six separate digit boxes. `digits` is an array of single-character strings
// ('' for an empty box). Typing advances focus, Backspace steps back, and
// pasting or an autofilled code fills every box. Once every box holds a digit,
// `onComplete` is called with the joined code.
const OtpCodeInput = ({ digits, onChange, onComplete, disabled = false }) => {
  const length = digits.length;
  const inputRefs = useRef([]);

  const focusBox = (index) => inputRefs.current[index]?.focus();

  const update = (next, focusIndex) => {
    onChange(next);
    if (focusIndex !== undefined) focusBox(Math.min(focusIndex, length - 1));
    if (next.every(Boolean) && onComplete) onComplete(next.join(''));
  };

  const writeFrom = (start, chars) => {
    const next = [...digits];
    chars.forEach((ch, offset) => {
      if (start + offset < length) next[start + offset] = ch;
    });
    update(next, start + chars.length);
  };

  const handleChange = (index, e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    // Some phones autofill the whole code into the first box.
    if (onlyDigits.length === length) {
      writeFrom(0, onlyDigits.split(''));
      return;
    }
    const typed = onlyDigits.slice(-1);
    if (!typed) {
      const next = [...digits];
      next[index] = '';
      onChange(next);
      return;
    }
    writeFrom(index, [typed]);
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    writeFrom(0, pasted.split(''));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      const next = [...digits];
      next[index - 1] = '';
      onChange(next);
      focusBox(index - 1);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusBox(index + 1);
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          autoFocus={index === 0}
          aria-label={`Digit ${index + 1} of ${length}`}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold text-gray-800 bg-white border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-xl outline-none transition-all duration-200 disabled:opacity-60"
        />
      ))}
    </div>
  );
};

export default OtpCodeInput;
