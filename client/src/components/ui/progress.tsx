import React from "react";

interface ProgressProps {
    value: number;
    className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
    return (
        <div
            className={`relative w-full h-4 bg-gray-200 rounded-full overflow-hidden ${className}`}
        >
            <div
                className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
            ></div>
        </div>
    );
};
