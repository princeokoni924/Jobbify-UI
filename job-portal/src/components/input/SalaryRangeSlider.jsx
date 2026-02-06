
import { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { CURRENCY_CONFIG } from "../../pages/utils/data";


/**
 * Format number with thousand separators
 * @param {number} value - Number to format
 * @returns {string} Formatted number
 */
const formatNumber = (value) => {
  if (!value && value !== 0) return "";
  return Number(value).toLocaleString();
};

/**
 * Get currency configuration based on code
 * @param {string} currencyCode - Currency code (e.g., 'USD', 'NGN')
 * @returns {Object} Currency configuration
 */
const getCurrencyConfig = (currencyCode= "NGN") => {
  return CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.NGN;
};

/**
 * Salary Range Slider Component
 * Allows users to filter jobs by salary range with dynamic currency support
 * 
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.handleFilterChange - Filter change handler
 * @param {string} [props.currency] - Currency code (default: 'NGN')
 * @param {number} [props.maxLimit] - Maximum salary limit (default: 10000000)
 */
const SalaryRangeSlider = ({ 
  filters = {}, 
  handleFilterChange,
  currency = "NGN",
  maxLimit = 10000000
}) => {
  const [minSalary, setMinSalary] = useState(() => filters?.minSalary || 0);
  const [maxSalary, setMaxSalary] = useState(() => filters?.maxSalary || 0);
  const [error, setError] = useState(null);

  // Get currency configuration
  const currencyConfig = useMemo(() => getCurrencyConfig(currency), [currency]);

  /**
   * Validate salary range
   * @param {number} min - Minimum salary
   * @param {number} max - Maximum salary
   * @returns {Object} Validation result
   */
  const validateRange = useCallback((min, max) => {
    if (min && max && parseInt(min) > parseInt(max)) {
      return {
        isValid: false,
        message: "Minimum salary cannot exceed maximum salary"
      };
    }
    
    if (max && parseInt(max) > maxLimit) {
      return {
        isValid: false,
        message: `Maximum salary cannot exceed ${currencyConfig.symbol}${formatNumber(maxLimit)}`
      };
    }

    if (min && parseInt(min) < 0) {
      return {
        isValid: false,
        message: "Salary cannot be negative"
      };
    }

    return { isValid: true, message: null };
  }, [maxLimit, currencyConfig.symbol]);

  /**
   * Handle minimum salary change
   */
  const handleMinChange = useCallback((e) => {
    const value = e.target.value;
    
    // Allow empty string for clearing
    if (value === "") {
      setMinSalary("");
      setError(null);
      return;
    }

    // Only allow numeric values
    if (!/^\d*$/.test(value)) {
      return;
    }

    setMinSalary(value);
    
    // Validate in real-time
    const validation = validateRange(value, maxSalary);
    setError(validation.isValid ? null : validation.message);
  }, [maxSalary, validateRange]);

  /**
   * Handle maximum salary change
   */
  const handleMaxChange = useCallback((e) => {
    const value = e.target.value;
    
    // Allow empty string for clearing
    if (value === "") {
      setMaxSalary("");
      setError(null);
      return;
    }

    // Only allow numeric values
    if (!/^\d*$/.test(value)) {
      return;
    }

    setMaxSalary(value);
    
    // Validate in real-time
    const validation = validateRange(minSalary, value);
    setError(validation.isValid ? null : validation.message);
  }, [minSalary, validateRange]);

  /**
   * Handle minimum salary blur (apply filter)
   */
  const handleMinBlur = useCallback(() => {
    const value = minSalary ? parseInt(minSalary) : "";
    const validation = validateRange(value, maxSalary);

    if (validation.isValid) {
      handleFilterChange("minSalary", value);
      setError(null);
    } else {
      setError(validation.message);
    }
  }, [minSalary, maxSalary, handleFilterChange, validateRange]);

  /**
   * Handle maximum salary blur (apply filter)
   */
  const handleMaxBlur = useCallback(() => {
    const value = maxSalary ? parseInt(maxSalary) : "";
    const validation = validateRange(minSalary, value);

    if (validation.isValid) {
      handleFilterChange("maxSalary", value);
      setError(null);
    } else {
      setError(validation.message);
    }
  }, [maxSalary, minSalary, handleFilterChange, validateRange]);

  /**
   * Handle Enter key press to apply filter immediately
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.target.blur(); // Trigger blur event
    }
  }, []);

  /**
   * Format display range
   */
  const displayRange = useMemo(() => {
    const min = minSalary ? parseInt(minSalary) : 0;
    const max = maxSalary ? parseInt(maxSalary) : null;

    const minDisplay = `${currencyConfig.symbol}${formatNumber(min)}`;
    const maxDisplay = max 
      ? `${currencyConfig.symbol}${formatNumber(max)}`
      : "Unlimited";

    return `${minDisplay} - ${maxDisplay}`;
  }, [minSalary, maxSalary, currencyConfig.symbol]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Minimum Salary Input */}
        <div>
          <label 
            htmlFor="minSalary" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Minimum Salary
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none text-sm">
              {currencyConfig.symbol}
            </span>
            <input
              id="minSalary"
              type="text"
              inputMode="numeric"
              placeholder="0"
              min="0"
              step={currencyConfig.step}
              className={`w-full pl-8 pr-3 py-2 outline-none border rounded-lg shadow-sm text-sm
                focus:ring-1 focus:ring-blue-500 focus:border-blue-500 
                transition-colors duration-200
                ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
              value={minSalary}
              onChange={handleMinChange}
              onBlur={handleMinBlur}
              onKeyPress={handleKeyPress}
              aria-label="Minimum salary"
              aria-describedby={error ? "salary-error" : "salary-range"}
              aria-invalid={!!error}
            />
          </div>
        </div>

        {/* Maximum Salary Input */}
        <div>
          <label 
            htmlFor="maxSalary" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Maximum Salary
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none text-sm">
              {currencyConfig.symbol}
            </span>
            <input
              id="maxSalary"
              type="text"
              inputMode="numeric"
              placeholder="Unlimited"
              min="0"
              step={currencyConfig.step}
              value={maxSalary}
              className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm text-sm
                focus:ring-1 focus:ring-blue-500 outline-none focus:border-blue-500 
                transition-colors duration-200
                ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
              onChange={handleMaxChange}
              onBlur={handleMaxBlur}
              onKeyPress={handleKeyPress}
              aria-label="Maximum salary"
              aria-describedby={error ? "salary-error" : "salary-range"}
              aria-invalid={!!error}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          id="salary-error"
          className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
          role="alert"
        >
          <svg 
            className="w-4 h-4 mt-0.5 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Display Current Range */}
      {(minSalary || maxSalary) && !error ? (
        <div 
          id="salary-range"
          className="text-sm text-gray-700 bg-blue-50 px-4 py-2.5 rounded-lg border border-blue-200 flex items-center justify-between"
        >
          <span className="font-medium text-gray-600">Selected Range:</span>
          <span className="font-semibold text-blue-700">{displayRange}</span>
        </div>
      ) : !minSalary && !maxSalary && !error ? (
        <div 
          id="salary-range"
          className="text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 text-center"
        >
          No salary range selected
        </div>
      ) : null}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Enter your preferred salary range in {currencyConfig.name}. 
        Leave maximum empty for unlimited range.
      </p>
    </div>
  );
};

SalaryRangeSlider.displayName = "SalaryRangeSlider";

SalaryRangeSlider.propTypes = {
  filters: PropTypes.shape({
    minSalary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxSalary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  handleFilterChange: PropTypes.func.isRequired,
  currency: PropTypes.oneOf(Object.keys(CURRENCY_CONFIG)),
  maxLimit: PropTypes.number,
};

SalaryRangeSlider.defaultProps = {
  filters: {
    minSalary: 0,
    maxSalary: 0,
  },
  currency: "NGN",
  maxLimit: 10000000,
};

export default SalaryRangeSlider;





// import { useState, useCallback, useMemo } from "react";
// import PropTypes from "prop-types";

// /**
//  * Currency configuration for different regions
//  * Can be extended with more currencies as needed
//  */
// const CURRENCY_CONFIG = {
//   NGN: { symbol: "₦", name: "Nigerian Naira", step: 10000 },
//   USD: { symbol: "$", name: "US Dollar", step: 1000 },
//   EUR: { symbol: "€", name: "Euro", step: 1000 },
//   GBP: { symbol: "£", name: "British Pound", step: 1000 },
//   CAD: { symbol: "C$", name: "Canadian Dollar", step: 1000 },
//   AUD: { symbol: "A$", name: "Australian Dollar", step: 1000 },
//   INR: { symbol: "₹", name: "Indian Rupee", step: 1000 },
// };

// /**
//  * Format number with thousand separators
//  * @param {number} value - Number to format
//  * @returns {string} Formatted number
//  */
// const formatNumber = (value) => {
//   if (!value && value !== 0) return "";
//   return Number(value).toLocaleString();
// };

// /**
//  * Get currency configuration based on code
//  * @param {string} currencyCode - Currency code (e.g., 'USD', 'NGN')
//  * @returns {Object} Currency configuration
//  */
// const getCurrencyConfig = (currencyCode = "NGN") => {
//   return CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.NGN;
// };

// /**
//  * Salary Range Slider Component
//  * Allows users to filter jobs by salary range with dynamic currency support
//  * 
//  * @param {Object} props - Component props
//  * @param {Object} props.filters - Current filter values
//  * @param {Function} props.handleFilterChange - Filter change handler
//  * @param {string} [props.currency] - Currency code (default: 'NGN')
//  * @param {number} [props.maxLimit] - Maximum salary limit (default: 10000000)
//  */
// const SalaryRangeSlider = ({ 
//   filters = {}, 
//   handleFilterChange,
//   currency = "NGN",
//   maxLimit = 10000000
// }) => {
//   // Local state for immediate UI updates
//   const [minSalary, setMinSalary] = useState(filters?.minSalary || 0);
//   const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || 0);
//   const [error, setError] = useState(null);

//   // Get currency configuration
//   const currencyConfig = useMemo(() => getCurrencyConfig(currency), [currency]);

//   // Sync local state with filter props when they change externally
//   // useEffect(() => {
//   //   setMinSalary(filters?.minSalary || 0);
//   //   setMaxSalary(filters?.maxSalary || 0);
//   // }, [filters?.minSalary, filters?.maxSalary]);

//   /**
//    * Validate salary range
//    * @param {number} min - Minimum salary
//    * @param {number} max - Maximum salary
//    * @returns {Object} Validation result
//    */
//   const validateRange = useCallback((min, max) => {
//     if (min && max && parseInt(min) > parseInt(max)) {
//       return {
//         isValid: false,
//         message: "Minimum salary cannot exceed maximum salary"
//       };
//     }
    
//     if (max && parseInt(max) > maxLimit) {
//       return {
//         isValid: false,
//         message: `Maximum salary cannot exceed ${currencyConfig.symbol}${formatNumber(maxLimit)}`
//       };
//     }

//     if (min && parseInt(min) < 0) {
//       return {
//         isValid: false,
//         message: "Salary cannot be negative"
//       };
//     }

//     return { isValid: true, message: null };
//   }, [maxLimit, currencyConfig.symbol]);

//   /**
//    * Handle minimum salary change
//    */
//   const handleMinChange = useCallback((e) => {
//     const value = e.target.value;
    
//     // Allow empty string for clearing
//     if (value === "") {
//       setMinSalary("");
//       setError(null);
//       return;
//     }

//     // Only allow numeric values
//     if (!/^\d*$/.test(value)) {
//       return;
//     }

//     setMinSalary(value);
    
//     // Validate in real-time
//     const validation = validateRange(value, maxSalary);
//     setError(validation.isValid ? null : validation.message);
//   }, [maxSalary, validateRange]);

//   /**
//    * Handle maximum salary change
//    */
//   const handleMaxChange = useCallback((e) => {
//     const value = e.target.value;
    
//     // Allow empty string for clearing
//     if (value === "") {
//       setMaxSalary("");
//       setError(null);
//       return;
//     }

//     // Only allow numeric values
//     if (!/^\d*$/.test(value)) {
//       return;
//     }

//     setMaxSalary(value);
    
//     // Validate in real-time
//     const validation = validateRange(minSalary, value);
//     setError(validation.isValid ? null : validation.message);
//   }, [minSalary, validateRange]);

//   /**
//    * Handle minimum salary blur (apply filter)
//    */
//   const handleMinBlur = useCallback(() => {
//     const value = minSalary ? parseInt(minSalary) : "";
//     const validation = validateRange(value, maxSalary);

//     if (validation.isValid) {
//       handleFilterChange("minSalary", value);
//       setError(null);
//     } else {
//       setError(validation.message);
//     }
//   }, [minSalary, maxSalary, handleFilterChange, validateRange]);

//   /**
//    * Handle maximum salary blur (apply filter)
//    */
//   const handleMaxBlur = useCallback(() => {
//     const value = maxSalary ? parseInt(maxSalary) : "";
//     const validation = validateRange(minSalary, value);

//     if (validation.isValid) {
//       handleFilterChange("maxSalary", value);
//       setError(null);
//     } else {
//       setError(validation.message);
//     }
//   }, [maxSalary, minSalary, handleFilterChange, validateRange]);

//   /**
//    * Format display range
//    */
//   const displayRange = useMemo(() => {
//     const min = minSalary ? parseInt(minSalary) : 0;
//     const max = maxSalary ? parseInt(maxSalary) : null;

//     const minDisplay = `${currencyConfig.symbol}${formatNumber(min)}`;
//     const maxDisplay = max 
//       ? `${currencyConfig.symbol}${formatNumber(max)}`
//       : "Unlimited";

//     return `${minDisplay} - ${maxDisplay}`;
//   }, [minSalary, maxSalary, currencyConfig.symbol]);

//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         {/* Minimum Salary Input */}
//         <div>
//           <label 
//             htmlFor="minSalary" 
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Minimum Salary
//           </label>
//           <div className="relative">
//             <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
//               {currencyConfig.symbol}
//             </span>
//             <input
//               id="minSalary"
//               type="text"
//               inputMode="numeric"
//               placeholder="0"
//               min="0"
//               step={currencyConfig.step}
//               className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm text-sm
//                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
//                 transition-colors duration-200
//                 ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
//                 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
//               value={minSalary}
//               onChange={handleMinChange}
//               onBlur={handleMinBlur}
//               aria-label="Minimum salary"
//               aria-describedby={error ? "salary-error" : "salary-range"}
//               aria-invalid={!!error}
//             />
//           </div>
//         </div>

//         {/* Maximum Salary Input */}
//         <div>
//           <label 
//             htmlFor="maxSalary" 
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Maximum Salary
//           </label>
//           <div className="relative">
//             <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">
//               {currencyConfig.symbol}
//             </span>
//             <input
//               id="maxSalary"
//               type="text"
//               inputMode="numeric"
//               placeholder="Unlimited"
//               min="0"
//               step={currencyConfig.step}
//               value={maxSalary}
//               className={`w-full pl-8 pr-3 py-2 border rounded-lg shadow-sm text-sm
//                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
//                 transition-colors duration-200
//                 ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
//                 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed`}
//               onChange={handleMaxChange}
//               onBlur={handleMaxBlur}
//               aria-label="Maximum salary"
//               aria-describedby={error ? "salary-error" : "salary-range"}
//               aria-invalid={!!error}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div 
//           id="salary-error"
//           className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
//           role="alert"
//         >
//           <svg 
//             className="w-4 h-4 mt-0.5 flex-shrink-0" 
//             fill="currentColor" 
//             viewBox="0 0 20 20"
//             aria-hidden="true"
//           >
//             <path 
//               fillRule="evenodd" 
//               d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
//               clipRule="evenodd" 
//             />
//           </svg>
//           <span>{error}</span>
//         </div>
//       )}

//       {/* Display Current Range */}
//       {(minSalary || maxSalary) && !error ? (
//         <div 
//           id="salary-range"
//           className="text-sm text-gray-700 bg-blue-50 px-4 py-2.5 rounded-lg border border-blue-200 flex items-center justify-between"
//         >
//           <span className="font-medium text-gray-600">Selected Range:</span>
//           <span className="font-semibold text-blue-700">{displayRange}</span>
//         </div>
//       ) : !minSalary && !maxSalary && !error ? (
//         <div 
//           id="salary-range"
//           className="text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 text-center"
//         >
//           No salary range selected
//         </div>
//       ) : null}

//       {/* Helper Text */}
//       <p className="text-xs text-gray-500">
//         Enter your preferred salary range in {currencyConfig.name}. 
//         Leave maximum empty for unlimited range.
//       </p>
//     </div>
//   );
// };

// SalaryRangeSlider.displayName = "SalaryRangeSlider";

// SalaryRangeSlider.propTypes = {
//   filters: PropTypes.shape({
//     minSalary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//     maxSalary: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   }),
//   handleFilterChange: PropTypes.func.isRequired,
//   currency: PropTypes.oneOf(Object.keys(CURRENCY_CONFIG)),
//   maxLimit: PropTypes.number,
// };

// SalaryRangeSlider.defaultProps = {
//   filters: {
//     minSalary: 0,
//     maxSalary: 0,
//   },
//   currency: "NGN",
//   maxLimit: 10000000,
// };

// export default SalaryRangeSlider;



// import { useState } from "react";

// const SalaryRangeSlider = ({ filters, handleFilterChange }) => {
//   const [minSalary, setMinSalary] = useState(filters?.minSalary || 0);
//   const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || 0);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Minimum Salary
//           </label>
//           <input
//             type="number"
//             placeholder="0"
//             min={`0`}
//             step={`1000`}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-600 focus:opacity-50"
//             value={minSalary || ""}
//             onChange={({ target }) => setMinSalary(target.value)}
//             onBlur={() =>
//               handleFilterChange(
//                 "minSalary",
//                 minSalary ? parseInt(minSalary) : ""
//               )
//             }
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Maximun Salary
//           </label>
//           <input
//             type="number"
//             placeholder="Umlimited"
//             min={`0`}
//             value={maxSalary || ""}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-600 focus:opacity-50"
//             onChange={({ target }) => setMaxSalary(target.value)}
//             step={`1000`}
//             onBlur={() =>
//               handleFilterChange(
//                 "maxSalary",
//                 maxSalary ? parseInt(maxSalary) : ""
//               )
//             }
//           />
//         </div>
//       </div>

//       {/* Display current Range */}
//       {minSalary || maxSalary ? (
//         <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
//           Range: {minSalary ? `${minSalary.toLocalString()}` : "$0"}-{" "}
//           {maxSalary ? `${maxSalary.toLocalString()}` : "Unlimited range"}
//         </div>
//       ) : (
//         "No salary range available"
//       )}
//     </div>
//   );
// };

// export default SalaryRangeSlider;
