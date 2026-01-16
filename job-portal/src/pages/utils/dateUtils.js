// format time

/**
 * Formats a date string into a human-readable relative time
 * @param {string} timeString - ISO date string or any valid date format
 * @returns {string} Formatted time string (e.g., "2h ago", "Just now")
 */
const format_time = (timeString) => {
  if (!timeString) {
    return "N/A";
  }

  try {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      return timeString;
    }

    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins} m ago`;
    if (diffInHours < 24) return `${diffInHours} h go`;
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  } catch {
    return timeString;
  }
};

export default format_time;

/**
 * Formats a date to a full readable format
 * @param {string} timeString - ISO date string
 * @returns {string} Full formatted date
 */
export const format_full_date = (timeString) => {
  if (!timeString) return "N/A";

  try {
    const date = new Date();
    if (isNaN(date.getDate())) return timeString;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeString;
  }
};
