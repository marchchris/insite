import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import FeedbackForm from "../pages/feedbackForm";
import Loading from "../components/loadingScreen";
import NotFound from "../pages/404";
import { getUserSettingsByApiKey } from "./databaseRoutes";

const ApiPrivateRoute = ({ children }) => {
    const { apiKey } = useParams();
    const [loading, setLoading] = useState(true);
    const [userExists, setUserExists] = useState(false);

    const [formSettings, setFormSettings] = useState({});

    useEffect(() => {
        const checkUser = async () => {
            try {
                const userFormSettings = await getUserSettingsByApiKey(apiKey);
                if (userFormSettings) {
                    setFormSettings(userFormSettings);
                    setUserExists(true);
                }
            } catch (error) {
                console.error("Error fetching user by API key:", error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [apiKey]);

    if (loading) {
        return <Loading />;
    }

    return userExists ? <FeedbackForm formSettings={formSettings} apiKey={apiKey}/> : <NotFound />;
};


export default ApiPrivateRoute;