"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@cloudscape-design/components";

const Loading = () => {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSpinner(true);
        }, 300);

        return () => clearTimeout(timer); 
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            {showSpinner && <Spinner size="large" />}
        </div>
    );
};

export default Loading;
