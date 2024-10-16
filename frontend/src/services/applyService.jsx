import axios from "axios";

export const createApplyWithUser = async (data) => {
  const uuid = localStorage.getItem("authToken");
  let body;

  if (uuid) {
    body = { job_id: data.job_id };
  } else {
    body = {
      job_id: data.job_id,
      first_name: data.first_name,
      surname: data.surname,
      phone: data.phone,
      email: data.email,
    };
  }

  const response = await axios.post(
    `${import.meta.env.VITE_APPLY_JOB_URL}`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        uuid: uuid || '',
      },
    }
  );
  return response.data;
};

export const getAllApplications = async () => {
  try {
    const uuid = localStorage.getItem("authToken");

    if (!uuid) {
      throw new Error("UUID not provided");
    }

    const response = await axios.get(
      `${import.meta.env.VITE_GET_ALL_APPLY_URL}`,
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

    throw new Error("Failed to fetch applications");
  } catch (error) {
    throw new Error(`An error occurred while fetching applications: ${error.message}`);
  }
};

export const getAllApplicationsNoUser = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GET_ALL_APPLY_NO_USER_URL}`,
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Failed to fetch applications");
  } catch (error) {
    throw new Error(`An error occurred while fetching applications: ${error.message}`);
  }
};

