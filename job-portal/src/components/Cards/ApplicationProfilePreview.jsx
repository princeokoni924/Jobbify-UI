/* eslint-disable no-unused-vars */
import { Download, X } from "lucide-react";
import { useState } from "react";
import { getInitials } from "../../pages/utils/helpler";
import moment from "moment";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPath";
import toast from "react-hot-toast";
import StatusBadge from "../StatusBadge";

const statusOptions = ["Applied", "Accepted", "Reject", "In Review"];

const ApplicationProfilePreview = ({
  selectApplication,
  setSelectApplications,
  handleDownloadResume,
  handleClose,
}) => {
  const [currentStatus, setCurrentStatus] = useState(selectApplication.status);
  const [isLoading, setIsLoading] = useState(false);

  // handle on change status
  const onChangeStatus = async (event) => {
    const newStatus = event.target.value;
    setCurrentStatus(newStatus);
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(selectApplication._id),
        {
          status: newStatus,
        }
      );
      if (response.status === 200) {
        // update local state after succefull update
        setSelectApplications({ ...selectApplication, status: newStatus });
        toast.success("Application status updated successfully");
      }
    } catch (err) {
      toast.error("Error updating status.");
      // optionally revert status if fail
      setCurrentStatus(selectApplication.status);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.2)] bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Model Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Applicant Profile
          </h3>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handleClose()}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Model Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            {selectApplication.applicant.avatar ? (
              <img
                className="w-20 h-20 object-cover mx-auto rounded-full"
                src={selectApplication.applicant.avatar}
                alt={selectApplication.applicant.name}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center mx-auto">
                <span className="text-white text-xl font-semibold">
                  {getInitials(selectApplication.applicant.name)}
                </span>
              </div>
            )}
            <h4 className="mt-4 text-xl font-semibold text-gray-900">
              {selectApplication.applicant.name}
            </h4>
            <p className="text-gray-600">{selectApplication.applicant.email}</p>
          </div>

          {/* Applied postion */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Applied Position</h5>
              <p className="text-gray-700">{selectApplication.job.title}</p>
              <p className="text-gray-600 text-sm mt-1">
                {selectApplication.job.location}.{selectApplication.job.type}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Application Details</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <StatusBadge status={currentStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applied Date:</span>
                  <span className="text-gray-900">
                    {moment(selectApplication.job.createdAt).format(
                      "Do MM YYYY"
                    )}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="inline-flex w-full
               items-center justify-center
               gap-2 px-4 py-2 bg-blue-500 text-white font-medium 
               rounded-lg hover:bg-blue-800 transition-colors duration-200"
              onClick={() =>
                handleDownloadResume(selectApplication.applicant.resume)
              }
            >
              <Download className="w-4 h-4" />
              Download CV
            </button>

            {/* Status Dropdown */}
            <div className="mt-4">
              <label className="block mb-1 text-sm text-gray-700 font-medium" htmlFor="">
                Change Application status
              </label>
              <select value={currentStatus}
              onChange={onChangeStatus}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg
               p-2 focus:ring-blue-500 focus:border-blue-500 "
              >
                {statusOptions.map((status)=>(
                <option key={status}
                value={status}>{status}</option>
                ))}
              </select>
              {isLoading && (
                <p className="text-sm text-gray-500 font-medium mt-1">Updating Status, please wait......</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationProfilePreview;
