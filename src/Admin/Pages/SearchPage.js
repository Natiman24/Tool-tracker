import React, {useState, useEffect} from "react"
import { useLocation, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/SearchPage.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextTheme } from "../../Contexts/ThemeContext";
import { handleSearching } from "../../Services/ToolApiService";
import { useStateContextSideBar } from "../../Contexts/SideBarContext";

const SearchPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');

    const [searchList, setSearchList] = useState([]);
    const [toolSearchList, setToolSearchList] = useState([]);
    const [employeeSearchList, setEmployeeSearchList] = useState([]);
    const [categorySearchList, setCategorySearchList] = useState([]);
    const [siteSearchList, setSiteSearchList] = useState([]);
    const [loading, SetLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Tool"); //check here
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [searchFlag, setSearchFlag] = useState(false);
    const {theme, setPage, setPageId} = useStateContextTheme();
    const {sideBarExpand} = useStateContextSideBar()

    const expand = sideBarExpand.wide;


    useEffect(() => {
        setTimeout(() => {
            if(!searchQuery && !openSnackbar){
                window.history.back();
            }
        }, 2000)
        
    }, [openSnackbar && searchFlag])

    const handleSearch = async () => {
        if (!searchQuery){
            setSeveritySnackbar("warning");
            setMessageSnackbar("No search query, type your query inside the input box!");
            setOpenSnackbar(true);
            setSearchFlag(a => !a); // check this logic
            
        } else{
            try{
                SetLoading(true);
                const response = await handleSearching(searchQuery);
                setSearchList(response || [])
                setToolSearchList(response?.tools || []);
                setEmployeeSearchList(response?.workers || []);
                setCategorySearchList(response?.categories || []);
                setSiteSearchList(response?.locations || []);
                setPageId(searchQuery);

                if(response.tools.length !== 0){
                    setActiveTab('Tool');
                } else if(response.workers.length !== 0){
                    setActiveTab('Employee');
                } else if(response.categories.length !== 0){
                    setActiveTab('Category');
                } else if(response.locations.length !== 0){
                    setActiveTab('Site');
                } else {
                    setActiveTab('Tool');
                }

                SetLoading(false)
            } catch (error){
                setSeveritySnackbar("error");
                setMessageSnackbar(error?.response?.data?.message || "An error occurred");
                setOpenSnackbar(true);
                SetLoading(false);
            }     
        }
    }

    useEffect(() => {
        setPage("searchPage");
        handleSearch();

    }, [searchQuery]);

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
      }, [theme]);
    
    const handleProductDetails = (tool) => {
        navigate(`/dashboard/product-details?id=${tool.id}`);
    }

    const handleEmployeeDetails = (employee) => {
        navigate(`/employees/details?id=${employee.id}`);
    }

    const handleCategoryDetails = (category) => {
        navigate(`/categories/details?id=${category.id}`);
    }

    const handleSiteDetails = (site) => {
        navigate(`/project-sites/details?id=${site.id}`);
    }

    const ToolPage = () => {
        return(
                <div className="search-page-component-container">
                    <h6>Tools</h6>
                    <table className={`search-page-table ${theme ? "dark" : ""}`}>
                        <thead>
                            <tr> 
                                <th className="search-page-table-header ">
                                    <div className="table-item">
                                        Tool
                                    </div>
                                </th>
                                <th className="search-page-table-header search-page-table-header-active-erasable">
                                    <div className="table-item">
                                        Category
                                    </div>
                                </th>
                                <th className="search-page-table-header ">
                                    <div className="table-item">
                                        Location
                                    </div>
                                </th>
                                <th className="search-page-table-header">
                                    <div className="table-item">
                                        Details
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && toolSearchList.map((tool,index) => (
                                <tr className="search-page-table-row-data" key={index}>
                                    <td className="search-page-table-data ">
                                        <div className="table-item">
                                            {tool?.name || "Loading..."}
                                        </div>
                                    </td>
                                    <td className="search-page-table-data search-page-table-data-active-erasable">
                                        <div className="table-item">
                                            {tool?.category?.name || "Loading..."}
                                        </div>
                                    </td>
                                    <td className="search-page-table-data ">
                                        <div className="table-item">
                                            {tool?.location?.name || "Loading..."}
                                        </div>
                                    </td>
                                    <td className="search-page-table-data">
                                        <button className={`details-search-page-btn-table ${theme ? "dark" : ""}`} onClick={() => handleProductDetails(tool)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && !toolSearchList.length && (
                        <div className="search-not-found">
                            No Tools Found!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>

                </div>
        )
    }

    const EmployeePage = () => {
        return(
                <div className="search-page-component-container">
                    <h6>Employees</h6>
                    <table className={`search-page-table ${theme ? "dark" : ""}`}>
                        <thead>
                            <tr> 
                                <th className="search-page-table-header ">
                                    <div className="table-item">
                                        First Name
                                    </div>
                                </th>
                                <th className="search-page-table-header ">
                                    <div className="table-item">
                                        Last Name
                                    </div>
                                </th>
                                <th className="search-page-table-header search-page-table-header-active-erasable">
                                    <div className="table-item">
                                        Phone Number
                                    </div>
                                </th>
                                <th className="search-page-table-header">
                                    <div className="table-item">
                                        Details
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && employeeSearchList.map((employee,index) => (
                                <tr className="search-page-table-row-data" key={index}>
                                    <td className="search-page-table-data ">
                                        <div className="table-item">
                                        {employee?.firstName ? employee.firstName.charAt(0).toUpperCase() + employee.firstName.slice(1) : "" || 'Loading...'}
                                        </div>
                                    </td>
                                    <td className="search-page-table-data ">
                                        <div className="table-item">
                                        {employee?.lastName ? employee.lastName.charAt(0).toUpperCase() + employee.lastName.slice(1) : "" || ''}
                                        </div>
                                    </td>
                                    <td className="search-page-table-data search-page-table-data-active-erasable">
                                        <div className="table-item">
                                            {employee?.phoneNumber || "Loading..."}
                                        </div>
                                    </td>
                                    <td className="search-page-table-data">
                                        <button className={`details-search-page-btn-table ${theme ? "dark" : ""}`} onClick={() => handleEmployeeDetails(employee)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && !employeeSearchList.length && (
                        <div className="search-not-found">
                            No Employees Found!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>

                </div>
        )
    }

    const CategoryPage = () => {
        return(
                <div className="search-page-component-container">
                    <h6>Categories</h6>
                    <table className={`search-page-table ${theme ? "dark" : ""}`}>
                        <thead>
                            <tr> 
                                <th className="search-page-table-header ">
                                    <div className="table-item">
                                        Category
                                    </div>
                                </th>
                                <th className="search-page-table-header">
                                    <div className="table-item">
                                        Details
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && categorySearchList.map((category, index) => (
                                <tr className="search-page-table-row-data" key={index}>
                                    <td className="search-page-table-data ">
                                        <div className="table-item">
                                            {category?.name || "Loading..."}
                                        </div>
                                    </td>
                                    <td className="search-page-table-data">
                                        <button className={`details-search-page-btn-table ${theme ? "dark" : ""}`} onClick={() => handleCategoryDetails(category)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && !categorySearchList.length && (
                        <div className="search-not-found">
                            No Categories Found!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>
                </div>
        )
    }

    const SitePage = () => {
        return(
                <div className="search-page-component-container">
                    <h6>Sites</h6>
                    <table className={`search-page-table ${theme ? "dark" : ""}`}>
                        <thead>
                            <tr> 
                                <th className="search-page-table-header">
                                    <div className="table-item">
                                        Site
                                    </div>
                                </th>
                                <th className="search-page-table-header">
                                    <div className="table-item">
                                        Details
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && siteSearchList.map((site,index) => (
                                <tr className="search-page-table-row-data" key={index}>
                                    <td className="search-page-table-data ">
                                        <div className="table-item">
                                            {site?.name || "Loading..."}
                                        </div>
                                    </td>
                                    <td className="search-page-table-data">
                                        <button className={`details-search-page-btn-table ${theme ? "dark" : ""}`} onClick={() => handleSiteDetails(site)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && !siteSearchList.length && (
                        <div className="search-not-found">
                            No Sites Found!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>
                </div>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case "Tool":
                return <ToolPage />;
            case "Employee":
                return <EmployeePage />;
            case "Category":
                return <CategoryPage />;  
            case "Site":
                return <SitePage />;
            default:
                return <ToolPage />;
        }
    };
 
    // const renderContent = () => {
    //     const tabsHierarchy = ["Tool", "Employee", "Category", "Site"];

    //     for (const tab of tabsHierarchy) {
    //         switch (tab) {
    //             case "Tool":
    //                 if (toolSearchList.length > 0) {
    //                     setActiveTab("Tool");
    //                     return <ToolPage />;
    //                 }
    //                 break;
    //             case "Employee":
    //                 if (employeeSearchList.length > 0) {
    //                     setActiveTab("Employee");
    //                     return <EmployeePage />;
    //                 }
    //                 break;
    //             case "Category":
    //                 if (categorySearchList.length > 0) {
    //                     setActiveTab("Category");
    //                     return <CategoryPage />;
    //                 }
    //                 break;
    //             case "Site":
    //                 if (siteSearchList.length > 0) {
    //                     setActiveTab("Site");
    //                     return <SitePage />;
    //                 }
    //                 break;
    //             default:
    //                 setActiveTab("Tool");
    //                 return <ToolPage />;
    //                 break;
    //         }
    //     }

    // };

    return(
        <>
            <div className={`search-page ${expand ? "contract" : ""}`}>
                <div className={`search-page-container card ${theme ? "dark" : "" }`}>
                    <div className="search-page-name-btn-container">
                        <div className="search-page-header">
                            <h5>Search Results</h5>
                        </div>
                    </div>

                    <div className="search-page-result-btn-container">
                        <button className={`search-page-tool-btn ${theme ? "dark" : ""} 
                            ${activeTab === "Tool" ? "active" : ""}`}
                            onClick={()=> setActiveTab("Tool")}
                        >
                            Tools
                        </button>

                        <button className={`search-page-employee-btn ${theme ? "dark" : ""}
                            ${activeTab === "Employee" ? "active" : ""}`}
                            onClick={()=> setActiveTab("Employee")}
                        >
                            Employee
                        </button>

                        <button className={`search-page-category-btn ${theme ? "dark" : ""}
                            ${activeTab === "Category" ? "active" : ""}`}
                            onClick={()=> setActiveTab("Category")}
                        >
                            Category
                        </button>

                        <button className={`search-page-site-btn ${theme ? "dark" : ""} 
                            ${activeTab === "Site" ? "active" : ""}`}
                            onClick={()=> setActiveTab("Site")}
                        >
                            Site
                        </button>
                        
                        <hr className="search-page-hl"></hr>
                    </div>
                    <div>
                        {renderContent()}
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
        </>
    )
}

export default SearchPage;