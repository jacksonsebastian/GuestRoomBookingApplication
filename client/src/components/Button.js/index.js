import React from "react";

const CustomButton = ({ text, onClick, ...props }) => {
  return (
    <button
      className="btn"
      style={{ backgroundColor: "#3db54a", color: "#ffffff" }}
      onClick={onClick}
      {...props}
    >
      {text}
    </button>
  );
};

export default CustomButton;
