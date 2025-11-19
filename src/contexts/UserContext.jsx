import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: snap.data()?.name || firebaseUser.displayName,
          avatar: snap.data()?.avatar || firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => auth.signOut();

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}
