import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sun,
  Zap,
  Battery,
  Home,
  Building2,
  Factory,
  TreePine,
  Award,
  MapPin,
  Projector
} from 'lucide-react';

interface ProjectImage {
  id: number;
  title: string;
  category: string;
  location: string;
  capacity: string;
  year: string;
  imageUrl: string;
  size: 'small' | 'medium' | 'large' | 'tall';
  icon: React.ElementType;
}

const GalleryPage = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);


  const projects: ProjectImage[] = [
    {
      id: 1,
      title: 'Rooftop Solar Installation',
      category: 'Residential',
      location: 'California, USA',
      capacity: '10 kW',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
      size: 'large',
      icon: Home
    },
    {
      id: 2,
      title: 'Commercial Solar Farm',
      category: 'Commercial',
      location: 'Arizona, USA',
      capacity: '500 kW',
      year: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&h=600&fit=crop',
      size: 'medium',
      icon: Building2
    },
    {
      id: 3,
      title: 'Solar Panel Array',
      category: 'Industrial',
      location: 'Nevada, USA',
      capacity: '2 MW',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&h=600&fit=crop',
      size: 'medium',
      icon: Factory
    },
    {
      id: 4,
      title: 'Residential Solar System',
      category: 'Residential',
      location: 'Texas, USA',
      capacity: '15 kW',
      year: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&h=800&fit=crop',
      size: 'tall',
      icon: Home
    },
    {
      id: 5,
      title: 'Utility Scale Solar',
      category: 'Utility',
      location: 'New Mexico, USA',
      capacity: '5 MW',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop',
      size: 'large',
      icon: Zap
    },
    {
      id: 6,
      title: 'Solar Inverter System',
      category: 'Technology',
      location: 'Colorado, USA',
      capacity: '250 kW',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
      size: 'small',
      icon: Battery
    },
    {
      id: 7,
      title: 'Eco-Friendly Solar Park',
      category: 'Environmental',
      location: 'Oregon, USA',
      capacity: '1 MW',
      year: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=600&fit=crop',
      size: 'medium',
      icon: TreePine
    },
    {
      id: 8,
      title: 'Award-Winning Installation',
      category: 'Commercial',
      location: 'Florida, USA',
      capacity: '750 kW',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=600&h=800&fit=crop',
      size: 'tall',
      icon: Award
    },
    {
      id: 9,
      title: 'Modern Solar Farm',
      category: 'Industrial',
      location: 'Utah, USA',
      capacity: '3 MW',
      year: '2024',
      imageUrl: 'https://plus.unsplash.com/premium_photo-1682145347865-cc2f8cddf76a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TW9kZXJuJTIwU29sYXIlMjBGYXJtfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900',
      size: 'medium',
      icon: Sun
    },
    {
      id: 10,
      title: 'Rooftop Solar Grid',
      category: 'Residential',
      location: 'Georgia, USA',
      capacity: '20 kW',
      year: '2023',
      imageUrl: 'https://images.unsplash.com/photo-1705878565540-99d93b573fd2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1674',
      size: 'small',
      icon: Home
    },
    {
      id: 11,
      title: 'Large Scale Solar Project',
      category: 'Utility',
      location: 'Nevada, USA',
      capacity: '10 MW',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&h=600&fit=crop',
      size: 'large',
      icon: Factory
    },
    {
      id: 12,
      title: 'Solar Installation Close-up',
      category: 'Technology',
      location: 'California, USA',
      capacity: '100 kW',
      year: '2024',
      imageUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=600&h=600&fit=crop',
      size: 'small',
      icon: Zap
    }
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2 md:row-span-2';
      case 'tall':
        return 'md:row-span-2';
      case 'medium':
        return 'md:col-span-1 md:row-span-1';
      case 'small':
        return 'md:col-span-1 md:row-span-1';
      default:
        return 'md:col-span-1 md:row-span-1';
    }
  };

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

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      y: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-sky-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-sky-500 to-green-600 dark:from-yellow-700 dark:via-sky-700 dark:to-green-800 text-white py-24">

        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl"
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
            className="absolute bottom-20 left-1/3 w-64 h-64 bg-green-300/20 rounded-full blur-3xl"
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

        <div className="relative container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto space-y-6"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-2 bg-yellow-400/20 backdrop-blur-sm rounded-full text-yellow-200 text-sm font-medium mb-6">
                <Sun className="inline h-4 w-4 mr-2" />
                Solar Energy Excellence
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-white via-yellow-100 to-sky-100 bg-clip-text text-transparent">
                Our Solar Projects
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-yellow-50 leading-relaxed max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Discover our sustainable solar installations across rooftops and solar farms,
              powering a cleaner, greener future for communities worldwide.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 pt-4"
              variants={fadeInUp}
            >
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2 text-sm">
                <Zap className="h-2 w-2 mr-2" />
                50+ Projects Completed
              </Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2 text-sm">
                <Factory className="h-4 w-4 mr-2" />
                100 MW+ Installed
              </Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2 text-sm">
                <TreePine className="h-4 w-4 mr-2" />
                Carbon Neutral
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Project Showcase
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-yellow-600 via-sky-600 to-green-600 bg-clip-text text-transparent">
                Featured Solar Installations
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our portfolio of innovative solar energy projects, from residential rooftops
              to large-scale solar farms, each designed to maximize clean energy production.
            </p>
          </motion.div>


          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px]"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {projects.map((project) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  className={`${getSizeClasses(project.size)} group`}
                  variants={fadeInUp}
                  onHoverStart={() => setHoveredId(project.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800">
                    <div className="relative h-full">

                      <div className="absolute inset-0 overflow-hidden">
                        <motion.img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          animate={{
                            scale: hoveredId === project.id ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.6 }}
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                      </div>


                      <motion.div
                        className="absolute inset-0 p-6 flex flex-col justify-end"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: hoveredId === project.id ? 1 : 0.9,
                          y: hoveredId === project.id ? 0 : 10,
                        }}
                        transition={{ duration: 0.3 }}
                      >

                        <Badge className="absolute top-4 right-4 bg-yellow-400/90 text-black backdrop-blur-sm">
                          <Icon className="h-3 w-3 mr-1" />
                          {project.category}
                        </Badge>


                        <div className="space-y-2">
                          <h3 className="text-white text-xl font-bold leading-tight group-hover:text-yellow-300 transition-colors">
                            {project.title}
                          </h3>

                          <div className="flex items-center gap-2 text-sky-200 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{project.location}</span>
                          </div>


                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                              opacity: hoveredId === project.id ? 1 : 0,
                              height: hoveredId === project.id ? 'auto' : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center gap-4 text-green-200 text-sm pt-2">
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4" />
                                <span>{project.capacity}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                <span>{project.year}</span>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <section className="text-center mt-20 px-6">
            <motion.div
              className="flex items-center justify-center mt-12 mb-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <Projector className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-center justify-center gap-3">
                <Projector className="w-10 h-10 text-green-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                  Our Solar Achievements
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl">
                Empowering a sustainable future through innovation and clean energy.
              </p>
            </motion.div>



            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-16 px-6 md:px-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >

              <Card className="group relative overflow-hidden text-center py-10 px-6 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl border border-yellow-100 dark:border-yellow-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-yellow-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Sun className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-yellow-700 mb-1">50+</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide">
                    Completed Projects
                  </p>
                </div>
              </Card>


              <Card className="group relative overflow-hidden text-center py-10 px-6 bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20 rounded-2xl border border-sky-100 dark:border-sky-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-sky-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-sky-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-sky-700 mb-1">100 MW</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide">
                    Total Capacity
                  </p>
                </div>
              </Card>


              <Card className="group relative overflow-hidden text-center py-10 px-6 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-100 dark:border-green-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-green-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TreePine className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-green-700 mb-1">80K tons</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide">
                    CO₂ Saved Annually
                  </p>
                </div>
              </Card>


              <Card className="group relative overflow-hidden text-center py-10 px-6 bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-100 dark:border-purple-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-purple-700 mb-1">15+</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide">
                    Industry Awards
                  </p>
                </div>
              </Card>
            </motion.div>

          </section>


        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
