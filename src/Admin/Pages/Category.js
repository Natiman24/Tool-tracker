import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/Category.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextSideBar } from "../../Contexts/SideBarContext"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import { fetchCategoryNumOfPages, addNewCategory, deleteCategory, fetchCategoriesByPage } from "../../Services/ToolApiService"


const CategoryPage = () =>{

    const navigate = useNavigate();

    const [categoryList, setCategoryList] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [numOfPages, setNumOfPages] = useState(1);
    const [categoryName, setCategoryName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [newCategoryMessage, setNewCategoryMessage] = useState("");
    const [newCategoryFlag, setNewCategoryFlag] = useState(false);
    const [deleteCategoryFlag, setDeleteCategoryFlag] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);

    const {sideBarExpand} = useStateContextSideBar();
    const {theme} = useStateContextTheme();
    const expand = sideBarExpand.wide;


    const fetchCategory = async (pageNum) => {
        try{
          setLoading(true);
          const data = await fetchCategoriesByPage(pageNum);
          const sortedCategory = data.sort((a, b) => a.name.localeCompare(b.name))
          setCategoryList(sortedCategory || []);
    
        } catch(error)  {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        }finally{
            setLoading(false);
        }
      }

    useEffect(() => {
        fetchCategory(pageNum);
        
        const fetchNumOfPage = async () => {
            try{
                const data = await fetchCategoryNumOfPages();
                setNumOfPages(data?.pages || 1);
          
              } catch(error)  {
                setSeveritySnackbar("error");
                setMessageSnackbar(error?.response?.data?.message || "An error occurred");
                setOpenSnackbar(true);
              }
        }

        fetchNumOfPage(); 

    },[newCategoryFlag, deleteCategoryFlag])

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
      }, [theme]);
    
    

    const handleOpenOverlay = () => {
        setShowOverlay(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay = () =>{
        setShowOverlay(false);
        setCategoryName("");
        document.body.classList.remove('body-no-scroll');
    }

    const handleMoveToDetails = (category) =>{
        navigate(`./details?id=${category.id}`);
    }

    const handleOpenDeleteCategory = (e, id) =>{
        e.stopPropagation();
        setCategoryId(id);
        setShowOverlay2(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay2 = () =>{
        setCategoryId("");
        setShowOverlay2(false)
        document.body.classList.remove('body-no-scroll');
    }

    const handleNewKeyPress = (e) => {
        
        if(e.key == 'Enter'){
            handleNewCategory(e);
            e.target.blur();
        }
    }

    const handleNewCategory = async (e) => {
        e.preventDefault();
        if(!categoryName) return;

        const category = {
            name: categoryName
        }
        
        try{
            setCategoryLoading(true);

            const existingCategory = categoryList.find(
                (existingCat) => existingCat.name.toLowerCase() === categoryName.toLowerCase()
            );

            if (existingCategory) {
                setSeveritySnackbar("error");
                setMessageSnackbar("Category with the same name already exists");
                setOpenSnackbar(true);
              } else {
                const response = await addNewCategory(category);
                setNewCategoryMessage(response?.message || "");
                setNewCategoryFlag(prevFlag => !prevFlag);
                setSeveritySnackbar("success");
                setMessageSnackbar(response?.message|| "New Category Added Successfully!");
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
            setCategoryName("");
            setCategoryLoading(false);
        }
    }

    const handleDeleteCategory = async (e) => { 
        e.preventDefault();

        try{
            setCategoryLoading(true)
            const deleteResponse = await deleteCategory(categoryId);
            if (categoryList.length === 1) {
                setPageNum(prevPageNum => Math.max(1, prevPageNum - 1)); // Ensure pageNum doesn't go below 1
            }
            setDeleteCategoryFlag(prevFlag => !prevFlag)
            setSeveritySnackbar("success");
            setMessageSnackbar(deleteResponse?.message || "Category Deleted Successfully!");
            setOpenSnackbar(true);
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        } finally {
            setShowOverlay2(false);
            document.body.classList.remove('body-no-scroll');
            setCategoryId("");
            setCategoryLoading(false);
        }
    }

    const handlePreviousPage = () => {
        if(pageNum == 1 || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum - 1);
            fetchCategory(pageNum - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    const handleNextPage = () => {
        if(pageNum == numOfPages || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum + 1);
            fetchCategory(pageNum + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    return(
        <>
            <div className={`category-page ${expand ? "contract" : ""}`}>
                <div className={`category-page-container card ${theme ? "dark" : ""}`}>
                    <div className="category-name-btn-container">
                        <div className="category-header">
                            <h5>Categories</h5>
                        </div>
                        <button className="add-category-btn" onClick={handleOpenOverlay}>
                            Add Category
                        </button>
                    </div>
                    
                    <div className="category-hl-container">
                        <hr className="category-hl" />
                    </div>
                    
                    <div className="row category-list-row">
                        {!loading && categoryList.map((category,index) => (
                            <div className="category-list-container col-lg-6 col-md-6 col-sm-12 col-12" key={index}>
                                <div className={`category-list card ${theme ? "dark" : ""}`} onClick={() => handleMoveToDetails(category)} > 
                                    <h5 className="text-truncate">{category.name}</h5>
                                    <span onClick={(e) => handleOpenDeleteCategory(e, category.id)}>
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

                    {!loading && !categoryList.length && pageNum === 1 && (
                        <div className="search-not-found">
                            No Categories Found!
                        </div>
                    )}

                    <div className="category-pagenation">
                                    <button className={`category-previous-page-btn ${theme ? "dark" : ""}`} onClick={handlePreviousPage}>Previous</button>
                                        <h6 className={`category-page-num-header ${theme ? "dark" : ""}`}> Page {pageNum} of {numOfPages} </h6>
                                    <button className={`category-next-page-btn ${theme ? "dark" : ""}`} onClick={handleNextPage}>Next</button>
                    </div>
                </div>
                
            </div>

            {showOverlay && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h5>New Category</h5>
                        
                        <form className="new-category-form" onSubmit={handleNewCategory}>
                            <div className="new-category-label-input">
                                <label htmlFor="category-name" className={`new-category-label ${theme ? "dark" : ""}`}>
                                    Category Name
                                </label>
                                <input 
                                    type="text"
                                    placeholder="Enter Category name"
                                    className={`new-category-input ${theme ? "dark" : ""}`}
                                    id="category-name"
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    value={categoryName}
                                    onKeyPress={handleNewKeyPress}
                                    required
                                    />
                            </div>

                            <div className="new-category-btn-container">
                                <button className={`new-category-discard-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                                    Discard
                                </button>
                                <button className="new-category-add-btn" type="submit">
                                    Add Category
                                </button>
                            </div>
                        </form>

                        <div className={`loading-container-overlay ${categoryLoading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? "#fff" : "#000"} size={100} />
                        </div>
                    </div>
                </div>
            )}

            {showOverlay2 && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className={`delete-category-header ${theme ? "dark" : ""}`}>Confirm Category Deletion</h4>
                        <h6 className={`delete-category-text ${theme ? "dark" : ""}`}>
                            Deleting the category will result in the <span className="text-danger">deletion of all tools that reside in the category. </span>Are you sure you want to delete this category?
                        </h6>
                        <div className="delete-category-btn-container">
                            <button className={`delete-category-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay2}>
                                No
                            </button>
                            <button className="delete-category-ok-btn" onClick={handleDeleteCategory}>
                                Yes 
                            </button>
                        </div>

                        <div className={`loading-container-overlay ${categoryLoading ? "" : "stop"}`}>
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

export default CategoryPage;