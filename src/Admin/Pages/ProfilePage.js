import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import { useStateContextSideBar } from "../../Contexts/SideBarContext"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import "../Styles/ProfilePage.css"
import "../../Component/Overlay/Overlay.css"
import { fetchEmployeeDetails, updateProfile } from "../../Services/ToolApiService"
import { jwtDecode } from "jwt-decode"

const ProfilePage = () => {

    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState([]);
    const [userId, setUserId] = useState("");
    const [userType, setUserType] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newPhoneNumberDisplay, setNewPhoneNumberDisplay] = useState("");
    const [newPhoneNumberError, setNewPhoneNumberError] = useState("");
    const [email, setEmail] = useState("");
    const [editProfileOverlay, setEditProfileOverlay] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [decodedToken, setDecodedToken] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);

    const {sideBarExpand} = useStateContextSideBar();
    const {theme, setTheme} = useStateContextTheme();

    
    const expand = sideBarExpand.wide;

    const handleThemeChange = (e) => {
        const isChecked = e.target.checked
        setTheme(
            isChecked
        );
        localStorage.setItem('preferredTheme', isChecked ? 'dark' : 'light');
    } 

    const fetchUserDetail = async (id) => {
        try{
            const userData = await fetchEmployeeDetails(id);
            if(!userData){
                setSeveritySnackbar("error");
                setMessageSnackbar("Failed to retrieve user data!");
                setOpenSnackbar(true);
            } else {
                setUserDetails(userData || []);
                setFirstName(userData?.firstName || "");
                setLastName(userData?.lastName || "");
                setNewPhoneNumberDisplay(userData?.phoneNumber);
                setEmail(userData?.email);
                setUserType(userData?.userType);
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
    }, [updateFlag])

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; 
    }, [theme]);
    

    const handleNavigateChangePassword = () => {
        navigate("./change-password")
    }

    const handleNewPhoneNumberChange = (e) => {
        setNewPhoneNumberError("");
        const phoneNum = e.target.value
        const numberOnly = phoneNum.replace(/\D/g, '');
        const phoneNumFinal = numberOnly;
    
        if(phoneNum.length <= 10){
          setNewPhoneNumberDisplay(phoneNumFinal);
      } 
      }
    
    const handleBlurPhoneError = () => {
    if (newPhoneNumberDisplay.length < 10 && newPhoneNumberDisplay.length != 0) {
        setNewPhoneNumberError("Please enter a valid 10-digit number.");
        
    }
    };

    
    const handleKeyPressPhoneError = (e) => {
    if (e.key === 'Enter') {
        if (newPhoneNumberDisplay.length < 10 && newPhoneNumberDisplay.length != 0) {
            e.preventDefault();
            setNewPhoneNumberError("Please enter a valid 10-digit number.");
        
        }else if(newPhoneNumberDisplay.length == 10){

                handleUpdateProfile(e);
        }
    }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the default Enter key action
          handleUpdateProfile(e); // Trigger the Update action
          e.target.blur();
        }
    };

    const handleCloseProfileOverlay = (e) => {
        e.preventDefault()
        setEditProfileOverlay(false);
        document.body.classList.remove("body-no-scroll")
    }

    const validatePhoneNumber = (phoneNum) => {
        const numberOnly = phoneNum.replace(/\D/g, '');
        return numberOnly.length === 10 ? numberOnly : null;
    };


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if(!firstName || !newPhoneNumberDisplay || !email) return;

        const validatedPhoneNumber = validatePhoneNumber(newPhoneNumberDisplay);

        if (!validatedPhoneNumber) {
            setNewPhoneNumberError("Please enter a valid 10-digit number.");
            return;
        } 

        const newProfile ={
            id: userId,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: validatedPhoneNumber,
            userType: userType,
            email: email,
        }

        try{
            setLoadingUpdate(true);
            const update = await updateProfile(newProfile);
            setUpdateFlag(prevFlag => !prevFlag);
            setSeveritySnackbar("success");
            setMessageSnackbar(update?.message || "Profile Update Successful");
            setOpenSnackbar(true);
            document.body.classList.remove("body-no-scroll")
            setEditProfileOverlay(false);
            setLoadingUpdate(false);
        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            setLoadingUpdate(false);
        } 
    } 

    const handlEditProfileOverlay = () => {
        setEditProfileOverlay(true);
        document.body.classList.add("body-no-scroll")
    }

    

    return(
        <>
            <div className={`profile-page ${expand ? "contract" : ""}`}>
                <div className={`profile-page-container card ${theme ? "dark" : ""}`}>
                    <div className="profile-name-btn-container">
                        <div className="profile-header">
                            <h5>Profile</h5>
                        </div>
                        <div className="profile-btn-container">
                            <button className={`profile-edit-btn ${theme ? "dark" : ""}`} onClick={handlEditProfileOverlay}>
                                <span className="fa-solid fa-pencil"></span>
                                Edit
                            </button>
                            <button className={`profile-change-password-btn ${theme ? "dark" : ""}`} onClick={handleNavigateChangePassword}>
                                Change Password
                            </button>
                        </div>
                    </div>

                    <div className="profile-hl-container">
                            <hr className="profile-hl" />
                    </div>

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
                    </div>

                    
                    {!loading && ( // add firstName for condition
                        <div className="profile-detail-container row">
                            <div className={`profile-detail-parameter-value col-lg-6 col-md-6`}>
                                <p className={`profile-detail-parameter ${theme ? "dark" : ""}`}>
                                    Name:
                                </p>
                                <p className={`profile-detail-value ${theme ? "dark" : ""}`}>
                                    {userDetails?.firstName ? userDetails?.firstName.charAt(0).toUpperCase() + userDetails?.firstName.slice(1) : "" || "None"} {userDetails?.lastName ? userDetails?.lastName.charAt(0).toUpperCase() + userDetails?.lastName.slice(1) : "" || ""}
                                </p>
                            </div>
                            <div className={`profile-detail-parameter-value col-lg-6 col-md-6`}>
                                <p className={`profile-detail-parameter ${theme ? "dark" : ""}`}>
                                    Phone Number:
                                </p>
                                <p className={`profile-detail-value ${theme ? "dark" : ""}`}>
                                    {userDetails?.phoneNumber || "No Phone Number"}
                                </p>
                            </div>
                            <div className={`profile-detail-parameter-value col-lg-6 col-md-6`}>
                                <p className={`profile-detail-parameter ${theme ? "dark" : ""}`}>
                                    Email:
                                </p>
                                <p className={`profile-detail-value ${theme ? "dark" : ""}`}>
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
            {editProfileOverlay && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h5>Edit Profile</h5>
                        <div className="edit-profile-form-container">
                            <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
                                <div className="edit-profile-label-input">
                                    <label htmlFor="first-name" className={`edit-profile-label ${theme ? "dark" : ""}`}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter First Name"
                                        className={`edit-profile-input ${theme ? "dark" : ""}`}
                                        id="first-name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        required
                                        />
                                </div>
                                <div className="edit-profile-label-input">
                                    <label htmlFor="last-name" className={`edit-profile-label ${theme ? "dark" : ""}`}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Last Name"
                                        className={`edit-profile-input ${theme ? "dark" : ""}`}
                                        id="last-name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        />
                                </div>
                                <div className="edit-profile-label-input edit-phone-label-input">
                                    <label htmlFor="phone-num" className={`edit-profile-label ${theme ? "dark" : ""}`}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Phone Number"
                                        className={`edit-profile-input edit-profile-input-phone-num ${theme ? "dark" : ""}`}
                                        id="phone-num"
                                        value={newPhoneNumberDisplay}
                                        onChange={handleNewPhoneNumberChange}
                                        onBlur={handleBlurPhoneError}
                                        onKeyPress={handleKeyPressPhoneError}
                                        required
                                        />
                                    
                                    {/* <div className="profile-details-country-code">{countryCode}</div> */}
                                </div>
                                <p>{newPhoneNumberError}</p>
                                <div className="edit-profile-label-input">
                                    <label htmlFor="email" className={`edit-profile-label ${theme ? "dark" : ""}`}>
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Email"
                                        className={`edit-profile-input ${theme ? "dark" : ""}`}
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        required
                                        />
                                </div>

                                <div className="edit-profile-btn-container">
                                    <button className={`edit-profile-discard-btn ${theme ? "dark" : ""}`} onClick={handleCloseProfileOverlay}>
                                        Discard
                                    </button>
                                    <button className="edit-profile-update-btn" type="submit">
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className={`loading-container-overlay ${loadingUpdate ? "" : "stop"}`}>
                                <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
                        </div>
                    </div>
                </div>
            )}
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

export default ProfilePage;