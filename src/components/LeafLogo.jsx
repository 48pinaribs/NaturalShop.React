import React from "react";

export default function LeafLogo({ size = 42, color = "#4F6F52", strokeWidth = 1.2, variant = "horizontal" }) {
  // Horizontal version - single branch with 2-3 leaves
  const horizontalPath = (
    <g>
      {/* Main stem */}
      <path d="M 6 12 L 18 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      {/* Left leaf */}
      <path d="M 8 10 Q 6 8 4 10 Q 6 12 8 10" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Center leaf */}
      <path d="M 12 8 Q 11 6 10 8 Q 11 10 12 8" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Right leaf */}
      <path d="M 16 10 Q 18 8 20 10 Q 18 12 16 10" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  );

  // Stacked version - vertical branch
  const stackedPath = (
    <g>
      {/* Main stem */}
      <path d="M 12 6 L 12 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      {/* Top leaf */}
      <path d="M 12 8 Q 10 6 8 8 Q 10 10 12 8" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Middle left leaf */}
      <path d="M 12 12 Q 10 13 10 15 Q 11 14 12 12" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Middle right leaf */}
      <path d="M 12 12 Q 14 13 14 15 Q 13 14 12 12" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  );

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === "stacked" ? stackedPath : horizontalPath}
    </svg>
  );
}
