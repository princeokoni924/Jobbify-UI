import { useState, useEffect } from "react";
import {
  Plus,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoaderSpinner from "../../components/LoaderSpinner";
import JobDashboardCard from "../../components/Cards/JobDashboardCard";
import ApplicationDashboardCard from "../../components/Cards/ApplicationDashboardCard";
import toast from "react-hot-toast";
import {useAuth} from '../../content/AuthContext'

const Card = ({ className, children, title, headerAction, subtitle }) => {
  return (
    <div
      className={`bg-white rounded-xl border 
shadow-sm hover:shadow-md transition-shadow duration-300 border-gray-100 ${className}`}
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
      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  );
};

const StatCard = ({
  title,
  trendValue,
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  value,
  color,
  trend = false,
  subtitle,
}) => {
  const colorClass = {
    blue: "from-blue-200 to-blue-400",
    green: "from-green-200 to-green-400",
    purple: "from-violet-200 to-violet-400",
    orange: "from-orange-200 to-orange-300",
    sea_blue: "from-cyan-200 to-cyan-400",
    red: "from-red-200 to-red-400",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClass[color]} text-white border-0`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-white/70 text-xs mt-1">{subtitle}</p>
          )}
          {trend && trendValue !== undefined && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">{trendValue}%</span>
            </div>
          )}
        </div>
        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);

      // Handle different response formats
      const data = res.data?.data || res.data;

      setDashboardData(data);
    } catch (err) {
      toast.error("Dashboard error:");
      setError(err.response?.data?.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
  }, [location.pathname]);

  // Calculate analytics stats
  const analytics = dashboardData?.analytics || {};
  const jobs = dashboardData?.jobs || [];
  const applications = dashboardData?.applications || [];

  // Derived stats
  const totalJobPosted = analytics.totalJobPosted || 0;
  const totalActiveJobs = analytics.totalActiveJobs || 0;
  const totalApplicationsReceived = analytics.totalApplicationsReceived || 0;
  const totalHired = analytics.totalHired || 0;

  // Calculate additional metrics
  const closedJobs = totalJobPosted - totalActiveJobs;
  const averageApplicationsPerJob = totalJobPosted > 0 
    ? (totalApplicationsReceived / totalJobPosted).toFixed(1) 
    : 0;
  const hireRate = totalApplicationsReceived > 0 
    ? ((totalHired / totalApplicationsReceived) * 100).toFixed(1) 
    : 0;
 const {user} = useAuth();
  return (
    <DashboardLayout activeMenu="employer-dashboard">
      {isLoading ? (
        <LoaderSpinner />
      ) : error ? (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Failed to Load Dashboard
              </h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
              <button
                onClick={getDashboardOverview}
                className="mt-3 px-4 py-2 bg-red-600 font-bold text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8 mb-20">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold">     Hey, {user?.name},Welcome Back! 👋</h1>
            <p className="text-blue-100 mt-2">
              Here's an overview of your recruitment activities
            </p>
          </div>

          {/* Main Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Jobs Posted"
              value={totalJobPosted}
              icon={Briefcase}
              color="sea_blue"
              subtitle="All time"
            />

            <StatCard
              title="Active Jobs"
              value={totalActiveJobs}
              icon={Briefcase}
              color="blue"
              subtitle="Currently open"
            />

            <StatCard
              title="Total Applications"
              value={totalApplicationsReceived}
              icon={Users}
              color="green"
              subtitle={`${averageApplicationsPerJob} avg per job`}
            />

            <StatCard
              title="Hired"
              value={totalHired}
              icon={CheckCircle2}
              color="purple"
              subtitle={`${hireRate}% hire rate`}
            />
          </div>

          {/* Secondary Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-sm font-medium">
                    Closed Jobs
                  </p>
                  <p className="text-3xl font-bold text-orange-900 mt-1">
                    {closedJobs}
                  </p>
                </div>
                <div className="bg-orange-200 p-3 rounded-xl">
                  <XCircle className="w-6 h-6 text-orange-700" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-medium">
                    Avg Applications/Job
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {averageApplicationsPerJob}
                  </p>
                </div>
                <div className="bg-purple-200 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">
                    Hire Rate
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {hireRate}%
                  </p>
                </div>
                <div className="bg-green-200 p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card
              title="Recent Job Posts"
              subtitle="Your latest job postings"
              headerAction={
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View all
                </button>
              }
            >
              <div className="space-y-3">
                {jobs?.slice(0, 3)?.map((job, index) => (
                  <JobDashboardCard key={job._id || index} job={job} />
                ))}
                {(!jobs || jobs.length === 0) && (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      No jobs posted yet.
                    </p>
                    <button
                      onClick={() => navigate("/post-job")}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Post your first job
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Applications */}
            <Card
              title="Recent Applications"
              subtitle="Latest candidate applications"
              headerAction={
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View all
                </button>
              }
            >
              <div className="space-y-3">
                {applications?.slice(0, 3)?.map((data, index) => (
                  <ApplicationDashboardCard
                    key={data._id || index}
                    application={data.application || data.applicant}
                    position={data.job?.title || data.job}
                    time={moment(data.updatedAt || data.createdAt).fromNow()}
                  />
                ))}
                {(!applications || applications.length === 0) && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      No applications yet.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applications will appear here when candidates apply
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions" subtitle="Common tasks to get you started">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Post New Job",
                  icon: Plus,
                  color: "bg-blue-50 text-blue-600",
                  path: "/post-job",
                },
                {
                  title: "Review Applications",
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
                 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 text-left group"
                  onClick={() => navigate(action.path)}
                >
                  <div
                    className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Performance Insights */}
          {totalJobPosted > 0 && (
            <Card title="Performance Insights">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Job Performance
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Rate</span>
                      <span className="font-semibold text-gray-900">
                        {totalJobPosted > 0
                          ? ((totalActiveJobs / totalJobPosted) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            totalJobPosted > 0
                              ? (totalActiveJobs / totalJobPosted) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Hiring Success
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hire Rate</span>
                      <span className="font-semibold text-gray-900">
                        {hireRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${hireRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;

