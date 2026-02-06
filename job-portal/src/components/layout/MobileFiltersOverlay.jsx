
import { useEffect } from "react";
import { X } from "lucide-react";
import FilterContent from "../../pages/JobSeeker/components/FilterContent"
// Mobile Filters Overlay Component
const MobileFiltersOverlay = ({
  isOpen,
  onClose,
  toggleSection,
  clearAllFilter,
  expandedSections,
  filters,
  handleFilterChange,
}) => {
  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 inset-0 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filters-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 id="mobile-filters-title" className="font-bold text-gray-900 text-lg">
            Filters
          </h3>
          <button
            className="p-2 hover:bg-gray-100  rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X className="h-5 w-5 text-gray-500 hover:text-blue-500 text-5xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          <FilterContent
            toggleSection={toggleSection}
            clearAllFilter={clearAllFilter}
            expandedSections={expandedSections}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
  
};
export default MobileFiltersOverlay