import React, {useState, useEffect} from "react"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import { useNavigate, useLocation } from "react-router-dom"
import { deleteEmployee, fetchEmployeeDetails, updateEmployeeDetails } from "../../Services/ToolApiService"
import "../Styles/EmployeeDetails.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextSideBar } from "../../Contexts/SideBarContext"
import { useStateContextTheme } from "../../Contexts/ThemeContext"

const EmployeeDetails = () =>{

    const navigate = useNavigate();
    const urlLocation = useLocation();
    const queryParamsEmployee = new URLSearchParams(urlLocation.search);
    const employeeId = queryParamsEmployee.get('id');
    
    const [employeeDetail, setEmployeeDetail] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);
    const [newPhoneNumberDisplay, setNewPhoneNumberDisplay] = useState("");
    const [newPhoneNumberError, setNewPhoneNumberError] = useState("");
    const [updateFlag, setUpdateFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [message, setMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [emptyFlag, setEmptyFlag] = useState(false);

    const {theme} = useStateContextTheme();
    const {sideBarExpand} = useStateContextSideBar();
    
    const expand = sideBarExpand.wide;

    useEffect(() => {
        if(deleteFlag && !openSnackbar){
            setShowOverlay2(false);
            document.body.classList.remove('body-no-scroll');
            navigate("/employees");
        }
    }, [openSnackbar && deleteFlag])

    useEffect(() => {
        if(emptyFlag && !openSnackbar){
            navigate("/employees");
        }
    }, [openSnackbar && emptyFlag])

    useEffect(() => {  
         
            const fetchEmployeeDetail = async () => {
                try{
                    setLoading(true);
                    const details = await fetchEmployeeDetails(employeeId);
                    setEmployeeDetail(details || []);
                    if (!details){
                        setSeveritySnackbar("error");
                        setMessageSnackbar("There is no employee with this id.");
                        setOpenSnackbar(true);
                        setEmptyFlag(true)
                    }
                    setFirstName(details?.firstName || '');
                    setLastName(details?.lastName || '');
                    setNewPhoneNumberDisplay(details?.phoneNumber || '');
                    setEmail(details?.email || '');

                } catch (error){
                    setSeveritySnackbar("error");
                    setMessageSnackbar(error?.response?.data?.message || "An error occurred");
                    setOpenSnackbar(true);
                } finally{
                    setLoading(false);
                }
            }

            fetchEmployeeDetail();
    },[employeeId, updateFlag]);

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5";
      }, [theme]);

    const handleNewPhoneNumberChange = (e) => {
        setNewPhoneNumberError("");
        const phoneNum = e.target.value
        const numberOnly = phoneNum.replace(/\D/g, '');
        const phoneNumFinal = numberOnly;
    
        if(phoneNum.length <= 10){
          setNewPhoneNumberDisplay(phoneNumFinal);
      } 
      }
    
    const handleBlurPhoneError = () => {
    if (newPhoneNumberDisplay.length < 10 && newPhoneNumberDisplay.length != 0) {
        setNewPhoneNumberError("Please enter a valid 10-digit phone number.");
        
    }
    };
    
    const handleKeyPressPhoneError = (e) => {
    if (e.key === 'Enter') {
        if (newPhoneNumberDisplay.length < 10 && newPhoneNumberDisplay.length != 0) {
            e.preventDefault();
            setNewPhoneNumberError("Please enter a valid 10-digit phone number.");
        
        }else if(newPhoneNumberDisplay.length == 10){
                handleUpdateEmployee(e);
        }
    }
    };


    const handleOpenOverlay = () =>{
        setShowOverlay(true);
        document.body.classList.add("body-no-scroll");
    }

    const handleCloseOverlay = () =>{
        setFirstName(employeeDetail?.firstName);
        setLastName(employeeDetail?.lastName);
        setNewPhoneNumberDisplay(employeeDetail?.phoneNumber);
        setNewPhoneNumberError("");
        setEmail(employeeDetail?.email);
        setShowOverlay(false);
        document.body.classList.remove("body-no-scroll");
    }

    const handleOpenOverlay2 = () =>{
        setShowOverlay2(true);
        document.body.classList.add("body-no-scroll");
    }

    const handleCloseOverlay2 = () =>{
        setShowOverlay2(false);
        document.body.classList.remove("body-no-scroll");
    }

    const validatePhoneNumber = (phoneNum) => {
        const numberOnly = phoneNum.replace(/\D/g, '');
        return numberOnly.length === 10 ? numberOnly : null;
    };

    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        if(!firstName || !newPhoneNumberDisplay) return ;

        const validatedPhoneNumber = validatePhoneNumber(newPhoneNumberDisplay);

        if (!validatedPhoneNumber) {
            setNewPhoneNumberError("Please enter a valid 10-digit number.");
            return;
        }

       const newEmployeeDetail = {
        id: employeeId,
        firstName : firstName,
        lastName: lastName,
        phoneNumber : validatedPhoneNumber,
        email: email,
       }
        
        try{
            setLoadingUpdate(true)
            const updateResponse = await updateEmployeeDetails(newEmployeeDetail);
            setMessage(updateResponse?.message || ""); 
            setUpdateFlag(prevFlag => !prevFlag);
            setSeveritySnackbar("success");
            setMessageSnackbar(updateResponse?.message || ""); 
            setOpenSnackbar(true);     
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the default Enter key action
          handleUpdateEmployee(e); // Trigger the Update action
          e.target.blur();  
        }
      };

    const handleDeleteEmployee = async (e) => { 
        e.preventDefault();

        try{
            setLoadingUpdate(true)
            const deleteResponse = await deleteEmployee(employeeId);
            setMessage(deleteResponse?.message || "");
            setSeveritySnackbar("success");
            setMessageSnackbar(deleteResponse?.message || "");
            setOpenSnackbar(true);
            setDeleteFlag(true);

        } catch (error){
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
            setShowOverlay2(false);
            document.body.classList.remove('body-no-scroll');
            setLoadingUpdate(false);
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
        <div className={`employee-details-page ${expand ? "contract" : ""}`}>
            <div className={`employee-details-container card ${theme ? "dark" : ""}`}>
                <div className="employee-details-name-btn-container">
                    <div className="employee-details-header">
                        <h5>{employeeDetail?.firstName ? employeeDetail.firstName.charAt(0).toUpperCase() + employeeDetail.firstName.slice(1) : "" || 'Loading...'} {employeeDetail?.lastName ? employeeDetail.lastName.charAt(0).toUpperCase() + employeeDetail.lastName.slice(1) : ""}</h5>
                    </div>
                    <div className="employee-details-btn-container">
                        <button className={`employee-details-edit-btn ${theme ? "dark" : ""}`} onClick={handleOpenOverlay}>
                            <span className="fa-solid fa-pencil"></span>
                            Edit
                        </button>
                        <button className={`employee-details-delete-btn ${theme ? "dark" : ""}`} onClick={handleOpenOverlay2}>
                            Delete
                        </button>
                    </div>
                </div>

                <div className="employee-hl-container">
                        <hr className="employee-hl" />
                </div>

                <div className="employee-details-info-container">
                    <h6>Employee Details</h6>
                    <div className="employee-details-info">

                        <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
                        </div>

                        {!loading && employeeDetail && (
                            <table className="employee-details-table">
                                <tbody>
                                    <tr>
                                        <th className={`employee-details-parameter ${theme ? "dark" : ""}`}>
                                            Full Name
                                        </th>
                                        <td className={`employee-details-parameter-value ${theme ? "dark" : ""}`}>
                                            {employeeDetail?.firstName ? employeeDetail.firstName.charAt(0).toUpperCase() + employeeDetail.firstName.slice(1) : "" || 'None'} {employeeDetail?.lastName ? employeeDetail.lastName.charAt(0).toUpperCase() + employeeDetail.lastName.slice(1) : ""}
                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={`employee-details-parameter ${theme ? "dark" : ""}`}>
                                            Phone Number
                                        </th>
                                        <td className={`employee-details-parameter-value ${theme ? "dark" : ""}`}>
                                            {employeeDetail?.phoneNumber || 'None'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className={`employee-details-parameter ${theme ? "dark" : ""}`}>
                                            Email
                                        </th>
                                        <td className={`employee-details-parameter-value ${theme ? "dark" : ""}`}>
                                            {employeeDetail?.email || 'None'}
                                        </td>
                                    </tr>       
                                    <tr>
                                        <th className={`employee-details-parameter ${theme ? "dark" : ""}`}>
                                            Joined On
                                        </th>
                                        <td className={`employee-details-parameter-value ${theme ? "dark" : ""}`}>
                                            {formatDate(employeeDetail?.joinedOn)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>

        {showOverlay && (
            <div className="overlay-container">
                <div className={`overlay-content ${theme ? "dark" : ""}`}>
                    <h5>Edit Employee</h5>
                    <div className="edit-employee-form-container">
                        <form className="edit-employee-form">
                            <div className="edit-employee-label-input">
                                <label htmlFor="first-name" className={`edit-employee-label ${theme ? "dark" : ""}`}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    className={`edit-employee-input ${theme ? "dark" : ""}`}
                                    id="first-name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    required
                                    />
                            </div>
                            <div className="edit-employee-label-input">
                                <label htmlFor="last-name" className={`edit-employee-label ${theme ? "dark" : ""}`}>
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    className={`edit-employee-input ${theme ? "dark" : ""}`}
                                    id="last-name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    />
                            </div>
                            <div className="edit-employee-label-input edit-phone-label-input">
                                <label htmlFor="phone-num" className={`edit-employee-label ${theme ? "dark" : ""}`}>
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Phone Number"
                                    className={`edit-employee-input edit-employee-input-phone-num ${theme ? "dark" : ""}`}
                                    id="phone-num"
                                    value={newPhoneNumberDisplay}
                                    onChange={handleNewPhoneNumberChange}
                                    onBlur={handleBlurPhoneError}
                                    onKeyPress={handleKeyPressPhoneError}
                                    />
                            </div>

                            <p className="employee-phone-error text-danger">{newPhoneNumberError}</p>

                            <div className="edit-employee-label-input">
                                <label htmlFor="email" className={`edit-employee-label ${theme ? "dark" : ""}`}>
                                    Email
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Email"
                                    className={`edit-employee-input ${theme ? "dark" : ""}`}
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    />
                            </div>

                            <div className="edit-employee-btn-container">
                                <button className={`edit-employee-discard-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                                    Discard
                                </button>
                                <button className="edit-employee-update-btn" onClick={handleUpdateEmployee}>
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
                    <h4 className={`delete-employee-header ${theme ? "dark" : ""}`}>Employee</h4>
                    <h6 className={`delete-employee-text ${theme ? "dark" : ""}`}>Are you sure to delete the employee?</h6>
                    <div className="delete-employee-btn-container">
                        <button className={`delete-employee-cancel-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay2}>
                            No
                        </button>
                        <button className="delete-employee-ok-btn" onClick={handleDeleteEmployee}>
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

export default EmployeeDetails;