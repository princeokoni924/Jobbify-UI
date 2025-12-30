import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPge/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJob from "./pages/JobSeeker/SavedJob";
import UserProfile from "./pages/JobSeeker/UserProfile";
import ProtectedRoute from "./routes/ProtectedRoutes";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import JobPostingForm from "./pages/Employer/JobPostingForm";
import ManageJob from "./pages/Employer/ManageJob";
import ApplicationView from "./pages/Employer/ApplicationView";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import {AuthProvider } from './content/AuthContext'
const App = () => {
  return (
    <AuthProvider >
      <Router>
        <Routes>


          {/* public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-jobs" element={<JobSeekerDashboard />} />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route path="/saved-job" element={<SavedJob />} />
          <Route path="/profile" element={<UserProfile />} />


          {/* Protected oute */}
          <Route element={<ProtectedRoute requiredRole="employer" />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<JobPostingForm />} />
          <Route path="/manage-jobs" element={<ManageJob />} />
          <Route path="/applicants" element={<ApplicationView />} />
          <Route path="/employer-profile" element={<EmployerProfilePage />} />


          {/* Catch all Routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </AuthProvider>
  );
};

export default App;
