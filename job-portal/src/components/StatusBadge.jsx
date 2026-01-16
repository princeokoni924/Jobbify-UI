const StatusBadge = ({ status }) => {
  const statusCfg = {
    // Applied: "bg-gray-100 text-gray-800",
   
    Hired: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    interview: "bg-blue-100 text-blue-800 border-blue-200",
    Applied: "bg-gray-100 text-gray-800",
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
