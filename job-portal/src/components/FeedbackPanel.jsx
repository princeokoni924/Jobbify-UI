

const FeedbackPanel = ({bgClass = "bg-white/60", borderClass ="border-white/20", children}) => {
return(
<div className={`flex flex-col items-center justify-center py-16 lg:py-20 ${bgClass} backdrop-blur-xl rounded-2xl ${borderClass} border`}>
  {children}
</div>
)
}

export default FeedbackPanel;