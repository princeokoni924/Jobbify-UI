import React from "react";

const UserProfile = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            JO
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              John Okon
            </h2>
            <p className="text-sm text-gray-500">Job Seeker</p>
            <p className="text-sm text-gray-400">johnokon@email.com</p>
          </div>
        </div>

        <button className="px-5 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
          Edit Profile
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* About */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            About Me
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            I am a passionate job seeker with experience in software
            development, eager to contribute to innovative teams and
            grow professionally.
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
              <p className="text-gray-700">Lagos, Nigeria</p>
            </div>

            <div>
              <p className="text-gray-400">Experience</p>
              <p className="text-gray-700">3+ Years</p>
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
