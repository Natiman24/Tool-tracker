import React, {useState, useEffect} from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/Report.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextSideBar } from "../../Contexts/SideBarContext";
import { useNavigate } from "react-router-dom";
import { generateReport } from "../../Services/ToolApiService";
import { useStateContextReport } from "../../Contexts/ReportContext";
import { useStateContextTheme } from "../../Contexts/ThemeContext";

const customTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#4caf50", // Adjust the primary color as needed
      primary75: "#1a4b11", // Adjust the primary light color as needed
    },
  });

const ReportPage = () =>{

    const navigate = useNavigate();

    const [reportData, setReportData] = useState([]);
    const [initialDate, setInitialDate] = useState(null);
    const [finalDate, setFinalDate] = useState(null); 
    const [initialDateReport, setInitialDateReport] = useState(null);
    const [finalDateReport, setFinalDateReport] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);

    const {sideBarExpand} = useStateContextSideBar();
    const {reportDate, reportDataContext, setReportDate, setReportDataContext} = useStateContextReport();
    const {theme} = useStateContextTheme();
 
    const expand = sideBarExpand.wide;


    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
      }, [theme]);

    useEffect(() => {
        if(reportDate.startDate && reportDataContext.tool){
            setInitialDate(new Date (reportDate.startDate));
            setFinalDate(new Date (reportDate.endDate));
            setInitialDateReport(reportDate.startDate);
            setFinalDateReport(reportDate.endDate);
        }
    }, [reportDataContext])


    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
        //   handleGenerateReport(event);
        }
      };
    
    const handleResetDate = () => {
        setInitialDate(null);
        setFinalDate(null);
        setInitialDateReport(null);
        setFinalDateReport(null);
        setReportDataContext([]);
        setReportDate(
            prevState => ({
                ...prevState,
                startDate: null,
                endDate: null
            })
        )
    }



    const handleGenerateReport = async () => {
        if(!initialDate && !finalDate) {
            const dates = new Date();
            setReportData([]);
            setInitialDate(dates);
            setFinalDate(dates);
            setInitialDateReport(dates);
            setFinalDateReport(dates);
            const formattedInitialDate = dates ? new Date(dates).toLocaleDateString('en-CA') : null;
            const formattedFinalDate = dates ? new Date(dates).toLocaleDateString('en-CA') : null;
            var date = {
                startDate: formattedInitialDate,
                endDate: formattedFinalDate
            }
        } else if (initialDate && !finalDate){
            const dates = new Date();
            setReportData([]);
            setFinalDate(dates);
            setInitialDateReport(initialDate);
            setFinalDateReport(dates);
            const formattedInitialDate = initialDate ? new Date(initialDate).toLocaleDateString('en-CA') : null;
            const formattedFinalDate = dates ? new Date(dates).toLocaleDateString('en-CA') : null;
            var date = {
                startDate: formattedInitialDate,
                endDate: formattedFinalDate
            }
        }else {
            setReportData([]);
            setInitialDateReport(initialDate);
            setFinalDateReport(finalDate);
            const formattedInitialDate = initialDate ? new Date(initialDate).toLocaleDateString('en-CA') : null;
            const formattedFinalDate = finalDate ? new Date(finalDate).toLocaleDateString('en-CA') : null;
            var date = {
                startDate: formattedInitialDate,
                endDate: formattedFinalDate
            }
        }

        


        try{
            setReportLoading(true);
            const report = await generateReport(date);
            const sortedReport = report.sort((a, b) => a?.tool?.name.localeCompare(b?.tool?.name))
            setReportData(sortedReport || []);
        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        } finally{
            setReportLoading(false);
        }
    }

    const handleMoveToDetail = (toolReport) => {
        setReportDataContext(toolReport);
        setReportDate(prevState => ({
            ...prevState,
            startDate: initialDateReport,
            endDate: finalDateReport,
        }))
        

        navigate("./details")
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

    const minDate = new Date('2024-01-01');

    return(
        <>
            <div className={`report-page ${expand ? "contract" : ""}`}>
                <div className={`report-page-container card ${theme ? "dark" : ""}`}>
                    <div className="report-name-btn-container">
                        <div className="report-label-input-container">
                            <div className="report-label-input">
                                <label htmlFor="initial-date" className={`report-label ${theme ? "dark" : ""}`}>
                                    Initial Date:
                                </label>
                                <DatePicker
                                    selected={initialDate}
                                    onChange={(date) => setInitialDate(date)}
                                    selectsStart
                                    minDate={minDate}
                                    startDate={initialDate}
                                    endDate={finalDate}
                                    maxDate={finalDate || new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    showTimeSelect={false}
                                    className={`custom-datepicker report-input ${theme ? "dark" : ""}`}
                                    calendarClassName="custom-calendar"
                                    theme={customTheme}
                                    onKeyPress={handleKeyPress}
                                    id="initial-date"
                                    />

                                <span className="fa-regular fa-calendar report-calendar-icon"></span>
                            </div>
                    

                            <div className="report-label-input report-final-date-input">
                                <label htmlFor="final-date" className={`report-label ${theme ? "dark" : ""}`}>
                                    Final Date:
                                </label>
                                <DatePicker
                                    selected={finalDate}
                                    onChange={(date) => setFinalDate(date)}
                                    selectsEnd
                                    startDate={initialDate}
                                    endDate={finalDate}
                                    minDate={initialDate || minDate}
                                    maxDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    showTimeSelect={false}
                                    className={`custom-datepicker report-input ${theme ? "dark" : ""}`}
                                    calendarClassName="custom-calendar"
                                    theme={customTheme}
                                    onKeyPress={handleKeyPress}
                                    id="final-date"
                                    />

                                <span className="fa-regular fa-calendar report-calendar-icon"></span>
                            </div>
                        </div>

                        <div className={`report-header ${theme ? "dark" : ""}`}>
                            <h5>Report: {initialDateReport ? formatDate(initialDateReport.toLocaleDateString('en-US')) : 'Select start date'} - 
                            {finalDateReport ? formatDate(finalDateReport.toLocaleDateString('en-US')) : 'Select end date'}</h5>
                            <div className="report-header-btn-container">
                                <button className={`report-reset-btn ${theme ? "dark" : ""}`} onClick={handleResetDate}>
                                    Reset
                                </button>
                                <button className="report-generate-btn" onClick={handleGenerateReport}>
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="report-hl-container">
                            <hr className="report-hl" />
                    </div>

                    <table className="report-table">
                        <thead>
                            <tr>
                                <th className="report-table-header">
                                    <div className="table-item">
                                        Tool
                                    </div>
                                </th>
                                <th className="report-table-header report-table-header-erasable">
                                    <div className="table-item">
                                        Category
                                    </div>
                                </th>
                                <th className="report-table-header">
                                    <div className="table-item">
                                        Total Movement
                                    </div>
                                </th>
                                <th className="report-table-header">
                                    <div className="table-item">
                                        Action
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData && reportData.map((report, index) => (
                                <tr className="report-table-row-data" key={index}>
                                    <td className="report-table-data">
                                        <div className="table-item">
                                            {report?.tool?.name || "Loading..."}
                                        </div>
                                    </td>
                                    <td className="report-table-data report-table-data-erasable">
                                        <div className="table-item">
                                            {report?.tool?.category?.name || "Loading..."}
                                        </div>
                                    </td>
                                    <td className="report-table-data">
                                        <div className="table-item"> 
                                            {report?.totalMovements}
                                        </div>
                                    </td>
                                    <td className="report-table-data">
                                        <button className={`report-detail-btn-table ${theme ? "dark" : ""}`} onClick={() => handleMoveToDetail(report)}>
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={`loading-container-report ${reportLoading ? "" : "stop"}`}>
                        <ClipLoader color={theme ? '#fff' : '#000'} size={80} />
                    </div>

                    {!reportLoading && reportData.length === 0 && (
                            <div className={`no-report`}>
                            No reports available!
                        </div>
                    )}
                    
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

export default ReportPage;


