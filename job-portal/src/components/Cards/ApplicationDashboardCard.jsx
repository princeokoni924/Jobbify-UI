// import { Clock } from "lucide-react";

// const ApplicationDashboardCard = ({ app, position, time }) => {
//   const initials =
//     app?.name
//       ?.split(" ")
//       ?.map((n) => n[0])
//       ?.join("")||"";

//   return (
//     <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
//       <div className="flex items-center space-x-4">
//         <div className="w-10 h-10 bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-xl flex items-center justify-center">
//           <span className="text-white font-medium text-sm">
//             {initials}
//           </span>
//         </div>
//         <div>
//           <h4 className="text-[15px] font-medium text-gray-900">
//             {app?.name || "Unknown Applicant"}
//           </h4>
//           <p className="text-sm text-gray-500">
//             {position || "Unknown position"}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center text-sm text-gray-500">
//         <Clock className="h-3 w-3 mr-1" />
//         {time}
//       </div>
//     </div>
//   );
// };

// export default ApplicationDashboardCard;




import { Clock } from "lucide-react";

const ApplicationDashboardCard = ({ application, position, time }) => {
const name = application?.name || "N/A";
const initials = name !== "N/A" ? name.split(" ").map((n) => n[0]).join("") : "NA";


  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-xl flex items-center justify-center">
          {/* <span className="text-white font-medium text-sm">
            {application.name
              .split(" ")
              .map((n) => n[0])
              .join("") || "NA"}
          </span> */}

          <span className="text-white font-medium text-sm">{initials}</span>
        </div>
        <div>
          <h4 className="text-[15px] font-medium text-gray-900">{application.name}</h4>
          <p className="text-sm text-gray-500">{position}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-3 w-3 mr-1"/>
          {time}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDashboardCard;
