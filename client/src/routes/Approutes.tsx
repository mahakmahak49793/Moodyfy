import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/Dashboard";
import Journal from "../pages/Journal";
import Insight from "../pages/Insight";
import GratitudePage from "../pages/Gratitude";
import VerifyOTP from "../pages/auth/verify-otp";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      {path:"verify-otp",element:<VerifyOTP/>},
      { path: "dashboard", element: <Dashboard /> },
      {path:"journal",element:<Journal/>},
      {path:"insights",element:<Insight/>},
      {path:"gratitude",element:<GratitudePage/>},
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;