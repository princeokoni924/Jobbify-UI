import React, { useState } from 'react';
import { Check, X, TrendingUp, Users, Shield, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import getColorClasses from "../../../constant/colors/getColorClassess"
import {faqs, employerPlans, jobSeekerPlans} from "../../utils/data"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [userType, setUserType] = useState('jobseeker');
 const currentYear = new Date().getFullYear()
  
  const plans = userType === 'jobseeker' ? jobSeekerPlans : employerPlans;

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