import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  CheckCircle,
  X,

  Users,
  Building,
  Crown,
  ArrowRight,
  Zap,
  Shield,
  HeadphonesIcon,
  IndianRupeeIcon,

  TextQuoteIcon,
  AlignStartHorizontal,
  CompassIcon,
  ServerIcon,

} from 'lucide-react';
import { motion } from "framer-motion";
const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses getting started with energy management",
      icon: Users,
      color: "bg-blue-600",
      monthlyPrice: 49,
      annualPrice: 39,
      savings: "Save 20%",
      popular: false,
      features: [
        "Up to 5 utility accounts",
        "Basic bill analysis",
        "Monthly consumption reports",
        "Email support",
        "Mobile app access",
        "Data export (CSV)",
        "Basic dashboard",
        "1 GB storage"
      ],
      limitations: [
        "Advanced analytics",
        "Custom reporting",
        "API access",
        "Multi-user access"
      ]
    },
    {
      name: "Professional",
      description: "Ideal for growing companies with multiple locations",
      icon: Building,
      color: "bg-green-600",
      monthlyPrice: 149,
      annualPrice: 119,
      savings: "Save 20%",
      popular: true,
      features: [
        "Up to 25 utility accounts",
        "Advanced AI bill analysis",
        "Real-time monitoring",
        "Custom dashboards",
        "Scenario modeling",
        "Priority support",
        "Multi-user access (5 users)",
        "API access",
        "Advanced reporting",
        "10 GB storage",
        "Mobile & web access",
        "Data integrations"
      ],
      limitations: [
        "White-label options",
        "Dedicated support manager"
      ]
    },
    {
      name: "Enterprise",
      description: "Comprehensive solution for large organizations",
      icon: Crown,
      color: "bg-purple-600",
      monthlyPrice: 499,
      annualPrice: 399,
      savings: "Save 20%",
      popular: false,
      features: [
        "Unlimited utility accounts",
        "Full AI suite",
        "24/7 monitoring",
        "Custom integrations",
        "Advanced scenario modeling",
        "Dedicated support manager",
        "Unlimited users",
        "White-label options",
        "Advanced security",
        "Custom reporting",
        "Unlimited storage",
        "SLA guarantee",
        "Training & onboarding",
        "Custom workflows"
      ],
      limitations: []
    }
  ];

  const addOns = [
    {
      name: "Additional Users",
      description: "Extra user seats for team collaboration",
      price: "$15/user/month",
      icon: Users
    },
    {
      name: "Premium Support",
      description: "24/7 phone support with dedicated account manager",
      price: "$299/month",
      icon: HeadphonesIcon
    },
    {
      name: "Custom Integration",
      description: "Bespoke API integrations with your existing systems",
      price: "Custom pricing",
      icon: Zap
    },
    {
      name: "Advanced Security",
      description: "Enhanced security features and compliance certifications",
      price: "$199/month",
      icon: Shield
    }
  ];

  const faqs = [
    {
      question: "Can I change plans at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle, and we'll prorate any differences."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 14-day free trial for all plans. No credit card required to start your trial."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bank transfers, and can accommodate enterprise purchase orders for annual plans."
    },
    {
      question: "Do you offer custom pricing for large enterprises?",
      answer: "Yes, we offer custom pricing and features for organizations with 500+ employees or unique requirements. Contact our sales team for details."
    },
    {
      question: "What's included in support?",
      answer: "All plans include email support. Professional plans get priority support, and Enterprise plans include dedicated account management and phone support."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
    }
  ];

  const getPrice = (plan: any) => isAnnual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="flex items-center justify-center mb-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <IndianRupeeIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Simple, Transparent
              <span className="block text-yellow-300">Pricing</span>
            </h1>
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              Choose the perfect plan for your organization. Start with a free trial
              and scale as you grow. No hidden fees, no surprises.
            </p>


            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`${!isAnnual ? 'text-white' : 'text-green-200'}`}>Monthly</span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-yellow-500"
              />
              <span className={`${isAnnual ? 'text-white' : 'text-green-200'}`}>Annual</span>
              <Badge className="bg-yellow-500 text-black">Save 20%</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20  mt-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative p-8 ${plan.popular ? 'ring-2 ring-green-500 scale-105' : ''} hover:shadow-lg transition-all`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {plan.description}
                  </CardDescription>

                  <div className="mt-6">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${getPrice(plan)}
                      </span>
                      <div className="text-left">
                        <div className="text-gray-600">/month</div>
                        {isAnnual && (
                          <div className="text-sm text-green-600 font-medium">{plan.savings}</div>
                        )}
                      </div>
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed annually (${getPrice(plan) * 12})
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button
                    asChild
                    className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    <Link to="/register">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Everything included:</h4>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-gray-400 mt-6">Not included:</h4>
                        {plan.limitations.map((limitation, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <X className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-400">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom solution?</p>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Sales for Enterprise Pricing</Link>
            </Button>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              className="flex items-center justify-center mb-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <ServerIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add-on Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your plan with additional features and services tailored to your specific needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {addOns.map((addon, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <addon.icon className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{addon.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                <div className="text-lg font-bold text-green-600">{addon.price}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              className="flex items-center justify-center mb-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <CompassIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Plans</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly what's included in each plan to make the best choice for your organization.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-4 gap-4 text-center font-semibold text-gray-900 mb-8">
              <div></div>
              <div>Starter</div>
              <div>Professional</div>
              <div>Enterprise</div>
            </div>

            {[
              { feature: "Utility Accounts", starter: "5", professional: "25", enterprise: "Unlimited" },
              { feature: "Users Included", starter: "1", professional: "5", enterprise: "Unlimited" },
              { feature: "Storage", starter: "1 GB", professional: "10 GB", enterprise: "Unlimited" },
              { feature: "API Access", starter: "❌", professional: "✅", enterprise: "✅" },
              { feature: "Custom Integrations", starter: "❌", professional: "Basic", enterprise: "Advanced" },
              { feature: "Support", starter: "Email", professional: "Priority", enterprise: "24/7 + Manager" },
              { feature: "SLA", starter: "❌", professional: "❌", enterprise: "99.9%" }
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-200">
                <div className="font-medium text-gray-900">{row.feature}</div>
                <div className="text-center text-gray-600">{row.starter}</div>
                <div className="text-center text-gray-600">{row.professional}</div>
                <div className="text-center text-gray-600">{row.enterprise}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <motion.div
                className="flex items-center justify-center mb-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                  <TextQuoteIcon className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Frequently Asked Questions</h2>
              <p className="text-gray-600">Everything you need to know about our pricing and plans.</p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="flex items-center justify-center mb-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
              <AlignStartHorizontal className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already saving money with our intelligent energy management platform.
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link to="/register">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link to="/contact">Talk to Sales</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 mt-12 text-green-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;