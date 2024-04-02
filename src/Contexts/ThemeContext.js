// StateContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const StateContextTheme = createContext();

export const StateProviderTheme = ({ children }) => {
  
  const [theme, setTheme] = useState(false);
  const [page, setPage] = useState("");
  const [pageId, setPageId] = useState("");

  useEffect(() =>{
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme) {
        setTheme(savedTheme === 'dark')
    } else {
        setTheme(false);
        localStorage.setItem('preferredTheme', 'light');
    }
  }, []);
  

  return (
    <StateContextTheme.Provider value={{theme, page, pageId, setTheme, setPage, setPageId}}>
      {children}
    </StateContextTheme.Provider>
  );
};

export const useStateContextTheme = () => useContext(StateContextTheme);
