import React, {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchToolDetails, updateProductDetails, fetchCategories, deleteTool } from "../../Services/ToolApiService";
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/ProductDetails.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextSideBar } from "../../Contexts/SideBarContext";
import { useStateContextTheme } from "../../Contexts/ThemeContext";


const ProductDetails = () =>{

    const navigate = useNavigate();
    const urlLocation = useLocation();
    const queryParamsTools = new URLSearchParams(urlLocation.search);
    const toolsId = queryParamsTools.get('id');

    const [toolDetail, setToolDetail] = useState([]);
    const [toolHistory, setToolHistory] = useState([]);
    const [toolCategories, setToolCategories] = useState([]);
    const [activeTab, setActiveTab] = useState("Overview");
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");
    const [updateFlag, setUpdateFlag] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [emptyFlag, setEmptyFlag] = useState(false);
    const {theme, page, pageId} = useStateContextTheme();
    const {sideBarExpand} = useStateContextSideBar();

    const expand = sideBarExpand.wide

    useEffect(() => {
        if(emptyFlag && !openSnackbar){
            navigate("/dashboard");
        }
    }, [openSnackbar && emptyFlag])

    useEffect(() => {
        if(deleteFlag && !openSnackbar){
            setShowOverlay(false);
            document.body.classList.remove('body-no-scroll');
            setLoadingUpdate(false);
            switch(page){
                case "dashboard": 
                    navigate("/dashboard")
                    break;
                case "category":
                    navigate(`/categories/details?id=${pageId}`);
                    break;
                case "site":
                    navigate(`/project-sites/details?id=${pageId}`);
                    break;
                case "seachPage":
                    navigate(`/search-results?q=${encodeURIComponent(pageId)}`);
                    break;
                case "filterPage":
                    navigate("/dashboard/filter")
                    break;
                default:
                    navigate("/dashboard");
                    break;
            }
        }
    }, [deleteFlag && openSnackbar]) 

    useEffect(() => {  

            const fetchToolDetail = async () => {
                try{
                    setLoading(true);
                    const details = await fetchToolDetails(toolsId);
                    setToolDetail(details || []);
                    if(!details){
                        setMessageSnackbar("There is no tool with this id")
                        setSeveritySnackbar("error");
                        setOpenSnackbar(true);
                        setEmptyFlag(true)
                    }
                    setProductName(details?.name || ''); 
                    setCategory(details?.category?.id || '');
                    setLocation(details?.location || '');
                    setDescription(details?.description || '');
                    setToolHistory(details?.historyList || []);

                } catch (error){
                    setMessageSnackbar(error?.response?.data?.message || "An error occurred")
                    setSeveritySnackbar("error");
                    setOpenSnackbar(true);
                } finally{
                    setLoading(false);
                 }
            }

            const fetchToolCategory = async () => {
                try{
                    setLoading(true);
                    const category = await fetchCategories();
                    setToolCategories(category || []);

                } catch (error){
                    setMessageSnackbar(error?.response?.data?.message || "An error occurred")
                    setSeveritySnackbar("error");
                    setOpenSnackbar(true);
                }finally{
                    setLoading(false);
                }
            }

            fetchToolDetail();
            fetchToolCategory();
           
    },[toolsId, updateFlag])

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
      }, [theme]);


    const handleOpenOverlay = () =>{
        setShowOverlay(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleOpenOverlay2 = () =>{
        setShowOverlay2(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay = (e) => {
        e.preventDefault();
        setShowOverlay(false);
        setProductName(toolDetail?.name);
        setCategory(toolDetail?.category?.id);
        setDescription(toolDetail?.description);
        document.body.classList.remove('body-no-scroll');
    };

    const handleCloseOverlay2 = () =>{
        setShowOverlay2(false);
        document.body.classList.remove('body-no-scroll');
    }

    const handleCategoryChange = (event) =>{
        setCategory(event.target.value);
    }

   

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if(!productName || !category || !description) return ;

       const newProductDetail = {
        id: toolsId,
        name : productName,
        category : category,
        description: description,
       }
        
        try{
            setLoadingUpdate(true)
            const updateResponse = await updateProductDetails(newProductDetail);
            setUpdateMessage(updateResponse?.message || "");   
            setSeveritySnackbar("success");
            setMessageSnackbar(updateResponse?.message || "");
            setOpenSnackbar(true);
            setUpdateFlag(prevFlag => !prevFlag);

            setShowOverlay(false);
            document.body.classList.remove('body-no-scroll');
        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);

        } finally{
            setShowOverlay(false);
            document.body.classList.remove('body-no-scroll');
            setLoadingUpdate(false);
        }
          
    }

    

    const handleDeleteProduct = async (e) => { 
        e.preventDefault();

        try{
            setLoadingUpdate(true)
            const deleteResponse = await deleteTool(toolsId);
            setDeleteMessage(deleteResponse?.message || "");
            setDeleteFlag(prevFlag => !prevFlag);
            setSeveritySnackbar("success");
            setMessageSnackbar(deleteResponse?.message || "");
            setOpenSnackbar(true);
                
        } catch (error){
            setMessageSnackbar(error?.response?.data?.message || "An error occurred")
            setSeveritySnackbar("error");
            setOpenSnackbar(true);
            setShowOverlay(false);
            document.body.classList.remove('body-no-scroll');
            setLoadingUpdate(false);
        }
    }

    const handleToolKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the default Enter key action
          handleUpdateProduct(e); // Trigger the Update action
          e.target.blur();  
        }
      };
    

    const getCurrentDate = () => {
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return currentDate.toLocaleDateString('en-US', options);
    };

    const formatDate = (dateString) => {
        if(!dateString) return getCurrentDate();
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    }

    const OverviewPage = () =>{
        return(
            <div className="product-primary-details">
                    <h6>Primary Details</h6>
                    <div className="product-details-specifics">
                        <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
                        </div>
                        
                        {!loading && toolDetail && (<table className={`product-details-specifics-table`}>
                            <tbody>
                                <tr>
                                    <th>
                                        <h6 className={`product-details-parameter ${theme ? "dark" : ""}`}>Tool Name</h6>
                                    </th>
                                    <td>
                                        <p className={`product-details-parameter-value ${theme ? "dark" : ""}`}> {toolDetail?.name ? toolDetail.name.charAt(0).toUpperCase() + toolDetail.name.slice(1) : toolDetail?.name || "Loading..."} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <h6 className={`product-details-parameter ${theme ? "dark" : ""}`}>Tool Category</h6>
                                    </th>
                                    <td>
                                        <p className={`product-details-parameter-value ${theme ? "dark" : ""}`}> {toolDetail?.category?.name ? toolDetail.category.name.charAt(0).toUpperCase() + toolDetail.category.name.slice(1) : toolDetail?.category?.name || "Loading..."} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <h6 className={`product-details-parameter ${theme ? "dark" : ""}`}>Current Location</h6>
                                    </th>
                                    <td>
                                        <p className={`product-details-parameter-value ${theme ? "dark" : ""}`}> {toolDetail?.location?.name ? toolDetail.location.name.charAt(0).toUpperCase() + toolDetail.location.name.slice(1) : toolDetail?.location?.name  || "Loading..."} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <h6 className={`product-details-parameter ${theme ? "dark" : ""}`}>Last Moved On</h6>
                                    </th>
                                    <td>
                                        <p className={`product-details-parameter-value ${theme ? "dark" : ""}`}> {formatDate(toolDetail?.lastMovedOn) || "None"} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <h6 className={`product-details-parameter ${theme ? "dark" : ""}`}>Last Moved By</h6>
                                    </th>
                                    <td>
                                        <p className={`product-details-parameter-value ${theme ? "dark" : ""}`}> {toolDetail?.lastMover?.firstName ? toolDetail?.lastMover?.firstName.charAt(0).toUpperCase() + toolDetail?.lastMover?.firstName.slice(1) : "None"} {toolDetail?.lastMover?.lastName ? toolDetail?.lastMover?.lastName.charAt(0).toUpperCase() + toolDetail?.lastMover?.lastName.slice(1) : ""} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <h6 className={`product-details-parameter ${theme ? "dark" : ""}`}>Description</h6>
                                    </th>
                                    <td>
                                        <p className={`product-details-parameter-value ${theme ? "dark" : ""}`}> {toolDetail?.description ? toolDetail.description.charAt(0).toUpperCase() + toolDetail.description.slice(1) : toolDetail?.description || "Loading..."} </p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <h6 className={`product-details-parameter ${theme ? "dark" : ""}`}>Added On</h6>
                                    </th>
                                    <td>
                                        <p className={`product-details-parameter-value ${theme ? "dark" : ""}`}> {formatDate(toolDetail?.createdOn)|| "Loading..."} </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        )}
                    </div>
                </div>
        )
    }

    const HistoryPage = () =>{
        return(
            <>
                <div className="history-part">
                    <h6>Tool History</h6>
                    <table className={`history-details-table ${theme ? "dark" : ""} active-erasable`}>
                        <thead>
                            <tr> 
                                <th className="history-details-table-header history-details-table-header-active-erasable">
                                    <div className="table-item">
                                        Start Date
                                    </div>
                                </th>
                                <th className="history-details-table-header history-details-table-header-active-erasable">
                                    <div className="table-item">
                                        End Date
                                    </div>
                                </th>
                                <th className="history-details-table-header history-details-table-header-erasable-active">
                                    <div className="table-item">
                                        Interval Date
                                    </div>
                                </th>
                                <th className="history-details-table-header">
                                    <div className="table-item">
                                        Last Moved By
                                    </div>
                                </th>
                                <th className="history-details-table-header">
                                    <div className="table-item">
                                        Location
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && toolHistory.map((history,index) => (
                                <tr className="history-details-table-row-data" key={index}>
                                    <td className="history-details-table-data history-details-table-data-active-erasable">
                                        <div className="table-item">
                                            {formatDate(history?.startDate)}
                                        </div>
                                    </td>
                                    <td className="history-details-table-data history-details-table-data-active-erasable">
                                        <div className="table-item">
                                            {formatDate(history?.endDate)}
                                        </div>
                                    </td>
                                    <td className="history-details-table-data history-details-table-data-erasable-active">
                                        <div className="table-item-2">
                                            {`${formatDate(history?.startDate)} - ${formatDate(history?.endDate)}`}
                                        </div>
                                    </td>
                                    <td className="history-details-table-data">
                                        <div className="table-item-2"> 
                                            {history?.mover?.firstName ? history?.mover?.firstName.charAt(0).toUpperCase() + history?.mover?.firstName.slice(1) : ""} {history?.mover?.lastName ? history?.mover?.lastName.charAt(0).toUpperCase() + history?.mover?.lastName.slice(1) :  ""}
                                        </div>
                                    </td>
                                    <td className="history-details-table-data">
                                        <div className="table-item">
                                            {history?.location?.name ? history.location.name.charAt(0).toUpperCase() + history.location.name.slice(1) : history?.location?.name || ""}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
                    </div>
                    
                </div>
                
            </>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
          case "Overview":
            return <OverviewPage />;
          case "History":
            return <HistoryPage />;
          default:
            return <OverviewPage />;
        }
      };

    return(
        <>
        <div className={`product-details-page ${expand ? "contract" : ""}`}>
            <div className={`product-details-container card ${theme ? "dark" : ""}`}>
                <div className="product-details-name-btn-container">
                    <div className="product-details-header">
                        <h5>{toolDetail?.name ? toolDetail.name.charAt(0).toUpperCase() + toolDetail.name.slice(1) : toolDetail?.name || "Loading..."}</h5>
                    </div>
                    <div className="product-details-header-btn-container">
                        <button className={`product-details-edit-btn ${theme ? "dark" : ""}`} onClick={handleOpenOverlay}>
                            <span className="fa-solid fa-pencil"></span>
                            Edit
                        </button>
                        <button className={`product-details-delete-btn ${theme ? "dark" : ""}`} onClick={handleOpenOverlay2}>
                            Delete
                        </button>
                    </div>
                </div>

                <div className="product-details-overview-history-btn-container">
                    <button className={`product-details-overview-btn ${theme ? "dark" : ""} 
                        ${activeTab === "Overview" ? "active" : ""}`}
                        onClick={()=> setActiveTab("Overview")}
                    >
                        Overview
                    </button>
                    <button className={`product-details-history-btn ${theme ? "dark" : ""}
                        ${activeTab === "History" ? "active" : ""}`}
                        onClick={()=> setActiveTab("History")}
                    >
                        History
                    </button>
                    <hr className="overview-history-hl"></hr>
                </div>
                <div>
                    {renderContent()}
                </div>
                
            </div>

        </div>

{ showOverlay && (
            
    <div className="overlay-container">
        <div className={`overlay-content ${theme ? "dark" : ""}`}>
            <h5> Edit Product </h5>
            <div className="edit-product-form-container">
                <form className="edit-product-form" onSubmit={handleUpdateProduct}>
                    <div className="edit-product-label-input">
                        <label htmlFor="product-name" className={`edit-product-label ${theme ? "dark" : ""}`}>
                            Product Name <span className="text-danger">*</span> 
                        </label>
                        <input 
                            type="text"
                            placeholder="Enter tool name"
                            id="product-name"
                            className={`edit-product-input ${theme ? "dark" : ""}`}
                            onChange={(e) => setProductName(e.target.value)}
                            value={productName}
                            onKeyPress={handleToolKeyPress}
                            required
                            />
                    </div>
                    <div className="edit-product-label-input">
                        <label htmlFor="category" className={`edit-product-label ${theme ? "dark" : ""}`}>
                            Category <span className="text-danger">*</span> 
                        </label>
                        {!loading && toolCategories && toolCategories.length > 0 ? (
                            <select value={category} onChange={handleCategoryChange} className={`edit-product-input edit-dropdown-input ${theme ? "dark" : ""}`} required>
                                <option value="">Select product category</option>
                                {toolCategories.map((category, index) => (
                                    <option value={category?.id} key={index}>{category?.name}</option>
                                ))}
                            </select>
                        ) : (
                        <select value={category} onChange={handleCategoryChange} className={`edit-product-input edit-dropdown-input ${theme ? "dark" : ""}`}>
                            <option value="">Select product category</option>
                        </select>)}
                        
                    </div>

                    <div className="edit-product-label-input-description">
                        <label htmlFor="description" className={`edit-product-label ${theme ? "dark" : ""}`}>
                            Description <span className="text-danger">*</span> 
                        </label>
                
                        <textarea
                            className={`edit-product-input-description ${theme ? "dark" : ""}`}
                            id="description"
                            placeholder="Enter tool description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            rows="6"
                            required
                            />
                    </div>

                    <div className="edit-product-btn-container">
                        <button className={`edit-product-discard-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                            Discard
                        </button>
                        <button className="edit-product-update-btn" type="submit">
                            Update
                        </button>
                    </div>
                    
                </form>
            </div>

            <div className={`loading-container-overlay ${loadingUpdate ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
            </div>
        </div>    
    </div>

)}

     {showOverlay2 && (
        <div className="overlay-container">
            <div className={`overlay-content ${theme ? "dark" : ""}`}>
                <h4 className={`delete-product-header ${theme ? "dark" : ""}`}>Tool</h4>
                <h6 className={`delete-product-text ${theme ? "dark" : ""}`}>Are you sure to delete the Tool?</h6>
                <div className="delete-product-btn-container">
                    <button className={`delete-product-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay2}>
                        No
                    </button>
                    <button className="delete-product-ok-btn" onClick={handleDeleteProduct}>
                        Yes 
                    </button>
                </div>
                <div className={`loading-container-overlay ${loadingUpdate ? "" : "stop"}`}>
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

export default ProductDetails;