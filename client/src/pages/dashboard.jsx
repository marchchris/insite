import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../config/AuthProvider";
import { useNavigate } from "react-router-dom";

import FeedbackRatioChart from "../components/pieChart";
import FeedbackAmountChart from "../components/barChart";

import FeedbackImage from "../imgs/feedbackImage.svg";

import Loading from "../components/loadingScreen";

import { getUserById, deleteFeedback, deleteAllFeedback, updateFormSettings, deleteUserAccount } from "../util/databaseRoutes";

import CodeBlock from "../components/codeBlock";

export default function Dashboard() {
    const { user, logOut } = useContext(AuthContext);

    const [currentPage, setCurrentPage] = useState("Overview");
    const [checkAll, setCheckAll] = useState(false);
    const [rowsCheck, setRowsCheck] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [userData, setUserData] = useState({});

    const [code, setCode] = useState(``);

    const [rating, setRating] = useState(5);

    const submitButton = (
        <button
            type="button"
            className={`w-full bg-purple-600 text-white py-3 rounded-md`}
        >
            Submit Feedback
        </button>
    );

    const dateOptions = {
        year: 'numeric',
        month: 'long', // Use "short" for abbreviations like Feb
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // 12-hour clock format
    };

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

    const [formSettings, setFormSettings] = useState({
        theme: "dark",
        formTitle: "",
        formDescription: ""
    });
    const [originalSettings, setOriginalSettings] = useState(null);
    const [isEdited, setIsEdited] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

    const [deleteAccountEmail, setDeleteAccountEmail] = useState("");
    const [deleteError, setDeleteError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    const returnedData = await getUserById(user.uid);
                    setUserData(returnedData);
                    setFormSettings(returnedData.formSettings);
                    setOriginalSettings(returnedData.formSettings);
                    setCode(`<!-- Add this button to your website -->
<a 
    href="${window.location.origin}/form/${returnedData.apiKey}"
    target="_blank"
    style="
        display: inline-block;
        padding: 8px 16px;
        background-color: #9333ea;
        color: white;
        border-radius: 50px;
        text-decoration: none;
        font-family: sans-serif;
        transition: background-color 0.3s"
    onmouseover="this.style.backgroundColor='#7e22ce'"
    onmouseout="this.style.backgroundColor='#9333ea'"
>
    Feedback
</a>`);



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
        if (event.target.closest(".dropdown-menu") || event.target.closest("input[type='checkbox']")) return;
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

    const handleResolveAllSelected = async () => {
        if (window.confirm("Are you sure you want to resolve all selected feedback?")) {
            try {
                const updatedFeedbackData = userData.feedbackData.filter((_, index) => !rowsCheck.includes(index));
                await Promise.all(rowsCheck.map(index => deleteFeedback(user.uid, index)));
                setUserData({ ...userData, feedbackData: updatedFeedbackData });
                updateFeedbackStats(updatedFeedbackData);
                setResolvedNumber(resolvedNumber + rowsCheck.length);
                setRowsCheck([]);
                setCheckAll(false);
            } catch (error) {
                console.error("Failed to resolve selected feedback", error);
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
            setCheckAll(false);
        } else {
            // Check all Boxes
            if (userData.feedbackData.length > 0) {

                setRowsCheck(userData.feedbackData.map((_, index) => index));
                setCheckAll(true);
            }
        }

    };

    // Handle individual row check
    const handleCheckRow = (id) => {
        if (rowsCheck.includes(id)) {
            const updatedRowsCheck = rowsCheck.filter(rowId => rowId !== id);
            setRowsCheck(updatedRowsCheck);
            if (updatedRowsCheck.length < userData.feedbackData.length) {
                setCheckAll(false);
            }
        } else {
            const updatedRowsCheck = [...rowsCheck, id];
            setRowsCheck(updatedRowsCheck);
            if (updatedRowsCheck.length === userData.feedbackData.length) {
                setCheckAll(true);
            } else {
                setCheckAll(false);

            }
        }
    };

    if (isDataLoading) return <Loading />;

    return (
        <div className="flex flex-row w-screen h-screen bg-[#2a2a2a] overflow-hidden">
            {/* Left side Navbar */}
            <div className="flex w-64 h-screen border-r border-white border-opacity-15">
                <div className="px-4 py-6 w-full">
                    <a href="/" className="text-white text-2xl font-bold px-4">In<span className="text-purple-300">Site</span></a>


                    <ul className="mt-6 space-y-1">
                        <li>
                            <details className="group [&_summary::-webkit-details-marker]:shown" open>
                                <summary
                                    className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 transition duration-200"
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
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 transition duration-200 ${currentPage === "Overview" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage("Overview");
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                </svg>
                                                Overview
                                            </div>
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 transition duration-200 ${currentPage === "Feedback" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage("Feedback");
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                                                </svg>
                                                Feedback
                                            </div>
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 transition duration-200 ${currentPage === "API Key" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage("API Key");
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                </svg>
                                                API Key
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details className="group [&_summary::-webkit-details-marker]:hidden" open>
                                <summary
                                    className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 transition duration-200"
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
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 transition duration-200 ${currentPage === "Customisation" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage("Customisation");
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                                                </svg>
                                                Customisation
                                            </div>
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#"
                                            className={`block rounded-xl px-4 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 transition duration-200 ${currentPage === "Account" ? "bg-white bg-opacity-10" : ""}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage("Account");
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                </svg>
                                                Account
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col w-full overflow-hidden">
                {/* Header */}
                <div className="flex h-16 bg-[#2a2a2a] border-b border-white border-opacity-15 justify-between items-center px-8">
                    <div className="text-white flex items-center">
                        <p className="mx-2 opacity-40">{["Overview", "Feedback", "API Key"].includes(currentPage) ? "Dashboards" : "Settings"}</p>
                        <p className="mx-2 opacity-40">/</p>
                        <p className="mx-2">{currentPage}</p>
                    </div>

                    <div className="flex items-center gap-1 text-white">
                        <a href="#" className="text-white text-sm font-medium" onClick={() => {
                            logOut()
                                .then(() => {
                                    console.log("User logged out successfully");
                                    navigate("/login");
                                })
                                .catch((error) => console.error(error));
                        }}>Logout</a>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                            <path fill-rule="evenodd" d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z" clip-rule="evenodd" />
                        </svg>


                    </div>
                </div>
                {/* Main Area */}
                <div className="flex-1 overflow-y-auto bg-[#2a2a2a] p-8">
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

                                            <div className="flex items-center bg-red-500 hover:bg-red-600 transition duration-300 p-2 cursor-pointer rounded-lg" style={{ display: checkAll ? "flex" : "none" }} onClick={handleDeleteAllFeedback}>
                                                {/* Delete All Button. Only shown if check all box is checked */}
                                                <p className="text-white text-xs">Resolve All</p>

                                            </div>
                                            <div className="flex items-center bg-red-500 hover:bg-red-600 transition duration-300 p-2 cursor-pointer rounded-lg" style={{ display: !checkAll && rowsCheck.length > 0 ? "flex" : "none" }} onClick={handleResolveAllSelected}>
                                                {/* Resolve All Selected Button. Only shown if one or more rows are selected and not all rows are selected */}
                                                <p className="text-white text-xs">Resolve All Selected</p>
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
                                                                            <label class="flex items-center cursor-pointer relative">
                                                                                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" checked={categoryFilter.includes(category)} onChange={() => handleCategoryChange(category)} />
                                                                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                                                    </svg>
                                                                                </span>
                                                                            </label>
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
                                                                        <label className="inline-flex items-center gap-2 relative">
                                                                            <label class="flex items-center cursor-pointer relative">
                                                                                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" checked={ratingFilter.includes(rating)} onChange={() => handleRatingChange(rating)} />
                                                                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
                                                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                                                                                    </svg>
                                                                                </span>
                                                                            </label>
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
                                                                <input type="checkbox" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-neutral-600 checked:bg-neutral-800 checked:border-neutral-800" id="checkAll" onClick={handleCheckAll} checked={checkAll} />
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
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 011.414 0l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
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
                                                        <td className="px-4 py-2 whitespace-nowrap text-white opacity-60">
                                                            {new Date(data.dateSubmitted).toLocaleString('en-GB', dateOptions)}
                                                        </td>
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
                                                                    <ul className="fixed mt-2 w-32 rounded-md shadow-lg z-50 bg-neutral-600 border border-neutral-500">
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

                    {currentPage === "API Key" && (
                        <div className="flex flex-col w-full h-full bg-[#2a2a2a]">
                            <div className="flex m-auto">
                                <div className="flex flex-col w-full bg-white bg-opacity-5 rounded-xl p-8 justify-center items-center">
                                    <h2 className="text-white text-xl font-bold">Your Public Key</h2>
                                    <p className="text-white opacity-60 mt-4 text-sm">Use this API key to integrate the feedback form into your website.</p>

                                    <div className="inline flex items-center gap-1 w-full">
                                        <div className="rounded-lg p-4 font-mono text-sm w-full flex justify-center items-center">
                                            <pre className="text-white overflow-x-auto w-full bg-neutral-700 p-4 rounded-lg text-center">
                                                {userData.apiKey}
                                            </pre>
                                        </div>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(userData.apiKey)}
                                            className="px-4 w-1/2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copy API Key
                                        </button>
                                    </div>

                                    <div className="mt-4 w-full flex flex-col justify-center items-center">
                                        <h3 className="text-white text-lg font-medium mb-2 text-center">Implementation Example</h3>
                                        <div className="rounded-lg p-4 font-mono text-sm w-full">
                                            {/* Code block for example implementation of button that uses api key in link */}
                                            <CodeBlock language='html' code={code} />;
                                        </div>

                                    </div>

                                    <div className="w-full flex flex-col justify-center items-center">
                                        <h3 className="text-white text-lg font-medium mb-2 text-center">See Your Form Live</h3>
                                        <p className="text-white opacity-60 text-sm mb-4 font-medium">
                                            Your form is now live at: <a href={`${window.location.origin}/form/${userData.apiKey}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                                                {window.location.origin}/form/{userData.apiKey}
                                            </a>
                                        </p>
                                        {/* Button that onClick goes to form */}
                                        <button
                                            onClick={() => window.open(`${window.location.origin}/form/${userData.apiKey}`, '_blank')}
                                            className="px-4 w-1/2 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 flex items-center justify-center gap-2"
                                        >
                                            Go To Form
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === "Customisation" && (
                        <div className="flex flex-col w-full h-full bg-[#2a2a2a]">
                            <div className="flex w-full h-fit m-auto gap-2 justify-center">
                                {/* Settings Panel */}
                                <div className="flex flex-col w-1/3 h-fit bg-white bg-opacity-5 rounded-xl p-8">
                                    <h2 className="text-white text-xl font-bold mb-6">Form Customisation</h2>

                                    {saveStatus.message && (
                                        <div className={`mb-4 p-4 rounded ${saveStatus.type === 'success' ? 'bg-green-500/20 text-green-200' :
                                            'bg-red-500/20 text-red-200'
                                            }`}>
                                            {saveStatus.message}
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <label className="text-white">Theme</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-white opacity-70">
                                                    {formSettings.theme === "dark" ? "Dark Mode" : "Light Mode"}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        setFormSettings(prev => ({
                                                            ...prev,
                                                            theme: prev.theme === "dark" ? "light" : "dark"
                                                        }));
                                                        setIsEdited(true);
                                                    }}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formSettings.theme === "dark" ? "bg-purple-600" : "bg-neutral-600"
                                                        }`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formSettings.theme === "dark" ? "translate-x-6" : "translate-x-1"
                                                        }`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-white mb-2">Form Title</label>
                                            <input
                                                type="text"
                                                value={formSettings.formTitle}
                                                onChange={(e) => {
                                                    setFormSettings(prev => ({
                                                        ...prev,
                                                        formTitle: e.target.value
                                                    }));
                                                    setIsEdited(true);
                                                }}
                                                className="w-full p-2 rounded bg-neutral-700 text-white border border-neutral-600 focus:border-purple-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white mb-2">Form Description</label>
                                            <textarea
                                                value={formSettings.formDescription}
                                                onChange={(e) => {
                                                    setFormSettings(prev => ({
                                                        ...prev,
                                                        formDescription: e.target.value
                                                    }));
                                                    setIsEdited(true);
                                                }}
                                                rows="4"
                                                className="w-full p-2 rounded bg-neutral-700 text-white border border-neutral-600 focus:border-purple-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await updateFormSettings(user.uid, formSettings);
                                                        setOriginalSettings(formSettings);
                                                        setIsEdited(false);
                                                        setSaveStatus({
                                                            type: 'success',
                                                            message: 'Settings updated successfully'
                                                        });
                                                        setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
                                                    } catch (error) {
                                                        console.error('Failed to update settings:', error);
                                                        setSaveStatus({
                                                            type: 'error',
                                                            message: 'Failed to update settings. Please try again.'
                                                        });
                                                    }
                                                }}
                                                disabled={!isEdited}
                                                className={`px-4 py-2 rounded ${isEdited
                                                    ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                                                    : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                                                    } transition-colors`}
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Panel */}
                                <div className="flex flex-col bg-white bg-opacity-5 rounded-xl p-8 w-fit" style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
                                    <h2 className="text-white text-2xl font-bold mb-6">Preview</h2>
                                    {formSettings.theme === "dark" ? (
                                        <form className="bg-white bg-opacity-5 p-8 rounded-lg border text-white flex border border-white border-opacity-15">
                                            <div className="p-8 rounded-lg text-white">
                                                <h1 className="text-2xl font-bold text-center">{formSettings.formTitle}</h1>
                                                <p className="text-center text-white opacity-70">{formSettings.formDescription}</p>
                                                <div className="mt-4">
                                                    <div>
                                                        <label class="text-white text-sm mb-2 block">Name</label>
                                                        <input
                                                            name="name"
                                                            type="text"
                                                            required
                                                            class="w-full bg-white bg-opacity-5 text-neutral-300 text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none"
                                                            placeholder="Enter name"
                                                        />
                                                    </div>

                                                    <div className="mt-2">
                                                        <label class="text-white text-sm mb-2 block">Email</label>
                                                        <input
                                                            name="email"
                                                            type="text"
                                                            required
                                                            class="w-full bg-white bg-opacity-5 text-neutral-300 text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none"
                                                            placeholder="Enter email"
                                                        />
                                                    </div>

                                                    <div className="mt-8">
                                                        <label class="text-white text-sm block">Category</label>
                                                        <select
                                                            name="HeadlineAct"
                                                            id="HeadlineAct"
                                                            required
                                                            className="focus:outline-none mt-1.5 px-4 py-3 w-full bg-white bg-opacity-5 rounded-lg border border-white border-opacity-15 text-white sm:text-sm"
                                                        >
                                                            <option value="" className="bg-neutral-600">Please select</option>
                                                            <option value="Bug" className="bg-neutral-600">Bug</option>
                                                            <option value="Design" className="bg-neutral-600">Design</option>
                                                            <option value="Feature" className="bg-neutral-600">Feature</option>
                                                            <option value="Recommend" className="bg-neutral-600">Recommendation</option>
                                                        </select>
                                                    </div>

                                                    <div className="mt-4">
                                                        <label for="rating" class="block mb-2 text-sm text-white">Rating: <span className="font-bold">{rating}/10</span></label>
                                                        <input
                                                            id="rating"
                                                            type="range"
                                                            min="0"
                                                            max="10"
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                            class="w-full h-2 bg-white bg-opacity-10 rounded-lg appearance-none cursor-pointer accent-purple-300">
                                                        </input>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label class="text-white text-sm mb-2 block">Message</label>
                                                        <textarea
                                                            name="message"
                                                            rows="4"
                                                            required
                                                            class="w-full bg-white bg-opacity-5 text-neutral-300 text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none"
                                                            placeholder="Enter your message (at least 50 characters)">
                                                        </textarea>
                                                    </div>
                                                    <div className="mt-4">
                                                        {submitButton}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    ) : (
                                        <form className="gap-2 shadow bg-gray-100 p-8 rounded-lg border border-gray-300 text-black flex flex-row">
                                            <div className="p-8 rounded-lg text-black">
                                                <h1 className="text-2xl font-bold text-center">{formSettings.formTitle}</h1>
                                                <p className="text-center text-gray-700">{formSettings.formDescription}</p>
                                                <div className="mt-4">
                                                    <div>
                                                        <label class="text-black text-sm mb-2 block">Name</label>
                                                        <input
                                                            name="name"
                                                            type="text"
                                                            required
                                                            class="w-full bg-gray-100 text-black text-sm border border-gray-400 px-4 py-3 rounded-md focus:outline-none"
                                                            placeholder="Enter name"
                                                        />
                                                    </div>

                                                    <div className="mt-2">
                                                        <label class="text-black text-sm mb-2 block">Email</label>
                                                        <input
                                                            name="email"
                                                            type="text"
                                                            required
                                                            class="w-full bg-gray-100 text-black text-sm border border-gray-400 px-4 py-3 rounded-md focus:outline-none"
                                                            placeholder="Enter email"
                                                        />
                                                    </div>

                                                    <div className="mt-8">
                                                        <label class="text-black text-sm block">Category</label>
                                                        <select
                                                            name="HeadlineAct"
                                                            id="HeadlineAct"
                                                            required
                                                            className="focus:outline-none mt-1.5 px-4 py-3 w-full bg-gray-100 rounded-lg border border-gray-400 text-black sm:text-sm"
                                                        >
                                                            <option value="" className="bg-white">Please select</option>
                                                            <option value="Bug" className="bg-white">Bug</option>
                                                            <option value="Design" className="bg-white">Design</option>
                                                            <option value="Feature" className="bg-white">Feature</option>
                                                            <option value="Recommend" className="bg-white">Recommendation</option>
                                                        </select>
                                                    </div>

                                                    <div className="mt-4">
                                                        <label for="rating" class="block mb-2 text-sm text-black">Rating: <span className="font-bold">{rating}/10</span></label>
                                                        <input
                                                            id="rating"
                                                            type="range"
                                                            min="0"
                                                            max="10"
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                            class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-400">
                                                        </input>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label class="text-black text-sm mb-2 block">Message</label>
                                                        <textarea
                                                            name="message"
                                                            rows="4"
                                                            required
                                                            class="w-full bg-gray-100 text-black text-sm border border-gray-400 px-4 py-3 rounded-md focus:outline-none"
                                                            placeholder="Enter your message (at least 50 characters)">
                                                        </textarea>
                                                    </div>
                                                    <div className="mt-4">
                                                        {submitButton}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === "Account" && (
                        <div className="flex flex-col w-full h-full bg-[#2a2a2a]">
                            <div className="flex w-2/5 m-auto">
                                <div className="flex flex-col w-full bg-white bg-opacity-5 rounded-xl p-8">
                                    <h2 className="text-white text-xl font-bold mb-6">Account Information</h2>

                                    <div className="space-y-4">
                                        <div className="flex flex-col space-y-1">
                                            <label className="text-white opacity-60">Email</label>
                                            <p className="text-white">{user.email}</p>
                                        </div>

                                        <div className="flex flex-col space-y-1">
                                            <label className="text-white opacity-60">Account Created</label>
                                            <p className="text-white">
                                                {new Date(user.metadata.creationTime).toLocaleString('en-GB', dateOptions)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col space-y-1">
                                            <label className="text-white opacity-60">Last Sign In</label>
                                            <p className="text-white">
                                                {new Date(user.metadata.lastSignInTime).toLocaleString('en-GB', dateOptions)}
                                            </p>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-white border-opacity-15">
                                            <h3 className="text-red-500 text-lg font-semibold mb-4">Danger Zone</h3>

                                            <details className="group">
                                                <summary className="flex cursor-pointer items-center justify-between rounded-lg bg-red-500 bg-opacity-10 p-4 text-red-500">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">Delete Account</span>
                                                    </div>

                                                    <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                </summary>

                                                <div className="mt-4 px-4 pb-4">
                                                    <p className="text-sm text-white opacity-60 mb-4">
                                                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                                                    </p>

                                                    <div className="space-y-4">
                                                        <input
                                                            type="email"
                                                            placeholder="Type your email to confirm"
                                                            className="w-full p-2 rounded bg-neutral-700 text-white border border-neutral-600 focus:border-red-500 focus:outline-none"
                                                            value={deleteAccountEmail}
                                                            onChange={(e) => setDeleteAccountEmail(e.target.value)}
                                                        />

                                                        {deleteError && (
                                                            <p className="text-sm text-red-500">{deleteError}</p>
                                                        )}

                                                        <button
                                                            onClick={async () => {
                                                                if (deleteAccountEmail === user.email) {
                                                                    if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
                                                                        try {
                                                                            await deleteUserAccount(user.uid); // Delete from database first
                                                                            await user.delete(); // Delete from Firebase Auth
                                                                            await logOut(); // Log out the user
                                                                            window.location.reload(false); // Reload the page
                                                                        } catch (error) {
                                                                            // If the error is about requiring recent login
                                                                            if (error.code === 'auth/requires-recent-login') {
                                                                                alert("For security purposes, please log out and log back in before deleting your account.");
                                                                                await logOut();
                                                                                window.location.reload(false); // Reload the page
                                                                            } else {
                                                                                setDeleteError("Failed to delete account. Please try again.");
                                                                                console.error("Account deletion error:", error);
                                                                            }
                                                                        }
                                                                    }
                                                                } else {
                                                                    setDeleteError("Email doesn't match");
                                                                }
                                                            }}
                                                            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300"
                                                        >
                                                            Delete Account
                                                        </button>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                                <dd className="sm:col-span-2 text-white opacity-90">{new Date(selectedFeedback.dateSubmitted).toLocaleString('en-GB', dateOptions)}</dd>
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
