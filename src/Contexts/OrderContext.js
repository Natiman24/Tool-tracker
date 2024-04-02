// StateContext.js
import React, { createContext, useContext, useState } from "react";

const StateContextOrder = createContext();

export const StateProviderOrder = ({ children }) => {
  
  const [orderDataContext, setOrderDataContext] = useState([]);
  

  return (
    <StateContextOrder.Provider value={{orderDataContext, setOrderDataContext}}>
      {children}
    </StateContextOrder.Provider>
  );
};

export const useStateContextOrder = () => useContext(StateContextOrder);
