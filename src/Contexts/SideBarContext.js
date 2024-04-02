// StateContext.js
import React, { createContext, useContext, useState } from "react";

const StateContextSideBar = createContext();

export const StateProviderSideBar = ({ children }) => {
  
  const [sideBarExpand, setSideBarExpand] = useState({wide: false});
  const [displaySideBar, setDisplaySideBar] = useState({display: false})

  return (
    <StateContextSideBar.Provider value={{sideBarExpand, displaySideBar, setSideBarExpand, setDisplaySideBar}}>
      {children}
    </StateContextSideBar.Provider>
  );
};

export const useStateContextSideBar = () => useContext(StateContextSideBar);
