const FeedbackAction = ({ primary, secondary }) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={primary.onClick}
        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        {primary.label}
      </button>
      {secondary && (
        <button
          onClick={secondary.onClick}
          className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
        >
          {secondary.label}
        </button>
      )}
    </div>
  );
};
export default FeedbackAction;
