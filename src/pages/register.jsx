import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

import Navbar from "../components/navBar";

export default function Register() {
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const auth = getAuth();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Registered user: ", user);
                sendEmailVerification(user).then(() => {
                    console.log("Verification email sent.");
                }).catch((error) => {
                    console.log("Error sending verification email: ", error);
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Error ocured: ", errorCode, errorMessage);
                setError(errorMessage);
            });

    };

    return (
        <div>
            <Navbar />
            <div class="bg-[#2a2a2a]">
                <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                    <div class="max-w-md w-full">
                        <div class="p-8 rounded-2xl bg-white bg-opacity-5">
                            <h2 class="text-white text-center text-2xl font-bold">Create Account</h2>
                            <form class="mt-8 space-y-4" onSubmit={handleSubmit}>
                                {error && <p class="text-red-500 text-sm">{error}</p>}
                                <div>
                                    <label class="text-white text-sm mb-2 block">Email</label>
                                    <div class="relative flex items-center">
                                        <input name="email" type="text" required class="w-full bg-white bg-opacity-5 text-neutral-300 text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none" placeholder="Enter Email" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <label class="text-white text-sm mb-2 block">Password</label>
                                    <div class="relative flex items-center">
                                        <input name="password" type="password" required class="w-full bg-white bg-opacity-5 text-neutral-300 text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none" placeholder="Enter password" />
                                    </div>
                                </div>

                                <div>
                                    <label class="text-white text-sm mb-2 block">Confirm Password</label>
                                    <div class="relative flex items-center">
                                        <input name="confirmPassword" type="password" required class="w-full bg-white bg-opacity-5 text-neutral-300 text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none" placeholder="Enter password" />
                                    </div>
                                </div>

                                <div class="!mt-8">
                                    <button type="submit" class="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-purple-400 hover:bg-purple-500 focus:outline-none transition duration-300">
                                        Create an account
                                    </button>
                                </div>
                                <p class="text-white text-sm !mt-8 text-center">Already have an account? <a href="/login" class="text-purple-300 hover:underline ml-1 whitespace-nowrap font-semibold ">Login here</a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}