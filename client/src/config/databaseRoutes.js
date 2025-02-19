export const createUserInDatabase = async (userData) => {
    try {
        const response = await fetch("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Failed to create user in database");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
