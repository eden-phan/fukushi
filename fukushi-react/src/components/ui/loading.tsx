import * as React from "react";

function Loading() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(177,177,177,0.4)] backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export { Loading };
