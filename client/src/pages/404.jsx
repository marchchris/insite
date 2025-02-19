import { Link } from "react-router-dom";
import Navbar from "../components/navBar";

const NotFound = () => {
    return (
        <div>
            <Navbar />
            <div className="h-screen w-screen bg-[#2a2a2a] flex items-center justify-center">
                    <div class="text-center">
                        <h1 class="text-9xl font-black text-gray-600">404</h1>

                        <p class="text-2xl font-bold tracking-tight text-white sm:text-4xl dark:text-white">
                            Uh-oh!
                        </p>

                        <p class="mt-4 text-white opacity-80">We can't find that page.</p>

                        <a
                            href="/"
                            class="mt-6 inline-block rounded-sm bg-purple-500 px-5 py-3 text-sm font-medium text-white hover:bg-purple-600 focus:ring-3 focus:outline-hidden transition duration-300"
                        >
                            Go Back Home
                        </a>
                    </div>
            </div>
        </div >
    );
};

export default NotFound;
