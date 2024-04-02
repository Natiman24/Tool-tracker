// StateContext.js
import React, { createContext, useContext, useState } from "react";

const StateContextFilter = createContext();

export const StateProviderFilter = ({ children }) => {
  const [showFilter, setShowFilter] = useState({filter: false});
  const [filterMetrics, setFilterMetrics] = useState({
    initialDate: null,
    finalDate: null,
    category: [],
    location: []
  })

  const [filterFlag, setFilterFlag] = useState(false);

  return (
    <StateContextFilter.Provider value={{ showFilter, setShowFilter, filterMetrics, setFilterMetrics, filterFlag, setFilterFlag }}>
      {children}
    </StateContextFilter.Provider>
  );
};

export const useStateContextFilter = () => useContext(StateContextFilter);
