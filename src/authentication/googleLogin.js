import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  await setDoc(
    doc(db, "users", user.uid),
    {
      name: user.displayName,
      email: user.email,
      avatar: user.photoURL
    },
    { merge: true }
  );

  return user; // optional but useful
}
