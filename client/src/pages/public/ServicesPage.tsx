
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";
import {

  FileText,
  BarChart3,
  TrendingDown,
  Shield,
  Users,
  Brain,
  Globe,
  Clock,
  CheckCircle,
  ArrowRight,

  Smartphone,
  IndentIncrease,

} from 'lucide-react';
import { GiLevelTwoAdvanced, GiProcessor } from 'react-icons/gi';
import { FaIntercom, FaRegCaretSquareUp } from 'react-icons/fa';

const ServicesPage = () => {
  const coreFeatures = [
    {
      icon: FileText,
      title: "AI-Powered Bill Analysis",
      description: "Automatically extract and analyze data from utility bills with 98% accuracy using advanced OCR and machine learning.",
      features: ["OCR Processing", "Data Validation", "Multi-format Support", "Bulk Processing"],
      color: "bg-blue-600"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics Dashboard",
      description: "Comprehensive dashboards providing insights into energy consumption patterns, costs, and optimization opportunities.",
      features: ["Live Monitoring", "Custom Reports", "Trend Analysis", "Predictive Insights"],
      color: "bg-green-600"
    },
    {
      icon: TrendingDown,
      title: "Cost Optimization Engine",
      description: "Advanced algorithms identify cost-saving opportunities and provide actionable recommendations for energy efficiency.",
      features: ["Scenario Modeling", "Cost Projections", "ROI Analysis", "Efficiency Recommendations"],
      color: "bg-purple-600"
    },
    {
      icon: Brain,
      title: "Scenario Simulation",
      description: "Model different energy strategies and scenarios to predict costs, savings, and environmental impact.",
      features: ["What-if Analysis", "Multiple Scenarios", "Impact Modeling", "Strategy Comparison"],
      color: "bg-orange-600"
    }
  ];

  const advancedFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with role-based access control and data segregation.",
      capabilities: ["SOC 2 Compliance", "End-to-end Encryption", "Role-based Access", "Audit Trails"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Multi-user workspace with customizable permissions and workflow management.",
      capabilities: ["User Management", "Permission Controls", "Workflow Automation", "Team Analytics"]
    },
    {
      icon: Globe,
      title: "Multi-site Management",
      description: "Centralized management for organizations with multiple locations and facilities.",
      capabilities: ["Site Aggregation", "Comparative Analysis", "Centralized Reporting", "Location Insights"]
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Full-featured mobile app for on-the-go energy management and monitoring.",
      capabilities: ["iOS & Android Apps", "Push Notifications", "Offline Access", "Mobile Reports"]
    }
  ];

  const integrations = [
    { name: "PowerBI", description: "Advanced business intelligence and reporting", logo: "📊" },
    { name: "SAP", description: "Enterprise resource planning integration", logo: "🏢" },
    { name: "Oracle", description: "Database and enterprise software connectivity", logo: "🗃️" },
    { name: "Salesforce", description: "CRM and customer data synchronization", logo: "☁️" },
    { name: "Slack", description: "Team communication and notifications", logo: "💬" },
    { name: "Microsoft Teams", description: "Collaboration and workflow integration", logo: "👥" },
    { name: "Excel", description: "Spreadsheet import/export functionality", logo: "📈" },
    { name: "API Access", description: "Custom integrations via REST API", logo: "🔗" }
  ];

  const industries = [
    {
      name: "Manufacturing",
      description: "Optimize energy-intensive production processes",
      icon: "🏭",
      benefits: ["25-40% cost reduction", "Production optimization", "Compliance tracking"]
    },
    {
      name: "Healthcare",
      description: "Manage complex facility energy requirements",
      icon: "🏥",
      benefits: ["24/7 monitoring", "Critical system tracking", "Regulatory compliance"]
    },
    {
      name: "Retail",
      description: "Multi-location energy management at scale",
      icon: "🏬",
      benefits: ["Chain-wide visibility", "Store comparisons", "Centralized control"]
    },
    {
      name: "Education",
      description: "Campus-wide energy optimization and sustainability",
      icon: "🎓",
      benefits: ["Budget optimization", "Sustainability goals", "Teaching resources"]
    },
    {
      name: "Real Estate",
      description: "Portfolio-wide energy management and tenant billing",
      icon: "🏢",
      benefits: ["Tenant transparency", "Portfolio insights", "Cost allocation"]
    },
    {
      name: "Government",
      description: "Public sector energy efficiency and compliance",
      icon: "🏛️",
      benefits: ["Taxpayer transparency", "Compliance reporting", "Sustainability initiatives"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-yellow-500 text-black px-4 py-2 mb-6">Complete Energy Intelligence Platform</Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Comprehensive Energy
              <span className="block text-yellow-300">Management Services</span>
            </h1>
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              From AI-powered bill analysis to advanced scenario modeling, our complete suite
              of services transforms how organizations manage and optimize energy consumption.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-green-600 hover:bg-white hover:text-green-600"
              >
                <Link to="/contact" className="text-green-600">
                  Schedule Demo
                </Link>
              </Button>

            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <FaRegCaretSquareUp className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Core Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with comprehensive energy management
              tools to deliver unprecedented insights and optimization capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    {feature.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">

            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <GiLevelTwoAdvanced className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced Capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade features designed for scalability, security, and seamless integration
              with your existing business processes.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <CardTitle className="text-lg text-gray-900 mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {feature.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-gray-600">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <FaIntercom className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Seamless Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing tools and systems for a unified energy management workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{integration.logo}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
                <p className="text-sm text-gray-600">{integration.description}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Request Custom Integration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <IndentIncrease className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Industry-Specific Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored features and workflows designed for the unique energy management
              needs of different industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="text-4xl mb-4">{industry.icon}</div>
                  <CardTitle className="text-xl text-gray-900 mb-2">{industry.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {industry.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {industry.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <GiProcessor className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Implementation Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven implementation methodology ensures rapid deployment and immediate value delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovery & Planning</h3>
              <p className="text-sm text-gray-600">Understand your requirements and design the optimal solution architecture.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Setup</h3>
              <p className="text-sm text-gray-600">Configure the platform, integrate systems, and import historical data.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Training & Launch</h3>
              <p className="text-sm text-gray-600">Comprehensive team training and guided platform launch with full support.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">4</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Optimization</h3>
              <p className="text-sm text-gray-600">Ongoing optimization, feature updates, and strategic consultation.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Typical implementation: 2-4 weeks</span>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-3">
            Ready to Transform Your Energy Management?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Experience the power of intelligent energy management with our comprehensive platform.
            Start your free trial today and see immediate results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link to="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-green-600 hover:bg-white hover:text-green-600"
            >
              <Link to="/contact" className="text-green-600">
                Schedule Demo
              </Link>
            </Button>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;