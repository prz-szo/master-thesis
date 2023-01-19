import React from 'react';

export const CrossIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <svg
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.187 7.247a1.016 1.016 0 00.001-1.433 1.013 1.013 0 00-1.433-.001l-6.112 6.112-6.11-6.112a1.014 1.014 0 10-1.435 1.434l6.112 6.11-6.112 6.11a1.015 1.015 0 001.434 1.435l6.11-6.112 6.113 6.112a1.013 1.013 0 101.432-1.435l-6.112-6.11 6.112-6.11z"
    />
  </svg>
);

export default CrossIcon;
