const StatusBadge = ({ status }) => {
 const statusConfig = {
    Applied: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Applied"
    },
    "In Review": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "In Review"
    },
    Shortlisted: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      label: "Shortlisted"
    },
    Interview: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      label: "Interview"
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Rejected"
    },
    Accepted: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Accepted"
    },
    Withdrawn: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Withdrawn"
    }
  };

  const config = statusConfig[status] || {
     bg: "bg-gray-100",
    text: "text-gray-800",
    label: status || "Unknown"
  }
  return (

    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
    // <span
    //   className={`px-3 py-1 rounded text-sm font-medium ${
    //     statusConfig[status] || "bg-gray-100 text-gray-800"
    //   }`}
    // >
    //   {status}
    // </span>
  );
};

export default StatusBadge;
