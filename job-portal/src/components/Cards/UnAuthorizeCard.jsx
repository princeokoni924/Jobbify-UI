import React from "react";

const UnAuthorizeCard = ({ className, children }) => {
  return (
    <div className={`bg-white rounded-xl shadow-2xl p-8 md:p-12 ${className}`}>
      {children}
    </div>
  );
};

export default UnAuthorizeCard;
