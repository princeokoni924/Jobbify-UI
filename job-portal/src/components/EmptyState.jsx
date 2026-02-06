import { Search } from "lucide-react";
// Empty State Component
const EmptyState = ({ onClearFilters, hasFilters }) => (
  <div className="text-center py-16 lg:py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm">
    <div className="text-gray-400 mb-6">
      <Search className="w-20 h-20 mx-auto" />
    </div>
    <h3 className="text-xl text-gray-900 mb-3 font-bold lg:text-2xl">
      No Jobs Found
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      {hasFilters
        ? "Try adjusting your search criteria or filters to find more opportunities."
        : "There are no job postings available at the moment. Check back soon!"}
    </p>
    {hasFilters && (
      <button
      type="button"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={onClearFilters}
      >
        Clear All Filters
      </button>
    )}
  </div>
);
export default EmptyState