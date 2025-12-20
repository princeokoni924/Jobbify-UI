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
  { value: "software-development", label: "Software Development" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "customer-support", label: "Customer Support" },
  { value: "human-resources", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "engineering", label: "Engineering" },
  { value: "legal", label: "Legal" },
  { value: "other", label: "Other" },
];
// Job Types
export const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
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
