import React, { useState } from "react";
import { useAuth } from "../../content/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { Edit3, User } from "lucide-react";
import toast from "react-hot-toast";
import uploadImage from "../utils/uploadStorage";
import UserEditProfileDetail from "./components/UserEditProfileDetail";

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    location: user?.location || "",
    skills: user?.skills || [],
    experience: user?.experience || [],
    education: user?.education || [],
    portfolio: user?.portfolio || "",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false });
  const [saving, setSaving] = useState(false);

  // Handle input change - accepts (field, value)
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Upload image async
  const handleUploadImgAsync = async (file, type) => {
    setUploading((prev) => ({
      ...prev,
      [type]: true,
    }));

    try {
      const response = await uploadImage(file);
      const url = response.imgUrl || "";
      handleInputChange("avatar", url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Handle image change - accepts (event, type)
  const handleImgChange = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    handleInputChange("avatar", previewUrl);
    handleUploadImgAsync(file, type);
  };

  // Handle save profile
  const saveProfile = async () => {
    try {
      setSaving(true);
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        formData
      );
      if (response.status === 200) {
        const updateUserProfile = response.data.user ?? { ...user, ...formData };
        toast.success("Profile updated successfully!");
        setProfileData(updateUserProfile);
        updateUser(updateUserProfile);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error saving profile", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  // Render edit mode
  if (editMode) {
    return (
      <UserEditProfileDetail
        formData={formData}
        saving={saving}
        handleImgChange={handleImgChange}
        handleCancel={handleCancel}
        uploading={uploading}
        handleInputChange={handleInputChange}
        saveProfile={saveProfile}
      />
    );
  }

  // Render view mode
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={32} />
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profileData.name || "User Name"}
            </h2>
            <p className="text-sm text-gray-500">{}</p>
            <p className="text-sm text-gray-400">{profileData.email}</p>
          </div>
        </div>

        <button
          onClick={() => setEditMode(true)}
          className="px-5 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Edit3 size={16} />
          Edit Profile
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* About */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {profileData.bio ||
              "I am a passionate job seeker with experience in software development, eager to contribute to innovative teams and grow professionally."}
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Info
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400">Location</p>
              <p className="text-gray-700">
                {profileData.location || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Phone</p>
              <p className="text-gray-700">
                {profileData.phone || "Not specified"}
              </p>
            </div>



            <div>
              <p className="text-gray-400">Availability</p>
              <p className="text-green-600 font-medium">Open to work</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;