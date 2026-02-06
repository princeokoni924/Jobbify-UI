import { 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  ArrowRight,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import {useCallback } from "react"
const Footer = () => {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear();


 // handle navigation
 const handleNavigationClick = useCallback(()=> {
   navigate("/")
 }, [navigate])
 
  const footerLinks = {
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

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/jobify", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Twitter, href: "https://twitter.com/jobify", label: "Twitter", color: "hover:text-sky-500" },
    { icon: Linkedin, href: "https://linkedin.com/company/jobify", label: "LinkedIn", color: "hover:text-blue-700" },
    { icon: Instagram, href: "https://instagram.com/jobify", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Youtube, href: "https://youtube.com/jobify", label: "YouTube", color: "hover:text-red-600" },
  ];

  return (
    <footer className="relative bg-gradient-to-br h-[100%] from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Stay Updated with Latest Opportunities
                </h3>
                <p className="text-gray-400">
                  Subscribe to our newsletter and never miss out on your dream job
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-white placeholder-gray-500 flex-1 md:w-80"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold
                transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                
                
                <a
                onClick={handleNavigationClick}
                className="cursor-pointer"
                >
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Jobify</h3>
                </a>
              </div>
              
              <p className="text-gray-400 leading-relaxed">
                Connecting talented professionals with innovative companies worldwide. 
                Your career success is our mission. Join thousands of job seekers 
                and employers who trust Jobify.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <a href="mailto:support@jobify.com">support@jobify.com</a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <a href="tel:+2348136808658">+(234) 8136808658</a>
                </div>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <span>GitHub, Business, <br /><a href="https://github.com/princeokoni924">GitHub</a></span>
                </div>
              </div>
            </div>

            {/* For Job Seekers */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">For Job Seekers</h4>
              <ul className="space-y-3">
                {footerLinks.forJobSeekers.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 
                      flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all duration-200"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">For Employers</h4>
              <ul className="space-y-3">
                {footerLinks.forEmployers.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 
                      flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all duration-200"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 
                      flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all duration-200"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 
                      flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all duration-200"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links & Stats */}
          <div className="mt-12 pt-8 border-t border-gray-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">Follow us:</span>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg 
                    flex items-center justify-center transition-all duration-300 
                    ${social.color} group`}
                  >
                    <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </a>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>All Systems Operational</span>
                </div>
                <div className="text-gray-400">
                  <span className="text-white font-semibold">10,000+</span> Companies Trust Us
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              <p className="text-gray-400 text-center md:text-left">
                © {currentYear} Jobify. All rights reserved. Made with{" "}
                <Heart className="w-4 h-4 inline text-red-500 fill-red-500" /> for job seekers worldwide.
              </p>
              
              <div className="flex items-center gap-6">
                <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </Link>
                <Link to="/api-docs" className="text-gray-400 hover:text-white transition-colors">
                  API Docs
                </Link>
                <Link to="/status" className="text-gray-400 hover:text-white transition-colors">
                  System Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
