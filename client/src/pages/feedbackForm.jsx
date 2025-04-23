import FeedbackImage from "../imgs/feedbackImage.svg";
import { useState, useEffect } from 'react';
import { addFeedbackByApiKey } from "../util/databaseRoutes";
import Cookies from 'js-cookie';

const FeedbackForm = (props) => {
    const [rating, setRating] = useState(5); // Initial rating value
    const [message, setMessage] = useState(""); // Message state
    const [name, setName] = useState(""); // Name state
    const [email, setEmail] = useState(""); // Email state
    const [category, setCategory] = useState(""); // Category state
    const [error, setError] = useState(""); // Error state
    const [success, setSuccess] = useState(""); // Success state
    const [hasRecentSubmission, setHasRecentSubmission] = useState(false);

    const apiKey = props.apiKey;
    const formSettings = props.formSettings;

    useEffect(() => {
        const submissionCookie = Cookies.get('feedback_submitted');
        setHasRecentSubmission(!!submissionCookie);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (hasRecentSubmission) {
            setError("You recently submitted feedback. Try again later.");
            return;
        }

        if (message.length < 50) {
            setError("Message must be at least 50 characters long.");
            return;
        }

        const feedbackObject = { name, email, category, rating, message };

        try {
            await addFeedbackByApiKey(apiKey, feedbackObject);
            Cookies.set('feedback_submitted', 'true', { expires: 1/24 }); // 1 hour expiration
            setHasRecentSubmission(true);
            setSuccess("Feedback submitted successfully!");
            setError("");
            // Reset form fields
            setName("");
            setEmail("");
            setCategory("");
            setRating(5);
            setMessage("");
        } catch (err) {
            setError("Failed to submit feedback. Please try again.");
            setSuccess("");
        }
    };

    const submitButton = (
        <button 
            type="submit" 
            disabled={hasRecentSubmission}
            className={`w-full ${hasRecentSubmission ? 'bg-gray-400' : 'bg-purple-600'} text-white py-3 rounded-md text-xs 2xl:text-sm`}
        >
            {hasRecentSubmission ? 'Recently Submitted' : 'Submit Feedback'}
        </button>
    );

    return (
        <>
            {formSettings.theme === "dark" ? (
                <div className="w-screen h-screen bg-[#2a2a2a] text-white justify-center items-center flex">
                    <form onSubmit={handleSubmit} className="gap-2 bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10 text-white flex flex-row border border-white border-opacity-15">
                        <div className="px-8 py-4 rounded-lg text-white w-full">
                            <h1 className="text-xl 2xl:text-2xl font-bold text-center">{formSettings.formTitle}</h1>
                            <p className="text-center text-white opacity-70 max-w-md mx-auto text-sm 2xl:text-base">{formSettings.formDescription}</p>
                            <div className="mt-2">
                                {error && <p className="text-red-500 text-xs 2xl:text-sm text-center">{error}</p>}
                                {success && <p className="text-green-500 text-xs 2xl:text-sm text-center">{success}</p>}
                                <div>
                                    <label className="text-white text-xs 2xl:text-sm mb-2 block">Name</label>
                                    <input 
                                        name="name" 
                                        type="text" 
                                        required 
                                        className="w-full bg-white bg-opacity-5 text-neutral-300 text-xs 2xl:text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none" 
                                        placeholder="Enter name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="text-white text-xs 2xl:text-sm mb-2 block">Email</label>
                                    <input 
                                        name="email" 
                                        type="text" 
                                        required 
                                        className="w-full bg-white bg-opacity-5 text-neutral-300 text-xs 2xl:text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none" 
                                        placeholder="Enter email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="text-white text-xs 2xl:text-sm block">Category</label>
                                    <select
                                        name="HeadlineAct"
                                        id="HeadlineAct"
                                        required
                                        className="focus:outline-none mt-1.5 px-4 py-3 w-full bg-white bg-opacity-5 rounded-lg border border-white border-opacity-15 text-white text-xs 2xl:text-sm"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="" className="bg-neutral-600">Please select</option>
                                        <option value="Bug" className="bg-neutral-600">Bug</option>
                                        <option value="Design" className="bg-neutral-600">Design</option>
                                        <option value="Feature" className="bg-neutral-600">Feature</option>
                                        <option value="Recommend" className="bg-neutral-600">Recommendation</option>
                                    </select>
                                </div>

                                <div className="mt-3">
                                    <label htmlFor="rating" className="block mb-2 text-xs 2xl:text-sm text-white">Rating: <span className="font-bold">{rating}/10</span></label>
                                    <input 
                                        id="rating" 
                                        type="range" 
                                        min="0" 
                                        max="10" 
                                        value={rating} 
                                        onChange={(e) => setRating(e.target.value)} 
                                        className="w-full h-2 bg-white bg-opacity-10 rounded-lg appearance-none cursor-pointer accent-purple-300">
                                    </input>
                                </div>
                                <div className="mt-2">
                                    <label className="text-white text-xs 2xl:text-sm mb-2 block">Message</label>
                                    <textarea 
                                        name="message" 
                                        rows="4" 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="w-full bg-white bg-opacity-5 text-neutral-300 text-xs 2xl:text-sm border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none" 
                                        placeholder="Enter your message (at least 50 characters)">
                                    </textarea>
                                </div>
                                <div className="mt-2">
                                    {submitButton}
                                </div>
                            </div>
                        </div>
                    </form>
                </div >
            ) : (
                <div className="w-screen h-screen bg-gray-100 text-black justify-center items-center flex">
                    <form onSubmit={handleSubmit} className="gap-2 shadow bg-gray-100 p-4 rounded-lg border border-gray-300 text-black flex flex-row">
                        <div className="px-8 py-4 rounded-lg text-black w-full">
                            <h1 className="text-xl 2xl:text-2xl font-bold text-center">{formSettings.formTitle}</h1>
                            <p className="text-center text-gray-700 max-w-md mx-auto text-sm 2xl:text-base">{formSettings.formDescription}</p>
                            <div className="mt-2">
                                {error && <p className="text-red-500 text-xs 2xl:text-sm text-center">{error}</p>}
                                {success && <p className="text-green-500 text-xs 2xl:text-sm text-center">{success}</p>}
                                <div>
                                    <label className="text-black text-xs 2xl:text-sm mb-2 block">Name</label>
                                    <input 
                                        name="name" 
                                        type="text" 
                                        required 
                                        className="w-full bg-gray-100 text-black text-xs 2xl:text-sm border border-gray-400 px-4 py-3 rounded-md focus:outline-none" 
                                        placeholder="Enter name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="text-black text-xs 2xl:text-sm mb-2 block">Email</label>
                                    <input 
                                        name="email" 
                                        type="text" 
                                        required 
                                        className="w-full bg-gray-100 text-black text-xs 2xl:text-sm border border-gray-400 px-4 py-3 rounded-md focus:outline-none" 
                                        placeholder="Enter email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="text-black text-xs 2xl:text-sm block">Category</label>
                                    <select
                                        name="HeadlineAct"
                                        id="HeadlineAct"
                                        required
                                        className="focus:outline-none mt-1.5 px-4 py-3 w-full bg-gray-100 rounded-lg border border-gray-400 text-black text-xs 2xl:text-sm"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="" className="bg-white">Please select</option>
                                        <option value="Bug" className="bg-white">Bug</option>
                                        <option value="Design" className="bg-white">Design</option>
                                        <option value="Feature" className="bg-white">Feature</option>
                                        <option value="Recommend" className="bg-white">Recommendation</option>
                                    </select>
                                </div>

                                <div className="mt-3">
                                    <label htmlFor="rating" className="block mb-2 text-xs 2xl:text-sm text-black">Rating: <span className="font-bold">{rating}/10</span></label>
                                    <input 
                                        id="rating" 
                                        type="range" 
                                        min="0" 
                                        max="10" 
                                        value={rating} 
                                        onChange={(e) => setRating(e.target.value)} 
                                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-400">
                                    </input>
                                </div>
                                <div className="mt-2">
                                    <label className="text-black text-xs 2xl:text-sm mb-2 block">Message</label>
                                    <textarea 
                                        name="message" 
                                        rows="4" 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="w-full bg-gray-100 text-black text-xs 2xl:text-sm border border-gray-400 px-4 py-3 rounded-md focus:outline-none" 
                                        placeholder="Enter your message (at least 50 characters)">
                                    </textarea>
                                </div>
                                <div className="mt-2">
                                    {submitButton}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default FeedbackForm;
