
// Function to retrieve user by userID
export async function getUserById(userID) {
    console.log("Fetching user data for ", userID);
  const response = await fetch(`/users/${userID}`);
  if (!response.ok) {
    throw new Error("User not found");
  }
  return await response.json();
}

// Function to add feedback object to feedbackData of a user
export async function addFeedback(userID, feedbackObject) {
  const response = await fetch(`/users/${userID}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedbackObject),
  });

  if (!response.ok) {
    throw new Error("Failed to add feedback");
  }
  return await response.json();
}
