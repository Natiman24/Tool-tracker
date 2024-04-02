import React, { useState, useEffect } from "react"
import ClipLoader from "react-spinners/ClipLoader"
import "./Login.css"
import "../Overlay/Overlay.css"
import { useNavigate } from "react-router-dom"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import { handleAllLogin } from "../../Services/LoginService"
import CustomSnackbar from "../Snackbar/Snackbar"
import { jwtDecode } from "jwt-decode"
import { fetchToken } from "../../Services/ToolApiService"

const Login = () =>{

    const navigate = useNavigate();

    const [phoneNumberDisplay, setPhoneNumberDisplay] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [success, setSuccess] = useState(false);
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const {theme} = useStateContextTheme();



    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
        const user = localStorage.getItem('user');
        if(user === "admin"){
            setUserType(true);
        } else {
            setUserType(false);
        }
      }, [theme]);


    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if(!openSnackbar && token){
            const decodedToken = jwtDecode(token);
            if(decodedToken.userType === "OWNER"){

                navigate("/dashboard")
            } else{

                navigate("/user-order");
            }
        }
    }, [success && openSnackbar]) 
    
    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if(token){
            const decodedToken = jwtDecode(token);
            if(decodedToken.userType === "OWNER"){

                navigate("/dashboard");
            } else{
                navigate("/user-order");
            }
        }
    }, [])

    const handlePhoneNumberChange = (e) => {
        setPhoneNumberError("");
        const phoneNum = e.target.value
        const numberOnly = phoneNum.replace(/\D/g, '');
        const phoneNumFinal = numberOnly;
    
        if(phoneNum.length <= 10){
        //   setPhoneNumber("");
          setPhoneNumberDisplay(phoneNumFinal);
      } 
      }
    
    const handleBlurPhoneError = () => {
        if (phoneNumberDisplay.length < 10 && phoneNumberDisplay.length != 0) {
            setPhoneNumberError("Please enter a valid 10-digit number.");
        }else if(phoneNumberDisplay.length == 10){
            // setPhoneNumber(phoneNumberDisplay);
        }
    };
      
    const handleKeyPressPhoneError = (e) => {
        if (e.key === 'Enter') {
        if (phoneNumberDisplay.length < 10 && phoneNumberDisplay.length != 0) {
            // setPhoneNumber("");
            setPhoneNumberError("Please enter a valid 10-digit number.");
        }else if(phoneNumberDisplay.length == 10){
            // setPhoneNumber(phoneNumberDisplay);
            handleLogin(e);
        }
        }
    };

    const validatePhoneNumber = (phoneNum) => {
        const numberOnly = phoneNum.replace(/\D/g, '');
        return numberOnly.length === 10 ? numberOnly : null;
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        if(!phoneNumberDisplay || !password) return;

        const validatedPhoneNumber = validatePhoneNumber(phoneNumberDisplay);

        if (!validatedPhoneNumber) {
            setPhoneNumberError("Please enter a valid 10-digit number.");
            return;
        }

        var user = "";
        userType ? user = "OWNER" : user = "WORKER";

        const loginInfo = {
            password: password,
            userType: user,
            phone: validatedPhoneNumber,    
        }

        try{
            setLoading(true);
            // Check if authToken exists in session storage before removing
            if (sessionStorage.getItem('authToken')) {
                sessionStorage.removeItem('authToken');
            }
            const response = await handleAllLogin(loginInfo);
            const token = response?.token;

            // Check if the token exists before storing it
            if (token) {
                // Store the token in session storage
                sessionStorage.setItem('authToken', token);

                setSeveritySnackbar("success");
                setMessageSnackbar("Login Successful");
                setOpenSnackbar(true);
                setSnackbarDuration(800);
                setSuccess(a => !a);
                
            } else {
                setSeveritySnackbar("error");
                setMessageSnackbar(response?.message || "An error has occured");
                setOpenSnackbar(true);
            }
            
        }   catch (error) {
                setSeveritySnackbar("error");
                setMessageSnackbar(error?.response?.data?.message || "An error occurred, Please try again");
                setOpenSnackbar(true);
        } finally{
            setLoading(false);
        }
    }

    const handleKeyPress = (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            handleLogin(event);
            document.getElementById('phone-num').blur();
            document.getElementById('password').blur();
        }
    }

    const handleChangeUserType = (e) => {
        const isChecked = e.target.checked
        setUserType(isChecked);
        const user = localStorage.getItem('user');
        if(user){
            localStorage.removeItem('user');
        }

        localStorage.setItem('user', isChecked ? "admin" : "worker");
    }

    return(
        <>
        <div className={`login ${theme ? "dark" : ""}`}>
            <div className={`login-page-container card ${theme ? "dark" : ""}`}>
            <div className="left-side-login col-6">
                <div className="logo-name-container">
                    <div className="logo-container-left">
                        <img src="/Images/logo.png" alt="logo" className="login-logo" />
                    </div>
                
                    <div className="logo-name">
                        <h3 className="log-in-name-header">Snabb Construction</h3>
                    </div>
                </div>
            </div>

            <div className="right-side-login col-6">
                <div className="form-container">
                    <div className="logo-container-right">
                        <img src="/Images/logo.png" alt="logo" className="login-logo" />
                    </div>

                    <h4 className="right-log-in-name-header">Snabb Construction</h4>

                    <h4 className="log-in-header">Log in to your account</h4>

                    <p> Welcome back! Please enter your details.</p>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="login-label-input">
                            <label htmlFor="phone-num" className={`login-label ${theme ? "dark" : ""}`}>
                                Phone Number
                            </label>

                            <input 
                                type="text"
                                placeholder="Enter your phone number"
                                className={`login-input login-number-input ${theme ? "dark" : ""}`}                        
                                id="phone-num"
                                value={phoneNumberDisplay}
                                onChange={handlePhoneNumberChange}
                                onBlur={handleBlurPhoneError}
                                onKeyPress={handleKeyPressPhoneError}
                                required 
                                />               
                        </div>

                        <div className="login-label-input login-password-label-input">
                            <label htmlFor="password" className={`login-label ${theme ? "dark" : ""}`}>
                                Password
                            </label>

                            <input 
                                type={`${showPassword ? "text" : "password"}`}
                                placeholder="Enter password"
                                className={`login-input login-password-input ${theme ? "dark" : ""}`}       
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                required
                                />
                            
                            <span className={`login-password-eye ${showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}`} onClick={() => setShowPassword(!showPassword)}></span>
                        </div>

                        <p className="text-danger">{phoneNumberError}</p>

                        <div className="toggle-btn-login">
                            <label htmlFor="toggle-btn" className="toggle-btn-label" onClick={() => setUserType(a=>!a)}> {userType ? "Admin" : "User"}</label>
                            <label htmlFor="toogle-btn" className="switch-login">
                                <input 
                                    type="checkbox" 
                                    id="toogle-btn" 
                                    checked={userType} 
                                    onChange={handleChangeUserType} 
                                    />
                                    
                                <span className={`slider round round-login ${theme ? "dark" : ""}`}></span>
                            </label>
                        </div>

                        <button className="forgot-pass">Forgot password</button>
                        <button className="sign-in-btn" type="submit">Sign in</button>
                    </form>
                    
                </div>
            </div>
            </div>
            <div className={`loading-container-overlay ${loading ? "" : "stop"}`}>
                <ClipLoader color={theme ? "#fff" : "#000"} size={100} />
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

export default Login;