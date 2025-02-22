import LandingImage from "./images/fadedLandingImage.png";

export default function Landing() {
    return (
        <div className="w-screen w-screen justify-center items-center flex flex-col">
            {/* Landing Nav bar */}
            <div className="w-screen h-20 border-b border-white border-opacity-20 flex justify-center items-center z-10">
                <div className="w-1/2 flex justify-between items-center cursor-pointer">
                    {/* Logo */}
                    <div>
                        <a className="text-xl font-bold">In<span className="text-purple-300">Site</span></a>
                    </div>
                    {/* Center Links */}
                    <div className="justify-center items-center flex space-x-10">
                        <a className="opacity-60 hover:opacity-100 transition duration 300">Features</a>
                        <a className="opacity-60 hover:opacity-100 transition duration 300">Getting Started</a>
                        <a className="opacity-60 hover:opacity-100 transition duration 300">Dashboard</a>
                    </div>
                    {/* Login and Sign up buttons */}
                    <div>
                        <a className="opacity-60 hover:opacity-100 transition duration 300">Log in</a>
                        <a className="transition duration 300 py-2 px-4 mx-4 bg-purple-400 rounded-lg text-black hover:bg-purple-500 text-[#fcfcff]">Sign up</a>
                    </div>
                </div>

            </div>

            {/* Landing Content */}
            <div className="h-screen">
                <div className="w-screen h-1/3 flex justify-center items-center mt-10">
                    <div className="w-1/2 flex flex-col">
                        <div className="z-10">
                            <h1 className="text-6xl font-medium text-white">Effortless <span className="text-purple-300">Feedback</span></h1>
                            <h1 className="text-6xl font-medium text-white"><span className="text-purple-300">Powerful</span> Insights</h1>
                            <p className="mt-4 w-2/3 opacity-70">Collect, manage, and act on user feedback. Empower your website or service with a simple, elegant feedback system designed to help you grow.</p>
                            <div className="mt-4 flex space-x-6 items-center cursor-pointer">
                                <button className="transition duration-300 py-2 px-4 bg-purple-400 rounded-lg text-black hover:bg-purple-500 text-[#fcfcff] font-medium">Get Started</button>
                                <a className="opacity-70 font-medium hover:opacity-100 transition duration-300 flex items-center">
                                    Go To Dashboard
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 ml-1">
                                        <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <img src={LandingImage} alt="Landing Image" className="mt-10 absolute top-0 left-[400px]" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}