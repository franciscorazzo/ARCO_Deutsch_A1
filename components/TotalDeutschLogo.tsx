import React from 'react';

export const TotalDeutschLogo: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
            {/* Using an SVG for the logo */}
            <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#000" strokeWidth="2" fill="none">
                    {/* House */}
                    <path d="M40 88V55.5L50 45l10 10.5V88H40z" fill="#F7E0A3" strokeWidth="3"/>
                    <path d="M37 57l13-13.5 13 13.5" strokeWidth="3"/>
                    <path d="M40 68h20" strokeWidth="2"/>
                    <path d="M50 88V55.5" strokeWidth="2"/>
                    <path d="M41 87l9-15" strokeWidth="2"/>
                    <path d="M59 87l-9-15" strokeWidth="2"/>
                    <path d="M41 67l9-15" strokeWidth="2"/>
                    <path d="M59 67l-9-15" strokeWidth="2"/>
                    {/* Roof */}
                    <path d="M34 58.5L50 42l16 16.5" fill="#D44" strokeWidth="3"/>
                    {/* Windows */}
                    <g fill="#D44" strokeWidth="1.5">
                        <rect x="43" y="60" width="4" height="4"/>
                        <rect x="53" y="60" width="4" height="4"/>
                        <rect x="43" y="72" width="4" height="4"/>
                        <rect x="53" y="72" width="4" height="4"/>
                    </g>
                    {/* Door */}
                    <rect x="46" y="80" width="8" height="8" fill="#333" strokeWidth="2"/>
                    {/* Speech Bubble */}
                    <g transform="translate(60, 40)">
                        <path d="M-15.5 1.5c0-8 6-14.5 14-14.5h2c8 0 14.5 6.5 14.5 14.5v0c0 8-6.5 14.5-14.5 14.5h-2c-8 0-14-6.5-14-14.5z" fill="#fff" strokeWidth="2"/>
                        <path d="M-15.5 1.5L-20 8l5-2" fill="#fff" strokeWidth="2"/>
                        <text x="1.5" y="5.5" fontFamily="Inter, sans-serif" fontSize="11" textAnchor="middle" fill="#000" fontWeight="bold">HALLO!</text>
                    </g>
                </g>
            </svg>
        </div>
        <div>
            <div className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900" style={{ lineHeight: '1' }}>TOTAL</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tighter text-gray-900" style={{ lineHeight: '1' }}>Deutsch</div>
        </div>
    </div>
);
