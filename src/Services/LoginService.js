import ApiConstant from "./ApiConstant";
import axios from "axios";

export const handleAllLogin = async (loginInfo) => {
    try{
      const response = await axios.post(ApiConstant.baseApiUser + "/login", loginInfo);
      return response.data;
    } catch (error) {
      if (!error.response) {
            // If it's a network error (no internet connection)
            console.error("Network Error:", error.message);
            return null; // Return null to indicate the error
        }
      throw error;
    }
  }