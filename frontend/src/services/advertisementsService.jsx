import axios from "axios";

export const fetchJobs = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_GET_JOBS_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch jobs");
  }
};

export const createJobs = async (newJob) => {
  const uuid = localStorage.getItem("authToken");
  const response = await axios.post(
    `${import.meta.env.VITE_CREATE_JOBS_URL}`,
    newJob,
    {
      headers: {
        "Content-Type": "application/json",
        uuid: uuid,
      },
    }
  );
  return response.data;
};

export const updateJobs = async (jobId, updatedJob) => {
  const uuid = localStorage.getItem("authToken");
  const url = `${import.meta.env.VITE_PUT_JOBS_URL.replace("{id}", jobId)}`;
  const response = await axios.put(url, updatedJob, {
    headers: {
      "Content-Type": "application/json",
      uuid: uuid,
    },
  });
  return response.data;
};

export const deleteJobs = async (jobId) => {
  const uuid = localStorage.getItem("authToken");
  const response = await axios.delete(
    `${import.meta.env.VITE_DELETE_JOBS_URL}/${jobId}`,
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
  throw new Error("Failed to delete job");
};
