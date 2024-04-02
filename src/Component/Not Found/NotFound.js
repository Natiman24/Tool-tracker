import React, {useEffect} from "react"
import "./NotFound.css"
import "../Overlay/Overlay.css"
import { useStateContextTheme } from "../../Contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const PageNotFound = () =>{

    const navigate = useNavigate();
    const {theme} = useStateContextTheme();

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
      }, [theme]);

    const handlePreviousPage = () => {
        navigate("");
    }
    
    return (

        <div className={`not-found-page ${theme ? "dark" : ""}`}>
            <div className={`not-found-nav ${theme ? "dark" : ""}`}>
                <div onClick={handlePreviousPage} className={`not-found-nav-link ${theme ? "dark" : ""}`}> {/* Later add a condition when there is token in session, if there is, redirect to home page instead of login */}
                    <img src= "/Images/logo.png" className="not-found-img" alt="anteneh tool tracking" />
                    <h4> Anteneh Tool Tracking </h4>
                </div>
            </div>
            <div className="not-found-content">
                <h1 className="not-found-h1"> 404 - Page not found </h1>
                <h4 className="not-found-h2">The page you are looking for doesn't exist!</h4>
            </div>
        </div>
    )
  }
  export default PageNotFound;