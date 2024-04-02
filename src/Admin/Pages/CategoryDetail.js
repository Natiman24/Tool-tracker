import React, {useState, useEffect} from "react"
import "../Styles/CategoryDetail.css"
import "../../Component/Overlay/Overlay.css"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import { useStateContextSideBar } from "../../Contexts/SideBarContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContextTheme } from "../../Contexts/ThemeContext";
import { fetchCategoryDetails, fetchProductByCategory, fetchProductByCategoryInfo, fetchLocations, addTools } from "../../Services/ToolApiService";


const CategoryDetail = () =>{

    const navigate = useNavigate();
    const urlLocation = useLocation();
    const queryParamsCategory = new URLSearchParams(urlLocation.search);
    const categoryId = queryParamsCategory.get('id');

    const [categoryDetail, setCategoryDetail] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [numOfTools, setNumOfTools] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    const [flag, setFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newToolLoading, setNewToolLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [numOfPages, setNumOfPages] = useState(1);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [locationList, setLocationList] = useState(null || []);
    const [location, setLocation] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [emptyFlag, setEmptyFlag] = useState(false);


    const {theme, setPage, setPageId} = useStateContextTheme();
    const {sideBarExpand} = useStateContextSideBar();

    const expand = sideBarExpand.wide;

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5";
      }, [theme]);

    useEffect(() => {
        setPage("category");
        setPageId(categoryId);
        
    },[categoryId])

    useEffect(() => {
        if(emptyFlag && !openSnackbar){
            navigate("/categories");
        }
    }, [openSnackbar && emptyFlag])

    

    const fetchCateogryDetail = async (pageNum) => {
        try{
            setLoading(true);
            const details = await fetchCategoryDetails(categoryId);
            setCategoryName(details?.name || ''); 
            if(!details){
                setSeveritySnackbar("error");
                setMessageSnackbar("There is no category with this id.");
                setOpenSnackbar(true);
                setEmptyFlag(true);
            }
            const response = await fetchProductByCategoryInfo(categoryId);
            setNumOfPages(response?.pages || 1);
            setNumOfTools(response?.numberOfTools || 0);
            const products = await fetchProductByCategory(categoryId, pageNum);
            const sortedProducts = products.sort((a,b) => a?.name.localeCompare(b?.name))
            setCategoryDetail(sortedProducts || []);
            setLoading(false);

        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            setEmptyFlag(true); // check here added now
            setLoading(false);
        } 
    }

    useEffect(() => {  
  
        const fetchLocation = async () => {
            try{
                const locations = await fetchLocations();
                setLocationList(locations || []);

            } catch (error) {
                setSeveritySnackbar("error");
                setMessageSnackbar(error?.response?.data?.message || "An error occurred");
                setOpenSnackbar(true);
            }
        }

        fetchLocation();   
        fetchCateogryDetail(pageNum); 
               
    },[categoryId, flag, pageNum])

    const handleOpenOverlay = () =>{
        setShowOverlay(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay = (e) =>{
        e.preventDefault();
        setShowOverlay(false);
        setProductName("");
        setLocation("");
        setDescription("");
        document.body.classList.remove('body-no-scroll');
        
    }

    const handleLocationChange = (event) =>{
        setLocation(event.target.value);
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
            fetchCateogryDetail(pageNum - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    }

    const handleNextPage = () => {
        if(pageNum == numOfPages || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum + 1);
            fetchCateogryDetail(pageNum + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const handleAddTool = async (e) =>   {
        e.preventDefault()
        if(!productName || !categoryId ||!location || !description) return;

        const toolData = {
            name : productName,
            category: categoryId,
            location : location,
            description : description,
        }

        try{
            setNewToolLoading(true);
            const response = await addTools(toolData);
            setFlag(prevFlag => !prevFlag);
            setSeveritySnackbar("success");
            setMessageSnackbar(response.data?.message|| "New Tool Added Successfully");
            setOpenSnackbar(true);
            setShowOverlay(false);
            document.body.classList.remove('body-no-scroll');
            setProductName("");
            setLocation("");
            setDescription("");
            setNewToolLoading(false);
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            setNewToolLoading(false);
        }
    }


    return(
        <>
            <div className={`category-detail-page ${expand ? "contract" : ""}`}>
                <div className={`category-detail-page-container card ${theme ? "dark" : ""}`}>
                    <div className="category-detail-name-btn-container">
                        <div className="category-detail-header">
                            {loading ? 
                                (<h5><span className="category-header-span">Category:</span> Loading...</h5>) : (
                                <h5><span className="category-header-span">Category:</span> {categoryName || "Loading..."}</h5>
                                )}
                        </div>
                        <div className="category-detail-btn-container">
                            <button className="category-detail-edit-btn" onClick={handleOpenOverlay}>Add Tool</button>
                        </div>
                    </div>
                    <div className="category-details-total-tools">
                        {loading ? (
                            <h6>Total Tools: Loading...</h6>) : (
                            <h6>Total Tools: {numOfTools || 0}</h6>
                            )}
                    </div>
                    <div className="category-hl-container">
                            <hr className="category-hl" />
                    </div>

                    <table className="category-detail-table">
                        <thead>
                            <tr>
                                <th className="category-detail-table-header">
                                    <div className="table-item">
                                        Product
                                    </div>
                                </th>
                                <th className="category-detail-table-header">
                                    <div className="table-item">
                                        Current Location 
                                    </div>
                                </th>
                                <th className="category-detail-table-header">
                                    <div className="table-item">
                                        Details
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && categoryDetail.map((categoryData, index) => (
                                <tr className="category-detail-table-row-data" key={index}>
                                    <td className="category-detail-table-data">
                                        <div className="table-item">
                                            {categoryData?.name || "Loading..."}
                                        </div>  
                                    </td>
                                    <td className="category-detail-table-data">
                                        <div className="table-item">
                                            {categoryData?.location?.name || "Loading"}
                                        </div>
                                    </td>
                                    <td className="category-detail-table-data">
                                        <button className={`details-category-btn-table ${theme ? "dark" : ""}`} onClick={() => handleProductDetails(categoryData)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && !categoryDetail.length && (
                        <div className="search-not-found">
                            No Tools Found in this category!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
                    </div>

                    <div className="category-detail-pagenation">
                        <button className={`category-detail-previous-page-btn ${theme ? "dark" : ""}`} onClick={handlePreviousPage}>Previous</button>
                            <h6 className={`category-detail-page-num-header ${theme ? "dark" : ""}`}> Page {pageNum} of {numOfPages} </h6>
                        <button className={`category-detail-next-page-btn ${theme ? "dark" : ""}`} onClick={handleNextPage}>Next</button>
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
                                <label htmlFor="location" className={`new-product-label ${theme ? "dark" : ""}`}>
                                    Location 
                                </label>
                                <select value={location} onChange={handleLocationChange} className={`new-product-input ${theme ? "dark" : ""}`} id="location" required>
                                    <option value="">Select Tool location</option>
                                    {locationList.map((location, index) => (
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
        </>
    )
}

export default CategoryDetail;