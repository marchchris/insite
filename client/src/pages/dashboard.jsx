import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../config/AuthProvider";
import { useNavigate } from "react-router-dom";

import FeedbackRatioChart from "../components/pieChart";
import FeedbackAmountChart from "../components/barChart";

import Loading from "../components/loadingScreen";

import { getUserById, deleteFeedback, deleteAllFeedback } from "../util/databaseRoutes";

export default function Dashboard() {
    const { user, logOut } = useContext(AuthContext);

    const [currentPage, setCurrentPage] = useState("Overview");
    const [checkAll, setCheckAll] = useState(false);
    const [rowsCheck, setRowsCheck] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [userData, setUserData] = useState({});

    const [feedbackStats, setFeedbackStats] = useState({
        received: 0,
        positive: 0,
        negative: 0,
        resolved: 0,
        receivedChange: 0,
        positiveChange: 0,
        negativeChange: 0,
    });

    const [resolvedNumber, setResolvedNumber] = useState(0);

    const [categoryFilter, setCategoryFilter] = useState([]);
    const [ratingFilter, setRatingFilter] = useState([]);

    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    const returnedData = await getUserById(user.uid);
                    setUserData(returnedData);



                    // Calculate feedback statistics
                    updateFeedbackStats(returnedData.feedbackData);
                    updateResolvedNumber(returnedData);
                    setIsDataLoading(false);

                } catch (error) {
                    console.error("Failed to fetch user data", error);
                }
            };
            fetchData();
        }
    }, [user]);

    const handleCategoryChange = (category) => {
        setCategoryFilter(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleRatingChange = (rating) => {
        setRatingFilter(prev =>
            prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
        );
    };

    const handleRowClick = (data, event) => {
        if (event.target.closest(".dropdown-menu")) return;
        setSelectedFeedback(data);
    };

    // Handle Row Tab View Click
    const handleRowTabViewClick = (data, event) => {
        setSelectedFeedback(data);
    };

    const updateResolvedNumber = (data) => {
        const resolved = data.resolvedAmount;
        setResolvedNumber(resolved);
    };


    const updateFeedbackStats = (feedbackData) => {
        const now = new Date();
        const last7Days = feedbackData.filter(fb => new Date(fb["dateSubmitted"]) >= new Date(now.setDate(now.getDate() - 7)));
        const previous7Days = feedbackData.filter(fb => new Date(fb["dateSubmitted"]) >= new Date(now.setDate(now.getDate() - 7)) && new Date(fb["Date Submitted"]) < new Date(now.setDate(now.getDate() + 7)));

        const received = last7Days.length;
        const positive = last7Days.filter(fb => fb.rating > 7).length;
        const negative = last7Days.filter(fb => fb.rating <= 4).length;

        const previousReceived = previous7Days.length;
        const previousPositive = previous7Days.filter(fb => fb.Rating > 7).length;
        const previousNegative = previous7Days.filter(fb => fb.Rating <= 4).length;

        const receivedChange = ((received - previousReceived) / (previousReceived || 1)) * 100;
        const positiveChange = ((positive - previousPositive) / (previousPositive || 1)) * 100;
        const negativeChange = ((negative - previousNegative) / (previousNegative || 1)) * 100;

        setFeedbackStats({
            received,
            positive,
            negative,
            receivedChange,
            positiveChange,
            negativeChange,
        });
    };

    // Handle Row Tab Delete Click
    const handleRowTabDeleteClick = async (data, event) => {
        event.stopPropagation();
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                // Get index of feedback object in feedbackData list
                const index = userData.feedbackData.findIndex(fb => fb === data);
                // Delete feedback by index
                await deleteFeedback(user.uid, index);
                // Remove feedback from local state
                const updatedFeedbackData = userData.feedbackData.filter((_, i) => i !== index);
                setUserData({ ...userData, feedbackData: updatedFeedbackData });
                // Update feedback statistics
                updateFeedbackStats(updatedFeedbackData);
                // Update resolved number
                setResolvedNumber(resolvedNumber + 1);
            } catch (error) {
                console.error("Failed to delete feedback", error);
            }
        }
    };

    // Handle delete all feedback
    const handleDeleteAllFeedback = async () => {
        if (window.confirm("Are you sure you want to delete all feedback?")) {
            try {
                const feedbackCount = userData.feedbackData.length;
                await deleteAllFeedback(user.uid);
                setUserData({ ...userData, feedbackData: [] });
                updateFeedbackStats([]);
                // Update resolved number
                setResolvedNumber(resolvedNumber + feedbackCount);
            } catch (error) {
                console.error("Failed to delete all feedback", error);
            }
        }
    };

    const handleCloseModal = () => {
        setSelectedFeedback(null);
    };

    const filteredFeedbackData = userData.feedbackData ? userData.feedbackData.filter(data =>
        (categoryFilter.length === 0 || categoryFilter.includes(data.category)) &&
        (ratingFilter.length === 0 || ratingFilter.includes(data.rating <= 4 ? "Negative" : data.rating <= 7 ? "Neutral" : "Positive"))
    ) : [];

    // Handle check All
    const handleCheckAll = () => {
        if (checkAll) {
            // Uncheck all Boxes
            setRowsCheck([]);
        } else {
            // Check all Boxes
            setRowsCheck(userData.feedbackData.map((_, index) => index));
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

    if (isDataLoading) return <Loading />;

    return (
        <div class="flex flex-row w-screen h-screen bg-[#2a2a2a]">
            {/* Left side Navbar */}
            <div class="flex w-64 h-screen border-r border-white border-opacity-15">
                <div className="px-4 py-6 w-full">
                    <a href="/" className="text-white text-2xl font-bold px-4">In<span className="text-purple-300">Site</span></a>


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

                        <a href="#" className="text-white text-sm font-medium mr-8" onClick={() => {
                            logOut()
                                .then(() => {
                                    console.log("User logged out successfully");
                                    navigate("/login"); // Redirect to the login page after logout
                                })
                                .catch((error) => console.error(error));
                        }}>Logout</a>
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
                                            <p className="text-sm text-white">Feedback Received</p>
                                            <p className="text-xs text-white opacity-40">Last 7 Days</p>

                                            <p className="text-2xl font-medium text-white">{feedbackStats.received}</p>
                                        </div>

                                        {feedbackStats.receivedChange >= 0 ? (
                                            <div className="inline-flex gap-2 rounded-sm p-1 bg-green-500 text-green-50 bg-opacity-75">
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

                                                <span className="text-xs font-medium"> {feedbackStats.receivedChange.toFixed(2)}% </span>

                                            </div>
                                        ) : (
                                            <div className="inline-flex gap-2 rounded-sm p-1 bg-red-500 text-red-50 bg-opacity-75">
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
                                                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                                    />
                                                </svg>

                                                <span className="text-xs font-medium"> {feedbackStats.receivedChange.toFixed(2)}% </span>
                                            </div>
                                        )}
                                    </article>

                                    <article
                                        className="flex items-end justify-between rounded-xl bg-white bg-opacity-5 p-10 w-1/4 mx-4"
                                    >
                                        <div>
                                            <p className="text-sm text-white">Positive Feedback</p>
                                            <p className="text-xs text-white opacity-40">Last 7 Days</p>

                                            <p className="text-2xl font-medium text-white">{feedbackStats.positive}</p>
                                        </div>

                                        {feedbackStats.positiveChange >= 0 ? (
                                            <div className="inline-flex gap-2 rounded-sm p-1 bg-green-500 text-green-50 bg-opacity-75">
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

                                                <span className="text-xs font-medium"> {feedbackStats.positiveChange.toFixed(2)}% </span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex gap-2 rounded-sm p-1 bg-red-500 text-red-50 bg-opacity-75">
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
                                                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                                    />
                                                </svg>

                                                <span className="text-xs font-medium"> {feedbackStats.positiveChange.toFixed(2)}% </span>
                                            </div>
                                        )}
                                    </article>

                                    <article
                                        className="flex items-end justify-between rounded-xl bg-white bg-opacity-5 p-10 w-1/4 mx-4"
                                    >
                                        <div>
                                            <p className="text-sm text-white">Negative Feedback</p>
                                            <p className="text-xs text-white opacity-40">Last 7 Days</p>

                                            <p className="text-2xl font-medium text-white">{feedbackStats.negative}</p>
                                        </div>

                                        {feedbackStats.negativeChange >= 0 ? (
                                            <div className="inline-flex gap-2 rounded-sm p-1 bg-green-500 text-green-50 bg-opacity-75">
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

                                                <span className="text-xs font-medium"> {feedbackStats.negativeChange.toFixed(2)}% </span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex gap-2 rounded-sm p-1 bg-red-500 text-red-50 bg-opacity-75">
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
                                                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                                    />
                                                </svg>

                                                <span className="text-xs font-medium"> {feedbackStats.negativeChange.toFixed(2)}% </span>
                                            </div>
                                        )}
                                    </article>

                                    <article
                                        className="flex items-end justify-between rounded-xl bg-white bg-opacity-5 p-10 w-1/4 mx-4"
                                    >
                                        <div>
                                            <p className="text-sm text-white">Feedback Resolved</p>
                                            <p className="text-xs text-white opacity-40">All Time</p>

                                            <p className="text-2xl font-medium text-white">{resolvedNumber}</p>
                                        </div>
                                    </article>


                                </div>

                                <div className="flex w-full h-5/6 justify-center items-center mt-10">

                                    <div className="flex flex-row w-full h-full px-4 gap-8">
                                        <div className="flex flex-col w-4/6 h-full p-8 bg-white bg-opacity-5 rounded-xl">
                                            <h1 className=" text-white font-semibold">Feedback Received Per Month</h1>
                                            <p className="text-xs text-white opacity-40">Last 12 Months</p>
                                            <div className="flex w-full h-full justify-center items-center">
                                                <FeedbackAmountChart feedbackData={userData.feedbackData} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-2/6 h-full rounded-xl bg-white bg-opacity-5 p-8">
                                            <h1 className="text-white font-semibold">Current Feedback Pending</h1>
                                            <p className="text-xs text-white opacity-40">All Time</p>
                                            <div className="flex flex-row w-full h-full justify-center items-center">
                                                <div className="flex w-2/3 h-full justify-center items-center">
                                                    {/* If no feedback is pending, display no pending feedback message */}
                                                    {userData.feedbackData.length === 0 ? (
                                                        <p className="text-white text-opacity-40">No Feedback Pending</p>
                                                    ) : (
                                                        <FeedbackRatioChart feedbackData={userData.feedbackData} />
                                                    )}
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

                                <div className="flex flex w-5/6 h-full m-auto justify-center">
                                    <div className="flex flex-col w-full h-full bg-white bg-opacity-5 rounded-xl p-8">
                                        <p className="text-white text-opacity-40">Results: <span className="text-white font-semibold">{filteredFeedbackData.length}</span></p>

                                        {/* Actions Bar */}
                                        <div className="flex justify-between items-center py-3">
                                            <div>

                                                <div className="flex items-center bg-purple-400 p-2 cursor-pointer rounded-lg" style={{ display: checkAll ? "flex" : "none" }} onClick={handleDeleteAllFeedback}>
                                                    {/* Delete All Button. Only shown if check all box is checked */}
                                                    <p className="text-white text-xs">Delete All</p>

                                                </div>
                                            </div>

                                            <div className="flex flex-row gap-2">
                                                {/* Category filtering menu */}
                                                <div className="relative">
                                                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                                                        <summary
                                                            className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-white"
                                                        >
                                                            <span className="text-sm font-medium"> Category </span>

                                                            <span className="transition group-open:-rotate-180">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="1.5"
                                                                    stroke="currentColor"
                                                                    className="size-4"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                                </svg>
                                                            </span>
                                                        </summary>

                                                        <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                                                            <div
                                                                className="rounded-sm border border-neutral-600 bg-neutral-700"
                                                            >
                                                                <header className="flex items-center justify-between p-4">
                                                                    <span className="text-sm text-white text-gray-200"> {categoryFilter.length} Selected </span>

                                                                    <button
                                                                        type="button"
                                                                        className="text-sm underline underline-offset-4 text-white"
                                                                        onClick={() => setCategoryFilter([])}
                                                                    >
                                                                        Reset
                                                                    </button>
                                                                </header>

                                                                <ul className="space-y-1 border-t border-neutral-600 p-4">
                                                                    {["Bug", "Design", "Feature", "Recommend"].map(category => (
                                                                        <li key={category}>
                                                                            <label className="inline-flex items-center gap-2">
                                                                                <input type="checkbox" className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" checked={categoryFilter.includes(category)} onChange={() => handleCategoryChange(category)} />
                                                                                <span className="text-sm font-medium text-white">{category}</span>
                                                                            </label>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </details>
                                                </div>

                                                {/* Positve, Negative, Neutral Filter */}
                                                <div className="relative">
                                                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                                                        <summary
                                                            className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-white"
                                                        >
                                                            <span className="text-sm font-medium"> Rating </span>

                                                            <span className="transition group-open:-rotate-180">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="1.5"
                                                                    stroke="currentColor"
                                                                    className="size-4"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                                </svg>
                                                            </span>
                                                        </summary>

                                                        <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                                                            <div
                                                                className="rounded-sm border border-neutral-600 bg-neutral-700"
                                                            >
                                                                <header className="flex items-center justify-between p-4">
                                                                    <span className="text-sm text-white text-gray-200 w-24"> {ratingFilter.length} Selected </span>

                                                                    <button
                                                                        type="button"
                                                                        className="text-sm underline underline-offset-4 text-white"
                                                                        onClick={() => setRatingFilter([])}
                                                                    >
                                                                        Reset
                                                                    </button>
                                                                </header>

                                                                <ul className="space-y-1 border-t border-neutral-600 p-4">
                                                                    {["Positive", "Neutral", "Negative"].map(rating => (
                                                                        <li key={rating}>
                                                                            <label className="inline-flex items-center gap-2">
                                                                                <input type="checkbox" className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" checked={ratingFilter.includes(rating)} onChange={() => handleRatingChange(rating)} />
                                                                                <span className="text-sm font-medium text-white">{rating}</span>
                                                                            </label>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </details>
                                                </div>


                                            </div>
                                        </div>

                                        <div className="overflow-x-auto rounded-xl border border-white border-opacity-5 mb-10">
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
                                                        <th className="px-4 py-2 font-medium whitespace-nowrap">Category</th>
                                                        <th className="px-4 py-2 font-medium whitespace-nowrap">Date Submitted</th>
                                                        <th className="px-4 py-2 font-medium whitespace-nowrap">Rating</th>

                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white divide-opacity-15">
                                                    {/* If no feedback is available, display a message */}
                                                    {filteredFeedbackData.length === 0 && (
                                                        <tr>
                                                            <td colSpan="6" className="text-center text-white opacity-40 py-4">You have no current feedback</td>
                                                        </tr>
                                                    )}
                                                    {filteredFeedbackData.map((data, index) => (
                                                        <tr key={index} className=" cursor-pointer hover:bg-white hover:bg-opacity-10 transition duration-300" onClick={(event) => handleRowClick(data, event)}>
                                                            <td className="px-4 py-2">
                                                                <div className="inline-flex items-center">
                                                                    <label className="flex items-center cursor-pointer relative">
                                                                        <input type="checkbox" className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" id={index} checked={rowsCheck.includes(index)} onChange={() => handleCheckRow(index)} />
                                                                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                                            </svg>
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-white font-semibold">{data.name}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">{data.email}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap">
                                                                <div className={`inline-block py-1 px-3 rounded-full font-semibold ${data.category === "Bug" ? "bg-red-500 text-red-100" : data.category === "Design" ? "bg-blue-500 text-blue-100" : data.category === "Feature" ? "bg-green-500 text-green-100" : "bg-yellow-500 text-yellow-100 "}`}>
                                                                    {data.category}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">{data.dateSubmitted}</td>
                                                            <td className="px-4 py-2 whitespace-nowrap text-white">
                                                                <div className="flex flex-col items-center">
                                                                    <span className="text-xs text-white opacity-60">{data.rating}/10</span>
                                                                    <div className="w-full bg-white bg-opacity-10 rounded-full h-2.5">
                                                                        <div className={`h-2.5 rounded-full ${data.rating <= 4 ? "bg-red-500" : data.rating <= 7 ? "bg-yellow-500" : "bg-green-500"} bg-opacity-100`} style={{ width: `${data.rating * 10}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2 whitespace-nowrap">
                                                                <div className="relative dropdown-menu">
                                                                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                                                                        <summary className="text-white opacity-70 cursor-pointer pl-8 hover:opacity-100 transition duration-300 flex items-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                                            </svg>
                                                                        </summary>
                                                                        <ul className="absolute right-0 mt-2 w-32 rounded-md shadow-lg z-10 bg-neutral-600 border border-neutral-500">
                                                                            <li className="block px-4 py-2 text-sm text-white hover:bg-neutral-500 hover:rounded-md cursor-pointer transition duration-300" onClick={(event) => handleRowTabViewClick(data, event)}>View</li>
                                                                            <li className="block px-4 py-2 text-sm text-white hover:bg-neutral-500 hover:rounded-md cursor-pointer transition duration-30" onClick={(event) => handleRowTabDeleteClick(data, event)}>Resolve</li>
                                                                        </ul>
                                                                    </details>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
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
            {selectedFeedback && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-8 w-1/3">

                        <dl className="-my-3 text-sm">
                            <div
                                className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4 even:bg-neutral-700"
                            >
                                <dt className="font-medium text-white">Name</dt>
                                <dd className="sm:col-span-2 text-white opacity-90">{selectedFeedback.name}</dd>
                            </div>

                            <div
                                className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4 even:bg-neutral-700"
                            >
                                <dt className="font-medium text-white">Email</dt>
                                <dd className="sm:col-span-2 text-white opacity-90">{selectedFeedback.email}</dd>
                            </div>
                            <div
                                className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4 even:bg-neutral-700"
                            >
                                <dt className="font-medium text-white">Category</dt>
                                <dd className="sm:col-span-2 text-white opacity-90">{selectedFeedback.category}</dd>
                            </div>
                            <div
                                className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4 even:bg-neutral-700"
                            >
                                <dt className="font-medium text-white">Date</dt>
                                <dd className="sm:col-span-2 text-white opacity-90">{selectedFeedback.dateSubmitted}</dd>
                            </div>
                            <div
                                className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4 even:bg-neutral-700"
                            >
                                <dt className="font-medium text-white">Rating</dt>
                                <dd className="sm:col-span-2 text-white opacity-90">{selectedFeedback.rating}/10</dd>
                            </div>

                            <dt className="font-medium text-white text-center mt-10 mb-2">Message</dt>
                            <div
                                className="p-3 sm:grid-cols-3 sm:gap-4 border border-neutral-600 rounded-md text-center"
                            >
                                <dd className="sm:col-span-2 text-white opacity-90">{selectedFeedback.message}</dd>
                            </div>
                        </dl>

                        <button className="mt-10 bg-red-500 text-white  px-4 py-2 rounded hover:bg-red-600 transition duration-300" onClick={(event) => handleRowTabDeleteClick(selectedFeedback, event)}>Resolve</button>
                        <button className="mt-10 bg-purple-500 text-white mx-2 px-4 py-2 rounded hover:bg-purple-600 transition duration-300" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
