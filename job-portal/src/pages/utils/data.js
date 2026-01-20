import {
  Search,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  Plus,
} from "lucide-react";

export const jobSearchFeatures = [
  {
    icon: Search,
    title: "Smart Job matching",
    description:
      "AI-powered algorithm matches you with relevant opportunities based on your skill and preference.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create a professional resume with our easy-to-use builder and template designed.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Communicate directly with employers through our secure platform's messaging system.",
  },
  {
    icon: Award,
    title: "Skill Assessments",
    description:
      "Showcase your abilities with our skill assessments and increase your chances of getting hired.",
  },
];

export const employerFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description:
      "Access a vast pool of pre-screened qualified candidates to find the perfect fit for your job openings or team.",
  },
  {
    icon: BarChart3,
    title: "Advanced Dashboards",
    description:
      "Utilize our advanced dashboards to track and analyze recruitment metrics, helping you make data-driven hiring decisions.",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description:
      "All candidates undergo verification to ensure you're hiring trustworthy professionals.",
  },
  {
    icon: Clock,
    title: "Quick Hiring Process",
    description:
      "Streamline your hiring process with our efficient tools designed to save you time and effort.",
  },
];

// Navigation Items configurations
export const NAVIGATION_MENU = [
  { id: "employer-dashboard", name: "dashboard", icon: LayoutDashboard },
  { id: "post-job", name: "post job", icon: Plus },
  { id: "manage-jobs", name: "manage jobs", icon: Briefcase },
  { id: "employer-profile", name: "company profiles", icon: Building2 },
];
// Categories and job types
export const JOB_CATEGORIES = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Education", label: "Education" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Customer Service", label: "Customer Service" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Operations", label: "Operations" },
  { value: "Legal", label: "Legal" },
  { value: "Construction", label: "Construction" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Retail", label: "Retail" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Software Engineer", label: "Software Engineer" },
  {value:"software-development", label:"software-development"},
  { value: "Other", label: "Other" }
];
// Job Types
export const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
  { value: "remote", label: "Remote" },
];

// Salary Ranges
export const SALARY_RANGES = [
                "less than $1000",
  "$30,000 - $50,000",
  "$50,000 - $70,000",
  "More than $70,000",
]

export const CURRENCIES = [
  { value: "NGN", label: "₦ NGN (Nigerian Naira)", symbol: "₦" },
  { value: "USD", label: "$ USD (US Dollar)", symbol: "$" },
  { value: "EUR", label: "€ EUR (Euro)", symbol: "€" },
  { value: "GBP", label: "£ GBP (British Pound)", symbol: "£" },
  { value: "CAD", label: "$ CAD (Canadian Dollar)", symbol: "C$" },
  { value: "AUD", label: "$ AUD (Australian Dollar)", symbol: "A$" },
  { value: "INR", label: "₹ INR (Indian Rupee)", symbol: "₹" }
];

export const WORK_MODE=[
  {value:"remote", label:"Remote"},
  {value:"hybrid", label:'Hybrid'},
  {value:"onsite", label:"On-Site"}
];

export const PAYMENT_PERIOD=[
  {value:"hourly", label:"Hourly"},
  {value:"monthly", label:"Monthly"},
  {value:"yearly", label:"Yearly"}
];

export const EXPERIENCE_LEVEL=[
  {value:'entry', label:"Entry level"},
  {value:"junior", label:"Junior level"},
  {value:"mid", label:"Mid level"},
  {value:"senior", label:"Senior level"},
  {value:"lead", label:"lead"},
  {value:"executive", label:"Executive"}
]