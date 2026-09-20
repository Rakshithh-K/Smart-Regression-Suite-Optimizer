import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import GitAuto from "./pages/GitAuto";
import History from "./pages/History";
import InputFormat from "./pages/InputFormat";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

import {
  AuthProvider,
} from "./context/AuthContext";


function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* Public routes */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-otp"
            element={<VerifyOTP />}
          />


          {/* Protected application */}

          <Route
            element={
              <ProtectedRoute>

                <AppLayout />

              </ProtectedRoute>
            }
          >

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/git-auto"
              element={<GitAuto />}
            />

            <Route
              path="/git-auto/runs/:runId"
              element={<GitAuto />}
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/input-format"
              element={<InputFormat />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>


          {/* Default */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}


export default App;