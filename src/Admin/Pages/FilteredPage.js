import React, {useState, useEffect} from "react"
import "../Styles/Dashbord.css"
import "../../Component/Overlay/Overlay.css"
import { useNavigate } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import FilterPage from "../Components/Filter/Filter"
import { useStateContextFilter } from "../../Contexts/FilterContext"
import { useStateContextSideBar } from "../../Contexts/SideBarContext"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import { fetchFilterPageNum, filterTools } from "../../Services/ToolApiService";

const FilteredPage = () => {

    const navigate = useNavigate();

    const [filterParams, setFilterParams] = useState([]);
    const [filteredTools, setFilteredTools] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [numOfPages, setNumOfPages] = useState(1);
    const [loading, setLoading] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);

    const {showFilter, setShowFilter, filterMetrics, filterFlag} = useStateContextFilter();
    const {sideBarExpand} = useStateContextSideBar();
    const {theme, setPage} = useStateContextTheme();

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
    }, [theme]);

    const handleFilter = async (filterParam, pageNum) => {
        
        try{
            setLoading(true);
            const filteredData = await filterTools(filterParam, pageNum);
            const sortedFilteredData = filteredData.sort((a,b) => a.name.localeCompare(b.name))
            setFilteredTools(sortedFilteredData || []);
        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred, Please try again");
            setOpenSnackbar(true);
        } finally{
            setLoading(false);
        }
    }

    const fetchNumOfPages = async (metrics) => {
        try{
            const data = await fetchFilterPageNum(metrics);
            setNumOfPages(data?.pages || 1);
      
          } catch(error)  {
            setMessageSnackbar(error?.response?.data?.message || "An error occurred fetching number of pages")
            setSeveritySnackbar("error");
            setOpenSnackbar(true);
          }
    }

    useEffect(() => {
        if(filterMetrics){
            const formattedInitialDate = filterMetrics.initialDate ? new Date(filterMetrics.initialDate).toLocaleDateString('en-CA') : null;
            const formattedFinalDate = filterMetrics.finalDate ? new Date(filterMetrics.finalDate).toLocaleDateString('en-CA') : null;
            var filterParameter = {
                initialDate: formattedInitialDate,
                finalDate: formattedFinalDate,
                category: filterMetrics.category,
                location: filterMetrics.location
            }
            setFilterParams(filterParameter);
        } else {
           
        }

        setPage("filterPage");

        
        
        fetchNumOfPages(filterParameter);
        setPageNum(1);
        handleFilter(filterParameter, 1);
    }, [filterFlag])


    const handleMoveToInventory = (tools) =>{
        navigate(`/dashboard/product-details?id=${tools.id}`);
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

    const handlePreviousPge = () => {
        if(pageNum === 1 || numOfPages === 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum - 1);
            handleFilter(filterParams, pageNum - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    const handleNextPage = () => {
        if(pageNum === numOfPages || numOfPages === 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum + 1);
            handleFilter(filterParams, pageNum + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    return(
        <>
            <div className={`dashboard-page  ${sideBarExpand.wide ? "contract" : ""}`}>
                <div className={`dashboard-container`}>
                    <div className="overall-inventory-tools-container">
                        <div className={`tools-container card  ${theme ? "dark" : ""} filter`}>
                            <div className="tools-btn-header">
                                <div className="tools-header">
                                <h5>Filtered Tools</h5>
                                </div>
                                <div className="tools-btn-container">
                                    {/* <button className="add-product-btn" onClick={handleOpenOverlay}>Add Tool</button> */}
                                    <button className={`filter-btn  ${theme ? "dark" : ""} ${filterMetrics.initialDate || filterMetrics.finalDate || filterMetrics.category.length || filterMetrics.location.length  ? "filter" : ""}`} onClick={handleOpenFilter}>
                                        <span className="filter-icon">
                                            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6H14M1.5 1H16.5M6.5 11H11.5" stroke="#5D6679" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        Filter
                                    </button>
                                    {/* <button className="download-btn">Download all</button> */}
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
                                        {/* <th className="tools-table-header">Last Moved On</th> */}
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
                                    {!loading && filteredTools && filteredTools.map((tools, index) => (
                                        <tr className="tools-table-item-row" key={index}>
                                            <td className="tools-table-item">
                                                <div className="table-item">
                                                    {tools?.name}
                                                </div>
                                            </td>
                                            <td className="tools-table-item">
                                                <div className="table-item">
                                                    {tools?.category.name}
                                                </div>
                                            </td>
                                            <td className="tools-table-item tools-table-item-erasable">
                                                <div className="table-item">
                                                    {tools?.lastMover.firstName ? tools.lastMover.firstName.charAt(0).toUpperCase() + tools.lastMover.firstName.slice(1) : "" || "None"} {tools?.lastMover.lastName ? tools.lastMover.lastName.charAt(0).toUpperCase() + tools.lastMover.lastName.slice(1) : "" || ""}
                                                </div>
                                            </td>
                                            {/* <td className="tools-table-item">{tools.lastMovedOn}</td> */}
                                            <td className="tools-table-item tools-table-item-erasable">
                                                <div className="table-item">
                                                    {tools?.location.name}
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

                            {!loading && !filteredTools.length && pageNum === 1 && (
                                <div className="search-not-found"> 
                                    No Tools Found! {/*its adding new page for this*/}
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

export default FilteredPage;