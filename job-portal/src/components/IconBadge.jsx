import React from "react";

// eslint-disable-next-line no-unused-vars
const IconBadge = ({ icon: Icon, variant = "warning" }) => {
  const variants = {
    warning: "bg-yellow-100 text-yellow-600",
    error: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600",
  };
  return (
    <div
      className={`w-20 h-20 rounded-full flex items-center justify-center ${variants[variant]} mx-auto mb-6`}
    >
      <Icon size={40} />
    </div>
  );
};

export default IconBadge;
