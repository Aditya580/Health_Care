// AuthProvider.jsx
import React, { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext({
  user: undefined, // undefined = not resolved yet; null = signed out
  setUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined until firebase reports
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // firebaseUser is null if signed out
      setUser(firebaseUser || null);
    });

    // cleanup
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
