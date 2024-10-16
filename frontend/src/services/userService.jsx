import axios from "axios";

export const deleteUser = async (userId) => {
  const uuid = localStorage.getItem("authToken");
  const response = await axios.delete(
    `${import.meta.env.VITE_DELETE_USER_URL}/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        uuid: uuid,
      },
    }
  );
  if (response.status === 204) {
    return true;
  }
  throw new Error("Failed to delete user");
};

export const getUser = async () => {
  try {
    const uuid = localStorage.getItem("authToken");
    const response = await axios.get(
      `${import.meta.env.VITE_GET_USER_URL}`,
      {
        headers: {
          "Content-Type": "application/json",
          uuid: uuid,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("User not found");
  } catch (error) {
    throw new Error(
      `An error occurred while searching for user: ${error.message}`
    );
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GET_ALL_USERS_URL}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Failed to fetch users");
  } catch (error) {
    throw new Error(
      `An error occurred while fetching users: ${error.message}`
    );
  }
};
