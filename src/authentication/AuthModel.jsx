import {useEffect, useState} from "react";
import {LoginForm} from "@/components/login-form";
import {SignupForm} from "@/components/signup-form";
import {signInWithGoogle} from "./googleLogin.js";
import {onAuthStateChanged, getAuth} from "firebase/auth";

export default function Page({onClose}) {
    const [mode, setMode] = useState("login");
    const auth = getAuth();

    // Close the modal automatically when the user logs in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                onClose();
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={onClose} // close when clicking outside
        >
            <div
                className="w-full max-w-sm"
                onClick={(e) => e.stopPropagation()} // prevent inside clicks from closing
            >
                {mode === "login" && <LoginForm onSwitch={() => setMode("signup")} />}

                {mode === "signup" && <SignupForm onSwitch={() => setMode("login")} />}
            </div>
        </div>
    );
}
