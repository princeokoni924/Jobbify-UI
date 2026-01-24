import React, { useState, useEffect } from 'react';
import { Briefcase, Target, Users, Award, TrendingUp, Globe, Shield, Zap, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Active Jobs', value: '50K+', icon: Briefcase },
    { label: 'Companies', value: '10K+', icon: Users },
    { label: 'Success Rate', value: '94%', icon: TrendingUp },
    { label: 'Countries', value: '25+', icon: Globe }
  ];

  const values = [
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

  const milestones = [
    { year: '2025', event: 'Jobify Founded', description: 'Started with a vision to revolutionize recruitment' },
    // { year: '2021', event: 'AI Integration', description: 'Launched smart matching algorithm' },
    // { year: '2023', event: 'Global Expansion', description: 'Reached 25+ countries worldwide' },
    // { year: '2024', event: 'V2.0 Launch', description: 'Next-gen platform with enhanced features' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-white font-semibold text-sm">Version 2.0.1 - Production Ready</span>
            </div> */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Connecting Talent with
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Jobify is the next-generation job portal revolutionizing how companies find talent and professionals discover their dream careers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
              
              
                <a
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-700 p-2"
              >
               Get Started <ArrowRight className="inline ml-2" size={18} />
              </a>
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-indigo-100"
              >
                <Icon className="text-indigo-600 mb-3" size={32} />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-700 font-semibold text-sm">Our Mission</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Empowering Careers, Building Futures
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Jobify, we believe that finding the right job or the perfect candidate shouldn't be complicated. Our mission is to create a seamless, intelligent platform that connects talented professionals with forward-thinking companies.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We leverage advanced AI algorithms, real-time analytics, and user-centric design to deliver a job portal experience that's not just functional, but truly transformative.
            </p>
            <div className="space-y-3">
              {['AI-Powered Matching', 'Real-Time Notifications', 'Verified Companies', 'Career Growth Tools'].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl transform rotate-3"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Target className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">For Job Seekers</h3>
                    <p className="text-gray-600 text-sm">Discover opportunities tailored to your skills, get instant alerts, and apply with one click.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Briefcase className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">For Employers</h3>
                    <p className="text-gray-600 text-sm">Post jobs in minutes, access qualified candidates, and build your dream team efficiently.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Star className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Our Commitment</h3>
                    <p className="text-gray-600 text-sm">Continuous innovation, transparent processes, and unwavering support for your journey.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Jobify
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all transform hover:-translate-y-2 border border-white/20"
                >
                  <div className="bg-white/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-blue-200">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-gray-600 text-lg">Milestones that shaped Jobify</p>
        </div>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-400 to-purple-400 hidden md:block"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all inline-block">
                    <div className="text-indigo-600 font-bold text-2xl mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="hidden md:block w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Version Info & CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-block mb-4 px-4 py-2 bg-white/20 rounded-full">
                  <span className="text-white font-semibold text-sm">Current Version</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Jobify</h2>
                <p className="text-blue-100 mb-6">
                 An enterprise reliability, advanced security features, and seamless user experience. Built with cutting-edge technology to serve millions of users globally.
                </p>
                <div className="flex flex-wrap gap-3">
                  {/* <span className="px-4 py-2 bg-white/20 rounded-lg text-white text-sm"></span> */}
                  <span className="px-4 py-2 bg-white/20 rounded-lg text-white text-sm">AI-Powered</span>
                  <span className="px-4 py-2 bg-white/20 rounded-lg text-white text-sm">Cloud-Native</span>
                  <span className="px-4 py-2 bg-white/20 rounded-lg text-white text-sm">Mobile-First</span>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">Join thousands of professionals and companies already using Jobify</p>
                <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl">
                  
                  
                 <a
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-700 p-2"
              >
               Start Your Journey <ArrowRight className="inline ml-2" size={18} />
              </a>
              


                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 Jobify. Empowering careers worldwide.</p>
        </div>
      </div> */}
    </div>
  );
}