import React from "react";

const TitleText = ({ title }) => {
  return (
    <div>
      <h1 className="text-primary">
        <span className="text-gray-400 text-2xl">{title}</span>
      </h1>
    </div>
  );
};

export default TitleText;
