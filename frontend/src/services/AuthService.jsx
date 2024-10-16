import axios from "axios";

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_LOGIN_URL,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Login failed: ",
      error.response?.data?.error || error.message
    );
    throw new Error(error.response?.data?.error || "Failed to login");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_REGISTER_URL,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Registration failed: ",
      error.response?.data?.error || error.message
    );
    throw new Error(error.response?.data?.error || "Registration failed");
  }
};
