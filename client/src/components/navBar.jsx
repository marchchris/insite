import { useContext } from "react";
import { AuthContext } from "../config/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut().then(() => {
            navigate("/login");
        });
    };

    return (
        <nav class="bg-[#2a2a2a] fixed top-0 left-0 w-full z-10">
            <div class="w-full mx-auto px-8 border-b border-white border-opacity-15 bg-white bg-opacity-5">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <a href="/" className="text-white text-2xl font-bold">In<span className="text-purple-300">Site</span></a>
                    </div>
                    <div class="flex items-center gap-8">
                        <a href="/" class="text-white hover:text-purple-400">Home</a>
                        {user ? (
                            <button onClick={handleLogout} class="text-white hover:text-purple-400">Logout</button>
                        ) : (
                            <a href="/login" class="text-white hover:text-purple-400">Login</a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}