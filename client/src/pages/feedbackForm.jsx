const FeedbackForm = (props) => {
    const formSettings = props.formSettings
    return (
        <div className="h-screen w-screen bg-[#2a2a2a] flex items-center justify-center">
            <h1 className="text-white text-3xl">{formSettings.formTitle}</h1>
        </div>
    );
};

export default FeedbackForm;
