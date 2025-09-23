import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import Movie from "./pages/Movie";


const router = createBrowserRouter([
{
path: "/",
element: <App />,
children: [
{ index: true, element: <Home /> },
{ path: "movie/:id", element: <Movie /> },
],
},
]);


const qc = new QueryClient();


ReactDOM.createRoot(document.getElementById("root")!).render(
<React.StrictMode>
<QueryClientProvider client={qc}>
<RouterProvider router={router} />
</QueryClientProvider>
</React.StrictMode>
);