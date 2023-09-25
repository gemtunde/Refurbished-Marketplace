import React from "react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center opacity-80">
      <div className="w-10 h-10 border-4 border-dashed border-gray-200 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );
};

export default Spinner;
