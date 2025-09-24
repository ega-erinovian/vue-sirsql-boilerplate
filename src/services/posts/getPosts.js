import axios from "axios";

export const getPosts = async () => {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
