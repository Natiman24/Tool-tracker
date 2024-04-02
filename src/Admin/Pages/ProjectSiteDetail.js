import React, {useState, useEffect} from "react"
import "../Styles/ProjectSiteDetail.css"
import "../../Component/Overlay/Overlay.css"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import { useStateContextSideBar } from "../../Contexts/SideBarContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContextTheme } from "../../Contexts/ThemeContext";
import { fetchSiteDetails, fetchProductBySite, fetchProductBySiteInfo, fetchCategories, addTools } from "../../Services/ToolApiService";


const ProjectSiteDetail = () =>{

    const navigate = useNavigate();
    const urlLocation = useLocation();
    const queryParamsSite = new URLSearchParams(urlLocation.search);
    const siteId = queryParamsSite.get('id');

    const [showOverlay, setShowOverlay] = useState(false);
    const [siteDetail, setSiteDetail] = useState([] || "");
    const [siteName, setSiteName] = useState("");
    const [numOfTools, setNumOfTools] = useState(0);
    const [flag, setFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newToolLoading, setNewToolLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [numOfPages, setNumOfPages] = useState(1);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryList, setCategoryList] = useState(null || []);
    const [category, setCategory] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [emptyFlag, setEmptyFlag] = useState(false);

    const {sideBarExpand} = useStateContextSideBar();

    const {theme, setPage, setPageId} = useStateContextTheme();
    const expand = sideBarExpand.wide;


    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5";
      }, [theme]);

    useEffect(() => {
        setPage("site");
        setPageId(siteId);
    }, []);

    useEffect(() => {
        if(emptyFlag && !openSnackbar){
            navigate("/project-sites");
        }
    }, [openSnackbar && emptyFlag])

    const fetchSiteDetail = async (pageNum) => {
        try{
            setLoading(true);
            const details = await fetchSiteDetails(siteId);
            setSiteName(details?.name || ''); 
            if(!details){
                setSeveritySnackbar("error");
                setMessageSnackbar("There is no site with this id.");
                setOpenSnackbar(true);
                setEmptyFlag(true);
            }
            const response = await fetchProductBySiteInfo(siteId || "");
            setNumOfPages(response?.pages || 1);
            setNumOfTools(response?.numberOfTools || 0);
            const products = await fetchProductBySite(siteId, pageNum);
            const sortedProducts = products.sort((a, b) => {
                return new Date(b.lastMovedOn) - new Date(a.lastMovedOn);
            });
            setSiteDetail(sortedProducts || []);
            setLoading(false);

        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            setLoading(false);
        } 
    }

    useEffect(() => {  
  
        const fetchCategory = async () => {
            try{
                const categories = await fetchCategories();
                setCategoryList(categories || []);

            } catch (error) {
                setSeveritySnackbar("error");
                setMessageSnackbar(error?.response?.data?.message || "An error occurred");
                setOpenSnackbar(true);
            }
        }

        fetchCategory();   
        fetchSiteDetail(pageNum); 
               
    },[siteId, flag, pageNum])


    const handleOpenOverlay = () =>{
        setShowOverlay(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay = () =>{
        setShowOverlay(false);
        setProductName("");
        setCategory("");
        setDescription("");
        document.body.classList.remove('body-no-scroll');   
    }

    const handleCategoryChange = (event) =>{
        setCategory(event.target.value);
    }

    const handleKeyPress = (e) => {
        if(e.key == 'Enter'){
            e.preventDefault();
            handleAddTool(e);
            e.target.blur();
        }
    }

    const handleProductDetails = (product) => {
        navigate(`/dashboard/product-details?id=${product.id}`)
    }

    const handlePreviousPage = () => {
        if(pageNum == 1 || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum - 1);
            fetchSiteDetail(pageNum - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    }

    const handleNextPage = () => {
        if(pageNum == numOfPages || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum + 1);
            fetchSiteDetail(pageNum + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const handleAddTool = async (e) =>   {
        e.preventDefault()
        if(!productName || !siteId ||!category || !description) return;

        const toolData = {
            name : productName,
            category: category,
            location : siteId,
            description : description,
        }

        try{
            setNewToolLoading(true);
            const response = await addTools(toolData);
            setFlag(prevFlag => !prevFlag);
            setSeveritySnackbar("success");
            setMessageSnackbar(response.data?.message || "New Tool Added Successfully");
            setOpenSnackbar(true);
            setShowOverlay(false);
            document.body.classList.remove('body-no-scroll');
            setProductName("");
            setCategory("");
            setDescription("");
            setNewToolLoading(false);
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            setNewToolLoading(false);
        } 
    }

    const getCurrentDate = () => {
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return currentDate.toLocaleDateString('en-CA', options);
    };

    const formatDate = (dateString) => {
        if(!dateString) return getCurrentDate();
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-CA', options);
    }

    return(
        <>
            <div className={`site-detail-page ${expand ? "contract" : ""}`}>
                <div className={`site-detail-page-container card ${theme ? "dark" : ""}`}>
                    <div className="site-detail-name-btn-container">
                        <div className="site-detail-header">
                        {loading ? (
                                <h5><span className="site-header-span">Site:</span> Loading...</h5>) : (
                                <h5><span className="site-header-span">Site:</span> {siteName || "Loading..."}</h5>
                                )}
                        </div>
                        <div className="site-detail-btn-container">
                            <button className="site-detail-edit-btn" onClick={handleOpenOverlay}>Add Tool</button>
                        </div>
                    </div>
                    <div className="site-details-total-tools">
                        {loading ? (
                            <h6>Total Tools: Loading...</h6>) : (
                            <h6>Total Tools: {numOfTools || 0}</h6>
                            )}
                    </div>
                    <div className="site-hl-container">
                            <hr className="site-hl" />
                    </div>

                    <table className="site-detail-table">
                        <thead>
                            <tr>
                                <th className="site-detail-table-header">
                                    <div className="table-item">
                                        Product
                                    </div>
                                </th>
                                <th className="site-detail-table-header">
                                    <div className="table-item">
                                        Since
                                    </div>
                                </th>
                                <th className="site-detail-table-header">
                                    <div className="table-item">
                                        Details
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && siteDetail.map((siteData,index) => (
                                <tr className="site-detail-table-row-data" key={index}>
                                    <td className="site-detail-table-data">
                                        <div className="table-item">
                                            {siteData?.name || "None"}
                                        </div>  
                                    </td>
                                    <td className="site-detail-table-data">
                                        <div className="table-item">
                                            {formatDate(siteData?.lastMovedOn) || "None"}
                                        </div>
                                    </td>
                                    <td className="site-detail-table-data">
                                        <button className={`details-site-btn-table ${theme ? "dark" : ""}`} onClick={() => handleProductDetails(siteData)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && !siteDetail.length && (
                        <div className="search-not-found">
                            No Tools Found in this site!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
                    </div>

                    <div className="site-detail-pagenation">
                        <button className={`site-detail-previous-page-btn ${theme ? "dark" : ""}`} onClick={handlePreviousPage}>Previous</button>
                            <h6 className={`site-detail-page-num-header ${theme ? "dark" : ""}`}> Page {pageNum} of {numOfPages} </h6>
                        <button className={`site-detail-next-page-btn ${theme ? "dark" : ""}`} onClick={handleNextPage}>Next</button>
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
                                <select value={category} onChange={handleCategoryChange} className={`new-product-input ${theme ? "dark" : ""}`} id="category" required>
                                    <option value="">Select Tool Category</option>
                                    {categoryList.map((category, index) => (
                                        <option value={category.id} key={index}>{category.name}</option>
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
        </>
    )
}

export default ProjectSiteDetail;