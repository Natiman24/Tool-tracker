import React, { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import { useStateContextTheme } from "../../Contexts/ThemeContext";
import { useStateContextSideBar } from "../../Contexts/SideBarContext";
import "../Styles/NotificationPage.css"
import "../../Component/Overlay/Overlay.css"
import { archiveNotification, deleteNotification, fetchArchivedNotification, fetchNotification, fetchOrderNotification, fetchUserNotification } from "../../Services/ToolApiService";

const NotificationPage = () => {
    const navigate = useNavigate();
    

    const [notificationList, setNotificationList] = useState([]);
    const [orderNotificationList, setOrderNotificationList] = useState([]);
    const [userNotificationList, setUserNotificationList] = useState([]);
    const [archivedNotificationList, setArchivedNotifationList] = useState([]);
    const [loading, SetLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);
    const [showDeleteNotificationOverlay, setShowDeleteNotificationOverlay] = useState(false);
    const [showArchiveNotificationOverlay, setShowArchiveNotificationOverlay] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const [flag, setFlag] = useState(false);
    const [notificationDetail, setNotificationDetail] = useState([]);
    const [notificationDetailArchive, setNotificationDetailArchive] = useState([]);
    const [notificationDetailDelete, setNotificationDetailDelete] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const {theme, setPage, setPageId} = useStateContextTheme();
    const {sideBarExpand} = useStateContextSideBar()

    const expand = sideBarExpand.wide;


    const handleNotification = async () => {
            try{
                SetLoading(true);
                switch (activeTab) {
                    case "All":
                        const responseAll = await fetchNotification();
                        const sortedNotification = responseAll.reverse();
                        setNotificationList(sortedNotification || []);
                        break;
                    case "User":
                        const responseUser = await fetchUserNotification();
                        const sortedNotificationUser = responseUser.reverse();
                        setUserNotificationList(sortedNotificationUser || []);
                        break;  
                    case "Order":
                        const responseOrder = await fetchOrderNotification();
                        const sortedNotificationOrder = responseOrder.reverse();
                        setOrderNotificationList(sortedNotificationOrder || []);
                        break;
                    case "Archive":
                        const archives = await fetchArchivedNotification();
                        const sortedNotificationArchive = archives.reverse();
                        setArchivedNotifationList(sortedNotificationArchive || []);
                        break;
                    default:
                        break;
                }
                SetLoading(false)
            } catch (error){
                setSeveritySnackbar("error");
                setMessageSnackbar(error?.response?.data?.message || "An error occurred");
                setOpenSnackbar(true);
            } finally{
                SetLoading(false);
            }    
        
    }

    useEffect(() => {
        handleNotification();
    }, [flag, activeTab]);

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
      }, [theme]);
    

    const handleOpenNotificationDetailOverlay = (notification) => {
        setNotificationDetail(notification);
        setShowNotificationOverlay(true);
        document.body.classList.add("body-no-scroll")
    }

    const handleCloseNotificationDetailOverlay = () => {
        setShowNotificationOverlay(false);
        document.body.classList.remove("body-no-scroll")
        setNotificationDetail([]);
    }

    const handleOpenNotificationDeleteOverlay = (notification, e) => {
        e.stopPropagation();
        setNotificationDetailDelete(notification);
        setShowDeleteNotificationOverlay(true);
        document.body.classList.add("body-no-scroll")
    }

    const handleOpenNotificationDeleteOverlay2 = () => {
        setNotificationDetailDelete(notificationDetail);
        setShowNotificationOverlay(false);
        setShowDeleteNotificationOverlay(true);
        document.body.classList.add("body-no-scroll");
    }

    const handleCloseNotificationDeleteOverlay = () => {
        setShowDeleteNotificationOverlay(false);
        document.body.classList.remove("body-no-scroll")
        setNotificationDetailDelete([]);
    }

    const handleOpenNotificationArchiveOverlay = (notification, e) => {
        e.stopPropagation()
        setNotificationDetailArchive(notification)
        setShowArchiveNotificationOverlay(true);
        document.body.classList.add("body-no-scroll")
    }

    const handleCloseNotificationArchiveOverlay = () => {
        setShowArchiveNotificationOverlay(false);
        document.body.classList.remove("body-no-scroll")
        setNotificationDetailArchive([]);
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
    
    const handleArchiveNotification = async () => {
        try {
            setNotificationLoading(true)
            const archiveMessage = await archiveNotification(notificationDetailArchive.id);
            setSeveritySnackbar("success");
            setMessageSnackbar(archiveMessage?.message || "Notification Archived Successfully");
            setOpenSnackbar(true);
            setFlag(prevState => !prevState)
            setShowArchiveNotificationOverlay(false)
            document.body.classList.remove("body-no-scroll")
            setNotificationLoading(false)
        }  catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            
            setFlag(prevState => !prevState)
        } finally{
            
            setShowArchiveNotificationOverlay(false);
            document.body.classList.remove("body-no-scroll")
            setNotificationLoading(false);
        }
    }

    const handleDeleteNotification = async () => {
        try {
            setNotificationLoading(true)
            const deleteMessage = await deleteNotification(notificationDetailDelete.id);
            setSeveritySnackbar("success");
            setMessageSnackbar(deleteMessage?.message || "Notification Deleted Successfully");
            setOpenSnackbar(true);
            setFlag(prevState => !prevState)
            setShowDeleteNotificationOverlay(false)
            document.body.classList.remove("body-no-scroll")
            setNotificationLoading(false)
        }  catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);

            setFlag(prevState => !prevState)
        } finally{
            
            setShowDeleteNotificationOverlay(false);
            document.body.classList.remove("body-no-scroll")
            setNotificationLoading(false);
        }
    }


    const AllNotificationPage = () => {
        return(
                <div className="notification-page-component-container">
                    <h6>All Notification</h6>
                    <div className="notification-card-container row">
                        {!loading && notificationList.map((notification, index) => {
                            // Determine the appropriate icon class based on notificationType
                            let iconClass = "";
                            if (notification.notificationType === "USER") {
                                iconClass = "fa-solid fa-user notification-type-icon";
                            } else if (notification.notificationType === "MOVEMENT") {
                                iconClass = "fa-solid fa-location-dot notification-type-icon";
                            } else if (notification.notificationType === "PASSWORD") {
                                iconClass = "fa-solid fa-key notification-type-icon";
                            }
                            return(
                                <div className={`notification-card card ${theme ? "dark" : ""}`} key={index} onClick={() => handleOpenNotificationDetailOverlay(notification)}>
                                    <table className="notification-detail-table first">
                                        <tbody>
                                            <tr>
                                                <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                    <span className={iconClass}></span> 
                                                </th>
                                                <td className={`notification-detail-parameter-value date ${theme ? "dark" : ""}`}>
                                                    {formatDate(notification.date)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                    {notification.message}
                                                </th>
                                                <td className={`notification-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                    <button className="notification-card-archive-btn" onClick={(e) => handleOpenNotificationArchiveOverlay(notification, e)}>
                                                        Archive
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className="notification-detail-table second">
                                        <tbody>
                                            <tr>
                                                <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                    <span className={iconClass}></span>
                                                </th>
                                                <td className={`notification-detail-parameter-value date ${theme ? "dark" : ""}`}>
                                                    {formatDate(notification.date)}
                                                </td>
                                            </tr>
                                            <tr className="notification-detail-parameter-row second">
                                                <th className={`notification-detail-parameter second ${theme ? "dark" : ""}`}>
                                                    {notification.message}
                                                </th>
                                            </tr>
                                            <tr>
                                                <td className={`notification-detail-parameter-value second ${theme ? "dark" : ""}`}>
                                                    <button className="notification-card-archive-btn" onClick={(e) => handleOpenNotificationArchiveOverlay(notification, e)}>
                                                        Archive
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                        )})}
                    </div>

                    {!loading && !notificationList.length && (
                        <div className="notification-not-found">
                            No Notification Found!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>

                </div>
        )
    }

    const UserNotificationPage = () => {
        return(
                <div className="notification-page-component-container">
                    <h6>User Notification</h6>
                    
                    <div className="notification-card-container row">
                        {!loading && userNotificationList.map((notification, index) => (
                            <div className={`notification-card card ${theme ? "dark" : ""}`} key={index} onClick={() => handleOpenNotificationDetailOverlay(notification)}>
                                <table className="notification-detail-table first">
                                    <tbody>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                <span className="fa-solid fa-user notification-type-icon"></span>
                                            </th>
                                            <td className={`notification-detail-parameter-value date ${theme ? "dark" : ""}`}>
                                                {formatDate(notification.date)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                {notification.message}
                                            </th>
                                            <td className={`notification-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                <button className="notification-card-archive-btn" onClick={(e) => handleOpenNotificationArchiveOverlay(notification, e)}>
                                                    Archive
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="notification-detail-table second">
                                    <tbody>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                {/* {notification.id} */} <span className="fa-regular fa-user notification-type-icon"></span>
                                            </th>
                                            <td className={`notification-detail-parameter-value date ${theme ? "dark" : ""}`}>
                                                {formatDate(notification.date)}
                                            </td>
                                        </tr>
                                        <tr className="notification-detail-parameter-row second">
                                            <th className={`notification-detail-parameter second ${theme ? "dark" : ""}`}>
                                                {notification.message}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className={`notification-detail-parameter-value second ${theme ? "dark" : ""}`}>
                                                <button className="notification-card-archive-btn" onClick={(e) => handleOpenNotificationArchiveOverlay(notification, e)}>
                                                    Archive
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>

                    {!loading && !userNotificationList.length && (
                        <div className="notification-not-found">
                            No User Notificaiton Found!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>

                </div>
        )
    }

    const OrderNotificationPage = () => {
        return(
                <div className="notification-page-component-container">
                    <h6>Order Notification</h6>
                    
                    <div className="notification-card-container row">
                        {!loading && orderNotificationList.map((notification, index) => (
                            <div className={`notification-card card ${theme ? "dark" : ""}`} key={index} onClick={() => handleOpenNotificationDetailOverlay(notification)}>
                                <table className="notification-detail-table first">
                                    <tbody>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                {/* {notification.id} */} <span className="fa-solid fa-location-dot notification-type-icon"></span>
                                            </th>
                                            <td className={`notification-detail-parameter-value date ${theme ? "dark" : ""}`}>
                                                {formatDate(notification.date)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                {notification.message}
                                            </th>
                                            <td className={`notification-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                <button className="notification-card-archive-btn" onClick={(e) => handleOpenNotificationArchiveOverlay(notification, e)}>
                                                    Archive
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="notification-detail-table second">
                                    <tbody>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                {/* {notification.id} */} <span className="fa-solid fa-location-dot notification-type-icon"></span>
                                            </th>
                                            <td className={`notification-detail-parameter-value date ${theme ? "dark" : ""}`}>
                                                {formatDate(notification.date)}
                                            </td>
                                        </tr>
                                        <tr className="notification-detail-parameter-row second">
                                            <th className={`notification-detail-parameter second ${theme ? "dark" : ""}`}>
                                                {notification.message}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className={`notification-detail-parameter-value second ${theme ? "dark" : ""}`}>
                                                <button className="notification-card-archive-btn" onClick={(e) => handleOpenNotificationArchiveOverlay(notification, e)}>
                                                    Archive
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>

                    {!loading && !orderNotificationList.length && (
                        <div className="notification-not-found">
                            No Order Notificaiton Found!
                        </div>
                    )}

                    <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>

                </div>
        )
    }

    const ArchivedNotificationPage = () => {
        return(
                <div className="notification-page-component-container">
                    <h6>Archived Notification</h6>

                    <div className="notification-card-container row">
                        {!loading && archivedNotificationList.map((notification, index) => {
                            // Determine the appropriate icon class based on notificationType
                            let iconClass = "";
                            if (notification.notificationType === "USER") {
                                iconClass = "fa-solid fa-user notification-type-icon";
                            } else if (notification.notificationType === "MOVEMENT") {
                                iconClass = "fa-solid fa-location-dot notification-type-icon";
                            } else if (notification.notificationType === "PASSWORD") {
                                iconClass = "fa-solid fa-key notification-type-icon";
                            }
                            return(
                                <div className={`notification-card card ${theme ? "dark" : ""}`} key={index} onClick={() => handleOpenNotificationDetailOverlay(notification)}>
                                <table className="notification-detail-table first">
                                    <tbody>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                <span className={iconClass}></span>
                                            </th>
                                            <td className={`notification-detail-parameter-value date ${theme ? "dark" : ""}`}>
                                                {formatDate(notification.date)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                {notification.message}
                                            </th>
                                            <td className={`notification-detail-parameter-value ${theme ? "dark" : ""}`}>
                                                <button className="notification-card-archive-btn" onClick={(e) => handleOpenNotificationDeleteOverlay(notification, e)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="notification-detail-table second">
                                    <tbody>
                                        <tr>
                                            <th className={`notification-detail-parameter ${theme ? "dark" : ""}`}>
                                                <span className={iconClass}></span>
                                            </th>
                                            <td className={`notification-detail-parameter-value date ${theme ? "dark" : ""}`}>
                                                {formatDate(notification.date)}
                                            </td>
                                        </tr>
                                        <tr className="notification-detail-parameter-row second">
                                            <th className={`notification-detail-parameter second ${theme ? "dark" : ""}`}>
                                                {notification.message}
                                            </th>
                                        </tr>
                                        <tr>
                                            <td className={`notification-detail-parameter-value second ${theme ? "dark" : ""}`}>
                                                <button className="notification-card-archive-btn" onClick={(e) => handleOpenNotificationDeleteOverlay(notification, e)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )})}
                    </div>

                    {!loading && !archivedNotificationList.length && (
                        <div className="notification-not-found">
                            No Archived Notifications Found!
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
            case "All":
                return <AllNotificationPage />;
            case "User":
                return <UserNotificationPage />;
            case "Order":
                return <OrderNotificationPage/>;
            case "Archive":
                return <ArchivedNotificationPage />;
            default:
                return <AllNotificationPage />;
        }
    };

    return(
        <>
            <div className={`notification-page ${expand ? "contract" : ""}`}>
                <div className={`notification-page-container card ${theme ? "dark" : "" }`}>
                    <div className="notification-page-name-btn-container">
                        <div className="notification-page-header">
                            {activeTab === "Archive" ? (    <h5>Archives</h5>   ) : (   <h5>Notifications</h5>  )}
                        </div>
                        <span className={`notification-archive-icon ${theme ? "dark" : ""} ${activeTab === "Archive" ? "active" : ""}`} onClick={() => setActiveTab("Archive")}>
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier"> <path d="M7 20H6C4.89543 20 4 19.1046 4 18V8H20V18C20 19.1046 19.1046 20 18 20H17" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M6 4H18L20 8H4L6 4Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
                                <path d="M12 14L12 20M12 20L14.5 17.5M12 20L9.5 17.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
                            </svg>
                        </span>
                    </div>

                    <div className="notification-page-result-btn-container">
                        <button className={`notification-page-all-btn ${theme ? "dark" : ""} 
                            ${activeTab === "All" ? "active" : ""}`}
                            onClick={()=> setActiveTab("All")}
                        >
                            All
                        </button>

                        <button className={`notification-page-order-btn ${theme ? "dark" : ""}
                            ${activeTab === "User" ? "active" : ""}`}
                            onClick={()=> setActiveTab("User")}
                        >
                            User
                        </button>

                        <button className={`notification-page-password-btn ${theme ? "dark" : ""}
                            ${activeTab === "Order" ? "active" : ""}`}
                            onClick={()=> setActiveTab("Order")}
                        >
                            Order
                        </button>
                        
                        <hr className="notification-page-hl"></hr>
                    </div>
                    <div>
                        {renderContent()}
                    </div>
                </div>
            </div>

            {showNotificationOverlay && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className={`notification-detail-overlay-header ${theme ? "dark" : ""}`}>Notification Detail</h4>
                        <p className={`notification-detail-overlay-text ${theme ? "dark" : ""}`}>{notificationDetail?.detail}</p>
                        <div className="notification-detail-overlay-btn-container">
                            <button className={`notification-detail-overlay-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseNotificationDetailOverlay}>
                                Close
                            </button>
                            <button className="notification-detail-overlay-ok-btn" onClick={handleOpenNotificationDeleteOverlay2}>
                                Delete
                            </button>
                        </div>
                        <div className={`loading-container-overlay ${notificationLoading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? "#fff" : "#000"} size={100} />
                        </div>
                    </div>
                </div>
            )}

            {showDeleteNotificationOverlay && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className={`notification-detail-overlay-header ${theme ? "dark" : ""}`}>Delete Notification</h4>
                        <p className={`notification-detail-overlay-text ${theme ? "dark" : ""}`}>Are you sure you want to delete the notification</p>
                        <div className="notification-detail-overlay-btn-container">
                            <button className={`notification-detail-overlay-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseNotificationDeleteOverlay}>
                                No
                            </button>
                            <button className="notification-detail-overlay-ok-btn" onClick={handleDeleteNotification}>
                                Yes
                            </button>
                        </div>
                        <div className={`loading-container-overlay ${notificationLoading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? "#fff" : "#000"} size={100} />
                        </div>
                    </div>
                </div>
            )}

            {showArchiveNotificationOverlay && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className={`notification-detail-overlay-header ${theme ? "dark" : ""}`}>Archive Notification</h4>
                        <p className={`notification-detail-overlay-text ${theme ? "dark" : ""}`}>Are you sure you want to Archive the notification</p>
                        <div className="notification-detail-overlay-btn-container">
                            <button className={`notification-detail-overlay-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseNotificationArchiveOverlay}>
                                No
                            </button>
                            <button className="notification-detail-overlay-ok-btn" onClick={handleArchiveNotification}>
                                Yes
                            </button>
                        </div>
                        <div className={`loading-container-overlay ${notificationLoading ? "" : "stop"}`}>
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

export default NotificationPage;