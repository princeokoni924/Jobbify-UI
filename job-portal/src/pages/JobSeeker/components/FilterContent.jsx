
import PropTypes from "prop-types";
import { memo, useCallback } from "react";
import { JOB_CATEGORIES, JOB_TYPES } from "../../utils/data";
import SalaryRangeSlider from "../../../components/input/SalaryRangeSlider";
import FilterSection from "../components/FilterSection"
/**
 * Reusable collapsible filter section component
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 * @param {boolean} props.isExpanded - Whether section is expanded
 * @param {Function} props.onToggle - Toggle handler
 * @param {string} [props.className] - Additional CSS classes
 */


FilterSection.displayName = "FilterSection";

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

/**
 * Main filter content component
 * Manages job search filters including type, salary range, and category
 * @param {Object} props - Component props
 * @param {Function} props.toggleSection - Toggle section expansion
 * @param {Function} props.clearAllFilter - Clear all filters
 * @param {Object} props.expandedSections - Object tracking expanded sections
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.handleFilterChange - Filter change handler
 */
const FilterContent = ({
  toggleSection,
  clearAllFilter,
  expandedSections = {},
  filters = {},
  handleFilterChange,
}) => {
  // Memoized handlers for better performance
  const handleTypeChange = useCallback(
    (typeValue, isChecked) => {
      handleFilterChange("type", isChecked ? typeValue : "");
    },
    [handleFilterChange]
  );

  const handleCategoryChange = useCallback(
    (categoryValue, isChecked) => {
      handleFilterChange("category", isChecked ? categoryValue : "");
    },
    [handleFilterChange]
  );

  const handleSectionToggle = useCallback(
    (sectionName) => {
      toggleSection(sectionName);
    },
    [toggleSection]
  );

  // Check if any filters are active
  const hasActiveFilters = 
    filters.type || 
    filters.category || 
    (filters.salaryMin && filters.salaryMin > 0) || 
    (filters.salaryMax && filters.salaryMax < 1000000);

  return (
    <div className="space-y-2">
      {/* Clear All Filters Button */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-1"
            onClick={clearAllFilter}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Job Type Filter Section */}
      <FilterSection
        title="Job Type"
        isExpanded={expandedSections.jobType}
        onToggle={() => handleSectionToggle("jobType")}
      >
        <div className="space-y-3" role="group" aria-label="Job type filters">
          {JOB_TYPES && JOB_TYPES.length > 0 ? (
            JOB_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex items-center cursor-pointer group hover:bg-gray-50 rounded px-2 py-1.5 transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200 cursor-pointer"
                  checked={filters.type === type.value}
                  onChange={(e) => handleTypeChange(type.value, e.target.checked)}
                  aria-label={`Filter by ${type.label || type.value}`}
                />
                <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                  {type.label || type.value}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No job types available</p>
          )}
        </div>
      </FilterSection>

      {/* Salary Range Filter Section */}
      <FilterSection
        title="Salary Range"
        isExpanded={expandedSections.salary}
        onToggle={() => handleSectionToggle("salary")}
      >
        <SalaryRangeSlider
          filters={filters}
          handleFilterChange={handleFilterChange}
        />
      </FilterSection>

      {/* Category Filter Section */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections.categories}
        onToggle={() => handleSectionToggle("categories")}
      >
        <div className="space-y-3" role="group" aria-label="Category filters">
          {JOB_CATEGORIES && JOB_CATEGORIES.length > 0 ? (
            JOB_CATEGORIES.map((category) => (
              <label
                key={category.value}
                className="flex items-center cursor-pointer group hover:bg-gray-50 rounded px-2 py-1.5 transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 text-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200 cursor-pointer"
                  checked={filters.category === category.value}
                  onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
                  aria-label={`Filter by ${category.label || category.value}`}
                />
                <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                  {category.label || category.value}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No categories available</p>
          )}
        </div>
      </FilterSection>
    </div>
  );
};

FilterContent.displayName = "FilterContent";

FilterContent.propTypes = {
  toggleSection: PropTypes.func.isRequired,
  clearAllFilter: PropTypes.func.isRequired,
  expandedSections: PropTypes.shape({
    jobType: PropTypes.bool,
    salary: PropTypes.bool,
    categories: PropTypes.bool,
  }),
  filters: PropTypes.shape({
    type: PropTypes.string,
    category: PropTypes.string,
    salaryMin: PropTypes.number,
    salaryMax: PropTypes.number,
  }),
  handleFilterChange: PropTypes.func.isRequired,
};

FilterContent.defaultProps = {
  expandedSections: {
    jobType: true,
    salary: false,
    categories: false,
  },
  filters: {
    type: "",
    category: "",
    salaryMin: 0,
    salaryMax: 1000000,
  },
};

export default memo(FilterContent);
