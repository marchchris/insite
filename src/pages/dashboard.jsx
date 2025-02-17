import { useState } from "react";
import FeedbackRatioChart from "../components/pieChart";
import FeedbackAmountChart from "../components/barChart";

export default function Dashboard() {
    const [currentPage, setCurrentPage] = useState("Overview");
    const [checkAll, setCheckAll] = useState(false);
    const [rowsCheck, setRowsCheck] = useState([]);

    // Handle check All
    const handleCheckAll = () => {
        if (checkAll) {
            // Uncheck all Boxes
            setRowsCheck([]);
        } else {
            // Check all Boxes
            setRowsCheck([1, 2]); // Assuming 1 and 2 are the IDs of the rows to be checked
        }
        setCheckAll(!checkAll);
    };

    // Handle individual row check
    const handleCheckRow = (id) => {
        if (rowsCheck.includes(id)) {
            setRowsCheck(rowsCheck.filter(rowId => rowId !== id));
        } else {
            setRowsCheck([...rowsCheck, id]);
        }
    };

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
                        {/* Overview Page */}
                        {currentPage === "Overview" && (

                            <div className="flex flex-col w-full h-full bg-[#2a2a2a]">
                                <div className="flex w-full h-1/6 justify-center items-center">
                                    <article
                                        className="flex items-end justify-between rounded-xl bg-white bg-opacity-5 p-8 py-10 w-1/4 mx-4"
                                    >
                                        <div>
                                            <p className="text-sm text-white">Feedback Recieved</p>
                                            <p className="text-xs text-white opacity-40">Last 7 Days</p>

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
                                            <p className="text-xs text-white opacity-40">Last 7 Days</p>

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
                                            <p className="text-xs text-white opacity-40">Last 7 Days</p>

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
                                            <p className="text-sm text-white">Feedback Recieved</p>
                                            <p className="text-xs text-white opacity-40">All Time</p>

                                            <p className="text-2xl font-medium text-white">$240.94</p>
                                        </div>
                                    </article>


                                </div>

                                <div className="flex w-full h-5/6 justify-center items-center mt-10">

                                    <div className="flex flex-row w-full h-full px-4 gap-8">
                                        <div className="flex flex-col w-4/6 h-full p-8 bg-white bg-opacity-5 rounded-xl">
                                            <h1 className=" text-white font-semibold">Feedback Recieved Per Month</h1>
                                            <p className="text-xs text-white opacity-40">Last 12 Months</p>
                                            <div className="flex w-full h-full justify-center items-center">
                                                <FeedbackAmountChart />
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-2/6 h-full rounded-xl bg-white bg-opacity-5 p-8">
                                            <h1 className="text-white font-semibold">Current Feedback Pending</h1>
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
                        )}


                        {/* Feedback Page */}
                        {currentPage === "Feedback" && (

                            <div className="flex flex-col w-full h-full bg-[#2a2a2a] ">

                                <div className="flex flex w-1/2 h-full m-auto justify-center">
                                    <div className="flex flex-col w-full h-full bg-white bg-opacity-5 rounded-xl p-8">

                                        {/* Actions Bar */}
                                        <div className="flex justify-between items-center py-3">
                                            <div>

                                                <div className="flex items-center bg-purple-400 p-2 cursor-pointer rounded-lg" style={{ display: checkAll ? "flex" : "none" }}>
                                                    {/* Delete All Button. Only shown if check all box is checked */}
                                                    <p className="text-white text-xs">Delete All</p>

                                                </div>
                                            </div>

                                            <div className="flex flex-row gap-2">
                                                <div class="relative">
                                                    <select
                                                        class="w-full bg-white bg-opacity-10 text-white text-sm rounded-lg pl-3 pr-2 py-2 mr-8 transition duration-300 appearance-none cursor-pointer focus:outline-none">
                                                        <option value="all" className="bg-neutral-700">All Ratings</option>
                                                        <option value="bug" className="bg-neutral-700">Postive</option>
                                                        <option value="design" className="bg-neutral-700">Negative</option>
                                                        <option value="feature" className="bg-neutral-700">Neutral</option>
                                                    </select>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="h-5 w-5 ml-1 absolute top-2.5 right-3.5 text-white"
                                                        viewBox="0 0 24 24"
                                                        fill="#fff">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>

                                                <div class="relative">
                                                    <select
                                                        class="w-full bg-white bg-opacity-10 text-white text-sm rounded-lg pl-3 pr-2 py-2 transition duration-300 appearance-none cursor-pointer focus:outline-none">
                                                        <option value="all" className="bg-neutral-700">All Categories</option>
                                                        <option value="bug" className="bg-neutral-700">Bugs</option>
                                                        <option value="design" className="bg-neutral-700">Design</option>
                                                        <option value="feature" className="bg-neutral-700">Features</option>
                                                        <option value="recommend" className="bg-neutral-700">Recommendations</option>
                                                    </select>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-white"
                                                        viewBox="0 0 24 24"
                                                        fill="#fff">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="overflow-x-auto rounded-xl border border-white border-opacity-5">
                                            <table className="min-w-full divide-y-2 divide-white divide-opacity-15 text-sm">
                                                <thead className="text-left text-white">
                                                    <tr>
                                                        <th className="px-4 py-2">
                                                            <div class="inline-flex items-center">
                                                                <label class="flex items-center cursor-pointer relative">
                                                                    <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" id="checkAll" onClick={handleCheckAll} />
                                                                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                                        </svg>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-2 font-medium whitespace-nowrap">Name</th>
                                                        <th className="px-4 py-2 font-medium whitespace-nowrap">Email</th>
                                                        <th className="px-4 py-2 font-medium whitespace-nowrap">Rating</th>
                                                        <th className="px-4 py-2 font-medium whitespace-nowrap">Category</th>

                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white divide-opacity-15">
                                                    <tr>
                                                        <td className="px-4 py-2">
                                                            <div class="inline-flex items-center">
                                                                <label class="flex items-center cursor-pointer relative">
                                                                    <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" id="1" checked={rowsCheck.includes(1)} onChange={() => handleCheckRow(1)} />
                                                                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                                        </svg>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">John Doe</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">John@gmail.com</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">6/10</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">Design</td>
                                                        <td class="px-4 py-2 whitespace-nowrap">
                                                            <a
                                                                href="#"
                                                                class="inline-block rounded-sm bg-purple-400 rounded-md px-5 py-2 text-xs font-medium text-white hover:bg-purple-500 transition duration-300"
                                                            >
                                                                View
                                                            </a>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className="px-4 py-2">
                                                            <div class="inline-flex items-center">
                                                                <label class="flex items-center cursor-pointer relative">
                                                                    <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" id="2" checked={rowsCheck.includes(2)} onChange={() => handleCheckRow(2)} />
                                                                    <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                                        </svg>
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">Jane Doe</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">Jane@gmail.com</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">8/10</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">Development</td>
                                                        <td class="px-4 py-2 whitespace-nowrap">
                                                            <a
                                                                href="#"
                                                                class="inline-block rounded-sm bg-purple-400 rounded-md px-5 py-2 text-xs font-medium text-white hover:bg-purple-500 transition duration-300"
                                                            >
                                                                View
                                                            </a>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
