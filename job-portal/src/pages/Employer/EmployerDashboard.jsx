import { useState, useEffect } from "react";
import {
  Plus,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
  User,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoaderSpinner from "../../components/LoaderSpinner";
import JobDashboardCard from "../../components/Cards/JobDashboardCard";
import ApplicationDashboardCard from "../../components/Cards/ApplicationDashboardCard";

const Card = ({ className, children, title, headerAction, subtitle }) => {
  return (
    <div
      className={`bg-white rounded-xl border 
shadow-sm hover:shadow-md transition-shadow duration-300 border-gray-100 ${className} `}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>

          {headerAction}
        </div>
      )}

      <div className={title ? "px-6 pb-6 " : "p-6"}>{children}</div>
    </div>
  );
};

const StatCard = ({
  title,
  trendValue,
  icon: Icon,
  value,
  color ,
  trend = true,
}) => {
  const colorClass = {
    blue: "from-blue-200 to-blue-400",
    green: "from-green-200 to-green-400",
    purple: "from-violet-200 to-violet-400",
    orange: "from-orange-200 to-orange-300",
    sea_blue:"from-cyan-200 to-cyan-400"
  };
  return (
    <Card
      className={`bg-gradient-to-br ${colorClass[color]} text-white border-0`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="bg-white/10 p-3 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (res.status === 200) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.log("error", err);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   getDashboardOverview();
  //   return () => {};
  // }, []);


//   useEffect(() => {
//   (async () => {
//     try{
//       setIsLoading(true);
//       const res = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
//       setDashboardData(res.data);
//     } finally {
//       setIsLoading(false);
//     }
//   })();
// }, []);

const [fastLoading, setFastLoading] = useState(true);
useEffect(() =>{
  async ()=>{
    try{
      if(fastLoading){
        setIsLoading(true);
      }
      const res = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if(res.status ===200){
        setDashboardData(res.data);
      }
    }catch(err){
      console.log("error", err);
    }finally{
      setIsLoading(false);
      setFastLoading(false);
    }
  }
})

  return (
    <DashboardLayout activeMenu={`employer-dashboard`}>
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-8 mb-96">
          {/* Dashboard status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title={"Active jobs"}
              value={dashboardData?.count?.totalActiveJobs || 0}
              icon={Briefcase}
              // trend={true}
              trendValue={`${
                dashboardData?.count?.trend?.totalActiveJobs || 0}%`}
              color={"blue"}
            />
            {/* Total job posted StatCard */}

            <StatCard
              title={"Total Jobs Posted"}
              value={dashboardData?.count?.totalJobPosted || 0}
              icon={Briefcase}
              // trend={true}
              trendValue={`${dashboardData?.count?.trend?.totalJobPosted || 0}%`}
              color={"sea_blue"}
            />
            <StatCard
              title={`Total Applicants.`}
              value={dashboardData?.count?.totalApplications || 0}
              icon={Users}
              // trend={true}
              trendValue={`${
                dashboardData?.count?.trend?.totalApplications || 0
              }%`}
              color={`green`}
            />

            <StatCard
              title={`Hired`}
              value={dashboardData?.count?.totalHired || 0}
              icon={CheckCircle2}
              // trend={true}
              trendValue={`${dashboardData?.count?.trend?.totalHired || 0}%`}
              color={`purple`}
            />
          </div>

          {/* Recent Activity */}
          <div className={"grid grid-cols-1 lg:grid-cols-2 gap-8"}>
            <Card
              title={`Recent Job Posts`}
              subtitle={`Your latest job postings`}
              headerAction={
                <button
                  className="text-sm text-blue-400 hover:text-blue-600 font-medium"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View all
                </button>
              }
            >
              <div className="space-y-3">
                {dashboardData?.data?.recentJobs
                  ?.slice(0, 3)
                  ?.map((job, index) => (
                    <JobDashboardCard key={index} job={job} />
                  ))}
                {(!dashboardData?.data?.recentJobs ||
                  dashboardData?.data?.recentJobs?.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-6">
                    No recent jobs posted.
                  </p>
                )}
              </div>
            </Card>

            {/* Recent Application */}
            <Card
              title={`Recent Applications`}
              subtitle={`Latest candidate applications`}
              headerAction={
                <button
                  className="text-sm text-blue-500 font-medium hover:text-blue-700"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View all
                </button>
              }
            >
              <div className="space-y-3">
                {dashboardData?.data?.recentApplication
                  ?.slice(0, 3)
                  ?.map((data, index) => (
                    <ApplicationDashboardCard
                      key={index}
                      application={data?.application || ""}
                      position={data?.job || ""}
                      time={moment(data?.updatedAt).fromNow()}
                    />
                  ))}

                {(!dashboardData?.data?.recentApplication ||
                  dashboardData?.data?.recentApplication?.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-6">
                    No recent applicants.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Action */}
          <Card
            title={`Quick Action`}
            subtitle={`common tasks to get you started`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Post New Job",
                  icon: Plus,
                  color: "bg-blue-50 text-blue-600",
                  path: "/post-job",
                },
                {
                  title: "Review Application",
                  icon: Users,
                  color: "bg-green-50 text-green-600",
                  path: "/manage-jobs",
                },
                {
                  title: "Company Settings",
                  icon: Building2,
                  color: "bg-orange-50 text-orange-700",
                  path: "/employer-profile",
                },
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-xl border
                 border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 text-left"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>

                  <span className="font-medium text-gray-900">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
