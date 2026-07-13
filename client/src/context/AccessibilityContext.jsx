import { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
    const [textSize, setTextSize] = useState(() => {
        return localStorage.getItem("textSize") || "normal";
    });

    const [highContrast, setHighContrast] = useState(() => {
        return localStorage.getItem("highContrast") === "true";
    });

    useEffect(() => {
        localStorage.setItem("textSize", textSize);
        localStorage.setItem("highContrast", String(highContrast));
    }, [textSize, highContrast]);

    return (
        <AccessibilityContext.Provider
            value={{
                textSize,
                setTextSize,
                highContrast,
                setHighContrast,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);

    if (!context) {
        throw new Error(
            "useAccessibility must be useed inside AccessibilityProvider"
        );
    }

    return context;
}