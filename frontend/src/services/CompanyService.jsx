import axios from "axios";

export const createCompanies = async (newCompany) => {
  const uuid = localStorage.getItem("authToken");
  const response = await axios.post(
    `${import.meta.env.VITE_CREATE_COMPANY_URL}`,
    newCompany,
    {
      headers: {
        "Content-Type": "application/json",
        uuid: uuid,
      },
    }
  );
  return response.data;
};

export const fetchCompanies = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_GET_COMPANY_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch companies");
  }
};

export const deleteCompanies = async (companyId) => {
  const uuid = localStorage.getItem("authToken");
  const response = await axios.delete(
    `${import.meta.env.VITE_DELETE_COMPANY_URL}/${companyId}`,
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
  throw new Error("Failed to delete company");
};
