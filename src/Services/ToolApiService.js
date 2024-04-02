import axios from "axios"
import ApiConstant from "./ApiConstant"
import { jwtDecode } from "jwt-decode";


let token = "";

export const fetchToken = async() => {
  token = sessionStorage.getItem('authToken');
  let decodedToken = jwtDecode(token);

  if (decodedToken && decodedToken.exp * 1000 > Date.now()){

  } else {
    alert("Token has expired, Login again!");
    sessionStorage.removeItem('authToken');
  }

}

export const fetchTools = async (pageNum) => {
    fetchToken();
    try {
      const response = await axios.get(ApiConstant.baseApiTool + `/${pageNum}`, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      });
      if(response.status === 200)
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

export const fetchAllTools = async () => {
    fetchToken();
    try {
      const response = await axios.get(ApiConstant.baseApiTool, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200)
        return response.data;
    } catch (error) {
      if (!error.response) {
            // If it's a network error (no internet connection)
            console.error("Network Error:", error.message);
            return null; // Return null to indicate the error
        }
      throw error;
    }
};
  
export const fetchNumOfPages = async () => {
    fetchToken();
    try {
        const response = await axios.get(ApiConstant.baseApiTool + "/getPages", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        if(response.status === 200)
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


export const fetchCategories = async () => {
  fetchToken();
  try{
    const response = await axios.get(ApiConstant.baseApiCategory, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    if(response.status === 200)
      return response.data
  } catch (error) {
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
  }
    throw error;
  }
}

export const fetchLocations = async () => {
  fetchToken();
  try{
    const response = await axios.get(ApiConstant.baseApiLocation, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    if(response.status === 200)
      return response.data
  } catch (error) {
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
  }
    throw error;
  }
}

export const fetchToolDetails = async (toolId) => {
  fetchToken();
  try{
    const response = await axios.get(ApiConstant.baseApiTool + `/id/${toolId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
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

export const addTools = async (toolData) => {
  fetchToken();
  try{
    const response = await axios.post(ApiConstant.baseApiTool, toolData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200){
      return response;
    }
  } catch (error) {
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
  }
    throw error;
  }
}

export const updateProductDetails = async (newProductDetail) => {
  fetchToken();
  try{
    const newDetail = {
      name: newProductDetail.name,
      category: newProductDetail.category,
      description: newProductDetail.description,
    }
    const response = await axios.put(ApiConstant.baseApiTool + `/${newProductDetail.id}`, newDetail, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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


export const deleteTool = async (toolId) => {
  fetchToken();

  try{
    const response = await axios.delete(ApiConstant.baseApiTool + `/${toolId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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

export const generateReport = async (date) => {
  fetchToken();

  const startDate = date.startDate;
  const endDate = date.endDate;
  try{
    const response = await axios.get(ApiConstant.baseApiTool + '/report', {
      params : {
        "startDate": startDate,
        "endDate": endDate 
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
      return response.data
  } catch (error) {
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
  }
      throw error;
  }
}

export const fetchEmployees = async (pageNum) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiUser + `/workers/${pageNum}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
      return response.data
  } catch (error) {
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
  }
    throw error;
  }
}

export const fetchEmployeeNumOfPages = async () => {
  fetchToken();

  try {
      const response = await axios.get(ApiConstant.baseApiUser + "/getPages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200)
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

export const addNewEmployee = async (newEmployeeData) => {
  fetchToken();

  try{
    const response = await axios.post(ApiConstant.baseApiUser, newEmployeeData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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

export const fetchEmployeeDetails = async (employeeId) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiUser + `/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
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

export const updateEmployeeDetails = async (newEmployeeDetail) => {
  fetchToken();

  try{
    const newDetail = {
      firstName : newEmployeeDetail.firstName,
      lastName: newEmployeeDetail.lastName,
      phoneNumber : newEmployeeDetail.phoneNumber,
      email: newEmployeeDetail.email,
    }
    const response = await axios.put(ApiConstant.baseApiUser + `/${newEmployeeDetail.id}`, newDetail, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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

export const deleteEmployee = async (employeeId) => {
  fetchToken();
  
  try{
    const response = await axios.delete(ApiConstant.baseApiUser + `/${employeeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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

export const fetchCategoriesByPage = async (pageNum) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiCategory + `/page/${pageNum}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
      return response.data
  } catch (error) {
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
  }
    throw error;
  }
}

export const fetchCategoryNumOfPages = async () => {
  fetchToken();

  try {
      const response = await axios.get(ApiConstant.baseApiCategory + "/getPages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200)
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

export const addNewCategory = async (category) => {
  fetchToken();

  try{
    const response = await axios.post(ApiConstant.baseApiCategory, category, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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

export const deleteCategory= async (categoryId) => {
  fetchToken();

  try{
    const response = await axios.delete(ApiConstant.baseApiCategory + `/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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
export const fetchSiteByPage = async (pageNum) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiLocation + `/page/${pageNum}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
      return response.data
  } catch (error) {
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
  }
    throw error;
  }
}

export const fetchSiteNumOfPages = async () => {
  fetchToken();

  try {
      const response = await axios.get(ApiConstant.baseApiLocation + "/getPages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200)
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

export const addNewSite = async (site) => {
  fetchToken();

  try{
    const response = await axios.post(ApiConstant.baseApiLocation, site, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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

export const deleteSite= async (categoryId) => {
  fetchToken();

  try{
    const response = await axios.delete(ApiConstant.baseApiLocation + `/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.status === 200)
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

export const fetchCategoryDetails = async (categoryId) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiCategory + `/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
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

export const fetchProductByCategoryInfo = async (category) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiTool + `/category/info/${category}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
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

export const fetchProductByCategory = async (id, pageNum) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiTool + `/category/${id}/${pageNum}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
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

export const fetchAllProductByCategory = async (category) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiTool + `/category/${category}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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

export const fetchSiteDetails = async (siteId) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiLocation + `/${siteId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
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

export const fetchProductBySiteInfo = async (site) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiTool + `/location/info/${site}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
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

export const fetchProductBySite = async (id, pageNum) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiTool + `/location/${id}/${pageNum}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if(response.status === 200)
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

export const fetchTotalInformation = async () => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiGeneral + "/all-quantity", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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

export const handleSearching = async (searchValue) => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiGeneral + `/search/${searchValue}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
  }
  
    throw error;
  }
}

export const fetchNotification = async () => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiNotification, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const fetchArchivedNotification = async () => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiNotification + "/archives", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const fetchUserNotification = async () => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiNotification + `/type/USER`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const fetchPasswordNotification = async () => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiNotification + `/type/PASSWORD`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const fetchOrderNotification = async () => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiNotification + `/type/MOVEMENT`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}



export const archiveNotification = async (id) => {
  fetchToken();

  try{
    const response = await axios.post(ApiConstant.baseApiNotification + `/archive/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const deleteNotification = async (id) => {
  fetchToken();

  try{
    const response = await axios.delete(ApiConstant.baseApiNotification + `/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const fetchOrders = async () => {
  fetchToken();

  try{
    const response = await axios.get(ApiConstant.baseApiTool + "/order", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const addOrder = async (tool, destination) => {
  fetchToken();
  
  try{
    const response = await axios.post(`${ApiConstant.baseApiTool}/${tool}/move-owner?newLocation=${destination}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const completeOrder = async (tool, user) => {
  fetchToken();

  try{
    const response = await axios.post(ApiConstant.baseApiTool + `/${tool}/move-worker?worker=${user}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  } catch (error){
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const cancelOrder = async (toolId) => {
  fetchToken();

  try{
    const response = await axios.post(ApiConstant.baseApiTool + `/${toolId}/cancel`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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

export const updateProfile = async (newProfile) => {
  fetchToken();

  const {id: id, ...profile} = newProfile;
  try{
    const response = await axios.put(ApiConstant.baseApiUser + `/${id}`, profile, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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

export const changePassword = async (data) => {
  fetchToken();

  const phone = data.phoneNumber;
  const oldPassword = data.oldPassword;
  const newPassword = data.newPassword;

  try{
    const response = await axios.put(ApiConstant.baseApiUser + `/change-password/${phone}/${oldPassword}/${newPassword}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response;
  } catch (error) {
    if (!error.response) {
      // If it's a network error (no internet connection)
      console.error("Network Error:", error.message);
      return null; // Return null to indicate the error
    }
  
    throw error;
  }
}

export const fetchFilterPageNum = async (metrics) => {
  fetchToken();

  try{
    const { initialDate, finalDate, category, location } = metrics;
    const categoryList = category.join(',');
    const locationList = location.join(',');

    const response = await axios.get(ApiConstant.baseApiTool + `/filter/getPages`, {
      params: {
        "initialDate": initialDate,
        "finalDate": finalDate,
        "category": categoryList,
        "location": locationList
      },
      headers : {
        Authorization: `Bearer ${token}`
      }
    });
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

export const filterTools = async (metrics, pageNum) => {
  fetchToken();

  try{
    const { initialDate, finalDate, category, location } = metrics;
    const categoryList = category.join(',');
    const locationList = location.join(',');

    const response = await axios.get(ApiConstant.baseApiTool + `/filter/${pageNum}`, {
      params: {
        "initialDate": initialDate,
        "finalDate": finalDate,
        "category": categoryList,
        "location": locationList
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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