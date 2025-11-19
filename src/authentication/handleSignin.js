import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export async function handleLogin(email, password) {
  const auth = getAuth();

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      alert("No account found with this email");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email format");
    } else {
      alert("Login failed. Please try again.");
    }
    throw error;
  }
}
