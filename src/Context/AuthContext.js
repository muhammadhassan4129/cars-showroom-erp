import { createContext, useContext, useState  } from "react";

const AuthContext = createContext();

const DUMMY_USER = {
    admin: {
        id: 1,
        name: "Super Admin",
        email: "admin@erp.com",
        role: "super_admin",
        Showroom_Id: null,
    },
    manager: {
        id: 2,
        name: "Showroom Manager",
        email: "manager@erp.com",
        role: "manager",
        Showroom_Id: 1,
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // login function with dummy data
    const login = (email, password) => {
        if (email === "admin@erp.com" && password === "admin@123") {
            setUser(DUMMY_USER.admin);
            localStorage.setItem("user", JSON.stringify(DUMMY_USER.admin));
            return {success: true};

        } else if (email === "manager@bargain.com" && password === "Manager@123") {
            setUser(DUMMY_USER.manager);
            localStorage.setItem("user", JSON.stringify(DUMMY_USER.manager));
            return {success: true}; 

        } else {
            console.log("Invalid credentials");
            return {success: false, message: "Invalid credentials"};
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const isSuperAdmin = () => {
        return user && user.role === "super_admin";
    };
    const isManager = () => {
        return user && user.role === "manager";
    };

    return (
        <AuthContext.Provider value={{ 
        user,
        login,
        logout,
        isSuperAdmin,
        isManager }}>
            {children}
        </AuthContext.Provider>
    );
};

    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) {
            throw new Error("useAuth must be used within an AuthProvider");
        }
        return context; 

};