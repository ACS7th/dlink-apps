import React from "react";

export const Test = () => {
    console.log("test");
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-400">
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800">
                    Hello, Test Component!
                </h1>
                <p className="mt-2 text-gray-600">
                    This is a simple React component styled with TailwindCSS.
                </p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Click Me
                </button>
            </div>
        </div>
    );
};

export default Test;
