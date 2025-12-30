import { AlertCircle } from "lucide-react";

const TextareaField = ({
  id,
  placeholder,
  value,
  onChange,
  helperText,
  required = false,
  disabled = false,
  label,
  error,
  rows = 6,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
        {required && <span className={`text-red-500 ml-1`}>*</span>}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border rounded-lg text-base transition-colors duration-300 resize-y disabled:bg-gray-50  ${
          error
            ? "border-red-300 focus:bg-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        } focus:outline-none focus:ring-1 focus:opacity-50`}
        style={{ minHeight: `150px` }}
        {...props}
      />
      {error && (
        <div className="flex text-sm font-medium text-red-600 items-center space-x-1">
                <AlertCircle className="w-4 h-4"/>
                <span>{error}</span>
        </div>
      )}
      {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default TextareaField;
