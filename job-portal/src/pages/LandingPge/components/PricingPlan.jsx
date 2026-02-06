import React, { useState } from 'react';
import { Check, X, Zap, Crown, Rocket, Star, TrendingUp, Users, Shield, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import Footer from "../components/Footer"
export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [userType, setUserType] = useState('jobseeker');
 const currentYear = new Date().getFullYear()
  const jobSeekerPlans = [
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

  const employerPlans = [
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

  const plans = userType === 'jobseeker' ? jobSeekerPlans : employerPlans;

  const faqs = [
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

  const getColorClasses = (color, isPrimary = false) => {
    const colors = {
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        badge: 'bg-gray-100 text-gray-700',
        button: 'bg-gray-900 hover:bg-gray-800 text-white',
        icon: 'text-gray-600'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-300',
        badge: 'bg-indigo-100 text-indigo-700',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        icon: 'text-indigo-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-300',
        badge: 'bg-purple-100 text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        icon: 'text-purple-600'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Transparent pricing that grows with you. No hidden fees, cancel anytime.
          </p>

          {/* User Type Toggle */}
          <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-lg p-1 mb-6">
            <button
              onClick={() => setUserType('jobseeker')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                userType === 'jobseeker'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:text-blue-100'
              }`}
            >
              Job Seekers
            </button>
            <button
              onClick={() => setUserType('employer')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                userType === 'employer'
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white hover:text-blue-100'
              }`}
            >
              Employers
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-white ${billingCycle === 'monthly' ? 'font-semibold' : 'opacity-70'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-16 h-8 bg-white/30 rounded-full transition-all"
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'transform translate-x-8' : ''
                }`}
              ></div>
            </button>
            <span className={`text-white ${billingCycle === 'annual' ? 'font-semibold' : 'opacity-70'}`}>
              Annual
            </span>
            <span className="px-3 py-1 bg-green-400 text-green-900 text-sm font-semibold rounded-full">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const colors = getColorClasses(plan.color);
            const price = plan.price[billingCycle];
            
            return (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                  plan.popular ? 'border-4 border-indigo-500 scale-105' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                      <Sparkles size={16} />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`p-8 ${colors.bg} rounded-t-2xl`}>
                  <div className={`inline-flex p-3 ${colors.badge} rounded-lg mb-4`}>
                    <Icon className={colors.icon} size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline mb-2">
                    {typeof price === 'number' ? (
                      <>
                        <span className="text-5xl font-bold text-gray-900">${price}</span>
                        <span className="text-gray-600 ml-2">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </>
                    ) : (
                      <span className="text-5xl font-bold text-gray-900">{price}</span>
                    )}
                  </div>
                  
                  {billingCycle === 'annual' && typeof price === 'number' && price > 0 && (
                    <p className="text-sm text-gray-600">
                      ${(price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>

                <div className="p-8">
                  <button className={`w-full py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg mb-6 ${colors.button}`}>
                    {plan.cta} <ArrowRight className="inline ml-2" size={18} />
                  </button>

                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                        ) : (
                          <X className="text-gray-300 flex-shrink-0 mt-0.5" size={20} />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Jobify?
            </h2>
            <p className="text-gray-600 text-lg">
              Powerful features designed to accelerate your success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Growth Focused',
                description: 'Plans designed to scale with your ambitions and business needs'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Enterprise-grade security protecting your sensitive data'
              },
              {
                icon: Users,
                title: 'Expert Support',
                description: '24/7 customer support from our dedicated team'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center p-6">
                  <div className="inline-flex p-4 bg-indigo-100 rounded-xl mb-4">
                    <Icon className="text-indigo-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <HelpCircle className="text-indigo-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals and companies already using Jobify
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© {currentYear} Jobify. Empowering careers worldwide.</p>
        </div>
      </div>
    </div>
  );
}