export const BASE_URL = "http://localhost:8000";
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // ===Sign up=====
    LOGIN: "/api/auth/login", // ====Authenticate user and return jwt token============
    GET_PROFILE: "/api/auth/profile", // ===Get logged-in user details=====
    UPDATE_PROFILE: "/api/user/profile", //====update user details=========
    DELETE_RESUME: "/api/user/resume", // ====delete user detail======
  },

  DASHBOARD: {
    OVERVIEW: `/api/analytics/overview`,
  },
  JOBS: {
     REOPEN: (id) => `/api/jobs/${id}/reopen`,
    EXTEND_EXPIRATION: (id) => `/jobs/${id}/extend-expiration`,
    GET_ALL_JOBS: `/api/jobs`,
    GET_JOB_By_ID: (id) => `/api/jobs/${id}`,
    POST_JOBS: "/api/jobs",
    GET_JOBS_EMPLOYERS: "/api/jobs/get-jobs-employer",
    GET_JOB_BY_ID: (jobId) => `/api/jobs/${jobId}`,
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
   // UPDATE_JOB: (jobId) => `/api/jobs/${jobId}`,
     TOGGLE_CLOSE: (id) => `api/jobs/${id}/toggle-close`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    SAVE_JOB: (jobId) => `/api/save-jobs/${jobId}`,
    UNSAVE_JOB: (jobId) => `/api/save-jobs/${jobId}`,
    GET_SAVED_JOB: `/api/save-jobs`,
  },
  APPLICATIONS: {
    APPLY_TO_JOB: (jobId) => `/api/applications/apply/${jobId}`,
    GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
    GET_MY_APPLICATIONS: `/api/applications/my`,
    WITHDRAW_APPLICATION: (id) => `/api/applications/${id}/withdraw`,
    GET_APPLICATIONS_FOR_JOB: (jobId) => `/api/applications/job/${jobId}`,
    GET_APPLICATIONS_BY_ID: (id) => `/api/applications/${id}`,
    GE_RESUME: (id) => `/api/applications/${id}/resume`,
    UPLOAD_RESUME: `/api/applications/upload-resume`,
    DELETE_RESUME: `/api/applications/resume`,
  },
DOWNLOAD_RESUME: (userId, filename) => `/download-resume/${userId}/${filename}`,
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
