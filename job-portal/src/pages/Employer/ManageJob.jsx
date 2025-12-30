import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Users,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ManageJob = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTearm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPage = 8;

  // Sample Job Data
  const [jobs, setJobs] = useState([]);

  // filter and sort job
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((j) => {
      const matchSearch =
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "All" || j.status === statusFilter;
      return matchSearch && matchStatus;
    });

    // sort Jobs
    filtered.sort((a, b) => {
      let value_a = a[sortField];
      let value_b = b[sortField];

      if (sortField === "applicants") {
        value_a = Number(value_a);
        value_b = Number(value_b);
      }

      if (sortDirection === "asc") {
        return value_a > value_b ? 1 : -1;
      } else {
        return value_a < value_b ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchTerm, sortDirection, statusFilter, sortField]);

  // pagination
  const totalPage = Math.ceil(filteredAndSortedJobs.length / itemsPage);
  const startIndex = (currentPage - 1) * itemsPage;
  const paginatedJob = filteredAndSortedJobs.slice(
    startIndex,
    startIndex + itemsPage
  );

  // handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // toggle the status of a job
  const handleStatusChange = async (jobId) => {
    try {
      await axiosInstance.put(
        API_PATHS.JOBS.TOGGLE_CLOSE(jobId)
      );
      getPostedJob(true);
   
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error("Error toggling job status");
    }
  };

  // delete a specific job
  const handleDeleteJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job deleted successfully!");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error("Error deleting job");
    }
  };

  // Decide which sort icon to display base on current sort field and direction
  const SortIconDecision = ({ field }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-400" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  // loading state with animations
  const LoadingRow = () => (
    <tr className="animate-ping">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </td>

      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </td>

      <td className="px-6 py-4">
        <div className="flex space-x-2 ">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </td>
    </tr>
  );

  // disable loader when job displayed
  const getPostedJob = async (disableLoader) => {
    setIsLoading(!disableLoader);
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOBS_EMPLOYERS
      );
      if (response.status === 200 && response.data?.length > 0) {
        const formattedJobs = response.data?.map((j) => ({
          id: j._id,
          title: j?.title,
          company: j?.company?.name,
          status: j?.isClosed ? "Closed" : "Active",
          applicants: j?.applicationCount || 0,
          datePosted: moment(j?.createdAt).format("DD-MM-YYYY"),
          logo: j?.company?.companyLogo,
        }));
        setJobs(formattedJobs);
      }
    } catch (err) {
      if (err.response) {
        // handle api specific errors
        console.error(err.response.data.message);
      } else {
        console.error("Error posting job. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostedJob();
    return () => {};
  }, []);

  // const SortIcon = ({ field }) => {
  //   return handleSortIconDecision({ field });
  // };
  return (
    <DashboardLayout activeMenu={`manage-jobs`}>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-row  items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Job Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your job postings and track applications
                </p>
              </div>
              <button
                className="inline-flex items-center
               px-6 py-3 bg-gradient-to-r
               from-blue-500 to-blue-600 hover:from-blue-700
               hover:to-blue-800 text-white
                rounded-xl transition-all duration-300 text-sm font-semibold
                 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                 transform hover:-translate-y-0.5 whitespace-nowrap"
                onClick={() => navigate("/post-job")}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Job
              </button>
            </div>
          </div>

          {/* Filters */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl
           shadow-xl shadow-black/5 border border-white/20 p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-2 text-sm 
                  border border-gray-200 outline-0
                   rounded-lg focus:ring-1 focus:ring-blue-500/20
                   focus:border-blue-500 transition-all
                    duration-200 bg-gray-50/50 placeholder-gray-400 "
                  type="text"
                  placeholder="Search Job....."
                  value={searchTerm}
                  onChange={(e) => setSearchTearm(e.target.value)}
                />
              </div>
              {/* Status filter */}
              <div className="sm:w-48 ">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-4 py-2 text-sm border border-gray-200
                   rounded-lg focus:ring-1 outline-0 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  <option value={"All"}>All Status</option>
                  <option value={"Active"}>Active</option>
                  <option value={"Closed"}>Closed</option>
                </select>
              </div>
            </div>

            {/* Result Summary */}
            <div className="my-4">
              <p className="text-sm text-gray-600">
                Showing {paginatedJob.length} of {filteredAndSortedJobs.length}
                {""} jobs
              </p>
            </div>
            {/* Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              {filteredAndSortedJobs.length === 0 && !isLoading ? (
                <div className="py-12 items-center ">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 justify-center items-center flex ">
                    No job found
                  </h3>
                  <p className="text-gray-400 flex items-center justify-center">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="w-[75vw] md:w-full overflow-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                      <tr>
                        <th
                          className="px-6 py-4 text-left text-sm
                         font-semibold text-gray-600 uppercase
                         tracking-wider cursor-pointer
                          hover:bg-gray-100/60 transition-all
                           duration-200 min-w-[200px] sm:min-w-0"
                          onClick={() => handleSort("title")}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            <span className="">Job Title</span>
                            {/* <SortIcon field={"title"} /> */}
                            <SortIconDecision field={"title"} />
                          </div>
                        </th>

                        <th
                          className="px-6 py-4 text-left text-xs
                         font-semibold text-gray-600 uppercase tracking-wider cursor-pointer
                          hover:bg-gray-100/60 transition-all
                           duration-200 min-w-[120px] sm:min-w-0"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            <span>Status</span>
                            {/* <SortIcon field={"status"} /> */}
                            <SortIconDecision field={"title"} />
                          </div>
                        </th>

                        <th
                          className="px-6 py-4 text-left text-xs
                         font-semibold text-gray-600 uppercase tracking-wider cursor-pointer
                          hover:bg-gray-100/60 transition-all
                           duration-200 min-w-[130px] sm:min-w-0"
                          onClick={() => handleSort("applicants")}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            <span>Applicants</span>
                            {/* <SortIcon field={"applicants"} /> */}
                            <SortIconDecision field={"applicants"} />
                          </div>
                        </th>

                        <th
                          className="px-6 py-4 text-left text-xs
                         font-semibold text-gray-600 uppercase tracking-wider cursor-pointer
                          hover:bg-gray-100/60 transition-all
                           duration-200 min-w-[180px] sm:min-w-0 flex items-center justify-center"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <LoadingRow key={index} />
                          ))
                        : paginatedJob.map((job) => (
                            <tr key={job.id} className="hover:bg-blue-50/30 transition-all
                             duration-200 border-b border-gray-100/60">
                              <td className="px-6 py-5 whitespace-nowrap min-w-[200px] sm:min-w-0">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{job.title}</div>
                                  <div className="text-sm text-gray-500 font-medium">{job.company}</div>
                                </div>
                              </td>

                              <td className="px-6 py-5 whitespace-nowrap min-w-[120px] sm:min-w-0">
                                <span
                                  className={`inline-flex px-3 py-1.5 ml-10 text-xs font-semibold rounded-full ${
                                    job.status === "Active"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-gray-100 text-gray-700 border border-gray-200"
                                  }`}
                                >
                                  {job.status}
                                </span>
                              </td>

                              <td className="px-6 py-5 whitespace-nowrap min-w-[130px] sm:min-w-0">
                                <button
                                  className="flex items-center text-sm text-blue-600
                                   hover:text-blue-800 font-semibold
                                    transition-colors duration-200
                                     hover:bg-blue-50 px-2 py-1 rounded-lg ml-10"
                                  onClick={() =>
                                    navigate("/applicants", {
                                      state: { jobId: job.id },
                                    })
                                  }
                                >
                                  <Users className="w-4 h-4 mr-1.5" />
                                  {job.applicants}
                                </button>
                              </td>

                              <td className="px-6 py-5 whitespace-nowrap min-w-[180px] sm:min-w-0">
                                <div className="flex space-x-2">
                                      <button
                                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                  onClick={() =>
                                    navigate("/post-job", {
                                      state: { jobId: job.id },
                                    })
                                  }
                                >
                                  <Edit className="w-4 h-4"/>
                                </button>
                                
                                

                                {job.status === "Active" ? (
                                  <button
                                  onClick={()=>handleStatusChange(job.id)}
                                  className="flex items-center gap-2 text-xs text-yellow-600
                                   hover:text-yellow-700 p-1 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                                  >
                                    <X className="w-4 h-4"/>
                                    <span className="hidden sm:inline">Close</span>
                                  </button>
                                ):(
                                  <button 
                                  onClick={()=>handleStatusChange(job.id)}
                                  className="flex items-center gap-2 text-sm text-green-600
                                   hover:text-green-800 p-1 rounded-lg hover:bg-green-50
                                    transition-colors duration-200"
                                  >
                                    <Plus className="w-4 h-4"/>
                                    <span className="hidden sm:inline">Activate</span>
                                  </button>
                                )}
                                <button
                                onClick={()=>handleDeleteJob(job.id)}
                                className="text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200 p-2"
                                >
                                  <Trash2 className="w-4 h-4"/>
                                </button>

                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>


            {/* Pagination */}
            {totalPage > 1 && (
             <div className="mt-6 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                onClick={()=>setCurrentPage(Math.max(1, currentPage-1))}
                disabled={currentPage ===1}
                className="relative inline-flex items-center
                 px-4 py-2 border border-gray-300 text-sm font-medium 
                 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                onClick={()=>setCurrentPage(Math.min(totalPage, currentPage +1))}
                disabled={currentPage === totalPage}
                className="ml-3 inline-flex relative items-center px-4 py-2 border border-gray-300 text-sm font-medium 
                 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between ">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{""}
                    <span className="font-medium ml-2">{startIndex + 1}</span> to {" "}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPage, filteredAndSortedJobs.length)}
                    </span> {" "} of {" "}
                    <span className="font-medium">{filteredAndSortedJobs.length}</span> {" "}
                    Result
                  </p>
                </div>
                <div>
                  <nav className="relative z-10 inline-flex rounded-md shadow-sm space-x-px">
                    <button className="relative inline-flex items-center px-2 py-2
                     rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                    onClick={()=>setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage===1}
                    >
                      Prev
                    </button>
                    {Array.from({length: totalPage}, (_, i)=> i + 1 ).map((page)=>(
                      <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage ===page ? "z-10 bg-blue-50 border-blue-500 text-blue-600" 
                        :"bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                    onClick={() => setCurrentPage(Math.min(totalPage, currentPage + 1))}
                    disabled={currentPage === totalPage}
                    className="relative inline-flex items-center px-2 py-2
                     rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                  </nav>
                </div>
              </div>
             </div>
                  )} 
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default ManageJob;
