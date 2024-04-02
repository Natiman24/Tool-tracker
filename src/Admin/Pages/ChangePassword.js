import React, {useState, useEffect} from "react"
import {useStateContextSideBar} from "../../Contexts/SideBarContext"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/ChangePassword.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextTheme } from "../../Contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { changePassword, fetchEmployeeDetails } from "../../Services/ToolApiService";
import { jwtDecode } from "jwt-decode"

const ChangePasswordPage = () =>{

    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    })

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [flag, setFlag] = useState(false);

    const {theme} = useStateContextTheme();

    const {sideBarExpand} = useStateContextSideBar();

    const expand = sideBarExpand.wide;

    
    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; 
        // decrypt token here for phone number
      }, [theme]);
    
    
    


    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if(token){
            const decode = jwtDecode(token);
            setUserId(decode.sub);
        } else {
            alert("No token found, login again");
            navigate("");
        }
    }, [])

    useEffect(() => {
        if(!openSnackbar && flag){
            document.body.classList.remove("body-no-scroll");
            setShowOverlay(false);
            setLoadingPassword(false);
            navigate("/profile")
        }
    }, [openSnackbar && flag])

    const handleOpenOverlay = () =>{
        if(!oldPassword || !newPassword || !confirmNewPassword){
            setErrorMessage("Fill all the required inputs!")
            return;
        }
        if(newPassword !== confirmNewPassword){
            setErrorMessage("The new passwords do not match!");
            return;
        }
        setShowOverlay(true);
        document.body.classList.add("body-no-scroll");
    }

    const handleCloseOverlay = () =>{
        setShowOverlay(false);
        document.body.classList.remove("body-no-scroll");
    }

    const handleMoveToProfile = () => {
        navigate("/profile");
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setErrorMessage("");
        
        try{
            const response = await fetchEmployeeDetails(userId);
            var phoneNum = response.phoneNumber || ""; // check here
            setUserPhoneNumber(response.phoneNumber || "");    
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            setLoadingPassword(false);
        }     

        const data = {
            phoneNumber: phoneNum, 
            oldPassword: oldPassword,
            newPassword: newPassword
        }
        try{
            setLoadingPassword(true);
            const response = await changePassword(data);
            setSeveritySnackbar("success");
            setMessageSnackbar(response?.data?.message || "");
            setOpenSnackbar(true);
            setSnackbarDuration(1000);
            if(response.status === 200){
                setFlag(true);
            } // else{
            //     setLoadingPassword(false); // new added
            // }
            
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            document.body.classList.remove("body-no-scroll");
            setShowOverlay(false);
            setLoadingPassword(false);
        } 
    }

    const handleKeyPress = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            handleOpenOverlay();
            document.getElementById('confirm-new-password').blur();
        }
    }

    return(
        <>
        <div className={`change-password-page ${expand ? "contract" : ""}`}>
            <div className={`change-password-page-container card  ${theme ? "dark" : ""}`}>
                <h5>Change Password</h5>
                
                <div className="change-password-label-input-container">
                    <label htmlFor="old-password" className={`change-password-label ${theme ? "dark" : ""}`}>
                        Old password:
                    </label>
                    <input
                        type={`${showPassword.old ? "text" : "password"}`}
                        placeholder="Enter old password"
                        id="old-password"
                        className={`change-password-input ${theme ? "dark" : ""}`}
                        onChange={(e) => setOldPassword(e.target.value)}
                        value={oldPassword}
                        autoComplete="new-password"
                        required
                        />
                    <span className={`change-password-eye ${showPassword.old ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}`} onClick={() => setShowPassword(prevState => ({...prevState, old: !showPassword.old}))}></span>
                </div>

                <div className="change-password-label-input-container">
                    <label htmlFor="new-password" className={`change-password-label ${theme ? "dark" : ""}`}>
                        New password:
                    </label>
                    <input
                        type={`${showPassword.new ? "text" : "password"}`}
                        placeholder="Enter new password"
                        id="new-password"
                        className={`change-password-input ${theme ? "dark" : ""}`}
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        autoComplete="off"
                        required
                        />
                    <span className={`change-password-eye ${showPassword.new ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}`} onClick={() => setShowPassword(prevState => ({...prevState, new: !showPassword.new}))}></span>
                </div>

                <div className="change-password-label-input-container">
                    <label htmlFor="confirm-new-password" className={`change-password-label ${theme ? "dark" : ""}`}>
                        Confirm new password:
                    </label>
                    <input
                        type={`${showPassword.confirm ? "text" : "password"}`}
                        placeholder="Confirm password"
                        id="confirm-new-password"
                        className={`change-password-input ${theme ? "dark" : ""}`}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        value={confirmNewPassword}
                        autoComplete="off"
                        onKeyPress={handleKeyPress}
                        required
                        />
                    <span className={`change-password-eye ${showPassword.confirm ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}`} onClick={() => setShowPassword(prevState => ({...prevState, confirm: !showPassword.confirm}))}></span>
                </div>

                <div className="change-password-label-input-container">
                    <p className='change-password-error-message text-danger'>{errorMessage}</p>
                </div>

                <div className="change-password-btn-container">
                    <button className={`discard-change-password-btn ${theme ? "dark" : ""}`} onClick={handleMoveToProfile}>
                        Discard
                    </button>

                    <button className="reset-change-password-btn" onClick={handleOpenOverlay}>
                        Reset Password
                    </button>
                </div>
            </div>
        </div>

        {showOverlay && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className={`cancel-change-password-header ${theme ? "dark" : ""}`}>Change Password</h4>
                        <h6 className={`cancel-change-password-text ${theme ? "dark" : ""}`}>Are you sure to change your password?</h6>
                        <div className="cancel-change-password-btn-container">
                            <button className={`cancel-change-password-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                                No
                            </button>
                            <button className={`cancel-change-password-ok-btn ${theme ? "dark" : ""}`} onClick={handleChangePassword}>
                                Yes 
                            </button>
                        </div>
                        <div className={`loading-container-overlay ${loadingPassword ? "" : "stop"}`}>
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

export default ChangePasswordPage;