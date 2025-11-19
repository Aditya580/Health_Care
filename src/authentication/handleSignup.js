import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export async function handleSignup(name, email, password) {
  const auth = getAuth();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;

  await setDoc(doc(db, "users", user.uid), {
    name,
    email,
    avatar: null,
  });

  return user;
}
