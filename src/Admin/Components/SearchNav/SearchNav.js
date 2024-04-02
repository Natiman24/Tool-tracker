import React, {useState, useEffect} from "react"
import { useNavigate, useLocation } from "react-router-dom";
import {FaBars} from "react-icons/fa"
import "./SearchNav.css"
import "../../../Component/Overlay/Overlay.css"
import { useStateContextSideBar } from "../../../Contexts/SideBarContext";
import { useStateContextTheme } from "../../../Contexts/ThemeContext";


const SearchNav = () =>{

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');

    const [searchValue, setSearchValue] = useState("");
    const [searchValueIsEmpty, setSearchValueIsEmpty] = useState(true);

    const {theme} = useStateContextTheme(); // false is light and true is dark
    const {sideBarExpand, setSideBarExpand, displaySideBar, setDisplaySideBar} = useStateContextSideBar();

    const display = displaySideBar.display;
    
    useEffect(() => {
      document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
    }, [theme]);

    useEffect(() => {
      if(searchQuery){
        setSearchValue(searchQuery || "");
        setSearchValueIsEmpty(false);
      }
    }, [])


    const handleChange = (e) => {
        const SearchValue = e.target.value;
      
        setSearchValue((prevValue) => {
          const newValue = SearchValue;
          if (newValue !== "") {
            setSearchValueIsEmpty(false);
          } else {
            setSearchValueIsEmpty(true);
          }
          return newValue;
        });
      };
      
    
      const handleErase = () =>{
        setSearchValue("");
        setSearchValueIsEmpty(true);
      }

      const handleSideBar = () =>{
        setDisplaySideBar(prevState => ({
          ...prevState,
          display: true
      }))

      setSideBarExpand(prevState => ({
        ...prevState,
        wide: false
    }))

      document.body.classList.add('body-no-scroll');
      }

    const handleSearch = (e) => {
      e.preventDefault();
      if(!searchValue) return;
      navigate(`/search-results?q=${encodeURIComponent(searchValue)}`);
    }

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch(e);
        e.target.blur();
      }
    }

    const handleNotificationPage = () =>{
      navigate("/notifications");
    }


      return(
            <div className={`search-nav ${sideBarExpand.wide ? "contract" : ""} ${theme ? "dark" : ""}`}>
                <div className={`search-bar-notification-container ${theme ? "dark" : ""}`}>
                    <div className="search-nav-hamburger-icon" onClick={handleSideBar}>
                        <FaBars />
                    </div>

                    <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search for tools, employees or categories"
                        className={`search-bar ${theme ? "dark" : ""}`}
                        onChange={(e) => handleChange(e)}
                        value={searchValue}
                        onKeyPress={handleKeyPress}
                        id="searchBar"
                        />
                    <span className="fa fa-search" onClick={handleSearch}></span>
                    <span className={`${searchValueIsEmpty ? "" : "fa-solid fa-xmark xmark-search"}`} onClick={handleErase}>

                    </span>
                    </div>

                    <span className={`notification-bell ${theme ? "dark" : ""}`} onClick={handleNotificationPage}>
                      <svg fill="#000000" width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"><path d="M10,21h4a2,2,0,0,1-4,0ZM3.076,18.383a1,1,0,0,1,.217-1.09L5,15.586V10a7.006,7.006,0,0,1,6-6.92V2a1,1,0,0,1,2,0V3.08A7.006,7.006,0,0,1,19,10v5.586l1.707,1.707A1,1,0,0,1,20,19H4A1,1,0,0,1,3.076,18.383ZM6.414,17H17.586l-.293-.293A1,1,0,0,1,17,16V10A5,5,0,0,0,7,10v6a1,1,0,0,1-.293.707Z"></path></g>
                      </svg>
                    </span>
                </div>
            </div>
      )
}

export default SearchNav;