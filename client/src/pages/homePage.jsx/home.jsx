import Landing from "./landing";
import DashboardSection from "./dashboardSection";


import "./home.css"

const HomePage = () => {
    return (
        <>
            <Landing/>
            
            <div id = "dashboardSection">
            <DashboardSection/>
            </div>

            <div id = "gettingStarted">
            <footer>
                <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-24">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold sm:text-5xl">
                            Want To Get Started?
                        </h2>

                        <p className="mx-auto mt-4 max-w-sm opacity-70">
                            Simply create an account to start collecting feedback and insights for your website.
                        </p>

                        <a
                            href="/register"
                            className="mt-8 inline-block rounded-full bg-purple-400 px-12 py-3 text-sm font-medium text-white hover:bg-purple-500 hover:text-white focus:ring-3 focus:outline-hidden transition duration-300"
                        >
                            Sign up
                        </a>
                    </div>

                    <div
                        className="mt-16 pt-8 sm:flex sm:items-center sm:justify-between lg:mt-24 dark:border-gray-800"
                    >
                        <ul className="flex flex-wrap justify-center gap-4 text-xs lg:justify-end">
                            <li>
                                <a href="https://marchchris.github.io/" className="opacity-70 transition hover:opacity-100 transition duration-300">
                                    Created By: Chris Marchand
                                </a>
                            </li>


                        </ul>

                        <ul className="mt-8 flex justify-center gap-6 sm:mt-0 lg:justify-end">


                            <li>
                                <a
                                    href="https://github.com/marchchris"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="opacity-70 transition hover:opacity-100"
                                >
                                    <span className="sr-only">GitHub</span>

                                    <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://marchchris.github.io/"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="opacity-70 transition hover:opacity-75 hover:opacity-100 transition duration-300"
                                >
                                    <span className="sr-only">Portfolio</span>

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-6">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clip-rule="evenodd" />
                                    </svg>

                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
            </div>
        </>
    );
};

export default HomePage;