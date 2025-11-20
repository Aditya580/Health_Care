import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const auth = getAuth();

  // STEP 1: Load cached user immediately
  const cachedUser = localStorage.getItem("user");

  const [user, setUser] = useState(
    cachedUser ? JSON.parse(cachedUser) : undefined // undefined = loading
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch Firestore profile
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        const finalUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: snap.data()?.name || firebaseUser.displayName,
          avatar: snap.data()?.avatar || firebaseUser.photoURL,
        };

        // STEP 2: Cache user to localStorage
        localStorage.setItem("user", JSON.stringify(finalUser));

        setUser(finalUser);
      } else {
        // STEP 3: Remove cache on logout
        localStorage.removeItem("user");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    auth.signOut();
  };

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
}
