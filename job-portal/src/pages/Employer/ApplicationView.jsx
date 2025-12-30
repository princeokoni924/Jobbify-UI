import { useEffect, useState, useMemo } from "react";
import {
  Users,
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  Download,
  Eye,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { getInitials } from "../utils/helpler";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import StatusBadge from '../../components/StatusBadge'
import ApplicationProfilePreview from '../../components/Cards/ApplicationProfilePreview'

const ApplicationView = () => {
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectApplicant, setSelectApplicants] = useState(null);

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)
      );
      // setApplications((await response).data)
      setApplications(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error("Fail to fetch an appliction");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) {
      navigate("/manage-jobs");
      return;
    } else {
      fetchApplication();
    }
  }, [jobId, navigate]);

  // Group application by job
  const groupApplication = useMemo(() => {
    const filtered = applications.filter((app) => app.job.title.toLowerCase());
    return filtered.reduce((acc, app) => {
      const jobId = app.job._id;
      if (!acc[jobId]) {
        acc[jobId] = {
          job: app.job,
          applications: [],
        };
      }
      acc[jobId].applications.push(app);
      return acc;
    }, {});
  }, [applications]);

  // handle download resume
  const handleDownloadResume = (resumeUrl) => {
    window.open(resumeUrl, "_blank");
  };
  return (
    <DashboardLayout activeMenu={`manage-jobs`}>
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full w-12 h-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Loading application, please wait....
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4 items-center mb-4 sm:mb-0">
              <button
                onClick={() => navigate("/manage-jobs")}
                className="group flex items-center space-x-2 px-3 py-2 text-sm
               font-medium text-gray-600 hover:text-white bg-white/50 
              hover:bg-gradient-to-r hover:from-blue-500
               hover:to-blue-700
                rounded-xl border border-gray-200 hover:border-transparent
                 transition-all duration-200 hover:shadow-xl shadow-lg shadow-gray-100"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Applications Overview
              </h1>
            </div>
          </div>
        </div>
        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:p-0 pb-8">
          {Object.keys(groupApplication).length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <Users className="w-24 h-24  mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No applications available
              </h3>
              <p className="mt-2 text-gray-500">
                No applications found at the moment.
              </p>
            </div>
          ) : (
            // Application by job
            <div className="space-y-8">
              {Object.value(groupApplication).map(({ job, applications }) => (
                <div
                  className="bg-white rounded-xl shadow-md overflow-hidden "
                  key={job._id}
                >
                  {/* Job Header */}
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-lg text-white font-semibold">
                          {job.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-100">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 " />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span className="text-sm">{job.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{job.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                        <span className="text-sm text-white font-medium">
                          {" "}
                          {applications.length} Application
                          {applications.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Application list */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div
                          className="flex flex-col
                         md:flex-row md:items-center
                         justify-between border p-4 border-gray-200
                          rounded-lg transition-colors hover:bg-gray-50"
                          key={app._id}
                        >
                          <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              {app.applicant.avatar.avatar ? (
                                <img
                                  src={app.applicant.avatar}
                                  alt={app.applicant.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600">
                                    {getInitials(app.applicant.name)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Application Info */}
                            <div className="max-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900">{app.applicant.name}</h3>
                              <p className="text-gray-500 text-sm">{app.applicant.email}</p>
                              <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                <Calendar className="h-3 w-3" />
                                <span className="">
                                  Applied {""}{" "}
                                  {moment(app.createdAt)?.format("Do MM YYYY")}
                                </span>
                                {/* <span className="">
                                  Applied {""}{" "}
                                  {moment(app.createdAt)?.format("Do MM YYYY")}
                                </span> */}
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          <div className="flex items-center gap-3 mt-4 md:m-0">
                            <StatusBadge status={app.status}/>
                            <button
                              onClick={() =>
                                handleDownloadResume(app.applcant.resum)
                              }
                              className="inline-flex items-center gap-2 px-3
                               py-2 bg-blue-600 text-white text-sm
                               font-medium rounded-lg hover:bg-blue-600
                                transition-colors duration-200"
                            >
                              <Download className="w-4 h-4" />
                              CV
                            </button>

                            <button
                             onClick={() => setSelectApplicants(app)}
                              className="inline-flex items-center gap-2 px-3
                               py-2 bg-gray-100 text-gray-700 text-sm
                               font-medium rounded-lg hover:bg-blue-600
                                transition-colors duration-200"
                              >
                              <Eye className="h-5 w-5" />
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Model */}
        {selectApplicant && (
          <ApplicationProfilePreview
          selectApplicant={selectApplicant}
          setSelectApplicants={setSelectApplicants}
          handleDownloadResume={handleDownloadResume}
          handleClose={()=>{
            setSelectApplicants(null)
            fetchApplication()
          }}
          />

          
        )}
      </div>
    </DashboardLayout>
  );
};
export default ApplicationView;
