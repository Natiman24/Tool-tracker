// StateContext.js
import React, { createContext, useContext, useState } from "react";

const StateContextReport = createContext();

export const StateProviderReport = ({ children }) => {
  
  const [reportDate, setReportDate] = useState({startDate: null, endDate: null});
  const [reportDataContext, setReportDataContext] = useState([]);
  

  return (
    <StateContextReport.Provider value={{reportDate, reportDataContext, setReportDate, setReportDataContext}}>
      {children}
    </StateContextReport.Provider>
  );
};

export const useStateContextReport = () => useContext(StateContextReport);
