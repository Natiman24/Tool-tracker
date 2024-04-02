// StateContext.js
import React, { createContext, useContext, useState } from "react";

const StateContextToken = createContext();

export const StateProviderToken = ({ children }) => {
  
  const [tokenApi, setTokenApi] = useState("");  

  return (
    <StateContextToken.Provider value={{tokenApi, setTokenApi}}>
      {children}
    </StateContextToken.Provider>
  );
};

export const useStateContextToken = () => useContext(StateContextToken);
