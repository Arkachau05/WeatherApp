// Loader.js
import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center bg-black h-[100vh] w-[100vw]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            <p className="ml-4 text-xl text-blue-500">Loading...</p>
        </div>
    );
};

export default Loader;
