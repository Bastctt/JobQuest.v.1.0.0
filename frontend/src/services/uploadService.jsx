import axios from 'axios';

export const uploadCV = async ({ uuid, cvFile }) => {
  const formData = new FormData();
  formData.append('cv', cvFile);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_UPLOAD_CV_URL}`,
      formData,
      {
        headers: {
          'uuid': uuid,
        },
      }
    );

    if (response.status === 204) {
      return "CV uploaded successfully";
    }

    throw new Error("Failed to upload");
  } catch (error) {
    throw new Error(`An error occurred while uploading: ${error.message}`);
  }
};

export const viewCV = async () => {
  const uuid = localStorage.getItem("authToken");

  if (!uuid) {
    throw new Error("UUID not provided");
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_VIEW_CV_URL}`,
      {
        headers: {
          uuid: uuid,
        },
        responseType: 'arraybuffer'
      }
    );

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    return url;
  } catch (error) {
    throw new Error(`An error occurred while viewing: ${error.message}`);
  }
}