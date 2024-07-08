import axios from "axios";
const fetcher = async (url, config) => {
  try {
    const response = await axios({
      url,
      withCredentials: true,
      baseURL: import.meta.env.VITE_BACKEND_URL,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.log(error?.response?.data);
    throw error?.response?.data;
  }
};

export default fetcher;
