import React, {useEffect} from "react"
import { useStateContext } from "../../Contexts/LogOutContext"
import "./LogOut.css"
import "../Overlay/Overlay.css"
import { useNavigate } from "react-router-dom"
import { useStateContextTheme } from "../../Contexts/ThemeContext"


const LogOut = () =>{

    const navigate = useNavigate();

    const {showOverlayLogOut, setShowOverlayLogOut} = useStateContext();
    const {theme} = useStateContextTheme();

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; 
      }, [theme]);

    const handleCloseOverlay = () =>{
        setShowOverlayLogOut(prevState=>({
            ...prevState,
            overlay:false
        }));
        document.body.classList.remove('body-no-scroll');
    }

    const handleLogOut = () =>{
        setShowOverlayLogOut(prevState=>({
            ...prevState,
            overlay:false
        }));
        document.body.classList.remove('body-no-scroll');
        const token = sessionStorage.getItem('authToken');
        if(token){
            sessionStorage.removeItem('authToken');
        }
        navigate("");
    }

    return(
        <div className="overlay-container">
            <div className={`overlay-content ${theme ? "dark" : ""}`}>
                <h4 className={`logout-header ${theme ? "dark" : ""}`}>Logout</h4>
                <h6 className={`logout-text ${theme ? "dark" : ""}`}>Are you sure to logout?</h6>
                    <div className="logout-btn-container">
                        <button className={`logout-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                            Cancel
                        </button>
                        <button className="logout-ok-btn" onClick={handleLogOut}>
                            Logout
                        </button>
                    </div>
            </div>
        </div>
    )
}

export default LogOut;