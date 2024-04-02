import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../Component/Snackbar/Snackbar"
import "../Styles/Employees.css"
import "../../Component/Overlay/Overlay.css"
import { useStateContextSideBar } from "../../Contexts/SideBarContext"
import { useStateContextTheme } from "../../Contexts/ThemeContext"
import { fetchEmployees, fetchEmployeeNumOfPages, addNewEmployee } from "../../Services/ToolApiService"

const EmployeesPage = () =>{

    const navigate = useNavigate();

    const [employeeList, setEmployeeList] = useState([]);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showOverlay2, setShowOverlay2] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberDisplay, setPhoneNumberDisplay] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [email, setEmail] = useState("");
    const [pageNum, setPageNum] = useState(1);
    const [numOfPages, setNumOfPages] = useState(1);
    const [newEmployeeFlag, setNewEmployeeFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newEmployeeLoading, setNewEmployeeLoading] = useState(false);
    const [newEmployeeMessage, setNewEmployeeMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
    const {sideBarExpand} = useStateContextSideBar();
    const {theme} = useStateContextTheme();
    
    const expand = sideBarExpand.wide;

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5";
      }, [theme]);

    const fetchEmployee = async (pageNum) => {
        try{
            setLoading(true);          
                const employeeData = await fetchEmployees(pageNum);
                const sortedEmployeeData = employeeData.sort((a,b) => a.firstName.localeCompare(b.firstName));
                setEmployeeList(sortedEmployeeData || []);
            
        }catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEmployee(pageNum);

        const fetchNumOfPage = async () => {
            try{
                const data = await fetchEmployeeNumOfPages();
                setNumOfPages(data?.pages || 1);
          
              } catch(error)  {
                    setSeveritySnackbar("error");
                    setMessageSnackbar(error?.response?.data?.message || "An error occurred");
                    setOpenSnackbar(true);
              }
        }

        fetchNumOfPage();
    },[newEmployeeFlag, pageNum])

    const handlePhoneNumberChange = (e) => {
        setPhoneNumberError("");
        const phoneNum = e.target.value;
        const numberOnly = phoneNum.replace(/\D/g, '');
        const phoneNumFinal = numberOnly;
    
        if(phoneNum.length <= 10){
          setPhoneNumber("");
          setPhoneNumberDisplay(phoneNumFinal);
      } 
    }
    
    const handleBlurPhoneError = () => {
        if (phoneNumberDisplay.length < 10 && phoneNumberDisplay.length != 0) {
            setPhoneNumberError("Please enter a valid 10-digit phone number.");
        } else if(phoneNumberDisplay.length == 10){
            setPhoneNumber("");
            setPhoneNumber(phoneNumberDisplay);
        }
    };
    
    const handleKeyPressPhoneError = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (phoneNumberDisplay.length < 10 && phoneNumberDisplay.length != 0) {
                setPhoneNumber("");
                setPhoneNumberError("Please enter a valid 10-digit phone number.");
            }else if(phoneNumberDisplay.length == 10){
                setPhoneNumber(phoneNumberDisplay);
                handleNewEmployee(e);
            }
        }
    };

    const handleOpenOverlay = () =>{
        setShowOverlay(true);
        document.body.classList.add('body-no-scroll');
    }

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        setFirstName("");
        setLastName("");
        setPhoneNumberDisplay("");
        setPhoneNumberError("");
        setEmail("");
        document.body.classList.remove('body-no-scroll');
    };

    const handleOpenOverlay2 = () =>{
        setShowOverlay2(true);
        document.body.classList.add('body-no-scroll');
    }
    
    const handleCloseOverlay2 = () =>{
        setShowOverlay2(false);
        document.body.classList.remove('body-no-scroll');
    }


    const handlePreviousPage = () => {
        if(pageNum == 1 || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum - 1);
            // fetchEmployee(pageNum - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    const handleNextPage = () => {
        if(pageNum == numOfPages || numOfPages == 1){
            return;
        }else{
            setPageNum(prevPageNum => prevPageNum + 1);
            // fetchEmployee(pageNum + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
        }
    }

    const handleNewEmployee = async (e) => {
        e.preventDefault();
        if(!firstName || !phoneNumber) return; // removed lastName
        
        const employeeData = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            userType: "WORKER",
        }

        try{
            setNewEmployeeLoading(true);
            const newEmployee = await addNewEmployee(employeeData);
            setNewEmployeeMessage(newEmployee?.message || "");
            setNewEmployeeFlag(prevFlag => !prevFlag);
            setSeveritySnackbar("success");
            setMessageSnackbar(newEmployee?.message || "New Employee Created");
            setOpenSnackbar(true);
            setShowOverlay(false);
            document.body.classList.remove("body-no-scroll");
            
        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred");
            setOpenSnackbar(true);
        } finally{
            setShowOverlay(false);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhoneNumberError("");
            setPhoneNumberDisplay("");
            document.body.classList.remove("body-no-scroll");
            setNewEmployeeLoading(false);
        }

    }

    const handleEmployeeDetail = (employee) =>{
        navigate(`./details?id=${employee.id}`);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); 
          handleNewEmployee(e); 
          e.target.blur();
        }
    };

    return(
        <>
            <div className={`employee-page ${expand ? "contract" : ""}`}>
                <div className={`employee-page-container card ${theme ? "dark" : ""}`}>
                    <div className="employee-name-btn-container">
                        <div className="employee-header">
                            <h5>Employees</h5>
                        </div>
                        <button className="add-employee-btn" onClick={handleOpenOverlay}>
                            Add Employee
                        </button>
                    </div>

                    <div className="employee-hl-container">
                        <hr className="employee-hl" />
                    </div>

                    <table className="employee-table">
                            <thead>
                                <tr>
                                    <th className="employee-table-header">
                                        <div className="table-item">
                                            First Name
                                        </div>
                                    </th>
                                    <th className="employee-table-header">
                                        <div className="table-item">
                                            Last Name
                                        </div>
                                    </th>
                                    <th className="employee-table-header employee-table-header-active-erasable">
                                        <div className="table-item">
                                            Phone Number
                                        </div>
                                    </th>
                                    <th className="employee-table-header">
                                        <div className="table-item">
                                            Details
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && employeeList.map((employee, index) => (
                                    <tr className="employee-table-row-data" key={index}>
                                        <td className="employee-table-data">
                                            <div className="table-item">
                                                {employee?.firstName ? employee.firstName.charAt(0).toUpperCase() + employee.firstName.slice(1) : ""}
                                            </div>
                                        </td>
                                        <td className="employee-table-data">
                                            <div className="table-item">
                                            {employee?.lastName ? employee.lastName.charAt(0).toUpperCase() + employee.lastName.slice(1) : ""}
                                            </div>
                                        </td>
                                        <td className="employee-table-data employee-table-data-active-erasable"> 
                                            <div className="table-item">
                                                {employee?.phoneNumber}
                                            </div>
                                        </td>

                                        <td className="employee-table-data">
                                            <button className={`details-employee-btn-table ${theme ? "dark" : ""}`} onClick={() => handleEmployeeDetail(employee)}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!loading && !employeeList.length && pageNum === 1 && (
                            <div className="search-not-found">
                                No Employees Found!
                            </div>
                        )}

                        <div className={`loading-container ${loading ? "" : "stop"}`}>
                            <ClipLoader color={`${theme ? "#fff" : "#000"}`} size={80} />
                        </div>

                        <div className="employee-pagenation">
                            <button className={`employee-previous-page-btn ${theme ? "dark" : ""}`} onClick={handlePreviousPage}>Previous</button>
                                <h6 className={`employee-page-num-header ${theme ? "dark" : ""}`}> Page {pageNum} of {numOfPages} </h6>
                            <button className={`employee-next-page-btn ${theme ? "dark" : ""}`} onClick={handleNextPage}>Next</button>
                        </div>
                </div>
            </div>

            {showOverlay &&(
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h5>New Employee</h5>
                        <div className="new-employee-form-container">
                            <form className="new-employee-form" onSubmit={handleNewEmployee}>
                                <div className="new-employee-label-input">
                                    <label htmlFor="first-name" className={`new-employee-label ${theme ? "dark" : ""}`}>
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter First Name"
                                        className={`new-employee-input ${theme ? "dark" : ""}`}
                                        id="first-name"
                                        onChange={(e) => setFirstName(e.target.value)}
                                        value={firstName}
                                        onKeyPress={handleKeyPress}
                                        required
                                        />
                                </div>

                                <div className="new-employee-label-input">
                                    <label htmlFor="last-name" className={`new-employee-label ${theme ? "dark" : ""}`}>
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Last Name"
                                        className={`new-employee-input ${theme ? "dark" : ""}`}
                                        id="last-name"
                                        onChange={(e) => setLastName(e.target.value)}
                                        value={lastName}
                                        onKeyPress={handleKeyPress}
                                        //add required
                                        />
                                </div>

                                <div className="new-employee-label-input">
                                    <label htmlFor="phoneNum" className={`new-employee-label ${theme ? "dark" : ""}`}>
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Phone Number"
                                        className={`new-employee-input new-employee-input-phone-num ${theme ? "dark" : ""}`}
                                        id="phoneNum"
                                        value={phoneNumberDisplay}
                                        onChange={handlePhoneNumberChange}
                                        onBlur={handleBlurPhoneError}
                                        onKeyPress={handleKeyPressPhoneError}
                                        required
                                        />
                                </div>
                                <p className={`employee-phone-error text-danger`}>{phoneNumberError}</p>

                                <div className="new-employee-label-input">
                                    <label htmlFor="email" className={`new-employee-label ${theme ? "dark" : ""}`}>
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Email (if there is one)"
                                        className={`new-employee-input ${theme ? "dark" : ""}`}
                                        id="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        onKeyPress={handleKeyPress}
                                        />
                                </div>

                                <div className="new-employee-btn-container">
                                    <button className={`new-employee-discard-btn ${theme ? "dark" : ""}`} onClick={handleCloseOverlay}>
                                        Discard
                                    </button>
                                    <button className="new-employee-add-btn" type="submit">
                                        Add Employee
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className={`loading-container-overlay ${newEmployeeLoading ? "" : "stop"}`}>
                            <ClipLoader color={theme ? "#fff" : "#000"} size={100} />
                        </div>
                    </div>
                </div>
            )}
            {showOverlay2 && (
                <div className="overlay-container">
                    <div className={`overlay-content ${theme ? "dark" : ""}`}>
                        <h4 className="delete-employee-header">Employee</h4>
                        <h6 className="delete-employee-text">Are you sure to delete the employee?</h6>
                        <div className="delete-employee-btn-container">
                            <button className="delete-employee-cancel-btn" onClick={handleCloseOverlay2}>
                                No
                            </button>
                            <button className="delete-employee-ok-btn" onClick={handleCloseOverlay2}>
                                Yes 
                            </button>
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

export default EmployeesPage;