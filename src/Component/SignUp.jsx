import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth,db} from "../firebase/firebase";



const maleAvatars = ["male1.jpg", "male2.jpg", "male3.jpg"];
const femaleAvatars = ["female1.png", "female2.png", "female3.png"];

export default function SignUpPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [avatar, setAvatar] = useState(maleAvatars[0]);
    const [error, setError] = useState("");

    
    const navigate = useNavigate();

    const generateUsername = async () => {
        const initials = (firstName[0] + lastName[0]).toUpperCase();
        const dobFormatted = dob.split("-").reverse().slice(0, 2).join(""); // DDMM
        let username = `${initials}@${dobFormatted}`;

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const randomNum = Math.floor(Math.random() * 90 + 10);
            username = `${initials}@${dobFormatted}${randomNum}`;
        }
        return username;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const username = await generateUsername();
            const userCredential = await createUserWithEmailAndPassword(auth, email, "123456");
            const user = userCredential.user;

            await addDoc(collection(db, "users"), {
                firstName,
                lastName,
                email,
                dob,
                avatar,
                username,
                uid: user.uid,
            });

            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center relative bg-gradient-to-b from-sky-100 to-blue-100 overflow-hidden p-4">
            {/* SVG Background */}
            <svg
                className="absolute top-0 left-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
            >
                <path
                    fill="#ffffff"
                    fillOpacity="0.3"
                    d="M0,96L80,106.7C160,117,320,139,480,149.3C640,160,800,160,960,165.3C1120,171,1280,181,1360,186.7L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
                ></path>
            </svg>

            <form
                className="relative bg-white/30 backdrop-blur-lg shadow-lg rounded-xl p-6 w-full max-w-md space-y-4 border border-white/20 transition-all duration-500 z-10"
                onSubmit={handleSignUp}
            >
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Sign Up</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}

                {/* Avatar Selection */}
                <div className="space-y-3">
                    <p className="text-gray-700 font-medium">Choose Male Avatar</p>
                    <div className="flex justify-center gap-4 mb-2">
                        {maleAvatars.map((img) => (
                            <img
                                key={img}
                                src={`/png/${img}`}
                                alt={img}
                                className={`w-14 h-14 rounded-full cursor-pointer border-2 transition-transform duration-300 ease-in-out ${
                                    avatar === img
                                        ? "border-blue-500 scale-110 shadow-lg"
                                        : "border-gray-200 hover:scale-105 hover:shadow-md"
                                }`}
                                onClick={() => setAvatar(img)}
                            />
                        ))}
                    </div>
                    <p className="text-gray-700 font-medium">Choose Female Avatar</p>
                    <div className="flex justify-center gap-4">
                        {femaleAvatars.map((img) => (
                            <img
                                key={img}
                                src={`/avatars/${img}`}
                                alt={img}
                                className={`w-14 h-14 rounded-full cursor-pointer border-2 transition-transform duration-300 ease-in-out ${
                                    avatar === img
                                        ? "border-blue-500 scale-110 shadow-lg"
                                        : "border-gray-200 hover:scale-105 hover:shadow-md"
                                }`}
                                onClick={() => setAvatar(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Input Fields */}
                {["First Name", "Last Name", "Email", "Date of Birth"].map((placeholder, idx) => {
                    const type = placeholder === "Email" ? "email" : placeholder === "Date of Birth" ? "date" : "text";
                    const value = placeholder === "First Name" ? firstName : placeholder === "Last Name" ? lastName : placeholder === "Email" ? email : dob;
                    const setter = placeholder === "First Name" ? setFirstName : placeholder === "Last Name" ? setLastName : placeholder === "Email" ? setEmail : setDob;

                    return (
                        <input
                            key={idx}
                            type={type}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            required
                            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 hover:shadow-md hover:border-blue-400 transition-all duration-300"
                        />
                    );
                })}

                {/* Username (disabled) */}
                <input
                    type="text"
                    placeholder="Username"
                    value={
                        firstName && lastName && dob
                            ? `${(firstName[0] + lastName[0]).toUpperCase()}@${dob
                                  .split("-")
                                  .reverse()
                                  .join("")}`
                            : ""
                    }
                    disabled
                    className="w-full p-3 border bg-gray-200 rounded cursor-not-allowed transition-all duration-300"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded hover:from-blue-500 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Sign Up
                </button>
            </form>

            {/* Decorative Floating SVGs */}
            <svg className="absolute top-10 left-5 w-16 h-16 text-blue-200 opacity-30 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" />
            </svg>
            <svg className="absolute bottom-10 right-5 w-20 h-20 text-sky-200 opacity-25 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="12" />
            </svg>
        </div>
    );
}
