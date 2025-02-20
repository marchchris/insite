// Function to retrieve user by userID
export async function getUserById(userID) {
  console.log("Fetching user data for ", userID);
  const response = await fetch(`/users/${userID}`);
  if (!response.ok) {
    throw new Error("User not found");
  }
  return await response.json();
}

// Function to retrieve user by API key
export async function getUserSettingsByApiKey(apiKey) {
  console.log("fetching key ", apiKey);
  const response = await fetch(`/userSettings/${apiKey}`);
  if (!response.ok) {
    throw new Error("User not found");
  }
  return await response.json();
}

// Function to create a new user in the database
export async function createUserInDatabase(userData) {
  const response = await fetch(`/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user in database");
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

// Function to add feedback object to feedbackData of a user by API key
export async function addFeedbackByApiKey(apiKey, feedbackObject) {
  const response = await fetch(`/users/feedback/${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...feedbackObject, message: feedbackObject.message }),
  });

  if (!response.ok) {
    throw new Error("Failed to add feedback");
  }
  return await response.json();
}

// Function to delete feedback object from feedbackData of a user by index
export async function deleteFeedback(userID, index) {
  const response = await fetch(`/users/${userID}/feedback/${index}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete feedback");
  }
  return await response.json();
}

// Function to delete all feedbackData of a user
export async function deleteAllFeedback(userID) {
  const response = await fetch(`/users/${userID}/feedback`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete all feedback");
  }
  return await response.json();
}

// Function to update form settings of a user
export async function updateFormSettings(userID, formSettings) {
  const response = await fetch(`/users/${userID}/formSettings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formSettings),
  });

  if (!response.ok) {
    throw new Error("Failed to update form settings");
  }
  return await response.json();
}
