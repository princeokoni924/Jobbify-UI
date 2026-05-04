const Tag = ({
  className = "bg-gray-100 text-gray-700",
  icon: Icon,
  children,
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};
export default Tag;
