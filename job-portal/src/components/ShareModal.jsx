import { useState, useCallback } from "react";
import IconButton from "./IconButton";
import {Mail, Copy, Check, X} from "lucide-react"

const ShareModal = ({ job, shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback for non-HTTPS or older browsers
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const shareOptions = [
    {
      label: "WhatsApp",
      className: "bg-[#25D366] hover:bg-[#20bd5a] text-white",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`Check out this job: ${job?.title} at ${job?.company?.companyName}\n${shareUrl}`)}`,
          "_blank"
        ),
    },
    {
      label: "Twitter / X",
      className: "bg-black hover:bg-gray-800 text-white",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job: ${job?.title} at ${job?.company?.companyName}`)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        ),
    },
    {
      label: "Email",
      className: "bg-gray-700 hover:bg-gray-800 text-white",
      icon: <Mail className="w-5 h-5" />,
      onClick: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(`Job Opportunity: ${job?.title}`)}&body=${encodeURIComponent(`Hi,\n\nI thought you might be interested in this job:\n\n${job?.title} at ${job?.company?.companyName}\n\n${shareUrl}`)}`,
          "_blank"
        ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5 animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-base">Share this job</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[220px]">
              {job?.title} · {job?.company?.companyName}
            </p>
          </div>
          <IconButton onClick={onClose} label="Close share menu" className="hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </IconButton>
        </div>

        {/* Share platform buttons — driven by config array (DRY) */}
        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map(({ label, icon, className, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-xs font-medium transition-all duration-150 ${className}`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Copy link row */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <span className="text-xs text-gray-500 truncate flex-1 select-all">{shareUrl}</span>
          <button
            onClick={handleCopy}
            aria-label="Copy link"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 shrink-0 ${
              copied
                ? "bg-green-100 text-green-700"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {copied
              ? <><Check className="w-3.5 h-3.5" /> Copied!</>
              : <><Copy className="w-3.5 h-3.5" /> Copy</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};
export default ShareModal