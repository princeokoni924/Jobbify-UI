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
  Zap,
  Star,
   Crown,
   Rocket,
   Globe,
   TrendingUp,
   Target,
   Facebook,
   Twitter,
   Youtube,
   Linkedin,
   Instagram
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
  {value:"Data Science", label:"Data Science"},
  {value:"Product Management", label:"Product Management"},
  {value:"Project Management", label:"Project Management"},
  {value:"Administration", label:"Administration"},
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

export const SAlARY_PERIOD=[
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
];

export const CURRENCY_CONFIG = {
  NGN: { symbol: "₦", name: "Nigerian Naira", step: 10000 },
  USD: { symbol: "$", name: "US Dollar", step: 1000 },
  EUR: { symbol: "€", name: "Euro", step: 1000 },
  GBP: { symbol: "£", name: "British Pound", step: 1000 },
  CAD: { symbol: "C$", name: "Canadian Dollar", step: 1000 },
  AUD: { symbol: "A$", name: "Australian Dollar", step: 1000 },
  INR: { symbol: "₹", name: "Indian Rupee", step: 1000 },
};

/**
 * Navigation link configuration
 */
export const NAV_LINKS = [
  { id: "find-jobs", label: "Browse Jobs", path: "/find-jobs", requiresAuth: false },
  { id: "employers", label: "Post Jobs", path: "/employer-dashboard", requiresAuth: false, authPath: "/login" },
  { id: "pricing", label: "Pricing Plans", path: "/price", requiresAuth: false },
  { id: "partner", label: "Partner", path: "/partner", requiresAuth: false },
  { id: "press", label: "Press & Media", path: "/press", requiresAuth: false },
  { id: "about", label: "About Us", path: "/about-us", requiresAuth: false },
  { id: "contact", label: "Contact Us", path: "/contact", requiresAuth: false },
];

export const faqs = [
    {
      q: 'Can I change plans at any time?',
      a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes, Pro and Business plans come with a 14-day free trial. No credit card required.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      q: 'Can I get a refund?',
      a: 'Yes, we offer a 30-day money-back guarantee on all paid plans.'
    }
  ];

  export const jobSeekerPlans = [
      {
        name: 'Free',
        icon: Star,
        price: { monthly: 0, annual: 0 },
        description: 'Perfect for starting your job search',
        popular: false,
        features: [
          { text: 'Browse unlimited jobs', included: true },
          { text: 'Apply to 5 jobs per month', included: true },
          { text: 'Basic profile', included: true },
          { text: 'Email notifications', included: true },
          { text: 'Resume builder (1 template)', included: true },
          { text: 'Priority support', included: false },
          { text: 'Featured profile', included: false },
          { text: 'Advanced analytics', included: false }
        ],
        cta: 'Get Started',
        color: 'gray'
      },
      {
        name: 'Pro',
        icon: Zap,
        price: { monthly: 19, annual: 190 },
        description: 'For serious job seekers',
        popular: true,
        features: [
          { text: 'Browse unlimited jobs', included: true },
          { text: 'Unlimited job applications', included: true },
          { text: 'Premium profile with badge', included: true },
          { text: 'Priority email & SMS alerts', included: true },
          { text: 'Resume builder (10+ templates)', included: true },
          { text: 'Priority support (24/7)', included: true },
          { text: 'Featured profile visibility', included: true },
          { text: 'Application tracking dashboard', included: true },
          { text: 'AI-powered job matching', included: true },
          { text: 'Interview preparation resources', included: true }
        ],
        cta: 'Start Free Trial',
        color: 'indigo'
      },
      {
        name: 'Premium',
        icon: Crown,
        price: { monthly: 39, annual: 390 },
        description: 'Maximum career acceleration',
        popular: false,
        features: [
          { text: 'Everything in Pro', included: true },
          { text: 'VIP profile visibility', included: true },
          { text: 'Direct messaging with recruiters', included: true },
          { text: 'Career coaching session (monthly)', included: true },
          { text: 'LinkedIn profile optimization', included: true },
          { text: 'Salary negotiation guidance', included: true },
          { text: 'Personal job search assistant', included: true },
          { text: 'Exclusive job listings access', included: true },
          { text: 'Advanced analytics & insights', included: true }
        ],
        cta: 'Go Premium',
        color: 'purple'
      }
    ];

    export const employerPlans = [
        {
          name: 'Starter',
          icon: Star,
          price: { monthly: 99, annual: 990 },
          description: 'Ideal for small businesses',
          popular: false,
          features: [
            { text: '5 active job postings', included: true },
            { text: '50 candidate views per month', included: true },
            { text: 'Basic applicant tracking', included: true },
            { text: 'Email support', included: true },
            { text: 'Company profile page', included: true },
            { text: 'Standard job promotion', included: false },
            { text: 'Advanced analytics', included: false },
            { text: 'API access', included: false }
          ],
          cta: 'Start Hiring',
          color: 'gray'
        },
        {
          name: 'Business',
          icon: Rocket,
          price: { monthly: 299, annual: 2990 },
          description: 'For growing companies',
          popular: true,
          features: [
            { text: 'Unlimited job postings', included: true },
            { text: 'Unlimited candidate views', included: true },
            { text: 'Advanced ATS with AI screening', included: true },
            { text: 'Priority support (24/7)', included: true },
            { text: 'Enhanced company profile', included: true },
            { text: 'Featured job postings', included: true },
            { text: 'Team collaboration (5 users)', included: true },
            { text: 'Interview scheduling tools', included: true },
            { text: 'Branded career page', included: true },
            { text: 'Analytics & reporting', included: true }
          ],
          cta: 'Start Free Trial',
          color: 'indigo'
        },
        {
          name: 'Enterprise',
          icon: Crown,
          price: { monthly: 'Custom', annual: 'Custom' },
          description: 'For large organizations',
          popular: false,
          features: [
            { text: 'Everything in Business', included: true },
            { text: 'Dedicated account manager', included: true },
            { text: 'Custom integrations', included: true },
            { text: 'API access with higher limits', included: true },
            { text: 'Unlimited team members', included: true },
            { text: 'White-label options', included: true },
            { text: 'Advanced security & compliance', included: true },
            { text: 'Custom analytics & reports', included: true },
            { text: 'Priority candidate matching', included: true },
            { text: 'On-site training', included: true }
          ],
          cta: 'Contact Sales',
          color: 'purple'
        }
      ];

export  const stats = [
    { label: 'Active Jobs', value: '50K+', icon: Briefcase },
    { label: 'Companies', value: '10K+', icon: Users },
    { label: 'Success Rate', value: '94%', icon: TrendingUp },
    { label: 'Countries', value: '25+', icon: Globe }
  ];

export const values = [
    {
      icon: Target,
      title: 'Innovation First',
      description: 'Leveraging cutting-edge AI and ML to match talent with opportunities seamlessly.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Enterprise-grade security ensuring your data privacy and protection at all times.'
    },
    {
      icon: Zap,
      title: 'Speed & Efficiency',
      description: 'Streamlined processes that reduce hiring time by 60% on average.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering exceptional experiences for both job seekers and employers.'
    }
  ];

export  const milestones = [
    { year: '2025', event: 'Jobify Founded', description: 'Started with a vision to revolutionize recruitment' },
    // { year: '2021', event: 'AI Integration', description: 'Launched smart matching algorithm' },
    // { year: '2023', event: 'Global Expansion', description: 'Reached 25+ countries worldwide' },
    // { year: '2024', event: 'V2.0 Launch', description: 'Next-gen platform with enhanced features' }
  ];

export const footerLinks = {
    forJobSeekers: [
      { label: "Browse Jobs", href: "/find-jobs" },
      { label: "Job Categories", href: "/categories" },
      { label: "Career Advice", href: "/career-advice" },
      { label: "Resume Builder", href: "/resume-builder" },
      { label: "Salary Guide", href: "/salary-guide" },
    ],
    forEmployers: [
      { label: "Post a Job", href: "/post-job" },
      { label: "Browse Candidates", href: "/candidates" },
      { label: "Pricing Plans", href: "/price" },
      { label: "Recruiter Tools", href: "/tools" },
      { label: "Success Stories", href: "/success-stories" },
    ],
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press & Media", href: "/press" },
      { label: "Partners", href: "/partners" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Security", href: "/security" },
    ],
  };
export const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/jobify", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Twitter, href: "https://twitter.com/jobify", label: "Twitter", color: "hover:text-sky-500" },
    { icon: Linkedin, href: "https://linkedin.com/company/jobify", label: "LinkedIn", color: "hover:text-blue-700" },
    { icon: Instagram, href: "https://instagram.com/jobify", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Youtube, href: "https://youtube.com/jobify", label: "YouTube", color: "hover:text-red-600" },
  ];