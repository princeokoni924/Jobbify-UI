import { ChevronDown, ChevronUp } from "lucide-react";
import { JOB_CATEGORIES, JOB_TYPES } from "../../utils/data";

import SalaryRangeSlider from "../../../components/input/SalaryRangeSlider";
const FilterSection = ({ title, children, isExpanded, onToggle }) => {
  <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
    <button
      className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3 hover:text-blue-600  transition-colors "
      onClick={onToggle}
    >
      {title}
      {isExpanded ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
    {isExpanded && children}
  </div>;
};
const FilterContent = ({
  toggleSection,
  clearAllFilter,
  expandedSections,
  filters,
  handleFilterChange,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <button
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
          onClick={clearAllFilter}
        >
          Clear All
        </button>
      </div>
      <FilterSection
        title={`Job Type`}
        isExpanded={expandedSections?.jobType}
        onToggle={() => toggleSection("jobType")}
      >
        <div className="space-y-3">
          {JOB_TYPES.map((types) => {
            <label
              key={types.value}
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600
               text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:opacity-50"
                checked={filters?.types === types.value}
                onChange={(e) =>
                  handleFilterChange(
                    "type",
                    e.target.checked ? types.value : ""
                  )
                }
              />
              <span className="ml-3 text-gray-700 font-medium">{types.value}</span>
            </label>;
          })}
        </div>
      </FilterSection>

      <FilterSection
        title={`Salary Range`}
        isExpanded={expandedSections?.salary}
        onToggle={() => toggleSection("salary")}
      >
        <SalaryRangeSlider
          filters={filters}
          handleFilterChange={handleFilterChange}
        />
      </FilterSection>

      <FilterSection
        title={"category"}
        isExpanded={expandedSections?.categories}
        onToggle={() => toggleSection("categories")}
      >
        <div className="">
          {JOB_CATEGORIES.map((category) => {
            <label className="flex items-center cursor-pointer"
             key={category.value}>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600
               text-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:opacity-50"
                checked={filters?.category === category.value}
                onChange={(e) =>
                  handleFilterChange(
                    "category",
                    e.target.checked ? category.value : ""
                  )
                }
              />
              <span className="ml-3 text-gray-700 font-medium">{category.value}</span>
            </label>;
          })}
        </div>
      </FilterSection>
    </>
  );
};

export default FilterContent;
