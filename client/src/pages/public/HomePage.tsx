
import { Link } from 'react-router-dom';
import { motion, TargetAndTransition } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Zap,
  TrendingDown,
  Shield,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Leaf,

  Play,
  Star,
  IndianRupee,


} from 'lucide-react';

import Video1 from './../../../src/video/video1.mp4';
import Video2 from './../../../src/video/video2.mp4';
import Video3 from './../../../src/video/video3.mp4';
import Video4 from './../../../src/video/video4.mp4';
import Video5 from './../../../src/video/video5.mp4';
import Video6 from './../../../src/video/video6.mp4';
import Video7 from './../../../src/video/video7.mp4';
import Video8 from './../../../src/video/video8.mp4';




const HomePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const floatingAnimation: TargetAndTransition = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };
  const videoCategories = [
    {
      name: 'Video1',
      video: Video1,
      title: 'Solar Panel Installation',
      description: 'Efficient installation for homes and businesses.',
      badge: 'Trending',
    },
    {
      name: 'Video2',
      video: Video2,
      title: 'Renewable Energy',
      description: 'Clean energy solutions for a sustainable future.',
      badge: 'New',
    },
    {
      name: 'Video3',
      video: Video3,
      title: 'Home Solar Setup',
      description: 'Affordable solar panel installation for residential use.',
      badge: 'Popular',
    },
    {
      name: 'Video4',
      video: Video4,
      title: 'Commercial Solar',
      description: 'High-efficiency solar systems for businesses.',
      badge: 'Featured',
    },
    {
      name: 'Video5',
      video: Video5,
      title: 'Solar Maintenance',
      description: 'Keep your solar panels performing at peak efficiency.',
      badge: 'Top Rated',
    },
    {
      name: 'Video6',
      video: Video6,
      title: 'Energy Storage',
      description: 'Battery solutions to store solar energy efficiently.',
      badge: 'New',
    },
    {
      name: 'Video7',
      video: Video7,
      title: 'Smart Monitoring',
      description: 'Monitor your energy usage in real-time.',
      badge: 'Trending',
    },
    {
      name: 'Video8',
      video: Video8,
      title: 'Green Energy Tips',
      description: 'Learn how to maximize energy savings at home.',
      badge: 'Featured',
    },
  ];



  const solarImages = [
    "https://plus.unsplash.com/premium_photo-1680129602397-f43e2d81617d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c29sYXIlMjBlbmVyeSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500",
    "https://images.unsplash.com/photo-1674168481499-983f0968a68f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNvbGFyJTIwZW5lcnklMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    "https://images.unsplash.com/photo-1662101525827-77bf00f40a52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNvbGFyJTIwZW5lcnklMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    "https://media.istockphoto.com/id/1457768039/photo/two-engineers-installing-solar-panels-on-roof.webp?a=1&b=1&s=612x612&w=0&k=20&c=if3NkZdskzbuNelXcFKGX7GDYdLRupn453NBnP69ROI=",
    "https://plus.unsplash.com/premium_photo-1716762544373-77789a03d6c7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHNvbGFyJTIwZW5lcnklMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1032",
    "https://plus.unsplash.com/premium_photo-1733306416524-051af34aa7bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fHNvbGFyJTIwZW5lcnklMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500"
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 dark:from-green-800 dark:via-teal-800 dark:to-blue-900 text-white min-h-screen flex items-center mb-10">

        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
            animate={{
              y: [10, -10, 10],
              transition: {
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-64 h-64 bg-green-400/20 rounded-full blur-3xl"
            animate={{
              y: [-5, 15, -5],
              transition: {
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <span className="inline-block px-4 py-2 bg-yellow-400/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-medium mb-6">
                  🚀 Next-Gen Energy Intelligence
                </span>
              </motion.div>

              <motion.h1
                className="text-6xl lg:text-7xl font-bold leading-tight"
                variants={fadeInUp}
              >
                <span className="bg-gradient-to-r from-white via-yellow-200 to-green-200 bg-clip-text text-transparent">
                  Revolutionize
                </span>
                <br />
                <span className="text-white">Your Energy</span>
                <br />
                <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Future
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-green-100 leading-relaxed max-w-lg"
                variants={fadeInUp}
              >
                Harness the power of AI and advanced analytics to transform your energy consumption,
                slash costs by up to 75%, and accelerate your sustainability journey.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold shadow-xl">
                  <Link to="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-black hover:bg-white/10 backdrop-blur-sm">
                  <Link to="/about">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Link>
                </Button>
              </motion.div>


              <motion.div
                className="flex items-center space-x-6 pt-8"
                variants={fadeInUp}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-green-100">500+ companies trust us</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-green-100 ml-2">4.9/5 rating</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Live Dashboard</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-200">Live</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="bg-white/10 rounded-xl p-4 text-center"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        className="text-3xl font-bold text-yellow-300"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        75%
                      </motion.div>
                      <div className="text-sm text-green-100">Cost Saved</div>
                    </motion.div>

                    <motion.div
                      className="bg-white/10 rounded-xl p-4 text-center"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        className="text-3xl font-bold text-blue-300"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        24/7
                      </motion.div>
                      <div className="text-sm text-green-100">Monitoring</div>
                    </motion.div>

                    <motion.div
                      className="bg-white/10 rounded-xl p-4 text-center"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        className="text-3xl font-bold text-green-300"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      >
                        98%
                      </motion.div>
                      <div className="text-sm text-green-100">Accuracy</div>
                    </motion.div>

                    <motion.div
                      className="bg-white/10 rounded-xl p-4 text-center"
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.div
                        className="text-3xl font-bold text-purple-300"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                      >
                        $2.5M
                      </motion.div>
                      <div className="text-sm text-green-100">Total Saved</div>
                    </motion.div>
                  </div>

                  <div className="h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg flex items-end justify-between p-2">
                    {[40, 60, 45, 80, 65, 90, 75].map((height, i) => (
                      <motion.div
                        key={i}
                        className="bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-sm"
                        style={{ width: '8px' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1 + 1 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>


              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                animate={floatingAnimation}
              >
                <Zap className="w-8 h-8 text-yellow-300" />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-400/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                animate={{
                  y: [5, -5, 5],
                  transition: {
                    y: {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }
                }}
              >
                <Leaf className="w-10 h-10 text-green-300" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>




      <div className="overflow-hidden group mt-6">
        <motion.div
          className="flex gap-6 py-4 whitespace-nowrap"
          animate={{ x: ['0%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
          style={{ animationPlayState: 'running' }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {videoCategories.concat(videoCategories).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % videoCategories.length) * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="cursor-pointer group min-w-[320px]"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden">
                  <video
                    src={item.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-2xl"
                  />


                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                    <h3 className="text-lg font-semibold">
                      {item.title || "Video Title"}
                    </h3>
                    <p className="text-sm mt-1 line-clamp-2">
                      {item.description || "Short description about this video."}
                    </p>
                    {item.badge && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-400/70 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>



      <div className="overflow-hidden mt-6">
        <motion.div
          className="flex gap-6 py-4 whitespace-nowrap"
          animate={{ x: ['-100%', '0%'] }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
        >
          {solarImages.concat(solarImages).map((src, index) => (
            <Card
              key={index}
              className="min-w-[300px] h-64 overflow-hidden rounded-xl shadow-lg flex-shrink-0 relative group"
            >
              <img
                src={src}
                alt={`solar-${index}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <h3 className="text-lg font-semibold">
                  {index % 2 === 0 ? "Solar Panel Setup" : "Renewable Energy"}
                </h3>
                <p className="text-sm mt-1">
                  {index % 2 === 0
                    ? "Efficient installation for homes"
                    : "Clean energy for a sustainable future"}
                </p>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>

      <section className="py-20 bg-white dark:bg-gray-800 transition-colors">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              💡 Cutting-Edge Features
            </motion.span>
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Supercharge
              </span>{" "}
              Your Energy Strategy
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Unlock the full potential of your energy data with AI-powered insights,
              automated optimization, and enterprise-grade security.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Zap,
                title: "AI Bill Analysis",
                description: "Automatically extract and analyze data from utility bills with 98% accuracy using advanced OCR and machine learning.",
                color: "green",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                description: "Real-time dashboards and insights to track consumption patterns and identify optimization opportunities.",
                color: "blue",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: TrendingDown,
                title: "Cost Optimization",
                description: "Advanced scenario modeling and simulation to predict savings and optimize procurement strategies.",
                color: "purple",
                gradient: "from-purple-500 to-violet-500"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level security with role-based access control and comprehensive data protection.",
                color: "orange",
                gradient: "from-orange-500 to-amber-500"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Multi-user workspace with customizable permissions and seamless workflow management.",
                color: "indigo",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: Lightbulb,
                title: "Smart Recommendations",
                description: "AI-powered suggestions for energy efficiency improvements and cost reduction strategies.",
                color: "teal",
                gradient: "from-teal-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 group">
                  <CardHeader className="text-center">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Reduce Energy Costs by up to 75%</h3>
                    <p className="text-gray-600">Advanced analytics identify inefficiencies and optimization opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Automate Manual Processes</h3>
                    <p className="text-gray-600">Eliminate manual bill processing with AI-powered automation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Real-time Monitoring & Alerts</h3>
                    <p className="text-gray-600">Stay informed with instant notifications and real-time consumption tracking.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Enterprise-Grade Security</h3>
                    <p className="text-gray-600">SOC 2 compliant with end-to-end encryption and audit trails.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6 bg-green-600 text-white">
                <IndianRupee className="h-10 w-10 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">₹2.5M+</div>
                <div className="text-green-100">Total Savings</div>
              </Card>
              <Card className="text-center p-6 bg-blue-600 text-white">
                <Leaf className="h-10 w-10 mx-auto mb-1" />
                <div className="text-2xl font-bold mb-1">40%</div>
                <div className="text-blue-100">Carbon Reduction</div>
              </Card>
              <Card className="text-center p-6 bg-purple-600 text-white">
                <Users className="h-10 w-10 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">500+</div>
                <div className="text-purple-100">Happy Clients</div>
              </Card>
              <Card className="text-center p-6 bg-orange-600 text-white">
                <BarChart3 className="h-10 w-10 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">99.9%</div>
                <div className="text-orange-100">Uptime</div>
              </Card>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-green-600 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-2">
            Ready to Transform Your Energy Management?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already saving millions with our intelligent energy management platform.
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
                Contact Sales
              </Link>
            </Button>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;