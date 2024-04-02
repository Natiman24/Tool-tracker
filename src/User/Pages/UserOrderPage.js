import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/UserOrderPage.css"
import "../../Component/Overlay/Overlay.css"
import { fetchOrders, fetchToken } from "../../Services/ToolApiService";
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import { useStateContextOrder } from "../../Contexts/OrderContext"


const UserOrderPage = () => {

    const navigate = useNavigate();

    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);

    const {theme} = useStateContextTheme();
    const {setOrderDataContext} = useStateContextOrder();


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

    

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; 
      }, [theme]);

    useEffect(() => {
        fetchToken()
    }, [])

    useEffect(() => {
        handleFetchOrder()
 
      }, []);

    const handleDetailUserOrder = (order) =>{
        setOrderDataContext(order);
        navigate("./details")
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
            <div className="user-order-page">
                    <div className={`user-order-page-container card ${theme ? "dark" : ""}`}>
                        <div className="user-order-name-btn-container">
                            <div className="user-order-header">
                                <h5>Pending Orders</h5>
                            </div>
                        </div>
                        
                        <div className="user-order-hl-container">
                            <hr className="user-order-hl" />
                        </div>

                        <table className="user-order-table">
                            <thead>
                                <tr>
                                    <th className="user-order-table-header">
                                        <div className="table-item">
                                            Tool
                                        </div>
                                    </th>
                                    <th className="user-order-table-header">
                                        <div className="table-item">
                                            Destination
                                        </div>
                                    </th>
                                    <th className="user-order-table-header user-order-table-header-erasable">
                                        <div className="table-item">
                                            Date
                                        </div>
                                    </th>
                                    <th className="user-order-table-header">
                                        <div className="table-item">
                                            Action
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && orderList.map((order, index) => (
                                    <tr className="user-order-table-row-data" key={index}>
                                        <td className="user-order-table-data">
                                            <div className="table-item">
                                                {order?.tool?.name}
                                            </div>
                                        </td>
                                        <td className="user-order-table-data">
                                            <div className="table-item"> 
                                                {order?.destination?.name}
                                            </div>
                                        </td>
                                        <td className="user-order-table-data user-order-table-data-erasable"> 
                                            <div className="table-item">
                                            {formatDate(new Date(order?.orderDate).toLocaleDateString('en-US'))}
                                            </div>
                                        </td>
                                        <td className={`user-order-table-data`}>
                                            <button className={`detail-user-order-btn-table ${theme ? "dark" : ""}`} onClick={() => handleDetailUserOrder(order)}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {!loading && !orderList.length  && (
                            <div className="order-not-found">
                                No Orders Found!
                            </div>
                        )}

                        <div className={`loading-container ${loading ? "" : "stop"}`}>
                                <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
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

export default UserOrderPage;