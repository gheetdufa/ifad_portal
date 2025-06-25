import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  className = '',
  ...props
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg text-umd-gray-900 placeholder-umd-gray-400
    focus:outline-none focus:ring-2 focus:ring-umd-red focus:border-transparent
    disabled:bg-umd-gray-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-umd-gray-300'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-umd-gray-700">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-umd-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default Input;