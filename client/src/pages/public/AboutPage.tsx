
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Globe,

  TrendingUp,

  ArrowRight,
  Flag,
  BookOpen,
  Rocket
} from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900",
      bio: "Former energy consultant with 15+ years in sustainability and AI innovation."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      bio: "AI researcher and former Google engineer specializing in machine learning and data analytics."
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "VP of Engineering",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      bio: "PhD in Energy Systems with expertise in smart grid technology and optimization algorithms."
    },
    {
      name: "David Kim",
      role: "Head of Sales",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      bio: "Enterprise sales veteran with deep understanding of energy markets and customer needs."
    }
  ];

  const milestones = [
    { year: "2020", title: "Company Founded", description: "Started with a vision to democratize energy intelligence" },
    { year: "2021", title: "AI Engine Launch", description: "Released our proprietary bill analysis AI with 95% accuracy" },
    { year: "2022", title: "Enterprise Scale", description: "Reached 100+ enterprise customers and $5M ARR" },
    { year: "2023", title: "Global Expansion", description: "Expanded to 15 countries with multi-language support" },
    { year: "2024", title: "Carbon Impact", description: "Helped customers reduce 50,000 tons of CO2 emissions" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">


      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">


            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl lg:text-6xl font-bold mb-3">
              About Our Mission
            </h1>

            <p className="text-xl text-green-100 leading-relaxed mb-8">
              We're on a mission to transform how organizations manage energy consumption
              through intelligent automation, advanced analytics, and sustainable innovation.
            </p>

            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link to="/contact">Join Our Mission</Link>
            </Button>
          </div>
        </div>
      </section>



      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-8 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-900">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To democratize energy intelligence by making advanced analytics and optimization
                  accessible to organizations of all sizes, driving both cost savings and environmental impact.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-900">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  A world where every organization has the insights and tools needed to optimize
                  energy consumption, reduce costs, and contribute to a sustainable future.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-purple-900">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Innovation, sustainability, transparency, and customer success drive everything we do.
                  We believe in building technology that makes a positive impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">

              <motion.div
                className="flex items-center justify-center mb-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-indigo-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Founded in 2020 by energy industry veterans and AI researchers, we recognized
                the massive opportunity to transform energy management through intelligent automation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">The Challenge We Saw</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Organizations were drowning in manual energy bill processing, lacking visibility
                  into consumption patterns, and missing opportunities for significant cost savings.
                  Traditional energy management tools were complex, expensive, and inaccessible.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We knew there had to be a better way - one that leveraged the power of AI and
                  modern cloud technology to make energy intelligence accessible to everyone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center bg-red-50 border-red-200">
                  <div className="text-2xl font-bold text-red-600 mb-2">80%</div>
                  <div className="text-sm text-red-700">Manual Processing</div>
                </Card>
                <Card className="p-6 text-center bg-orange-50 border-orange-200">
                  <div className="text-2xl font-bold text-orange-600 mb-2">$2T</div>
                  <div className="text-sm text-orange-700">Wasted Energy</div>
                </Card>
                <Card className="p-6 text-center bg-yellow-50 border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">30%</div>
                  <div className="text-sm text-yellow-700">Hidden Costs</div>
                </Card>
                <Card className="p-6 text-center bg-green-50 border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-2">24hrs</div>
                  <div className="text-sm text-green-700">Processing Time</div>
                </Card>
              </div>
            </div>


            <div className="space-y-8">
              <motion.div
                className="flex items-center justify-center mb-3"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                  <Flag className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">Our Journey</h3>
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h4>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-blue-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <h2 className="text-4xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team combines deep expertise in energy systems, artificial intelligence,
              and enterprise software to deliver innovative solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-green-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">

            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-400 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold mb-1">Our Impact</h2>
            <p className="text-xl text-green-100">Real results from real customers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-green-100">Enterprise Customers</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-1">₹2.5B</div>
              <div className="text-green-100">Energy Costs Analyzed</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-1">15</div>
              <div className="text-green-100">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-1">98%</div>
              <div className="text-green-100">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>



      <section className="py-20">
        <div className="container mx-auto px-4 text-center">

          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-green-600 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to optimize your energy costs or join our growing team,
            we'd love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link to="/contact">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/careers">View Open Positions</Link>
            </Button>
          </div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage;