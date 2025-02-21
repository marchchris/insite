import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../config/AuthProvider";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";

import Navbar from "../components/navBar";
import Loading from "../components/loadingScreen";




const VerifyEmail = () => {
    const { loading, logOut, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resending, setResending] = useState(false);

    const handleLogout = () => {
        logOut().then(() => {
            navigate("/login");
        });
    };


    useEffect(() => {
        const interval = setInterval(() => {
            user.reload().then(() => {
                if (user.emailVerified) {
                    window.location.reload();
                }
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [user, navigate]);

    const handleResendEmail = async () => {
        setResending(true);
        try {
            await sendEmailVerification(user);
        } catch (error) {
            console.error("Error resending email:", error);
        } finally {
            setResending(false);
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div>
            <Navbar />
            <div className="h-screen w-screen bg-[#2a2a2a] flex items-center justify-center">
                <div className="bg-white bg-opacity-5 p-8 rounded-lg border border-white border-opacity-10 text-white w-1/4">
                    <h1 className="text-2xl font-bold text-center">Verify Email</h1>
                    <p className="text-center text-white opacity-70">A verification email has been sent to your email address. Please verify your email address to continue. If you don’t see the email, please check your junk or spam folder.</p>
                    <button 
                        onClick={handleResendEmail} 
                        className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        disabled={resending}
                    >
                        {resending ? "Resending..." : "Resend Email"}
                    </button>
                    <p className="text-center mt-4">
                        <button 
                            onClick={handleLogout} 
                            className="mt-4 w-full text-purple-300 hover:underline bg-transparent border-none cursor-pointer"
                        >
                            Logout
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;