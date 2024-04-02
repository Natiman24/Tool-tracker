import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [showOverlayLogOut, setShowOverlayLogOut] = useState({overlay: false});

  return (
    <StateContext.Provider value={{ showOverlayLogOut, setShowOverlayLogOut}}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
