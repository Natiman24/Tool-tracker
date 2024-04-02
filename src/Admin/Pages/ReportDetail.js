import React, {useState, useEffect} from "react"
import CustomSnackbar from "../../Component/Snackbar/Snackbar";
import "../Styles/ReportDetail.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextSideBar } from "../../Contexts/SideBarContext";
import { useStateContextReport } from "../../Contexts/ReportContext";
import { useStateContextTheme } from "../../Contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const ReportDetailPage = () =>{

    const navigate = useNavigate();

    const [reportDetail, setReportDetail] = useState([]);
    const [reportDates, setReportDates] = useState({
        startDate: null,
        endDate: null
    })
    
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [reportFlag, setReportFlag] = useState(false);

    const {sideBarExpand} = useStateContextSideBar();
    const {reportDate, reportDataContext} = useStateContextReport();
    const {theme} = useStateContextTheme();

    const expand = sideBarExpand.wide;

    useEffect(() => {
        setTimeout(() => {
            if(!reportDate.startDate && !reportDate.endDate && !openSnackbar || !reportDataContext && !openSnackbar){
                navigate("/report")
            }
        }, 2000)
        
    }, [openSnackbar && reportFlag])

    useEffect(() => {
        const applyTheme = () => {
            document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5";
        };

        applyTheme();
    }, [theme]);



    useEffect(() => {
        if (reportDate.startDate && reportDate.endDate && reportDataContext) {
            setReportDates(prevState => ({
                ...prevState,
                startDate: new Date(reportDate.startDate),
                endDate: new Date(reportDate.endDate)
            }))
            
            setReportDetail(reportDataContext);
        } else {
            // Use setTimeout to ensure the theme is applied before alerting
                setSeveritySnackbar("warning");
                setMessageSnackbar("No Report Date Chosen, Please go to the report page and generate report first");
                setOpenSnackbar(true);
                setReportFlag(true);
            
        }
    }, []);

    const handleProductDetail = () => {
        navigate(`/dashboard/product-details?id=${reportDetail?.tool?.id}`)
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
            <div className={`report-detail-page ${expand ? "contract" : ""}`}>
                <div className={`report-detail-container card ${theme ? "dark" : ""}`}>
                    <div className="report-detail-name-btn-container">
                        <div className="report-detail-header">
                            {reportDetail?.tool ? (
                                <h5>{reportDetail?.tool?.name || "Loading..."}</h5>
                            ):(<h5>No tool selected</h5>)}                          
                        </div>
                        <div className="report-detail-header-btn-container">
                            <button className={`report-detail-details-btn ${theme ? "dark" : ""}`} onClick={handleProductDetail}>
                                Details
                            </button>
                        </div>
                    </div>
                    <div className="report-detail-hl-container">
                        <hr className="report-detail-hl" />
                    </div>

                    <div className="report-detail-info-container">
                        <h6>Report Details</h6>
                        <div className="report-detail-info">
                            {reportDetail?.tool ? (
                                <table className="report-detail-table">
                                <tbody>
                                    <tr>
                                        <th className={`report-detail-parameter ${theme ? "dark" : ""}`}>
                                            Tool Name
                                        </th>
                                        <td className={`report-detail-parameter-value ${theme ? "dark" : ""}`}>
                                            {reportDetail?.tool?.name || "Loading..."}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={`report-detail-parameter ${theme ? "dark" : ""}`}>
                                            Tool Category
                                        </th>
                                        <td className={`report-detail-parameter-value ${theme ? "dark" : ""}`}>
                                            {reportDetail?.tool?.category?.name || "Loading..."}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={`report-detail-parameter ${theme ? "dark" : ""}`}>
                                            Current Location
                                        </th>
                                        <td className={`report-detail-parameter-value ${theme ? "dark" : ""}`}>
                                            {reportDetail?.tool?.location?.name || "Loading..."}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={`report-detail-parameter ${theme ? "dark" : ""}`}>
                                            Last Moved On
                                        </th>
                                        <td className={`report-detail-parameter-value ${theme ? "dark" : ""}`}>
                                            {formatDate(reportDetail?.tool?.lastMovedOn) || "Loading..."}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={`report-detail-parameter ${theme ? "dark" : ""}`}>
                                            Total Movement
                                        </th>
                                        <td className={`report-detail-parameter-value ${theme ? "dark" : ""}`}>
                                            {reportDetail?.totalMovements || 0}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={`report-detail-parameter ${theme ? "dark" : ""}`}>
                                            Average Movement per Month
                                        </th>
                                        <td className={`report-detail-parameter-value ${theme ? "dark" : ""}`}>
                                            {Math.round((reportDetail?.averageTime) * 100) / 100 || 0}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={`report-detail-parameter ${theme ? "dark" : ""}`}>
                                            Report Date
                                        </th>
                                        <td className={`report-detail-parameter-value ${theme ? "dark" : ""}`}>
                                            {formatDate(reportDates?.startDate.toLocaleDateString('en-US'))} - {formatDate(reportDates?.endDate.toLocaleDateString('en-US'))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            ):(
                                <h5>No Report Generated</h5>
                            )}
                            
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
        </>
    )
}

export default ReportDetailPage;