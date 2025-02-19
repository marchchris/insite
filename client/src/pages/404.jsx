import { Link } from "react-router-dom";
import Navbar from "../components/navBar";

const NotFound = () => {
    return (
        <div>
            <Navbar />
            <div className="h-screen w-screen bg-[#2a2a2a] flex items-center justify-center">
                <div className="bg-white bg-opacity-5 p-8 rounded-lg border border-white border-opacity-10 text-white w-1/4 text-center">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="text-xl mt-4">Page Not Found</p>
                    <Link 
                        to="/" 
                        className="mt-4 inline-block bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition duration-300"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
