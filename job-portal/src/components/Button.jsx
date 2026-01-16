const Button = ({ children, variant = "primary", onClick, icon: Icon }) => {
 const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };
  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};


export default Button;
