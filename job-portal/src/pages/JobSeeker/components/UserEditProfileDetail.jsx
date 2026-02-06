import React from "react";
import { Save, X, Plus, Trash2 } from "lucide-react";
const UserEditProfileDetail = ({
  formData,
  saving,
  handleImgChange,
  handleCancel,
  uploading,
  handleInputChange,
  saveProfile,
}) => {
  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-100/50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading profile data.....</p>
          <div className="animate-spin border-t-transparent mx-auto border-4 w-9 h-9 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Handle array field changes (skills, experience, education)
  const handleArrayChange = (field, index, value) => {
    const currentArray = formData?.[field] || [];
    const updatedArray = [...currentArray];
    updatedArray[index] = value;
    handleInputChange(field, updatedArray);
  };

  // Add new item to array
  const addArrayItem = (field, defaultValue = "") => {
    const currentArray = formData?.[field] || [];
    const updatedArray = [...currentArray, defaultValue];
    handleInputChange(field, updatedArray);
  };

  // Remove item from array
  const removeArrayItem = (field, index) => {
    const currentArray = formData?.[field] || [];
    const updatedArray = currentArray.filter((_, i) => i !== index);
    handleInputChange(field, updatedArray);
  };

  return (
    <div className="min-h-screen bg-gray-100/50 py-8 px-4">
      {formData && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-6">
              <h1 className="text-lg lg:text-xl font-medium text-white">
                Edit Profile
              </h1>
            </div>

            {/* Edit Form */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN - Personal Info */}
                <div className="space-y-6">
                  <h2 className="text-lg font-medium pb-2 text-gray-800 border-b border-gray-200">
                    Personal Info
                  </h2>

                  {/* Avatar Upload */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={formData?.avatar}
                        alt={formData?.name || "Profile"}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      {uploading?.avatar && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin border-4 border-t-transparent border-white rounded-full w-6 h-6"></div>
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
                          className="text-sm block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span>Full Name</span>
                      <input
                        type="text"
                        value={formData?.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="mt-1 w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:border-transparent transition-all duration-200 rounded-lg focus:ring-blue-500 outline-none"
                        placeholder="Your name e.g. Scott Jane"
                      />
                    </label>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span>Email Address</span>
                      <input
                        type="email"
                        className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        value={formData?.email}
                        disabled
                      />
                    </label>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span>Phone</span>
                      <input
                        type="tel"
                        value={formData?.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="mt-1 w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="+234 8XX-XXX-XXXX"
                      />
                    </label>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span>Location</span>
                      <input
                        type="text"
                        value={formData?.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="mt-1 w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="City, Country"
                      />
                    </label>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span>Bio</span>
                      <textarea
                        value={formData?.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        rows={4}
                        className="mt-1 w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </label>
                  </div>
                </div>

                {/* RIGHT COLUMN - Professional Info */}
                <div className="space-y-6">
                  <h2 className="text-lg font-medium pb-2 text-gray-800 border-b border-gray-200">
                    Professional Info
                  </h2>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="space-y-2">
                      {(formData?.skill || []).map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill || ""}
                            onChange={(e) =>
                              handleArrayChange("skill", index, e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="e.g. JavaScript, React, Node.js"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("skill", index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("skill", "")}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Add Skill
                      </button>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience{" "}
                      <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="space-y-4">
                      {(formData?.experience || []).map((exp, index) => (
                        <div key={index} className="flex gap-2 ">
                          <textarea
                            value={exp.title || ""}
                            onChange={(e) =>
                              handleArrayChange("experience", index, {
                                ...exp,
                                title: e.target.value,
                              })
                            }
                            rows={2}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Job Title"
                          />

                          <textarea
                            value={exp.company || ""}
                            onChange={(e) =>
                              handleArrayChange("experience", index, {
                                ...exp,
                                company: e.target.value,
                              })
                            }
                            rows={2}
                            className="flex-1 px-4 placeholder:text-sm py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                            placeholder=" Company"
                          />
                          <div>
                            <input
                              value={exp.startDate || ""}
                              onChange={(e) =>
                                handleArrayChange("experience", index, {
                                  ...exp,
                                  startDate: e.target.value,
                                })
                              }
                              type="date"
                              className=" border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                              placeholder="start year"
                            />

                            <input
                              value={exp.endDate || ""}
                              onChange={(e) =>
                                handleArrayChange("experience", index, {
                                  ...exp,
                                  endDate: e.target.value,
                                })
                              }
                              type="date"
                              className="  border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-non"
                              placeholder="end year"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeArrayItem("experience", index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("experience", {
                            title: "",
                            company: "",
                            startDate: "",
                            endDate: "",
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Add Experience
                      </button>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education{" "}
                      <span className="text-gray-500">(Optional)</span>
                    </label>
                    <div className="space-y-2">
                      {(formData?.education || []).map((edu, index) => (
                        <div key={index} className="flex gap-2">
                          <textarea
                            value={edu.degree || ""}
                            onChange={(e) =>
                              handleArrayChange("education", index, {
                                ...edu,
                                degree: e.target.value,
                              })
                            }
                            rows={2}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Degree"
                          />

                          <textarea
                            value={edu.school || ""}
                            onChange={(e) =>
                              handleArrayChange("education", index, {
                                ...edu,
                                school: e.target.value,
                              })
                            }
                            rows={2}
                            placeholder="School Name"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none resize-none"
                          />

                          <input
                            value={edu.startDate || ""}
                            onChange={(e) =>
                              handleArrayChange("education", index, {
                                ...edu,
                                startDate: e.target.value,
                              })
                            }
                            placeholder="start date"
                            rows={2}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none resize-none"
                          />

                          <input
                            value={edu.endDate || ""}
                            onChange={(e) =>
                              handleArrayChange("education", index, {
                                ...edu,
                                endDate: e.target.value,
                              })
                            }
                            placeholder="Finished Year"
                            rows={2}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:border-blue-500 focus:ring-blue-500 outline-none resize-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem("education", index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("education", {
                            degree: "",
                            school: "",
                            startDate: "",
                            endDate: "",
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Add Education
                      </button>
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Portfolio URL{" "}
                      <span className="text-gray-500">(Optional)</span>
                      <input
                        type="url"
                        value={formData?.portfolio}
                        onChange={(e) =>
                          handleInputChange("portfolio", e.target.value)
                        }
                        className="mt-1 w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="https://yourportfolio.com"
                      />
                    </label>
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      LinkedIn URL{" "}
                      <span className="text-gray-500">(Optional)</span>
                      <input
                        type="url"
                        value={formData?.linkedin}
                        onChange={(e) =>
                          handleInputChange("linkedin", e.target.value)
                        }
                        className="mt-1 w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </label>
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      GitHub URL{" "}
                      <span className="text-gray-500">(Optional)</span>
                      <input
                        type="url"
                        value={formData?.github}
                        onChange={(e) =>
                          handleInputChange("github", e.target.value)
                        }
                        className="mt-1 w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="https://github.com/yourusername"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEditProfileDetail;
