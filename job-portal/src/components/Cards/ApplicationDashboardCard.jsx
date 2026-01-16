import { Clock, Briefcase } from "lucide-react";
import format_time from "../../pages/utils/dateUtils";
import StatusBadge from "../StatusBadge";

const ApplicationDashboardCard = ({
  application,
  position,
  time,
  avatar,
  onClick,
}) => {
  const name = application?.name || "N/A";
  const company = application?.companyName || "";
  const status = application?.status || "pending";

  const initials =
    name !== "N/A"
      ? name
          .split(" ")
          .filter((n) => n.length > 0)
          .slice(0, 2)
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "N/A";

  const formattedTime = format_time(time);

  return (
    <article
      className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "") {
          e.preventDefault(), onClick?.();
        }
      }}
      aria-label={`Application for ${name} at ${company || 'company'}`}
    >
      {avatar ? (
      <img className="h-12 w-12 object-cover rounded-full"
      src={avatar}
      alt={"profile"}
      />
      ):(
         <div
            className="w-8 h-8 bg-gradient-to-br
           from-blue-200 to-blue-300
            rounded-full flex items-center justify-center"
          >
            <span className="text-white font-semibold text-sm">
              {initials}
            </span>
          </div>
      )}
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                   {name}
            </h3>
            <StatusBadge status={status}/>
          </div>

          <div className="flex flex-col gap-1">
            {position && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Briefcase size={14} className="flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{position}</span>
            </div>
            )}

            {company && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="truncate">{company}</span>
            </div>
          )}
          </div>
        </div>
       {/* Time */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-shrink-0">
        <Clock size={16} aria-hidden="true" />
        <time dateTime={time} className="whitespace-nowrap">
          {formattedTime}
        </time>
      </div>
    </article>
  );
};

export default ApplicationDashboardCard;

// const ApplicationDashboardCard = ({ application, position, time }) => {
// const name = application?.name || "N/A";
// const initials = name !== "N/A" ? name.split(" ").map((n) => n[0]).join("") : "NA";

//   return (
//     <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
//       <div className="flex items-center space-x-4">
//         <div className="w-10 h-10 bg-gradient-to-br from-indigo-300 to-indigo-400 rounded-xl flex items-center justify-center">

//           <span className="text-white font-medium text-sm">{initials}</span>
//         </div>
//         <div>
//           <h4 className="text-[15px] font-medium text-gray-900">{application.name}</h4>
//           <p className="text-sm text-gray-500">{position}</p>
//         </div>
//       </div>
//       <div className="flex items-center space-x-3">
//         <div className="flex items-center text-sm text-gray-500">
//           <Clock className="h-3 w-3 mr-1"/>
//           {time}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplicationDashboardCard;
