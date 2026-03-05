import React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      width="200" 
      height="200" 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <clipPath id="leftHalf">
          <rect x="0" y="0" width="100" height="200" />
        </clipPath>
        <clipPath id="rightHalf">
          <rect x="100" y="0" width="100" height="200" />
        </clipPath>
      </defs>

      {/* Left (Tech) */}
      <circle cx="100" cy="100" r="90" fill="#111827" clipPath="url(#leftHalf)" />

      {/* Right (Eco) */}
      <circle cx="100" cy="100" r="90" fill="#22C55E" clipPath="url(#rightHalf)" />

      {/* Center divider */}
      <line x1="100" y1="10" x2="100" y2="190" stroke="white" strokeWidth="2"/>

      {/* Tech eye (minimal node) */}
      <circle cx="70" cy="100" r="8" fill="white" />

      {/* Eco leaf (geometric minimal) */}
      <path d="M125 90 Q145 100 125 120 Q115 105 125 90 Z" fill="white"/>
    </svg>
  );
}
