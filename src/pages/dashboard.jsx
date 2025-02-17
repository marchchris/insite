import { useState } from "react";
import FeedbackRatioChart from "./pieChart";

export default function Dashboard() {
    const [currentPage, setCurrentPage] = useState("Overview");

    return (
        <div class="flex flex-row w-screen h-screen bg-[#2a2a2a]">
            {/* Left side Navbar */}
            <div class="flex w-64 h-screen border-r border-white border-opacity-15">
                <div className="px-4 py-6 w-full">
                    <h1 className="text-white text-2xl font-bold px-4">In<span className="text-purple-300">Site</span></h1>

                    <ul className="mt-6 space-y-1">
                        <li>
                            <details className="group [&_summary::-webkit-details-marker]:shown">
                                <summary
                                    className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-2 text-white hover:bg-white hover:bg-opacity-10"
                                >
                                    <span className="text-sm font-medium"> Dashboards </span>

                                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-5"
                                            viewBox="0 0 20 20"
                                            fill="#FFFFFF33"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                </summary>

                                <ul className="mt-2 space-y-1 px-4">
                                    <li>
                                        <a
                                            href="#"
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 ${currentPage === "Overview" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={() => setCurrentPage("Overview")}
                                        >
                                            Overview
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 ${currentPage === "Feedback" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={() => setCurrentPage("Feedback")}
                                        >
                                            Feedback
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 ${currentPage === "API Key" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={() => setCurrentPage("API Key")}
                                        >
                                            API Key
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details className="group [&_summary::-webkit-details-marker]:hidden">
                                <summary
                                    className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-2 text-white hover:bg-white hover:bg-opacity-10"
                                >
                                    <span className="text-sm font-medium"> Settings </span>

                                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-5"
                                            viewBox="0 0 20 20"
                                            fill="#FFFFFF33"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                </summary>

                                <ul className="mt-2 space-y-1 px-4">
                                    <li>
                                        <a
                                            href="#"
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 ${currentPage === "Customisation" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={() => setCurrentPage("Customisation")}
                                        >
                                            Customisation
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 ${currentPage === "Account" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={() => setCurrentPage("Account")}
                                        >
                                            Account
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex w-full h-screen">
                <div className="flex flex-col w-full h-screen">
                    {/* Header */}
                    <div className="flex flex-1 p-8 h-screen bg-[#2a2a2a] border-b border-white border-opacity-15 justify-between">
                        <div className="w-1/6 text-white flex items-center justify-left ml-8">
                            <p className="mx-2 opacity-40">{["Overview", "Feedback", "API Key"].includes(currentPage) ? "Dashboards" : "Settings"}</p>
                            <p className="mx-2 opacity-40">/</p>
                            <p className="mx-2">{currentPage}</p>
                        </div>
                    </div>
                    {/* Main Area */}
                    <div className="flex h-full h-screen bg-[#2a2a2a] p-8">
                        {/* Main Content Area */}
                        <div className="flex flex-col w-full h-full bg-[#2a2a2a]">
                            <div className="flex w-full h-1/6 justify-center items-center">
                                <article
                                    className="flex items-end justify-between rounded-xl bg-white bg-opacity-5 p-8 py-10 w-1/4 mx-4"
                                >
                                    <div>
                                        <p className="text-sm text-white">Feedback Recieved</p>

                                        <p className="text-2xl font-medium text-white">$240.94</p>
                                    </div>

                                    <div
                                        className="inline-flex gap-2 rounded-sm p-1 bg-green-500 text-green-50 bg-opacity-75"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>

                                        <span className="text-xs font-medium"> 67.81% </span>
                                    </div>
                                </article>

                                <article
                                    className="flex items-end justify-between rounded-xl bg-white bg-opacity-5 p-10 w-1/4 mx-4"
                                >
                                    <div>
                                        <p className="text-sm text-white">Positve Feedback</p>

                                        <p className="text-2xl font-medium text-white">$240.94</p>
                                    </div>

                                    <div
                                        className="inline-flex gap-2 rounded-sm p-1 bg-green-500 text-green-50 bg-opacity-75"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>

                                        <span className="text-xs font-medium"> 67.81% </span>
                                    </div>
                                </article>

                                <article
                                    className="flex items-end justify-between rounded-xl bg-white bg-opacity-5 p-10 w-1/4 mx-4"
                                >
                                    <div>
                                        <p className="text-sm text-white">Resolved Feedback</p>

                                        <p className="text-2xl font-medium text-white">$240.94</p>
                                    </div>

                                    <div
                                        className="inline-flex gap-2 rounded-sm p-1 bg-green-500 text-green-50 bg-opacity-75"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>

                                        <span className="text-xs font-medium"> 67.81% </span>
                                    </div>
                                </article>

                                <article
                                    className="flex items-end justify-between rounded-xl bg-white bg-opacity-5 p-10 w-1/4 mx-4"
                                >
                                    <div>
                                        <p className="text-sm text-white">All-Time Feedback Recieved</p>

                                        <p className="text-2xl font-medium text-white">$240.94</p>
                                    </div>
                                </article>


                            </div>

                            <div className="flex w-full h-5/6 justify-center items-center mt-10">

                                <div className="flex flex-row w-full h-full px-4 gap-8">
                                    <div className="flex flex-col w-4/6 h-full p-8 bg-white bg-opacity-5 rounded-xl">
                                        <h1 className="text-2xl text-white font-semibold">Feedback Recieved Per Month</h1>
                                        <div className="flex w-full h-full justify-center items-center">

                                        </div>
                                    </div>
                                    <div className="flex flex-col w-2/6 h-full rounded-xl bg-white bg-opacity-5 p-8">
                                        <h1 className="text-2xl text-white font-semibold">Current Feedback Pending</h1>
                                        <div className="flex flex-row w-full h-full justify-center items-center">
                                            <div className="flex w-2/3 h-full justify-center items-center">
                                                <FeedbackRatioChart />
                                            </div>
                                            <div className="flex w-1/3 h-full justify-center items-center">
                                                <ul className="space-y-3">
                                                    <li className="flex items-center">
                                                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                                        <span className="text-white">Positive</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                                        <span className="text-white">Negative</span>
                                                    </li>
                                                    <li className="flex items-center">
                                                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                                                        <span className="text-white">Neutral</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
