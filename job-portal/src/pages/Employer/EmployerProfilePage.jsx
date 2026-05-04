/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Building2, Mail, Edit3, Users } from "lucide-react";
import { useAuth } from "../../content/AuthContext";
import { API_PATHS } from "../utils/apiPath";
import axiosInstance from "../utils/axiosInstance";
import moment from "moment";
import toast from "react-hot-toast";
import uploadImage from "../utils/uploadStorage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EditProfileDetails from "../Employer/EditProfileDetails";
const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  // Fetch fresh profile from backend and normalize for UI
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        const serverUser = res.data?.data?.user || res.data?.user;
        if (serverUser) {
          const normalized = {
            name: serverUser.name,
            email: serverUser.email,
            avatar: serverUser.avatar || "",
            companyName: serverUser.company?.name || "",
            companyDescription: serverUser.company?.description || "",
            companyLogo: serverUser.company?.logo || "",
          };
          setProfileData(normalized);
          setFormData(normalized);
          updateUser(normalized);
        }
      } catch (err) {
        // Keep local state if GET fails
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle input
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // handle img upload
  const handleImgUploadAsync = async (file, type) => {
    setUploading((prev) => ({
      ...prev,
      [type]: true,
    }));

    try {
      const response = await uploadImage(file);
      const url = response.imgUrl || "";

      // update form with new img url
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, url);
    } catch (err) {
      console.error("Image fail to upload.", err);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // handle img change
  const handleImgChange = (e, type) => {
    //if(!e?.target?.files?.length)return;
    const file = e.target.files[0];
    if (file) {
      // create preview url
      const previewUrl = URL.createObjectURL(file);
      const field = type === "avatar" ? "avatar" : "companyLogo";
      handleInputChange(field, previewUrl);

      // upload img
      handleImgUploadAsync(file, type);
    }
  };

  // save img
  const handleSaveAsync = async () => {
    setSaving(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData,
      );
      if (response.status === 200) {
        const serverUser = response.data?.data?.user || response.data?.user;
        const normalized =
          serverUser
            ? {
                name: serverUser.name,
                email: serverUser.email,
                avatar: serverUser.avatar || "",
                companyName: serverUser.company?.name || "",
                companyDescription: serverUser.company?.description || "",
                companyLogo: serverUser.company?.logo || "",
              }
            : { ...profileData, ...formData };
        toast.success("Profile Image updated successfully!!");
        setProfileData(normalized);
        updateUser(normalized);
        setEditMode(false);
      }
    } catch (err) {
      toast.error("Error updating profile!", err);
    } finally {
      setSaving(false);
    }
  };

  // handle cancellation
  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImgChange={handleImgChange}
        saving={saving}
        uploading={uploading}
        handleInputChange={handleInputChange}
        handleCancel={handleCancel}
        handleSaveAsync={handleSaveAsync}
      />
    );
  }
  return (
    <DashboardLayout activeMenu={`employer-profile`}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6  ">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-6 rounded-lg px-8 flex items-center justify-between">
              <h1 className="yext-xl font-medium text-white">
                Employer Profile
              </h1>
              <button
                className="bg-white/10 hover:bg-opacity-30
         text-white font-medium py-2
          px-4 rounded-lg transition-colors
           duration-200 flex items-center space-x-2"
                onClick={() => setEditMode(true)}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit profile</span>
              </button>
            </div>

            {/* Profile content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal info */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal info
                  </h2>
                  {/* Profile picture */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={profileData.avatar || null}
                      alt={"Profile"}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                      className="w-20 h-20 object-cover
                     rounded-full border-2
                   hover:border-blue-500
                    transition-colors
                    -translate-x-2 duration-200 hover:shadow-xl"
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {profileData.name}
                      </h3>
                      <div className="flex items-center  text-gray-600 mt-1">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="">{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Company info */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Company info
                  </h2>

                  {/* company logo */}
                  <div className="flex items-center space-x-4">
                   
                    <img
                      src={profileData.companyLogo || null}
                      alt={" logo"}
                      className="w-20 h-20 rounded-lg object-cover border-2 hover:border-blue-500 border-gray-200"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {profileData?.companyName || null}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building2 className="h-5 w-5 text-blue-400 mr-2" />
                        <span className="">Company</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Company desc */}
              <div className="mt-8">
                <h2 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2 mb-6">
                  About the company
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-100 p-6 rounded-lg">
                  {profileData?.companyDescription ||
                    "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default EmployerProfilePage;
