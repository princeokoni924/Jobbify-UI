import DashboardLayout from "../../components/layout/DashboardLayout";
import { Save, X } from "lucide-react";

const EditProfileDetails = ({
  formData,
  handleImgChange,
  saving,
  uploading,
  handleInputChange,
  handleCancel,
  handleSaveAsync,
}) => {
  return (
    <DashboardLayout activeMenu={`employer-profile`}>
      {formData && (
        <div className="min-h-screen bg-gray-100/50 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
                <h1 className="text-lg lg:text-xl font-medium  text-white">
                  Edit profile
                </h1>
              </div>
              {/* Edit form */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal info */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium pb-2 text-gray-800 border-b border-gray-200">
                      Personal info
                    </h2>
                    {/* Avatar uploading */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={formData?.avatar || null}
                          alt="Profile"
                          className="w-20 h-20 object-cover rounded-full border-2 "
                        />
                        {uploading?.avatar && (
                          <div
                            className="absolute bg-black bg-opacity-50 rounded-full
                           flex items-center justify-center"
                          >
                            <div className="animate-spin border-2 border-t-transparent rounded-full w-6 h-6"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block">
                          <span className="sr-only">Choose picture</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImgChange(e, "avatar")}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full
                            file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                            hover:file:text-blue-100 transition-colors duration-200"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Name input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                        <span className="ml-1"></span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 focus:ring-1 outline-none
                        focus:border-transparent transition-all duration-200 rounded-lg focus:ring-blue-500"
                        placeholder="Type in your full name"
                      />
                    </div>

                    {/* Email (Read only)*/}
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="email"
                      >
                        Email Address
                        <span className="ml-1"></span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Company info */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium pb-2 text-gray-800 border-b border-gray-200">
                      Company info
                    </h2>

                    {/* Company logo upload */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={formData?.companyLogo || null}
                          alt="logo"
                          className="w-20 h-20 rounded-xl border-2 object-cover border-blue-50"
                        />
                        {uploading?.logo && (
                          <div
                            className="absolute bg-black bg-opacity-50 rounded-full
                           flex items-center justify-center"
                          >
                            <div className="animate-spin border-2 border-t-transparent rounded-full w-6 h-6"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block" htmlFor="logo">
                          <span className="sr-only">
                            Choose your company's logo
                          </span>
                          <input
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full
                            file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700
                            hover:file:text-green-100 transition-colors duration-200"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImgChange(e, "logo")}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label
                        className="block text-sm text-gray-700 font-medium mb-2"
                        htmlFor="companyName"
                      >
                        Company Name
                      </label>
                      <input
                        className="w-full  px-4 py-3 border border-gray-300 focus:ring-1 outline-none
                        focus:border-transparent transition-all duration-200 rounded-lg focus:ring-blue-500"
                        placeholder="Enter your company's name"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                      />
                    </div>

                    {/* Company description */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-2 font-medium">
                        Company Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Kindly describe your company"
                        value={formData.companyDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "companyDescription",
                            e.target.value
                          )
                        }
                        type="text"
                        className="w-full resize-none  px-4 py-3 border border-gray-300 focus:ring-1 outline-none
                        focus:border-transparent transition-all duration-200 rounded-lg focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/*Action Btn  */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg
                  hover:bg-yellow-300 transition-colors font-medium duration-200 flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>

                  {/* Save or upload avatar */}
                  <button
                    onClick={handleSaveAsync}
                    disabled={saving || uploading.avatar || uploading.logo}
                    className="py-3 px-6 bg-blue-600 flex items-center rounded-lg space-x-2
                  transition-colors duration-200  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 text-white font-medium"
                  >
                    {saving ? (
                      <div className="w-4 h-4  border-white border-t-transparent rounded-full animate-spin border-2"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? "Saving...." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditProfileDetails;
