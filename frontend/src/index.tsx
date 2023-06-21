import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { DefaultRoutes } from './constants/defaults.constants';
import reportWebVitals from './reportWebVitals';
import HomePage from './components/pages/HomePage/HomePage';
import ListPage from './components/pages/ListPage/ListPage';
import './index.css';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: DefaultRoutes.Root,
    element: <HomePage />
  },
  {
    path: DefaultRoutes.RandomList,
    element: <ListPage /> 
  },
  {
    path: DefaultRoutes.History,
    element: <ListPage showHistory={true} />
  },
  {
    path: DefaultRoutes.Profile,
    element: <ProfilePage />
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
