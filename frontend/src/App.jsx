import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>

      <AppLayout>

        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>

      </AppLayout>

    </BrowserRouter>
  );
}


export default App;