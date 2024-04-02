import React from "react";
import {
  createBrowserRouter,
  Outlet, 
  useNavigate,
  Navigate
} from "react-router-dom";
import SideBar from "./Admin/Components/Sidebar/SideBar";
import SearchNav from "./Admin/Components/SearchNav/SearchNav";
import Login from "./Component/Login/Login";
import Dashbord from "./Admin/Pages/Dashbord"
import ProductDetails from "./Admin/Pages/ProductDetails";
import EmployeesPage from "./Admin/Pages/Employees";
import EmployeeDetails from "./Admin/Pages/EmployeeDetails";
import CategoryPage from "./Admin/Pages/Category";
import CategoryDetail from "./Admin/Pages/CategoryDetail";
import OrderPage from "./Admin/Pages/Order";
import OrderDetailPage from "./Admin/Pages/OrderDetail";
import ReportPage from "./Admin/Pages/Report";
import ReportDetailPage from "./Admin/Pages/ReportDetail";
import ProjectSite from "./Admin/Pages/ProjectSite";
import ProjectSiteDetail from "./Admin/Pages/ProjectSiteDetail";
import ProfilePage from "./Admin/Pages/ProfilePage";
import ChangePasswordPage from "./Admin/Pages/ChangePassword";
import UserNavigation from "./User/Components/Nav/UserNav";
import UserOrderPage from "./User/Pages/UserOrderPage";
import UserOrderDetail from "./User/Pages/UserOrderDetail";
import LogOut from "./Component/Logout/LogOut";
import { StateProvider, useStateContext } from "./Contexts/LogOutContext";
import { StateProviderFilter} from "./Contexts/FilterContext";
import { StateProviderSideBar } from "./Contexts/SideBarContext";
import "./App.css"
import { StateProviderReport } from "./Contexts/ReportContext";
import { StateProviderTheme } from "./Contexts/ThemeContext";
import PageNotFound from "./Component/Not Found/NotFound";
import SearchPage from "./Admin/Pages/SearchPage";
import NotificationPage from "./Admin/Pages/NotificationPage";
import UserChangePasswordPage from "./User/Pages/UserChangePasswordPage";
import UserProfilePage from "./User/Pages/UserProfilePage";
import { jwtDecode } from "jwt-decode";
import FilteredPage from "./Admin/Pages/FilteredPage";
import { StateProviderOrder } from "./Contexts/OrderContext";
import { StateProviderToken } from "./Contexts/TokenContext";



const AuthGuard = ({admin}) => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("authToken");
  
  if (!isAuthenticated) {
    navigate("");
    return <Navigate to=""/>;
  } 
  const decodedToken = jwtDecode(isAuthenticated);
  if(decodedToken.userType === "OWNER" && admin){
    return <StateProviderToken>
              <StateProviderTheme>
                <StateProviderSideBar>
                  <StateProviderFilter>
                    <StateProvider>
                        <AppLayout />
                    </StateProvider>
                  </StateProviderFilter>
                </StateProviderSideBar>
              </StateProviderTheme>
            </StateProviderToken>;
  } else if(decodedToken.userType === "WORKER" && !admin) {
    return <StateProviderToken>
              <StateProviderTheme>
                <StateProvider>
                  <UserAppLayout /> 
                </StateProvider>
              </StateProviderTheme>
            </StateProviderToken>
  } else {
    //  window.history.back();
    return <StateProviderToken><StateProviderTheme><PageNotFound /></StateProviderTheme></StateProviderToken>
  }
  
  
}




const AppLayout = () => {

  const {showOverlayLogOut} = useStateContext();

    return(
      <>
          <SideBar /> 
          <SearchNav />
          <Outlet />
          
        {showOverlayLogOut.overlay&&(
          <LogOut />
        )}
        
      </>
    )
  }

const UserAppLayout = () => {
  const {showOverlayLogOut} = useStateContext();

  return(
    <>
      <UserNavigation />
      <Outlet />
      {showOverlayLogOut.overlay&&(
          <LogOut />
        )}
    </>
  )

}
  
  
    const router = createBrowserRouter([
      {
        path: "",
        element: <StateProviderToken><StateProviderTheme><Login /></StateProviderTheme></StateProviderToken>,
      },
      {
        path: "/",
        element: <AuthGuard admin={false} /> ,
        children: [
          {
            path: "user-order",
            children:[
              {
                path: "",
                element: <StateProviderOrder><UserOrderPage /></StateProviderOrder>
              },
              {
                path: "details",
                element: <StateProviderOrder><UserOrderDetail /></StateProviderOrder>
              }
            ]
          },
          {
            path: "user-profile",
            children: [
              {
                path: "",
                element: <UserProfilePage />,
              },
              {
                path: "user-change-password",
                element: <UserChangePasswordPage /> 
              }
            ]        
          },
        ]
      },
      {
        path: "/",
        element:  <AuthGuard admin={true} />,
        children: [
          {
            path: "dashboard",
            children: [
              {
                path: "",
                element: <Dashbord />
              },
              {
                path: "product-details",
                element: <ProductDetails />
              },
              {
                path: "filter",
                element: <FilteredPage />
              }
            ]
          },
          {
            path: "employees",
            children: [
              {
                path: "",
                element: <EmployeesPage />
              },
              {
                path: "details",
                element: <EmployeeDetails />
              }
            ]
          },
          {
            path: 'categories',
            children: [
              {
                path: "",
                element: <CategoryPage />
              },
              {
                path: "details",
                element: <CategoryDetail />
              }
            ]   
          },
          {
            path: "orders",
            children: [
              {
                path: "",
                element: <StateProviderOrder><OrderPage /></StateProviderOrder>
              },
              {
                path: "details",
                element: <StateProviderOrder><OrderDetailPage /></StateProviderOrder>
              }
            ]
          },
          {
            path: "report",
            children:[
              {
                path: "",
                element: <StateProviderReport><ReportPage /></StateProviderReport>
              },
              {
                path: "details",
                element: <StateProviderReport><ReportDetailPage /></StateProviderReport>
              }
            ]
          },
          {
            path: "profile",
            children:[
              {
                path: "",
                element: <ProfilePage />,
              },
              {
                path: "change-password",
                element: <ChangePasswordPage />
              }
            ]
            
          },
          {
            path: "project-sites",
            children:[
              {
                path: "",
                element: <ProjectSite />
              },
              {
                path: "details",
                element: <ProjectSiteDetail />
              }
            ]
            
          },
          {
            path: "search-results",
            element: <SearchPage />
          },
          {
            path: "notifications",
            element: <NotificationPage />
          }
        ]
      },
      {
        path: "*",
        element: <StateProviderTheme><PageNotFound /></StateProviderTheme>
      }
    ]);
  
  export {router};
  export default AppLayout;
  