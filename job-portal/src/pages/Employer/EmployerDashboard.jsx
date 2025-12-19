import { useState, useEffect } from "react";
import {
  Plus,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
import DashboardLayout from "../../components/layout/DashboardLayout";
const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (res.status === 200) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
    return () => {};
  }, []);
  return <DashboardLayout activeMenu={`employer-dashboard`}>

  </DashboardLayout>;
};

export default EmployerDashboard;
