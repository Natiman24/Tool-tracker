import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import "../../Component/Overlay/Overlay.css"
import { updateProfile, fetchEmployeeDetails } from "../../Services/ToolApiService"
import { jwtDecode } from "jwt-decode"
import "../Styles/UserProfilePage.css"

const UserProfilePage = () => {
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState([]);
    const [userId, setUserId] = useState("");
    const [decodedToken, setDecodedToken] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);

    const {theme, setTheme} = useStateContextTheme();

    const fetchUserDetail = async (id) => {
        try{
            const userData = await fetchEmployeeDetails(id);
            if(!userData){
                setSeveritySnackbar("error");
                setMessageSnackbar("Failed to retrieve user data!");
                setOpenSnackbar(true);
            } else {
                setUserDetails(userData || []);
            }
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() =>{
        // decrypt token here to display the profile
        const token = sessionStorage.getItem('authToken');
        if(token) {
            setLoading(true);
            const decoded = jwtDecode(token);
            setDecodedToken(decoded);
            setUserId(decoded.sub);
            fetchUserDetail(decoded.sub);
        } else {
            alert("No token found, login again");
            navigate("");
        }
    }, [])


    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; 
      }, [theme]);
    

    
    const handleThemeChange = (e) => {
        const isChecked = e.target.checked
        setTheme(
            isChecked
        );
        localStorage.setItem('preferredTheme', isChecked ? 'dark' : 'light');
    } 

    const handleNavigateChangePassword = () => {
        navigate("./user-change-password")
    }


    return(
        <>
            <div className={`user-profile-page`}>
                <div className={`user-profile-page-container card ${theme ? "dark" : ""}`}>
                    <div className="user-profile-name-btn-container">
                        <div className="user-profile-header">
                            <h5>Profile</h5>
                        </div>
                        <div className="user-profile-btn-container">
                            <button className={`user-profile-change-password-btn ${theme ? "dark" : ""}`} onClick={handleNavigateChangePassword}>
                                Change Password
                            </button>
                        </div>
                    </div>

                    <div className="user-profile-hl-container">
                            <hr className="user-profile-hl" />
                    </div>

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
                    </div>
                        
                    {!loading && ( // add firstName for conditional rendering
                        <div className="user-profile-detail-container row">
                            <div className={`user-profile-detail-parameter-value col-lg-6 col-md-6`}>
                                <p className={`user-profile-detail-parameter ${theme ? "dark" : ""}`}>
                                    Name:
                                </p>
                                <p className={`user-profile-detail-value ${theme ? "dark" : ""}`}>
                                    {userDetails?.firstName ? userDetails.firstName.charAt(0).toUpperCase() + userDetails.firstName.slice(1) : "" || "None"} {userDetails?.lastName ? userDetails.lastName.charAt(0).toUpperCase() + userDetails.lastName.slice(1) : "" || ""}
                                </p>
                            </div>
                            <div className={`user-profile-detail-parameter-value col-lg-6 col-md-6`}>
                                <p className={`user-profile-detail-parameter ${theme ? "dark" : ""}`}>
                                    Phone Number:
                                </p>
                                <p className={`user-profile-detail-value ${theme ? "dark" : ""}`}>
                                    {userDetails?.phoneNumber || "No Phone Number"}
                                </p>
                            </div><div className={`user-profile-detail-parameter-value col-lg-6 col-md-6`}>
                                <p className={`user-profile-detail-parameter ${theme ? "dark" : ""}`}>
                                    Email:
                                </p>
                                <p className={`user-profile-detail-value ${theme ? "dark" : ""}`}>
                                    {userDetails?.email || "None"}
                                </p>
                            </div>
                            <div className="toggle-btn col-lg-6 col-md-6">
                                <h6>Theme: </h6>
                                <label htmlFor="toogle-btn" className="switch-theme">
                                    <input 
                                        type="checkbox" 
                                        id="toogle-btn" 
                                        checked={theme} 
                                        onChange={handleThemeChange} 
                                        />
                                        
                                    <span className="slider round round-theme"></span>
                                </label>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
            <CustomSnackbar
                severity={severitySnackbar}
                message={messageSnackbar}
                open={openSnackbar}
                onClose={() => setOpenSnackbar(false)}
                time= {snackbarDuration}
            />
        </>
    )
    
}

export default UserProfilePage;