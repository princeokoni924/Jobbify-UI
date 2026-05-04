import { Grid, List,Icon } from "lucide-react";
const VIEW_MODE = {
  GRID: "grid",
  LIST: "list",
};
const ViewToggle = ({ viewMode, onChange }) => {
  return (
    <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl p-1 gap-1">
      {[
        { mode: VIEW_MODE.GRID, Icon: Grid, label: "Grid" },
        { mode: VIEW_MODE.LIST, Icon: List, label: "List" },
      // eslint-disable-next-line no-unused-vars
      ].map(({ mode, Icon, label }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          aria-label={label}
          aria-pressed={viewMode === mode}
          className={`p-2 rounded-lg transition-all duration-200 ${viewMode === mode ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"}`}
        >
                <Icon className="w-4 h-4"/>
        </button>
      ))}
    </div>
  );
};
export default ViewToggle;
