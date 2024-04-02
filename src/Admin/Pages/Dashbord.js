import React, {useEffect, useState, useRef} from "react"
import "../Styles/Dashbord.css"
import "../../Component/Overlay/Overlay.css"
import { useNavigate } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"
import FilterPage from "../Components/Filter/Filter"
import { fetchLocations, fetchNumOfPages, fetchTools, fetchCategories, addTools, fetchTotalInformation, fetchToken } from "../../Services/ToolApiService"
import { useStateContextFilter } from "../../Contexts/FilterContext"
import { useStateContextSideBar } from "../../Contexts/SideBarContext"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"

const Dashbord = () =>{

    const navigate = useNavigate();
    const toolsContainerRef = useRef(null);

    const [tools, setTools] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [newToolMessage, setNewToolMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [newToolLoading, setNewToolLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [numOfPages, setNumOfPages] = useState(1);
    const [showOverlay, setShowOverlay] = useState(false);
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [newToolFlag, setNewToolFlag] = useState(false);
    const [totalInfo, setTotalInfo] = useState([]);
    const [overallNumLoading, setOverallNumLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const {showFilter, setShowFilter, filterMetrics} = useStateContextFilter();
    const {sideBarExpand} = useStateContextSideBar();
    const {theme, setPage} = useStateContextTheme();

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
      }, [theme]);

    useEffect(() => {
        fetchToken();
    }, [])

    const fetchTool = async (pageNum) => {
            try{
              setLoading(true);
              const data = await fetchTools(pageNum);
              const sortedTools = data.sort((a, b) => a.name.localeCompare(b.name))
              setTools(sortedTools|| []);
        
            } catch(error)  {
                setMessageSnackbar(error?.response?.data?.message || "An error occurred")
                setSeveritySnackbar("error");
                setOpenSnackbar(true);
            }finally{
                setLoading(false);
            }
          }
    
    const fetchData = async () => {
        try{
            const categories = await fetchCategories();
            const sortedCategories = categories.sort((a,b) => a.name.localeCompare(b.name));
            setCategoryList(sortedCategories || []);
            const locations = await fetchLocations();
            const sortedLocations = locations.sort((a,b) => a.name.localeCompare(b.name));
            setLocationList(sortedLocations|| []);

        } catch (error) {
            setMessageSnackbar(error?.response?.data?.message || "An error occurred")
            setSeveritySnackbar("error");
            setOpenSnackbar(true);
        }
    }

    useEffect(()=>{

        fetchTool(pageNum);

        const fetchNumOfPage = async () => {
            try{
                const data = await fetchNumOfPages();
                setNumOfPages(data?.pages || 1);
          
              } catch(error)  {
                setMessageSnackbar(error?.response?.data?.message || "An error occurred")
                setSeveritySnackbar("error");
                setOpenSnackbar(true);
              }
        }

        

        const fetchTotalInfo = async () => {
            try{
                setOverallNumLoading(true);
                const total = await fetchTotalInformation();
                setTotalInfo(total || []);
                setOverallNumLoading(false);
            } catch (error){
                setMessageSnackbar(error?.response?.data?.message || "An error occurred")
                setSeveritySnackbar("error");
                setOpenSnackbar(true);
                setOverallNumLoading(false)
            }
        }

        fetchNumOfPage();
        fetchTotalInfo();
        fetchData();

        setPage("dashboard")

    }, [newToolFlag]);

    
    const handleOpenOverlay = () =>{
        fetchData();
        setShowOverlay(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay = (e) => {
        e.preventDefault();

        setShowOverlay(false);
        setProductName("");
        setCategory("");
        setLocation("");
        setDescription("");
        document.body.classList.remove('body-no-scroll');
      };

    const handleCategoryChange = (event) =>{
        setCategory(event.target.value);
    }

    const handleLocationChange = (event) =>{
        setLocation(event.target.value);
    }

    const handleMoveToInventory = (tools) =>{
        navigate(`./product-details?id=${tools.id}`);
    }

    const handleOpenFilter = () =>{
        setShowFilter(prevState=>({
            ...prevState,
            filter:true
        }));
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseFilter = () =>{
        setShowFilter(prevState=>({
            ...prevState,
            filter:false
        }));
        document.body.classList.remove('body-no-scroll');
    }

    const handleAddTool = async (e) =>   {
        e.preventDefault()
        if(!productName || !category || !location || !description) return;

        const toolData = {
            name : productName,
            category: category,
            location : location,
            description : description,
        }

        try{
            setNewToolLoading(true);
            const response = await addTools(toolData);
            setNewToolMessage(response?.data?.message || "");
            setNewToolFlag(prevFlag => !prevFlag);
            setMessageSnackbar(response?.data?.message);
            setSeveritySnackbar("success");
            setOpenSnackbar(true);
            setProductName("");
            setCategory("");
            setLocation("");
            setDescription("");
            setShowOverlay(false);
            document.body.classList.remove('body-no-scroll');
            setNewToolLoading(false);
            
        } catch (error){
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setSeveritySnackbar("error");
            setOpenSnackbar(true);
            setNewToolLoading(false);
        } 
    }

    const handlePreviousPge = () => {
        if(pageNum == 1 || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum - 1);
            fetchTool(pageNum - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    const handleNextPage = () => {
        if(pageNum == numOfPages || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum + 1);
            fetchTool(pageNum + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); 
          handleAddTool(e); 
          e.target.blur();
        }
      };

    return(
        <>
        
        <div className={`dashboard-page  ${sideBarExpand.wide ? "contract" : ""}`}>
            <div className={`dashboard-container`}>

                <div className="overall-inventory-tools-container">
                    <div className={`overall-inventory-container card  ${theme ? "dark" : ""}`}>
                        <h5>Overall inventory</h5>
                        <table className="overall-inventory-table">
                            <thead >
                                <tr className="c-p-s-e">
                                    <th className="categories-table-header">
                                        Categories
                                    </th>
                                    <th className="products-table-header">
                                        Total Tools
                                    </th>
                                    <th className="sites-table-header">
                                        Total Project Sites
                                    </th>
                                    <th className="employees-table-header">
                                        Total Employees
                                    </th>
                                    
                                </tr>
                            </thead>
                            {!overallNumLoading && (<tbody>
                                <tr>
                                    <td className={`overall-num ${theme ? "dark" : ""}`}>{totalInfo.categoriesCount}</td>
                                    <td className={`overall-num ${theme ? "dark" : ""}`}>{totalInfo.toolsCount}</td>
                                    <td className={`overall-num ${theme ? "dark" : ""}`}>{totalInfo.locationsCount}</td>
                                    <td className={`overall-num ${theme ? "dark" : ""}`}>{totalInfo.workersCount}</td>
                                </tr>
                            </tbody>)}
                            
                        </table>

                        <table className={`overall-inventory-table-2  ${theme ? "dark" : ""}`}>
                            <thead>
                                <tr className="c-p-s-e">
                                    <th className="categories-table-header">
                                        Categories
                                    </th>
                                    <th className="products-table-header">
                                        Total Tools
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="num-row">
                                    <td className={`overall-num ${theme ? "dark" : ""}`}>{totalInfo.categoriesCount}</td>
                                    <td className={`overall-num ${theme ? "dark" : ""}`}>{totalInfo.toolsCount}</td>
                                </tr>
                            </tbody>

                            <thead>
                                <tr className="c-p-s-e">
                                    <th className="sites-table-header">
                                        Total Project Sites
                                    </th>
                                    <th className="employees-table-header">
                                        Total Employees
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="num-row">
                                    <td className={`overall-num ${theme ? "dark" : ""}`}>{totalInfo.locationsCount}</td>
                                    <td className={`overall-num ${theme ? "dark" : ""}`}>{totalInfo.workersCount}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className={`loading-container ${overallNumLoading ? "" : "stop"}`}>
                                <ClipLoader color={`${theme ? "#fff" : "#000"}`} size={60} />
                        </div>
                    </div>

                    <div className={`tools-container card  ${theme ? "dark" : ""}`}>
                        <div className="tools-btn-header">
                            <div className="tools-header">
                            <h5>Tools</h5>
                            </div>
                            <div className="tools-btn-container">
                                <button className="add-product-btn" onClick={handleOpenOverlay}>Add Tool</button>
                                <button className={`filter-btn  ${theme ? "dark" : ""} ${filterMetrics.initialDate || filterMetrics.finalDate || filterMetrics.category.length || filterMetrics.location.length  ? "filter" : ""}`} onClick={handleOpenFilter}>
                                    <span className="filter-icon">
                                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 6H14M1.5 1H16.5M6.5 11H11.5" stroke="#5D6679" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                    Filter
                                </button>
                            </div>
                        </div>

                        <div className="dashboard-hl-container">
                            <hr className="dashboard-hl" />
                        </div>
                        <table className="tools-table">
                            <thead>
                                <tr>
                                    <th className="tools-table-header">
                                        <div className="table-item">
                                            Tools
                                        </div>
                                    </th>
                                    <th className="tools-table-header">
                                        <div className="table-item">
                                            Category
                                        </div>
                                    </th>
                                    <th className="tools-table-header tools-table-header-erasable">
                                        <div className="table-item">
                                            Last Moved By
                                        </div>
                                    </th>
                                    <th className="tools-table-header tools-table-header-erasable">
                                        <div className="table-item">
                                            Current Location
                                        </div>
                                    </th>
                                    <th className="tools-table-header">
                                        <div className="table-item">
                                            Details
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && tools && tools.map((tools, index) => (
                                    <tr className="tools-table-item-row" key={index}>
                                        <td className="tools-table-item">
                                            <div className="table-item">
                                                {tools?.name ? tools.name.charAt(0).toUpperCase() + tools.name.slice(1) : tools?.name}
                                            </div>
                                        </td>
                                        <td className="tools-table-item">
                                            <div className="table-item">
                                                {tools?.category?.name ? tools.category.name.charAt(0).toUpperCase() + tools.category.name.slice(1) : tools?.category?.name}
                                            </div>
                                        </td>
                                        <td className="tools-table-item tools-table-item-erasable">
                                            <div className="table-item">
                                                {tools.lastMover.firstName ? tools.lastMover.firstName.charAt(0).toUpperCase() + tools.lastMover.firstName.slice(1) : "None"} {tools.lastMover.lastName ? tools.lastMover.lastName.charAt(0).toUpperCase() + tools.lastMover.lastName.slice(1) : ""}
                                            </div>
                                        </td>
                                        <td className="tools-table-item tools-table-item-erasable">
                                            <div className="table-item">
                                                {tools?.location?.name ? tools.location.name.charAt(0).toUpperCase() + tools.location.name.slice(1) : tools?.location?.name}
                                            </div>
                                        </td>
                                        <td className="tools-table-item table-details-btn">
                                            <button className={`details-btn  ${theme ? "dark" : ""}`} onClick={() => handleMoveToInventory(tools)}>
                                                Details
                                            </button>
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!loading && tools.length === 0 && pageNum === 1 && (
                            <div className="search-not-found"> 
                                No Tools Found! 
                            </div>
                        )}

                        <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={`${theme ? "#fff" : "#000"}`} size={80} />
                        </div>

                        <div className="tools-pagenation">
                            <button className={`previous-page-btn ${theme ? "dark" : ""}`} onClick={handlePreviousPge}>Previous</button>
                                <h6 className={`page-num-header ${theme ? "dark" : ""}`}> Page {pageNum} of {numOfPages} </h6>
                            <button className={`next-page-btn ${theme ? "dark" : ""}`} onClick={handleNextPage}>Next</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        { showOverlay &&(
            
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h5> New Tool </h5>
                        
                        <div className="new-product-form-container">
                            <form className="new-product-form" onSubmit={handleAddTool}>
                                <div className="new-product-label-input">
                                    <label htmlFor="product-name" className={`new-product-label ${theme ? "dark" : ""}`}>
                                        Tool Name 
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="Enter Tool name"
                                        id="product-name"
                                        className={`new-product-input ${theme ? "dark" : ""}`}
                                        onChange={(e) => setProductName(e.target.value)}
                                        value={productName}
                                        onKeyPress={handleKeyPress}
                                        required
                                        />
                                </div>
                                <div className="new-product-label-input">
                                    <label htmlFor="category" className={`new-product-label ${theme ? "dark" : ""}`}>
                                        Category 
                                    </label>
                                    <select value={category} onChange={handleCategoryChange} className={`new-product-input ${theme ? "dark" : ""}`} required>
                                        <option value="">Select Tool category</option>
                                        {categoryList && categoryList.map((category, index) => (
                                            <option value={category.id} key={index}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="new-product-label-input">
                                    <label htmlFor="location" className={`new-product-label ${theme ? "dark" : ""}`}>
                                        Location 
                                    </label>
                                    <select value={location} onChange={handleLocationChange} className={`new-product-input ${theme ? "dark" : ""}`} required>
                                        <option value="">Select Tool location</option>
                                        {locationList && locationList.map((location, index) => (
                                            <option value={location.id} key={index}>{location.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="new-product-label-input-description">
                                    <label htmlFor="description" className={`new-product-label ${theme ? "dark" : ""}`}>
                                        Description 
                                    </label>
                            
                                    <textarea
                                        className={`new-product-input-description ${theme ? "dark" : ""}`}
                                        id="description"
                                        placeholder="Enter description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="6"
                                        required
                                        />
                                </div>

                                <div className="new-product-btn-container">
                                    <button className={`new-product-discard-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                                        Discard
                                    </button>
                                    <button className="new-product-add-product-btn" type="submit">
                                        Add Tool
                                    </button>
                                </div>
                                
                            </form>
                        </div>
                        <div className={`loading-container-overlay ${newToolLoading ? "" : "stop"}`}>
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

    {showFilter.filter && (
        <div className="overlay-filter" onClick={handleCloseFilter}></div>
      )}
    
       <FilterPage />
        </>
    )
}

export default Dashbord;