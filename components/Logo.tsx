import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-auto' }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 220 50"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#2b89d1', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#156dbd', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Heart Icon Group */}
            <g transform="translate(0, 2)">
                {/* Heart Shape */}
                <path
                    d="M25,4C16.7,4,10,10.7,10,19c0,10.2,15,22,15,22s15-11.8,15-22C40,10.7,33.3,4,25,4z"
                    fill="url(#logoGradient)"
                />
                {/* Medical Cross */}
                <path
                    d="M25 15 V 29 M 18 22 H 32"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </g>

            {/* Text */}
            <text
                x="55"
                y="35"
                fontFamily="Inter, sans-serif"
                fontSize="32"
                fontWeight="bold"
                fill="#0f172a"
            >
                Salud YA
            </text>
        </svg>
    );
};

export default Logo;