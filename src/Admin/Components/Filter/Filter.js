import React, {useEffect, useState} from "react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Filter.css"
import "../../../Component/Overlay/Overlay.css"
import ClipLoader from "react-spinners/ClipLoader"
import CustomSnackbar from "../../../Component/Snackbar/Snackbar"
import { useStateContextFilter } from "../../../Contexts/FilterContext";
import { useStateContextTheme } from "../../../Contexts/ThemeContext";
import { fetchCategories, fetchLocations } from "../../../Services/ToolApiService";
import { useNavigate } from "react-router-dom";

// Custom theme for the calendar
const customTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#4caf50", // Adjust the primary color as needed
      primary75: "#1a4b11", // Adjust the primary light color as needed
    },
  });



const FilterPage = () =>{

    const navigate = useNavigate();

    const [filterDisplay, setFilterDisplay] = useState(false);
    const [initialDate, setInitialDate] = useState(null);
    const [finalDate, setFinalDate] = useState(null); 
    const [category, setCategory] = useState([]);
    const [location, setLocation] = useState([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState([]);
    const [selectedLocationName, setSelectedLocationName] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [initialDateFilter, setInitialDateFilter] = useState([]);
    const [finalDateFilter, setFinalDateFilter] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCategoryCheckboxes, setShowCategoryCheckboxes] = useState(false);
    const [showLocationCheckboxes, setShowLocationCheckboxes] = useState(false);
    const [initialDatePickerOpen, setInitialDatePickerOpen] = useState(false);
    const [finalDatePickerOpen, setFinalDatePickerOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [severitySnackbar, setSeveritySnackbar] = useState("");
    const [messageSnackbar, setMessageSnackbar] = useState("");
    const [snackbarDuration, setSnackbarDuration] = useState(0);
   
    const {theme} = useStateContextTheme();
    const {showFilter, setShowFilter, filterMetrics, setFilterMetrics, setFilterFlag} = useStateContextFilter();

    

    useEffect(() => {
        document.body.style.backgroundColor = theme ? "#161616" : "#f5f5f5"; // Example background colors
    }, [theme]);


    const fetchData = async () => {
        try{
            const categories = await fetchCategories();
            setCategoryList(categories || []);
            const locations = await fetchLocations();
            setLocationList(locations || []);
        } catch (error) {
            setSeveritySnackbar("error");
            setMessageSnackbar(error?.response?.data?.message || "An error occurred, Please try again");
            setOpenSnackbar(true);
        }
    }



    useEffect(()=>{
        fetchData();
        if(filterMetrics){
            setInitialDate(filterMetrics?.initialDate || null);
            setFinalDate(filterMetrics?.finalDate || null);
            setCategory(filterMetrics?.category || []);
            // Map category IDs to category names
            const selectedCategoryNames = filterMetrics && filterMetrics?.category.map(categoryId => {
                const selectedCategory = categoryList.find(categoryItem => categoryItem.id === categoryId);
                return selectedCategory?.name || 'ALL';
        });

            setSelectedCategoryName(selectedCategoryNames || []);
            setLocation(filterMetrics?.location || []);

            const selectedLocationNames = filterMetrics && filterMetrics?.location.map(locationId => {
                const selectedLocation = locationList.find(locationItem => locationItem.id === locationId);
                return selectedLocation?.name || 'ALL';
            });
    
            setSelectedLocationName(selectedLocationNames || []);
        } 
        setFilterDisplay(showFilter.filter)
        
    }, [showFilter.filter])

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
        //   handleGenerateReport(event);
        }
      };

    

    const handleCategoryClick = () => {
        setShowCategoryCheckboxes(!showCategoryCheckboxes);
        setShowLocationCheckboxes(false); // Hide location checkboxes
      };
    
    const handleLocationClick = () =>{
        setShowLocationCheckboxes(!showLocationCheckboxes)
        setShowCategoryCheckboxes(false);
    }

    const handleCategoryCheckboxChange = (event) =>{
        const selectedCategoryId = event.target.value;
        const selectedCategory = categoryList.find((category) => category.id === selectedCategoryId);   

        if(event.target.checked){
            setCategory([...category, selectedCategoryId]);
            setSelectedCategoryName([...selectedCategoryName, selectedCategory?.name])
        }else{
            setCategory(category.filter((category) => category !== selectedCategoryId))
            setSelectedCategoryName(selectedCategoryName.filter((category) => category !== selectedCategory?.name))
        }
    }

    const handleLocationCheckboxChange = (event) =>{
        const selectedLocationId = event.target.value;
        const selectedLocation = locationList.find((locationItem) => locationItem.id === selectedLocationId);   

        if(event.target.checked){
            setLocation([...location, selectedLocationId]);
            setSelectedLocationName([...selectedLocationName, selectedLocation?.name]);
        }else{
            setLocation(location.filter((location) => location !== selectedLocationId))
            setSelectedLocationName(selectedLocationName.filter((location) => location !== selectedLocation?.name))
        }
    }

    const handleClearFilter = () =>{
        setShowFilter(prevState => ({...prevState,filter:false}));
        setShowCategoryCheckboxes(false);
        setShowLocationCheckboxes(false);
        setInitialDate(null);
        setFinalDate(null);
        setCategory([]);
        setLocation([]);
        setSelectedCategoryName([]);
        setSelectedLocationName([]);
        setFilterMetrics({
            initialDate: null,
            finalDate: null,
            category: [],
            location: []
        })
        document.body.classList.remove('body-no-scroll');
        navigate("/dashboard")
    }

    const handleCloseFilter = () =>{
        setShowFilter(prevState => ({...prevState,filter:false}));
        setShowCategoryCheckboxes(false);
        setShowLocationCheckboxes(false);
        document.body.classList.remove('body-no-scroll');
    }

    const handleRemoveCategories = () =>{
        setCategory([]);
        setSelectedCategoryName([]);
        setFilterMetrics(
            prevState => ({
                ...prevState,
                category : []
            })
        )
        setShowCategoryCheckboxes(false);
        setShowLocationCheckboxes(false);
    }

    const handleRemoveLocations = () =>{
        setLocation([]);
        setSelectedLocationName([]);
        setFilterMetrics(
            prevState => ({
                ...prevState,
                location : []
            })
        )
        setShowCategoryCheckboxes(false);
        setShowLocationCheckboxes(false);
    }

    const handleDate = () =>{
        setShowCategoryCheckboxes(false);
        setShowLocationCheckboxes(false);
    }

    const handleInitialDateCalendar= () => {
        setInitialDatePickerOpen(a => !a)
    }

    const handleFinalDateCalendar= () => {
        setFinalDatePickerOpen(a => !a)
    }

    const handleClearInitailDate = () => {
        setInitialDate(null);
        setFilterMetrics(
            prevState => ({
                ...prevState,
                initialDate : null
            })
        )
    }

    const handleClearFinalDate = () => {
        setFinalDate(null);
        setFilterMetrics(
            prevState => ({
                ...prevState,
                finalDate : null
            })
        )
    }

    const handleFilter = async (e) => {
        e.preventDefault();
        if(!initialDate && !finalDate && !category.length && !location.length){
            setSeveritySnackbar("warning");
            setMessageSnackbar("Please provide at least one filtering criterion.")
            setOpenSnackbar(true);
            return;
        } 

        setInitialDateFilter(initialDate);
        setFinalDateFilter(finalDate);
        const formattedInitialDate = initialDate ? new Date(initialDate).toLocaleDateString('en-CA') : null;
        const formattedFinalDate = finalDate ? new Date(finalDate).toLocaleDateString('en-CA') : null;

        const params = {};

        // Include initialDate if it's not null
        if (initialDate !== null) {
            params.initialDate = formattedInitialDate;
            setFilterMetrics(
                prevState => ({...prevState, initialDate: initialDate})
            )
        }

        // Include finalDate if it's not null
        if (finalDate !== null) {
            params.finalDate = formattedFinalDate;
            setFilterMetrics(
                prevState => ({...prevState, finalDate: finalDate})
            )
        }

        // Include location if it's not empty
        if (location.length > 0) {
            params.location = location;
            setFilterMetrics(
                prevState => ({...prevState, location: location})
            )
        }

        // Include category if it's not empty
        if (category.length > 0) {
            params.category = category;
            setFilterMetrics(
                prevState => ({...prevState, category: category})
            )
        }

        document.body.classList.remove('body-no-scroll');
        setShowFilter(prevState => ({...prevState,filter:false}));
        setFilterFlag(prevState => !prevState);
        setShowCategoryCheckboxes(false);
        setShowLocationCheckboxes(false);
        navigate("/dashboard/filter");
    }

    const minDate = new Date('2024-01-01');

    return(
        <>
        <nav className={`${filterDisplay ? "filter-page filter-page-active" : "filter-page"} ${theme ? "dark" : ""}` }>
            
            <div className="filter-header-container">
                <div className="filter-header col-12">
                    <h5>Filter</h5>
                    <span className="fa-solid fa-xmark xmark-filter" onClick={handleCloseFilter}></span>
                </div>
                <hr className="filter-hl" />
            </div>

            <div className="filter-label-input container">
                <div className="filter-label-input"  onClick={handleDate}>
                    <label htmlFor="initial-date" className={`filter-label ${theme ? "dark" : ""}`}>
                        Initial Date
                    </label>
                    <DatePicker
                        selected={initialDate}
                        onChange={(date) => setInitialDate(date)}
                        selectsStart
                        startDate={initialDate}
                        endDate={finalDate}
                        minDate={minDate}
                        maxDate={finalDate || new Date()}
                        dateFormat="yyyy/MM/dd"
                        showTimeSelect={false}
                        className={`custom-datepicker filter-input ${theme ? "dark" : ""}`}
                        calendarClassName={`custom-calendar ${theme ? "dark" : ""}`}
                        theme={customTheme}
                        onKeyPress={handleKeyPress}
                        id="initial-date"
                        />
                    <span className={`fa-solid fa-xmark xmark-filter-date ${initialDate ? "show" : ""}`} onClick={handleClearInitailDate}></span>
                    <span className="fa-regular fa-calendar filter-calendar-icon" onClick={handleInitialDateCalendar}></span>
                </div>
            

                    <div className="filter-label-input" onClick={handleDate}>
                        <label htmlFor="final-date" className={`filter-label ${theme ? "dark" : ""}`}>
                            Final Date
                        </label>
                        <DatePicker
                            selected={finalDate}
                            onChange={(date) => setFinalDate(date)}
                            selectsEnd
                            startDate={initialDate}
                            endDate={finalDate}
                            minDate={initialDate || minDate}
                            maxDate={new Date()}
                            dateFormat="yyyy/MM/dd"
                            showTimeSelect={false}
                            className={`custom-datepicker filter-input ${theme ? "dark" : ""}`}
                            calendarClassName={`custom-calendar ${theme ? "dark" : ""}`}
                            theme={customTheme}
                            onKeyPress={handleKeyPress}
                            id="final-date"
                            />
                            <span className={`fa-solid fa-xmark xmark-filter-date ${finalDate ? "show" : ""}`} onClick={handleClearFinalDate}></span>
                            <span className="fa-regular fa-calendar filter-calendar-icon" onClick={handleFinalDateCalendar}></span>
                    </div>
                

                <div className={`filter-label-input ${showCategoryCheckboxes ? "shown" : ""}`}>
                    <label htmlFor="category" className={`filter-label ${theme ? "dark" : ""}`}>
                        Category
                    </label>
                    <div className="filter-input-dropdown-container">
                        <input
                            type="text"
                            placeholder="Select Category"
                            onClick={handleCategoryClick}
                            className={`filter-input filter-dropdown-input ${theme ? "dark" : ""}`}
                            value={selectedCategoryName}
                            readOnly
                            />
                        <span className={`fa-solid fa-xmark xmark-filter-dropdown ${category.length !== 0 ? "show" : ""}`} onClick={handleRemoveCategories}></span>
                    </div>
                </div>

                <div className={`filter-dropdown-content ${showCategoryCheckboxes ? "show" : ""} ${theme ? "dark" : ""}`}>
                            {categoryList && categoryList.map((categoryItem, index) => (
                                <div key={index}>
                                    <input type="checkbox" value={categoryItem.id} className="filter-checkbox" id={`category-checkbox-${index}`} onChange={handleCategoryCheckboxChange} checked={category.includes(categoryItem.id)}/>
                                        <label htmlFor={`category-checkbox-${index}`} className="checkbox-label">{categoryItem.name}</label>
                                </div>
                            ))}
                        </div>

                <div className={`filter-label-input ${showLocationCheckboxes ? "shown" : ""}`}>
                    <label htmlFor="location" className={`filter-label ${theme ? "dark" : ""}`}>
                        Location
                    </label>
                    <div className="filter-input-dropdown-container">
                        <input
                            type="text"
                            placeholder="Select Location"
                            onClick={handleLocationClick}
                            className={`filter-input filter-dropdown-input ${theme ? "dark" : ""}`}
                            value={selectedLocationName}
                            readOnly
                            />
                        <span className={`fa-solid fa-xmark xmark-filter-dropdown ${location.length !== 0 ? "show" : ""}`} onClick={handleRemoveLocations}></span>
                    </div>
                </div>
                <div className={`filter-dropdown-content ${showLocationCheckboxes ? "show" : ""} ${theme ? "dark" : ""}`}>
                        {locationList && locationList.map((locationItem, index) => (
                            <div key={index}>
                                <input type="checkbox" value={locationItem.id} className="filter-checkbox" id={`location-checkbox-${index}`} onChange={handleLocationCheckboxChange} checked={location.includes(locationItem.id)}/>
                                    <label htmlFor={`location-checkbox-${index}`} className="checkbox-label">{locationItem.name}</label>
                            </div>
                        ))}
                </div>
            </div>

            

            <div className="filter-btn-container">
                <button className="filter-filter-btn" onClick={handleFilter}>
                    Filter
                </button>
                <button className={`cancel-filter-btn ${theme ? "dark" : ""}`} onClick={handleClearFilter}>
                    Cancel
                </button>
            </div>

            <div className={`loading-container-overlay ${loading ? "" : "stop"}`}>
                <ClipLoader color={theme ? '#fff' : '#000'} size={100} />
            </div>
        </nav>

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

export default FilterPage;