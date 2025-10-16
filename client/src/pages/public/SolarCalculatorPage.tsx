import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sun,
  Zap,

  TrendingDown,
  Calculator,
  Leaf,
  BarChart3,
  Info,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { FaRupeeSign } from "react-icons/fa";

interface CalculatorInputs {
  monthlyUsage: string;
  tariffRate: string;
  sunlightHours: string;
  systemEfficiency: string;
}

interface CalculationResults {
  currentMonthlyCost: number;
  estimatedSolarProduction: number;
  monthlySavings: number;
  annualSavings: number;
  savingsPercentage: number;
  paybackPeriod: number;
  co2Saved: number;
}

const SolarCalculatorPage = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyUsage: '500',
    tariffRate: '8',
    sunlightHours: '5',
    systemEfficiency: '85'
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<Partial<CalculatorInputs>>({});

  const validateInputs = (): boolean => {
    const newErrors: Partial<CalculatorInputs> = {};

    if (!inputs.monthlyUsage || parseFloat(inputs.monthlyUsage) <= 0) {
      newErrors.monthlyUsage = 'Enter a valid positive number';
    }
    if (!inputs.tariffRate || parseFloat(inputs.tariffRate) <= 0) {
      newErrors.tariffRate = 'Enter a valid positive number';
    }
    if (!inputs.sunlightHours || parseFloat(inputs.sunlightHours) <= 0 || parseFloat(inputs.sunlightHours) > 24) {
      newErrors.sunlightHours = 'Enter between 0 and 24 hours';
    }
    if (!inputs.systemEfficiency || parseFloat(inputs.systemEfficiency) <= 0 || parseFloat(inputs.systemEfficiency) > 100) {
      newErrors.systemEfficiency = 'Enter between 0 and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSavings = () => {
    if (!validateInputs()) return;

    const monthlyUsage = parseFloat(inputs.monthlyUsage);
    const tariffRate = parseFloat(inputs.tariffRate);
    const sunlightHours = parseFloat(inputs.sunlightHours);
    const systemEfficiency = parseFloat(inputs.systemEfficiency) / 100;


    const currentMonthlyCost = monthlyUsage * tariffRate;


    const dailyUsage = monthlyUsage / 30;
    const systemSize = dailyUsage / (sunlightHours * systemEfficiency);


    const estimatedSolarProduction = systemSize * sunlightHours * 30 * systemEfficiency;


    const coveragePercentage = Math.min((estimatedSolarProduction / monthlyUsage) * 100, 95);
    const monthlySavings = (currentMonthlyCost * coveragePercentage) / 100;
    const annualSavings = monthlySavings * 12;


    const systemCost = systemSize * 50000;
    const paybackPeriod = systemCost / annualSavings;


    const co2Saved = (estimatedSolarProduction * 12 * 0.82) / 1000;

    setResults({
      currentMonthlyCost,
      estimatedSolarProduction,
      monthlySavings,
      annualSavings,
      savingsPercentage: coveragePercentage,
      paybackPeriod,
      co2Saved
    });
  };

  useEffect(() => {
    calculateSavings();
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {

    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-green-500 to-blue-600 dark:from-yellow-700 dark:via-green-700 dark:to-blue-800 text-white py-20">

        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-green-300/20 rounded-full blur-3xl"
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
            className="absolute bottom-20 left-1/3 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"
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
                <Calculator className="inline h-4 w-4 mr-2" />
                Solar Savings Calculator
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-white via-yellow-100 to-green-100 bg-clip-text text-transparent">
                Calculate Your Solar Savings
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-yellow-50 leading-relaxed max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Discover how much you can save by switching to solar power. Get instant estimates
              of your monthly and annual electricity cost savings.
            </motion.p>
          </motion.div>
        </div>
      </section>


      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    Input Your Details
                  </CardTitle>
                  <CardDescription>
                    Enter your current electricity usage and location details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                  <div className="space-y-2">
                    <Label htmlFor="monthlyUsage" className="text-base font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      Monthly Electricity Usage (kWh)
                    </Label>
                    <Input
                      id="monthlyUsage"
                      type="text"
                      inputMode="decimal"
                      value={inputs.monthlyUsage}
                      onChange={(e) => handleInputChange('monthlyUsage', e.target.value)}
                      className={`text-lg ${errors.monthlyUsage ? 'border-red-500' : ''}`}
                      placeholder="e.g., 500"
                    />
                    {errors.monthlyUsage && (
                      <p className="text-sm text-red-500">{errors.monthlyUsage}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Check your electricity bill for average monthly consumption
                    </p>
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="tariffRate" className="text-base font-semibold flex items-center gap-2">
                      <FaRupeeSign className="h-4 w-4 text-green-600" />
                      Electricity Tariff Rate (₹ per kWh)
                    </Label>
                    <Input
                      id="tariffRate"
                      type="text"
                      inputMode="decimal"
                      value={inputs.tariffRate}
                      onChange={(e) => handleInputChange('tariffRate', e.target.value)}
                      className={`text-lg ${errors.tariffRate ? 'border-red-500' : ''}`}
                      placeholder="e.g., 8"
                    />
                    {errors.tariffRate && (
                      <p className="text-sm text-red-500">{errors.tariffRate}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Average tariff in India ranges from ₹6-₹10 per kWh
                    </p>
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="sunlightHours" className="text-base font-semibold flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-600" />
                      Average Sunlight Hours per Day
                    </Label>
                    <Input
                      id="sunlightHours"
                      type="text"
                      inputMode="decimal"
                      value={inputs.sunlightHours}
                      onChange={(e) => handleInputChange('sunlightHours', e.target.value)}
                      className={`text-lg ${errors.sunlightHours ? 'border-red-500' : ''}`}
                      placeholder="e.g., 5"
                    />
                    {errors.sunlightHours && (
                      <p className="text-sm text-red-500">{errors.sunlightHours}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      India average: 4-6 hours (varies by location)
                    </p>
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="systemEfficiency" className="text-base font-semibold flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-blue-600" />
                      Solar System Efficiency (%)
                    </Label>
                    <Input
                      id="systemEfficiency"
                      type="text"
                      inputMode="decimal"
                      value={inputs.systemEfficiency}
                      onChange={(e) => handleInputChange('systemEfficiency', e.target.value)}
                      className={`text-lg ${errors.systemEfficiency ? 'border-red-500' : ''}`}
                      placeholder="e.g., 85"
                    />
                    {errors.systemEfficiency && (
                      <p className="text-sm text-red-500">{errors.systemEfficiency}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Modern systems: 80-90% efficiency
                    </p>
                  </div>

                  <div className="pt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex gap-2 text-sm text-blue-700 dark:text-blue-300">
                      <Info className="h-5 w-5 flex-shrink-0" />
                      <p>
                        Results update automatically as you type. All calculations are estimates
                        based on average conditions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >

              <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-green-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-white flex items-center gap-2 mb-2">
                        <FaRupeeSign className="h-6 w-6" />
                        Your Savings Estimate
                      </CardTitle>
                      <CardDescription className="text-green-50">
                        Potential cost savings with solar power
                      </CardDescription>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Sun className="h-12 w-12 text-yellow-300" />
                    </motion.div>
                  </div>
                </div>
              </Card>

              {results && (
                <>

                  <div className="grid grid-cols-1 gap-6">

                    <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="grid md:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">

                          <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                            <div className="flex items-start justify-between mb-3">
                              <Badge variant="destructive" className="text-xs">
                                Without Solar
                              </Badge>
                              <Zap className="h-5 w-5 text-red-500" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Current Monthly Cost
                            </p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                              ₹{results.currentMonthlyCost.toFixed(0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Based on your current usage
                            </p>
                          </div>


                          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                            <div className="flex items-start justify-between mb-3">
                              <Badge className="text-xs bg-green-600 hover:bg-green-700">
                                With Solar
                              </Badge>
                              <Sun className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Estimated Monthly Cost
                            </p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                              ₹{(results.currentMonthlyCost - results.monthlySavings).toFixed(0)}
                            </p>
                            <p className="text-xs text-green-600 mt-2 font-semibold">
                              Save {results.savingsPercentage.toFixed(0)}% every month!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>


                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full -ml-24 -mb-24 blur-2xl" />

                        <CardContent className="p-8 relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="space-y-2">
                              <Badge className="bg-white/20 text-white backdrop-blur-sm border-0">
                                Monthly Savings
                              </Badge>
                              <p className="text-white/80 text-sm">
                                Save every single month
                              </p>
                            </div>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <CheckCircle className="h-10 w-10 text-white" />
                            </motion.div>
                          </div>

                          <div className="flex items-baseline gap-2 mb-2">
                            <p className="text-3xl font-bold text-white">
                              ₹{results.monthlySavings.toFixed(0)}
                            </p>
                            <p className="text-2xl text-white/80">/mo</p>
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <TrendingDown className="h-5 w-5 text-white" />
                            <p className="text-white/90 text-sm font-medium">
                              {results.savingsPercentage.toFixed(0)}% reduction in electricity bills
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>


                    <div className="grid md:grid-cols-3 gap-4">

                      <motion.div
                        className="md:col-span-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 h-full">
                          <CardContent className="p-6 text-white">
                            <div className="flex items-start justify-between mb-3">
                              <Badge className="bg-white/20 text-white backdrop-blur-sm border-0">
                                Annual Savings
                              </Badge>
                              <BarChart3 className="h-6 w-6" />
                            </div>
                            <p className="text-3xl font-bold mb-2">
                              ₹{results.annualSavings.toFixed(0)}
                            </p>
                            <p className="text-blue-100 text-sm">
                              Total savings per year with solar power
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/20">
                              <p className="text-xs text-blue-100 mb-2">In 5 years, you'll save:</p>
                              <p className="text-2xl font-bold">
                                ₹{(results.annualSavings * 5).toFixed(0)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>


                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-green-400 to-emerald-500 h-full">
                          <CardContent className="p-6 text-white text-center flex flex-col justify-center">
                            <Leaf className="h-10 w-10 mx-auto mb-3" />
                            <p className="text-4xl font-bold mb-1">
                              {results.co2Saved.toFixed(1)}
                            </p>
                            <p className="text-sm text-green-100">
                              Tons CO₂ Saved
                            </p>
                            <p className="text-xs text-green-100 mt-2">
                              per year
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>


                    <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">

                          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Sun className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                System Payback Period
                              </p>
                              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                                {results.paybackPeriod.toFixed(1)} <span className="text-xl">years</span>
                              </p>
                            </div>
                          </div>


                          <div>
                            <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
                              Savings Breakdown
                            </h3>
                            <div className="space-y-3">

                              <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-gray-600 dark:text-gray-400">Monthly</span>
                                  <span className="text-green-600 dark:text-green-400 font-bold">₹{results.monthlySavings.toFixed(0)}</span>
                                </div>
                                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(results.monthlySavings / results.currentMonthlyCost) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                  />
                                </div>
                              </div>


                              <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-gray-600 dark:text-gray-400">Annual</span>
                                  <span className="text-blue-600 dark:text-blue-400 font-bold">₹{results.annualSavings.toFixed(0)}</span>
                                </div>
                                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((results.annualSavings / (results.currentMonthlyCost * 12)) * 100, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.7 }}
                                  />
                                </div>
                              </div>


                              <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-gray-600 dark:text-gray-400">5 Years</span>
                                  <span className="text-purple-600 dark:text-purple-400 font-bold">₹{(results.annualSavings * 5).toFixed(0)}</span>
                                </div>
                                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, delay: 0.9 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>


                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Card className="shadow-2xl border-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32" />

                        <CardContent className="p-8 text-center relative">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block mb-4"
                          >
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
                              <Zap className="h-8 w-8 text-white" />
                            </div>
                          </motion.div>

                          <h3 className="text-2xl font-bold mb-2 text-white">
                            Ready to Go Solar?
                          </h3>
                          <p className="text-white/90 mb-6 max-w-md mx-auto">
                            Get a free consultation and detailed quote for your property. Our experts will help you maximize your savings!
                          </p>
                          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-50 font-semibold shadow-xl">
                            Get Free Quote
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          </div>


          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-16 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Sun className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Zero Maintenance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Solar panels require minimal maintenance and come with 25-year warranties
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Eco-Friendly</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reduce your carbon footprint and contribute to a cleaner environment
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                    <FaRupeeSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Government Incentives</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Benefit from subsidies and tax incentives for solar installations
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SolarCalculatorPage;
