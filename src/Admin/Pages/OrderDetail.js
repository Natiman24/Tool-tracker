import React, {useState, useEffect} from "react"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../../Component/Overlay/Overlay.css"
import "../Styles/OrderDetail.css"
import { useStateContextSideBar } from "../../Contexts/SideBarContext";
import { useStateContextTheme } from "../../Contexts/ThemeContext";
import { cancelOrder, completeOrder } from "../../Services/ToolApiService";
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom";
import { useStateContextOrder } from "../../Contexts/OrderContext"

const OrderDetailPage = () =>{

    const navigate = useNavigate();

    const [orderDetail, setOrderDetail] = useState([]);
    const [userId, setUserId] = useState("");
    const [toolId, setToolId] = useState("");
    const [showMoveOverlay, setShowMoveOverlay] = useState(false);
    const [showCancelOverlay, setShowCancelOverlay] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [decodedToken, setDecodedToken] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [cancelFlag, setCancelFlag] = useState(false);
    const [orderFlag, setOrderFlag] = useState(false);

    const {sideBarExpand} = useStateContextSideBar();
    const {theme} = useStateContextTheme();
    const {orderDataContext, setOrderDataContext} = useStateContextOrder();
;
    const expand = sideBarExpand.wide;

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5";
      }, [theme]);


    useEffect(() => {
        if(cancelFlag && !openSnackbar){
            setShowCancelOverlay(false);
            setShowMoveOverlay(false);
            document.body.classList.remove('body-no-scroll');
            setOrderDataContext([]);
            setLoading(false);
            navigate("/orders");
        }
    }, [openSnackbar && cancelFlag])

    useEffect(() => {
        
            if(orderFlag && !openSnackbar){ // check why it doesnt work with length also removed the set time out
                navigate("/orders")
            }
       
        
    }, [openSnackbar && orderFlag])

    

    useEffect(() => {
        setLoading(true);

        if (orderDataContext.tool) {
            orderDataContext.orderDate = new Date(orderDataContext.orderDate);
            setOrderDetail(orderDataContext);
            setToolId(orderDataContext.tool?.id || "")
            setLoading(false);
        } else {
            // Use setTimeout to ensure the theme is applied before alerting
                setSeveritySnackbar("warning");
                setMessageSnackbar( "No Order Chosen, Please go to the order page and select order");
                setOpenSnackbar(true);
                setOrderFlag(true);
                
        }

        const token = sessionStorage.getItem('authToken');
        if(token){
            const decoded = jwtDecode(token);
            setDecodedToken(decoded);
            setUserId(decoded.sub);
        } else {
            alert("No token found, login again");
            navigate("");
        }
    }, []);  

    const handleOpenMoveOverlay = () => {
        setShowMoveOverlay(true);
        document.body.classList.add("body-no-scroll");
    }

    const handleCloseMoveOverlay = () => {
        setShowMoveOverlay(false);
        document.body.classList.remove("body-no-scroll");
    }

    const handleOpenCancelOverlay = () => {
        setShowCancelOverlay(true);
        document.body.classList.add("body-no-scroll");
    }

    const handleCloseCancelOverlay = () => {
        setShowCancelOverlay(false);
        document.body.classList.remove("body-no-scroll");
    }

    const handleCancelOrder = async () => {
        try{
            setOrderLoading(true);
            const response = await cancelOrder(toolId);
            setSeveritySnackbar("success");
            setMessageSnackbar("Order Canceled!");
            setOpenSnackbar(true);
            setCancelFlag(true);
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            document.body.classList.remove("body-no-scroll");    
            setShowCancelOverlay(false);
            setOrderLoading(false);

        }
    }

    const handleCompleteOrder = async () => {
        // when token is available, extract the id of the user and send it with toolId to complete order
        try{
            setOrderLoading(true);
            const response = await completeOrder(toolId, userId);
            setSeveritySnackbar("success");
            setMessageSnackbar(response?.message || "Order Completed!");
            setOpenSnackbar(true);
            setCancelFlag(true);
        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            document.body.classList.remove("body-no-scroll"); 
            setShowMoveOverlay(false);
            setOrderLoading(false);
        } 
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
            <div className={`order-detail-page ${expand ? "contract" : ""}`}>
                <div className={`order-detail-container card ${theme ? "dark" : ""}`}>
                    <div className="order-detail-name-btn-container">
                        <div className="order-detail-header">
                        {orderDetail?.tool ? (
                                <h5>{orderDetail?.tool.name || "Loading..."}</h5>
                            ):(<h5>No tool selected</h5>)} 
                        </div>
                        <div className="order-detail-header-btn-container">
                            <button className={`order-detail-move-btn ${theme ? "dark" : ""}`} onClick={handleOpenMoveOverlay}>
                                Move
                            </button>
                            <button className={`order-detail-cancel-btn ${theme ? "dark" : ""}`} onClick={handleOpenCancelOverlay}>
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="order-detail-hl-container">
                        <hr className="order-detail-hl" />
                    </div>

                    <div className="order-detail-info-container">
                        <h6>Order Details</h6>
                        <div className="order-detail-info">
                            {orderDetail?.tool ? (
                                <table className="order-detail-table">
                                    <tbody>
                                        <tr>
                                            <th className={`order-detail-parameter ${theme ? "dark" : ""}`}>
                                                Tool Name
                                            </th>
                                            <td className={`order-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                {orderDetail?.tool.name || "Loading..."}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={`order-detail-parameter ${theme ? "dark" : ""}`}>
                                                Tool Category
                                            </th>
                                            <td className={`order-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                {orderDetail?.tool.category?.name || "Loading..."} 
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={`order-detail-parameter ${theme ? "dark" : ""}`}>
                                                Current Location
                                            </th>
                                            <td className={`order-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                {orderDetail?.tool.location?.name || "Loading..."}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={`order-detail-parameter ${theme ? "dark" : ""}`}>
                                                Destination
                                            </th>
                                            <td className={`order-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                {orderDetail?.destination?.name || "Loading..."}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={`order-detail-parameter ${theme ? "dark" : ""}`}>
                                                Order Date
                                            </th>
                                            <td className={`order-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                {formatDate(orderDetail?.orderDate.toLocaleDateString('en-US')) || "Loading..."}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <h5>No Order Selected</h5>
                            )}
                            <div className={`loading-container ${!orderDataContext && loading ? "" : "stop"}`}>
                                <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showMoveOverlay &&(
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className={`order-detail-overlay-header ${theme ? "dark" : ""}`}>Complete Order</h4>
                        <h6 className={`order-detail-overlay-text ${theme ? "dark" : ""}`}>Are you sure you finished the order?</h6>
                        <div className="order-detail-overlay-btn-container">
                            <button className={`order-detail-overlay-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseMoveOverlay}>
                                No
                            </button>
                            <button className="order-detail-overlay-ok-btn" onClick={handleCompleteOrder}>
                                Yes 
                            </button>
                        </div>
                        <div className={`loading-container-overlay ${orderLoading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? "#fff" : "#000"} size={100} />
                        </div>
                    </div>
                </div>
            )}

            {showCancelOverlay &&(
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className={`order-detail-overlay-header ${theme ? "dark" : ""}`}>Cancel Order</h4>
                        <h6 className={`order-detail-overlay-text ${theme ? "dark" : ""}`}>Are you sure you want to cancel the order?</h6>
                        <div className="order-detail-overlay-btn-container">
                            <button className={`order-detail-overlay-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseCancelOverlay}>
                                No
                            </button>
                            <button className="order-detail-overlay-ok-btn" onClick={handleCancelOrder}>
                                Yes 
                            </button>
                        </div>
                        <div className={`loading-container-overlay ${orderLoading ? "" : "stop"}`}>
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

export default OrderDetailPage;