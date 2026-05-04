const IconButton = ({ onClick, disabled, label, className = "", children }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <button
      className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${className}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
    >
      {children}
    </button>
  );
};
export default IconButton;