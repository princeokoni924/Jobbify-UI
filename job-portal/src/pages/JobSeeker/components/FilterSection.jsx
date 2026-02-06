import { memo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";


const FilterSection = memo(({ 
  title, 
  children, 
  isExpanded, 
  onToggle,
  className = "" 
}) => {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 last:border-b-0 ${className}`}>
      <button
        type="button"
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`Toggle ${title} filter section`}
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 flex-shrink-0 transition-transform duration-200" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-200" aria-hidden="true" />
        )}
      </button>
      
      {isExpanded && (
        <div className="animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
});

export default FilterSection