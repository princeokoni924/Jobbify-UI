const StatusBadge = ({ status }) => {
  const statusCfg = {
    Applied: "bg-gray-100 text-gray-800",
    InterViewed: "bg-yellow-100 text-yellow-800",
    // Accept:"bg-blue-100 text-blue-600",
    Reject: "bg-red-100 text-red-600",
    Hired: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`px-3 py-1 rounded text-sm font-medium ${
        statusCfg[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
