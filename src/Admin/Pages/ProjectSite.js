import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/ProjectSite.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextSideBar } from "../../Contexts/SideBarContext"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import { addNewSite, deleteSite, fetchSiteByPage, fetchSiteNumOfPages } from "../../Services/ToolApiService"


const ProjectSitePage = () =>{

    const navigate = useNavigate();

    const [siteList, setSiteList] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [numOfPages, setNumOfPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [siteLoading, setSiteLoading] = useState(false);
    const [newSiteMessage, setNewSiteMessage] = useState("");
    const [siteId, setSiteId] = useState("");
    const [newSiteFlag, setNewSiteFlag] = useState(false);
    const [deleteSiteFlag, setDeleteSiteFlag] = useState(false);
    const [siteName, setSiteName] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);

    const {theme} = useStateContextTheme();
    const {sideBarExpand} = useStateContextSideBar();
    const expand = sideBarExpand.wide;

    const fetchSite = async (pageNum) => {
        try{
          setLoading(true);
          const data = await fetchSiteByPage(pageNum);
          const sortedSites = data.sort((a, b) => a.name.localeCompare(b.name))
          setSiteList(sortedSites|| []);
    
        } catch(error)  {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        }finally{
            setLoading(false);
        }
      }

    useEffect(() => {
        fetchSite(pageNum);

        const fetchNumOfPage = async () => {
            try{
                const data = await fetchSiteNumOfPages();
                setNumOfPages(data?.pages || 1);
          
              } catch(error)  {
                setSeveritySnackbar("error");
                setMessageSnackbar(error?.response?.data?.message || "An error occurred");
                setOpenSnackbar(true);
              }
        }

        fetchNumOfPage();

    },[newSiteFlag, deleteSiteFlag])

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
      }, [theme]);

    const handleOpenOverlay = () =>{
        setShowOverlay(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay = () =>{
        setShowOverlay(false);
        setSiteName("");
        document.body.classList.remove('body-no-scroll');
    }

    const handleMoveToDetails = (site) =>{
        navigate(`./details?id=${site.id}`)
    }

    const handleOpenDeleteSite = (e, id) =>{
        setSiteId(id)
        setShowOverlay2(true);
        e.preventDefault();
        e.stopPropagation();
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay2 = () =>{
        setSiteId("");
        setShowOverlay2(false)
        document.body.classList.remove('body-no-scroll');
    }

    const handleNewKeyPress = (e) => {
        
        if(e.key == 'Enter'){
            handleNewSite(e);
            e.target.blur();
        }
    }

    const handleNewSite = async (e) => {
        e.preventDefault();
        if(!siteName) return;

        const site = {
            name: siteName
        }
        
        try{
            setSiteLoading(true);

            const existingSite = siteList.find(
                (existinglocation) => existinglocation.name.toLowerCase() === siteName.toLowerCase()
            );

            if (existingSite) {
                setSeveritySnackbar("error");
                setMessageSnackbar("Site with the same name already exists");
                setOpenSnackbar(true);
              } else {
                const response = await addNewSite(site);
                setNewSiteMessage(response?.message || "");
                setNewSiteFlag(prevFlag => !prevFlag);
                setSeveritySnackbar("success");
                setMessageSnackbar(response?.message || "New Location Added Successfully!");
                setOpenSnackbar(true);
                setShowOverlay(false);
              }
        }catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        }finally {
            setShowOverlay(false);
            document.body.classList.remove('body-no-scroll');
            setSiteName("");
            setSiteLoading(false);
        }
    }

    const handleDeleteSite = async (e) => { 
        e.preventDefault();

        try{
            setSiteLoading(true)
            const deleteResponse = await deleteSite(siteId);
            if (siteList.length === 1) {
                setPageNum(prevPageNum => Math.max(1, prevPageNum - 1)); // Ensure pageNum doesn't go below 1
            }
            setDeleteSiteFlag(prevFlag => !prevFlag)
            setSeveritySnackbar("success");
            setMessageSnackbar(deleteResponse?.message || "Location Deleted Successfully!");
            setOpenSnackbar(true);   
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        } finally {
            setShowOverlay2(false);
            document.body.classList.remove('body-no-scroll');
            setSiteId("");
            setSiteLoading(false);
        }
    }



    const handlePreviousPage = () => {
        if(pageNum == 1 || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum - 1);
            fetchSite(pageNum - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    const handleNextPage = () => {
        if(pageNum == numOfPages || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum + 1);
            fetchSite(pageNum + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    return(
        <>
            <div className={`site-page ${expand ? "contract" : ""}`}>
                <div className={`site-page-container card ${theme ? "dark" : ""}`}>
                    <div className="site-name-btn-container">
                        <div className="site-header">
                            <h5>Project Sites</h5>
                        </div>
                        <button className="add-site-btn" onClick={handleOpenOverlay}>
                            Add Project Site
                        </button>
                    </div>
                    
                    <div className="site-hl-container">
                        <hr className="site-hl" />
                    </div>
                    
                    <div className="row site-list-row">
                        {!loading && siteList.map((site, index) => (
                            <div className="site-list-container col-lg-6 col-md-6 col-sm-12 col-12" key={index}>
                                <div className={`site-list card ${theme ? "dark" : ""}`} onClick={() => handleMoveToDetails(site)} > 
                                    <h5 className="text-truncate">{site.name}</h5>
                                    <span onClick={(e) => handleOpenDeleteSite(e,site.id)}>
                                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 
                                        16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z"
                                        fill="#FF0000"/>
                                    </svg>
                                    </span>
                                </div>
                            </div>
                        ))}

                        <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={`${theme ? "#fff" : "#000"}`} size={100} />
                        </div>
                    </div>

                    {!loading && !siteList.length && pageNum === 1 && (
                        <div className="search-not-found">
                            No Sites Found!
                        </div>
                    )}

                    <div className="site-pagenation">
                                    <button className={`site-previous-page-btn ${theme ? "dark" : ""}`} onClick={handlePreviousPage}>Previous</button>
                                        <h6 className={`site-page-num-header ${theme ? "dark" : ""}`}> Page {pageNum} of {numOfPages} </h6>
                                    <button className={`site-next-page-btn ${theme ? "dark" : ""}`} onClick={handleNextPage}>Next</button>
                    </div>
                </div>
                
            </div>

            {showOverlay && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h5>New Project Site</h5>
                        
                        <form className="new-site-form">
                            <div className="new-site-label-input">
                                <label htmlFor="site-name" className={`new-site-label ${theme ? "dark" : ""}`}>
                                    Site Name
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Enter site name"
                                    className={`new-site-input ${theme ? "dark" : ""}`}
                                    id="site-name"
                                    onChange={(e) => setSiteName(e.target.value)}
                                    value={siteName}
                                    onKeyPress={handleNewKeyPress}
                                    required
                                    />
                            </div>

                            <div className="new-site-btn-container">
                                <button className={`new-site-discard-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                                    Discard
                                </button>
                                <button className="new-site-add-btn" onClick={handleNewSite}>
                                    Add Site
                                </button>
                            </div>
                        </form>
                        <div className={`loading-container-overlay ${siteLoading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? "#fff" : "#000"} size={100} />
                        </div>
                    </div>
                </div>
            )}

            {showOverlay2 && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className={`delete-site-header ${theme ? "dark" : ""}`}>Confirm Site Deletion</h4>
                        <h6 className={`delete-site-text ${theme ? "dark" : ""}`}>
                            Deleting a site will result in the <span className="text-danger">movement of all tools that reside in the location to the default location.</span> Are you sure you want to delete this site?
                        </h6>
                        <div className="delete-site-btn-container">
                            <button className={`delete-site-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay2}>
                                No
                            </button>
                            <button className="delete-site-ok-btn" onClick={handleDeleteSite}>
                                Yes 
                            </button>
                        </div>
                        <div className={`loading-container-overlay ${siteLoading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? "#fff" : "#000"} size={100} />
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

export default ProjectSitePage;