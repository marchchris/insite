import LandingImage from "./images/fadedLandingImage.png";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../../config/AuthProvider";


export default function Landing(props) {
    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        
        <div className="w-screen w-screen justify-center items-center flex flex-col">
            {/* Landing Nav bar */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-screen h-20 border-b border-white border-opacity-20 flex justify-center items-center z-10"
            >
                <div className="2xl:w-1/2 xl:w-2/3 flex justify-between items-center cursor-pointer">
                    {/* Logo */}
                    <div>
                        <a className="text-xl font-bold" href='/'>In<span className="text-purple-300">Site</span></a>
                    </div>
                    {/* Center Links */}
                    <div className="justify-center items-center flex space-x-10">
                        <a className="opacity-60 hover:opacity-100 transition duration 300" href="#dashboardSection">Features</a>
                        <a className="opacity-60 hover:opacity-100 transition duration 300" href="#gettingStarted">Getting Started</a>
                        <a className="opacity-60 hover:opacity-100 transition duration 300" href="/dashboard">Dashboard</a>
                    </div>
                    {/* Login and Sign up buttons */}
                    {props.user ? (
                        <div>
                            <a className="opacity-60 hover:opacity-100 transition duration 300" onClick={() => {
                                logOut()
                                    .then(() => {
                                        console.log("User logged out successfully");
                                        navigate("/");
                                    })
                                    .catch((error) => console.error(error));
                            }}>Log out</a>
                        </div>
                    ) : (
                        <div>
                            <a className="opacity-60 hover:opacity-100 transition duration 300" href="/login">Log in</a>
                            <a className="transition duration 300 py-2 px-4 mx-4 bg-purple-400 rounded-lg text-white hover:bg-purple-500 text-[#fcfcff]" href="/register">Sign up</a>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Landing Content */}
            <div className="h-screen">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-screen h-1/3 flex justify-center items-center 2xl:mt-10 xl:mt-20"
                >
                    <div className="w-1/2 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="z-10"
                        >
                            <h1 className="text-6xl font-medium text-white">Effortless <span className="text-purple-300">Feedback</span></h1>
                            <h1 className="text-6xl font-medium text-white"><span className="text-purple-300">Powerful</span> Insights</h1>
                            <p className="mt-4 w-2/3 opacity-70">Collect, manage, and act on user feedback. Empower your website or service with a simple, elegant feedback system designed to help you grow.</p>
                            <div className="mt-4 flex space-x-6 items-center cursor-pointer">
                                <button className="transition duration-300 py-2 px-4 bg-purple-400 rounded-lg text-white hover:bg-purple-500 text-[#fcfcff] font-medium">Get Started</button>
                                <a className="opacity-70 font-medium hover:opacity-100 transition duration-300 flex items-center" href="/dashboard">
                                    Go To Dashboard
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 ml-1">
                                        <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className="mt-10 absolute 2xl:top-0 2xl:left-[400px] xl:left-[300px] lg:left-[200px] md:left-[100px] sm:left-[50px]"
                        >
                            <img src={LandingImage} alt="Landing Image" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}