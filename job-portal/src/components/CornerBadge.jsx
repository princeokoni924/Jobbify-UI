const CornerBadge = ({ className = "bg-gray-100 text-gray-700", icon: Icon, children }) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full border ${className}`}
      >
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {children}
      </span>
    </div>
  );
};
export default CornerBadge;
