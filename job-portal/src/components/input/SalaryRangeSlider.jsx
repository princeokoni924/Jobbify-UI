import { useState } from "react";

const SalaryRangeSlider = ({ filters, handleFilterChange }) => {
  const [minSalary, setMinSalary] = useState(filters?.minSalary || 0);
  const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Salary
          </label>
          <input
            type="number"
            placeholder="0"
            min={`0`}
            step={`1000`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-600 focus:opacity-50"
            value={minSalary || ""}
            onChange={({ target }) => setMinSalary(target.value)}
            onBlur={() =>
              handleFilterChange(
                "minSalary",
                minSalary ? parseInt(minSalary) : ""
              )
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximun Salary
          </label>
          <input
            type="number"
            placeholder="Umlimited"
            min={`0`}
            value={maxSalary || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-600 focus:opacity-50"
            onChange={({ target }) => setMaxSalary(target.value)}
            step={`1000`}
            onBlur={() =>
              handleFilterChange(
                "maxSalary",
                maxSalary ? parseInt(maxSalary) : ""
              )
            }
          />
        </div>
      </div>

      {/* Display current Range */}
      {minSalary || maxSalary ? (
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
          Range: {minSalary ? `${minSalary.toLocalString()}` : "$0"}-{" "}
          {maxSalary ? `${maxSalary.toLocalString()}` : "Unlimited range"}
        </div>
      ) : (
        "No salary range available"
      )}
    </div>
  );
};

export default SalaryRangeSlider;
