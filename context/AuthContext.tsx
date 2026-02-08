
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

// Define the shape of our authentication context
interface AuthContextType {
    isAuthenticated: boolean;
    user: { email: string } | null;
    login: (email: string) => void;
    logout: () => void;
}

// Create the context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to easily use the auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Provider component
export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<{ email: string } | null>(null);

    // Derived state to check if user is authenticated
    const isAuthenticated = !!user;

    const login = (email: string) => {
        // In a real app, you would validate credentials here
        // For now, we simulate a successful login
        setUser({ email });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
