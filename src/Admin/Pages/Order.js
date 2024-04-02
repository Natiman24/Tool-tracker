import React, {useState, useEffect, useLayoutEffect} from "react"
import { useNavigate } from "react-router-dom"
import {useStateContextSideBar} from "../../Contexts/SideBarContext"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/Order.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import { addOrder, fetchOrders, fetchCategories, fetchLocations, fetchAllTools, fetchAllProductByCategory } from "../../Services/ToolApiService"
import { useStateContextOrder } from "../../Contexts/OrderContext"


const OrderPage = () =>{

    const navigate = useNavigate();

    const [orderList, setOrderList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [locationListFiltered, setLocationListFiltered] = useState([]);
    const [toolListFiltered, setToolListFiltered] = useState([]);
    const [toolList, setToolList] = useState([]);
    const [categoryListFiltered, setCategoryListFiltered] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [category, setCategory] = useState("");
    const [tool, setTool] = useState("");
    const [destination, setDestination] = useState("");
    const [loading, setLoading] = useState(false);
    const [newOrderLoading, setNewOrderLoading] = useState(false);
    const [flag, setFlag] = useState(false);
    const [toolFlag, setToolFlag] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [toolListLoading, setToolListLoading] = useState(false);
    const [toolDestinationLoading, setToolDestinationLoading] = useState(false);

    const {sideBarExpand} = useStateContextSideBar();
    const {theme} = useStateContextTheme();
    const {orderDataContext, setOrderDataContext} = useStateContextOrder();

    const expand = sideBarExpand.wide;


    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors        
      }, [theme]);

    
    const handleFetchOrder = async () => {
        try{
            setLoading(true);
            const orders = await fetchOrders();
            const sortedOrders = orders.sort((a, b) => {
                return new Date(b.orderDate) - new Date(a.orderDate);
            });
            setOrderList(sortedOrders || []);
            setLoading(false);
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            setLoading(false);
        }  
    }


    const handleAddOrder = async (e) => {
        e.preventDefault();
        if(!tool || !category ||  !destination) return;

        try{
            setNewOrderLoading(true);
            const newOrder = await addOrder(tool, destination);
            setSeveritySnackbar("success");
            setMessageSnackbar(newOrder?.message || "New Order Initiated");
            setOpenSnackbar(true);
            setFlag(prevState => !prevState);
            setShowOverlay(false);
            setCategory("");
            setTool("");
            setDestination("");
            document.body.classList.remove("body-no-scroll")
            setNewOrderLoading(false);
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            document.body.classList.remove("body-no-scroll")
            setNewOrderLoading(false);
        } 
    }

    const fetchTool = async () => {
        try{
          const data = await fetchAllTools();
          const sortedData = data.sort((a,b) => a.name.localeCompare(b.name))
          setToolList(sortedData || []);
          setToolListFiltered(sortedData || []);
    
        } catch(error)  {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        }
      }

      const fetchCategory = async () => {
        try{
            const categories = await fetchCategories();
            const sortedCategories = categories.sort((a,b) => a.name.localeCompare(b.name))
            setCategoryList(sortedCategories || []);

        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        }
    }

    const fetchLocation = async () => {
        try{
            const locations = await fetchLocations();
            const sortedLocations = locations.sort((a,b) => a.name.localeCompare(b.name))
            setLocationList(sortedLocations || []);

        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        }
    }


    useEffect(() => {
        
        handleFetchOrder();

        

        
        fetchTool();
        fetchCategory();
        fetchLocation();
    }, [flag])


    const fetchToolsByCategory = async () => {
        try{
            if(category){
                setToolListLoading(true);
                const tools = await fetchAllProductByCategory(category);
                const sortedTools = tools.sort((a,b) => a.name.localeCompare(b.name))
                setToolListFiltered(sortedTools || []);
            } else{
                return;
            }
        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            } finally{
                setToolListLoading(false);
            }
    }

    useEffect(() => {
        fetchToolsByCategory();
    },[toolFlag])

    const handleOpenOverlay = () =>{
        fetchTool();
        fetchCategory();
        fetchLocation();
        setShowOverlay(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay = (e) =>{
        e.preventDefault();
        setShowOverlay(false);
        setCategory("");
        setTool("");
        setDestination("");
        setCategoryList([]);
        setLocationListFiltered([]);
        setToolListFiltered(toolList);
        document.body.classList.remove('body-no-scroll');
    }

    const handleDetailOrder = (order) =>{
        setOrderDataContext(order);
        navigate("./details")
    }

    const handleCategoryChange = (event) =>{
        
        const selectedCategoryId = event.target.value;

        if(selectedCategoryId){
            setCategory(selectedCategoryId);
            setTool("");
            setToolListFiltered([]);
            setLocationListFiltered(locationList);
            setToolFlag(prevState => !prevState);
        } else {
            setCategory("");
            fetchTool();
        }
    }

    const handleProductChange = (event) =>{
        const selectedToolId = event.target.value;
        
        if(selectedToolId){
            const selectedTool = toolList.find(tool => tool.id === selectedToolId);
            setTool(selectedTool?.id);
            setCategory(selectedTool?.category?.id);
            setToolDestinationLoading(true);
            fetchToolsByCategory(selectedTool?.category?.id) // check here  remove the parameters in the bracket                                                               
            if(destination === selectedTool?.location?.id){
                setDestination("")
            }
            setLocationListFiltered(
                locationList.filter(location => location?.id !== selectedTool?.location?.id)
            )
            setToolDestinationLoading(false);
        } else {
            setTool("")
            setLocationListFiltered([])
        }
    }

    const handleDestinationChange = (event) =>{
        setDestination(event.target.value);
    }

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

    return(
        <>
            <div className={`order-page ${expand ? "contract" : ""}`}>
                <div className={`order-page-container card ${theme ? "dark" : ""}`}>
                    <div className="order-name-btn-container">
                        <div className="order-header">
                            <h5>Pending Orders</h5>
                        </div>
                        <button className="add-order-btn" onClick={handleOpenOverlay}>
                            Add New Order
                        </button>
                    </div>
                    
                    <div className="order-hl-container">
                        <hr className="order-hl" />
                    </div>

                    <table className="order-table">
                        <thead>
                            <tr>
                                <th className="order-table-header">
                                    <div className="table-item">
                                        Tool
                                    </div>
                                </th>
                                <th className="order-table-header">
                                    <div className="table-item">
                                        Destination
                                    </div>
                                </th>
                                <th className="order-table-header order-table-header-erasable">
                                    <div className="table-item">
                                        Date
                                    </div>
                                </th>
                                <th className="order-table-header">
                                    <div className="table-item">
                                        Action
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && orderList.map((order, index) => (
                                <tr className="order-table-row-data" key={index}>
                                    <td className="order-table-data">
                                        <div className="table-item">
                                            {order?.tool?.name}
                                        </div>
                                    </td>
                                    <td className="order-table-data">
                                        <div className="table-item"> 
                                            {order?.destination?.name}
                                        </div>
                                    </td>
                                    <td className="order-table-data order-table-data-erasable"> 
                                        <div className="table-item">
                                            {formatDate(new Date(order?.orderDate).toLocaleDateString('en-US'))}
                                        </div>
                                    </td>
                                    <td className="order-table-data">
                                        <button className={`detail-order-btn-table ${theme ? "dark" : ""}`} onClick={() => handleDetailOrder(order)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && !orderList.length && (
                        <div className="order-not-found">
                            No Orders Found!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>
                </div>
            </div>

            {showOverlay && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h5>New Order</h5>
                        
                        <form className="new-order-form" onSubmit={handleAddOrder}>
                            <div className="new-order-label-input">
                                <label htmlFor="category" className={`new-order-label ${theme ? "dark" : ""}`}>
                                    Category
                                </label>
                                <select value={category} onChange={handleCategoryChange} className={`new-order-input edit-dropdown-input ${theme ? "dark" : ""}`} id="category">
                                    <option value="">Select Category</option>
                                    {categoryList.map((category, index) => (
                                        <option value={category?.id} key={index}>{category?.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="new-order-label-input">
                                <label htmlFor="product" className={`new-order-label ${theme ? "dark" : ""}`}>
                                    Tool
                                </label>
                                <select value={tool} onChange={handleProductChange} className={`new-order-input edit-dropdown-input ${theme ? "dark" : ""}`} id="product">
                                    <option value="">{toolListLoading ? ("Loading") : (toolListFiltered.length ? "Select Product" : "No Tools") }</option>
                                    {toolListFiltered.map((tool, index) => (
                                        <option value={tool?.id} key={index}>{tool?.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="new-order-label-input">
                                <label htmlFor="destination" className={`new-order-label ${theme ? "dark" : ""}`}>
                                    Destination
                                </label>
                                <select value={destination} onChange={handleDestinationChange} className={`new-order-input edit-dropdown-input ${theme ? "dark" : ""}`} id="destination">
                                    <option value="">Select Destination</option>
                                    {toolDestinationLoading ? ("Loading") : (locationListFiltered.length && locationListFiltered
                                        // .filter((destination) => tool && tool)
                                        .map((destination, index) => (
                                            <option value={destination?.id} key={index}>{destination?.name}</option>
                                    )))}
                                </select>
                            </div>
                            <div className="new-order-btn-container">
                                <button className={`new-order-discard-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                                    Discard
                                </button>
                                <button className="new-order-add-btn" type="submit">
                                    Add Order
                                </button>
                            </div>
                        </form>
                        <div className={`loading-container-overlay ${newOrderLoading ? "" : "stop"}`}>
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

export default OrderPage;