import {
  MapPin,
  DollarSign,
  ArrowLeft,
  Users,
  Building2,
  Clock,
  TrendingUp,
  Wifi,
  Briefcase,
} from "lucide-react";
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  CURRENCIES,
  WORK_MODE,
  SAlARY_PERIOD,
  EXPERIENCE_LEVEL,
} from "../../pages/utils/data";
import { useAuth } from "../../content/AuthContext";

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const getCurrencyInfo = () => {
    const currency = CURRENCIES.find(
      (c) => c.value === formData.salaryCurrency,
    );
    return (
      currency || {
        value: "NGN",
        label: "₦ NGN (Nigerian Naira)",
        symbol: "₦ ",
      }
    );
  };

  const currencyInfo = getCurrencyInfo();

  const getPaymentPeriodLabel = () => {
    const period = SAlARY_PERIOD.find((p) => p.value === formData.salaryPeriod);
    return period ? period.label : "Monthly";
  };

  const getWorkModeLabel = () => {
    const work_mode = WORK_MODE.find(
      (workMode) => workMode.value === formData.workMode,
    );
    return work_mode ? work_mode.label : "On-site";
  };

  const getExperienceLevel = () => {
    const experience = EXPERIENCE_LEVEL.find(
      (e) => e.value === formData.experienceLevel,
    );
    return experience ? experience.label : "Mid level";
  };

  // format salary for display
  const format_salary = () => {
    if (!formData.salaryMin || !formData.salaryMax) {
      return "Compitative Salary";
    }

    const min = parseInt(formData.salaryMin).toLocaleString();
    const max = parseInt(formData.salaryMax).toLocaleString();
    const period = getPaymentPeriodLabel();
    return `${currencyInfo.symbol} ${min} - ${currencyInfo.symbol} ${max} per ${period}`;
  };
  const { user } = useAuth();
  //const currencies = [{ value: "usd" }, { label: "$" }];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 lg:px-8 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with glassmorphism effect */}
        <div className="mb-8 backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl rounded-2xl px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg md:text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Job Preview
              </h2>
            </div>
            <button
              onClick={() => setIsPreview(false)}
              className="group flex items-center
             space-x-2 px-6 py-3 text-xs md:text-sm
            font-medium text-gray-600 hover:text-white
             bg-white/50 hover:bg-gradient-to-r from-blue-500 to-blue-600 transition-all 
            duration-200 border rounded-xl border-gray-200 hover:border-transparent
             shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to edit</span>
            </button>
          </div>
          {/* Main content card */}
          <div className="">
            {/* Hero section with clean bg */}
            <div className="relative bg-white px-0 pb-8 mt-8 border-b border-gray-100 ">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-0">
                  <div className="flex-1">
                    <h1 className="text-lg lg:text-xl font-semibold mb-2 leading-tight text-gray-900">
                      {formData.jobTitle}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {formData.isRemote ? "Remote" : formData.location}
                        </span>
                        {formData.isRemote && formData.location && (
                          <span className="text-sm text-gray-500">
                            {" "}
                            .{formData.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {user?.companyLogo ? (
                    <img
                      src={user.companyLogo}
                      alt={`Company logo`}
                      className={`h-15 md:h-20 w-16 md:w-20 object-cover rounded-2xl border-4 border-white/20 shadow-lg`}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-400 " />
                    </div>
                  )}
                </div>

                {/* Catgory Tags */}
                <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
                  <span className="px-4 py-2 bg-blue-50 text-sm text-blue-600 font-semibold rounded-full border border-blue-200">
                    {
                      JOB_CATEGORIES.find((e) => e.value === formData.category)
                        ?.label
                    }
                  </span>
                  {/* Job-tag */}
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold rounded-full border border-blue-200">
                    {JOB_TYPES.find((t) => t.value === formData.jobType)?.label}
                  </span>

                  {/* Work Mode Tag */}
                  <span className="px-4 py-2 bg-green-50 text-green-600 font-semibold text-sm rounded-full border border-green-200 flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    {getWorkModeLabel()}
                  </span>

                  {/* Experience level tag */}
                  <span className="px-4 py-2 bg-orange-50 text-orange-600 font-semibold text-sm rounded-full border border-orange-200 flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    {getExperienceLevel()}
                  </span>

                  <div
                    className="flex items-center space-x-1 px-4 py-2 gap-3 text-sm
                   bg-gray-50 text-gray-700 
                   font-semibold rounded-full border border-gray-200"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="">Posted today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="px-0 pb-8 space-y-8">
              {/* Salary section */}
              <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full -translate-y-16 translate-x-16 "></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    {/* Currency sign container */}
                    <div className="flex items-center  space-x-3">
                      <div className="p-3  bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl">
                        <DollarSign className="h-4 md:h-6 w-4 md:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 ">
                          {/* Compansation */}
                        </h3>
                        <div className="text-sm md:text-lg font-bold text-gray-900 ">
                          {format_salary()}
                          {/* {formData.salaryMax.toLocaleString()}
                          <span className="text-sm md:text-lg text-gray-600 font-normal ml-2">
                            Per Month
                          </span> */}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Currency:{" "}
                          {currencyInfo.label.split("(")[1]?.replace(")", "") ||
                            currencyInfo.value}
                        </div>
                      </div>
                    </div>
                    <div
                      className="hidden md:flex items-center
                   space-x-2 text-sm text-emerald-700 bg-emerald-100
                   px-3 py-1 rounded-full"
                    >
                      <Users className="w-4 h-4" />
                      {/* <span>Competitive</span> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  <span className="text-base md:text-lg">About This Role</span>
                </h3>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {formData.description}
                  </div>
                </div>
              </div>

              {/* Requirement */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                  <span className="text-base md:text-lg">
                    What We're Looking For
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {formData.requirement}
                  </div>
                </div>
              </div>

              {/* responsibilities */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 flext items-center space-x-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-700 to-purple-700 rounded-full"></div>
                  <span className="text-base md:text-lg">
                    Your responsibility
                  </span>
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6 ">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {formData.responsibilities}
                  </div>
                </div>
              </div>

              {/* Additional Job Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Job Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Job Type</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {JOB_TYPES.find((t) => t.value === formData.jobType)
                          ?.label || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Wifi className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Work Mode</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getWorkModeLabel()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Experience Level</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getExperienceLevel()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment Period</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getPaymentPeriodLabel()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;
