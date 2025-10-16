





import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

import { Label } from '@/components/ui/label';
import {
  Sun,
  Zap,
  Leaf,
  Wallet,
  Calculator,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  TrendingDown,

  DollarSign,
  BarChart3,
  Info,
  CheckCircle
} from 'lucide-react';

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
  systemSize: number;
}

const SolarCalculatorPage = () => {
  const navigate = useNavigate();


  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyUsage: '500',
    tariffRate: '8',
    sunlightHours: '5',
    systemEfficiency: '85'
  });
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [errors, setErrors] = useState<Partial<CalculatorInputs>>({});

  console.log("errors", errors);

  const handleGetQuote = () => {
    navigate('/contact');
  };


  const handleReset = () => {
    setInputs({
      monthlyUsage: '500',
      tariffRate: '8',
      sunlightHours: '5',
      systemEfficiency: '85'
    });
  };


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
    const co2SavedAdvanced = (estimatedSolarProduction * 12 * 0.82) / 1000;

    setResults({
      currentMonthlyCost,
      estimatedSolarProduction,
      monthlySavings,
      annualSavings,
      savingsPercentage: coveragePercentage,
      paybackPeriod,
      co2Saved: co2SavedAdvanced,
      systemSize
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

  console.log("handleInputChange::", handleInputChange);

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


  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-500 to-green-600 dark:from-yellow-700 dark:via-orange-700 dark:to-green-800 text-white py-20">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"
            animate={{
              y: [10, -10, 10],
              transition: { y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-64 h-64 bg-green-300/20 rounded-full blur-3xl"
            animate={{
              y: [-5, 15, -5],
              transition: { y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }
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
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-yellow-100 text-sm font-medium mb-6">
                <Calculator className="inline h-4 w-4 mr-2" />
                Solar Power Calculator
              </span>
            </motion.div>

            <motion.h1 className="text-4xl md:text-6xl font-bold leading-tight" variants={fadeInUp}>
              <span className="bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
                Calculate Your Solar Investment
              </span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-yellow-50 leading-relaxed max-w-3xl mx-auto" variants={fadeInUp}>
              Enter your electricity usage details for a comprehensive analysis of your potential savings and system requirements.
            </motion.p>
          </motion.div>
        </div>
      </section>


      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-4 py-2">
                Solar Savings Calculator
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Calculate Your Solar Savings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Adjust the sliders to match your electricity usage and see comprehensive analysis of your potential savings
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Zap className="h-6 w-6 text-yellow-500" />
                      Input Your Details
                    </CardTitle>
                    <CardDescription>
                      Enter your current electricity usage and location details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          Monthly Electricity Usage
                        </Label>
                        <motion.div
                          key={`usage-${inputs.monthlyUsage}`}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg"
                        >
                          <span className="text-2xl font-bold">{inputs.monthlyUsage}</span>
                          <span className="text-sm ml-1">kWh</span>
                        </motion.div>
                      </div>
                      <Slider
                        value={[parseFloat(inputs.monthlyUsage) || 0]}
                        onValueChange={(value: any) => setInputs(prev => ({ ...prev, monthlyUsage: value[0].toString() }))}
                        min={50}
                        max={2000}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>50 kWh</span>
                        <span>1000 kWh</span>
                        <span>2000 kWh</span>
                      </div>
                      <p className="text-xs text-gray-500">Check your electricity bill for average monthly consumption</p>
                    </div>


                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Electricity Tariff Rate
                        </Label>
                        <motion.div
                          key={`tariff-${inputs.tariffRate}`}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
                        >
                          <span className="text-2xl font-bold">₹{inputs.tariffRate}</span>
                          <span className="text-sm ml-1">/kWh</span>
                        </motion.div>
                      </div>
                      <Slider
                        value={[parseFloat(inputs.tariffRate) || 0]}
                        onValueChange={(value: any) => setInputs(prev => ({ ...prev, tariffRate: value[0].toFixed(1) }))}
                        min={3}
                        max={15}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>₹3/kWh</span>
                        <span>₹8/kWh</span>
                        <span>₹15/kWh</span>
                      </div>
                      <p className="text-xs text-gray-500">Average tariff in India ranges from ₹6-₹10 per kWh</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-600" />
                          Average Sunlight Hours
                        </Label>
                        <motion.div
                          key={`sun-${inputs.sunlightHours}`}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-lg shadow-lg"
                        >
                          <span className="text-2xl font-bold">{inputs.sunlightHours}</span>
                          <span className="text-sm ml-1">hrs/day</span>
                        </motion.div>
                      </div>
                      <Slider
                        value={[parseFloat(inputs.sunlightHours) || 0]}
                        onValueChange={(value: any) => setInputs(prev => ({ ...prev, sunlightHours: value[0].toFixed(1) }))}
                        min={2}
                        max={10}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>2 hrs</span>
                        <span>6 hrs</span>
                        <span>10 hrs</span>
                      </div>
                      <p className="text-xs text-gray-500">India average: 4-6 hours (varies by location)</p>
                    </div>

                    {/* System Efficiency Slider */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          Solar System Efficiency
                        </Label>
                        <motion.div
                          key={`eff-${inputs.systemEfficiency}`}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg"
                        >
                          <span className="text-2xl font-bold">{inputs.systemEfficiency}</span>
                          <span className="text-sm ml-1">%</span>
                        </motion.div>
                      </div>
                      <Slider
                        value={[parseFloat(inputs.systemEfficiency) || 0]}
                        onValueChange={(value: any) => setInputs(prev => ({ ...prev, systemEfficiency: value[0].toString() }))}
                        min={70}
                        max={95}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>70%</span>
                        <span>85%</span>
                        <span>95%</span>
                      </div>
                      <p className="text-xs text-gray-500">Modern systems: 80-90% efficiency</p>
                    </div>

                    <div className="pt-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                        <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Live Calculation</p>
                          <p className="text-xs">Results update automatically as you adjust the sliders. All calculations are estimates based on average conditions.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>


              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-green-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-white flex items-center gap-2 mb-2">
                          <DollarSign className="h-6 w-6" />
                          Your Savings Estimate
                        </CardTitle>
                        <CardDescription className="text-green-50">
                          Potential cost savings with solar power
                        </CardDescription>
                      </div>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                        <Sun className="h-12 w-12 text-yellow-300" />
                      </motion.div>
                    </div>
                  </div>
                </Card>

                {results && (
                  <>

                    <div className="grid md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 text-white overflow-hidden relative h-full">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl" />
                          <CardContent className="p-6 relative">
                            <div className="flex items-center justify-between mb-3">
                              <Badge className="bg-white/20 text-white backdrop-blur-sm border-0 text-xs">
                                System Size
                              </Badge>
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Zap className="h-6 w-6 text-purple-200" />
                              </motion.div>
                            </div>
                            <p className="text-white/80 text-xs font-medium mb-2">Expected kW Panel</p>
                            <div className="flex items-baseline gap-2">
                              <motion.p
                                key={`system-${results.systemSize}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-bold"
                              >
                                {results.systemSize.toFixed(2)}
                              </motion.p>
                              <p className="text-xl font-semibold">kW</p>
                            </div>
                            <p className="text-white/70 text-xs mt-2">
                              Recommended solar panel capacity
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                      >
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 text-white overflow-hidden relative h-full">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl" />
                          <CardContent className="p-6 relative">
                            <div className="flex items-center justify-between mb-3">
                              <Badge className="bg-white/20 text-white backdrop-blur-sm border-0 text-xs">
                                Setup Cost
                              </Badge>
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                              >
                                <Wallet className="h-6 w-6 text-indigo-200" />
                              </motion.div>
                            </div>
                            <p className="text-white/80 text-xs font-medium mb-2">Expected Price</p>
                            <div className="flex items-baseline gap-1">
                              <motion.p
                                key={`cost-${results.systemSize}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl font-bold"
                              >
                                ₹{formatPrice(Math.round(results.systemSize * 50000))}
                              </motion.p>
                            </div>
                            <p className="text-white/70 text-xs mt-2">
                              Estimated installation cost @ ₹50,000/kW
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="grid md:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
                          <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                            <div className="flex items-start justify-between mb-3">
                              <Badge variant="destructive" className="text-xs">Without Solar</Badge>
                              <Zap className="h-5 w-5 text-red-500" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Monthly Cost</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹{results.currentMonthlyCost.toFixed(0)}</p>
                            <p className="text-xs text-gray-500 mt-2">Based on your current usage</p>
                          </div>

                          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                            <div className="flex items-start justify-between mb-3">
                              <Badge className="text-xs bg-green-600 hover:bg-green-700">With Solar</Badge>
                              <Sun className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Monthly Cost</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                              ₹{(results.currentMonthlyCost - results.monthlySavings).toFixed(0)}
                            </p>
                            <p className="text-xs text-green-600 mt-2 font-semibold">Save {results.savingsPercentage.toFixed(0)}% every month!</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                      <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full -ml-24 -mb-24 blur-2xl" />
                        <CardContent className="p-8 relative">
                          <div className="flex items-start justify-between mb-4">
                            <div className="space-y-2">
                              <Badge className="bg-white/20 text-white backdrop-blur-sm border-0">Monthly Savings</Badge>
                              <p className="text-white/80 text-sm">Save every single month</p>
                            </div>
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                              <CheckCircle className="h-10 w-10 text-white" />
                            </motion.div>
                          </div>
                          <div className="flex items-baseline gap-2 mb-2">
                            <p className="text-2xl font-bold text-white">₹{results.monthlySavings.toFixed(0)}</p>
                            <p className="text-2xl text-white/80">/mo</p>
                          </div>
                          <div className="flex items-center gap-2 mt-4">
                            <TrendingDown className="h-5 w-5 text-white" />
                            <p className="text-white/90 text-sm font-medium">{results.savingsPercentage.toFixed(0)}% reduction in electricity bills</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <motion.div className="md:col-span-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 h-full">
                          <CardContent className="p-6 text-white">
                            <div className="flex items-start justify-between mb-3">
                              <Badge className="bg-white/20 text-white backdrop-blur-sm border-0">Annual Savings</Badge>
                              <BarChart3 className="h-6 w-6" />
                            </div>
                            <p className="text-2xl font-bold mb-2">₹{results.annualSavings.toFixed(0)}</p>
                            <p className="text-blue-100 text-sm">Total savings per year with solar power</p>
                            <div className="mt-4 pt-4 border-t border-white/20">
                              <p className="text-xs text-blue-100 mb-2">In 5 years, you'll save:</p>
                              <p className="text-2xl font-bold">₹{(results.annualSavings * 5).toFixed(0)}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-green-400 to-emerald-500 h-full">
                          <CardContent className="p-6 text-white text-center flex flex-col justify-center">
                            <Leaf className="h-10 w-10 mx-auto mb-3" />
                            <p className="text-2xl font-bold mb-1">{results.co2Saved.toFixed(1)}</p>
                            <p className="text-sm text-green-100">Tons CO₂ Saved</p>
                            <p className="text-xs text-green-100 mt-2">per year</p>
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
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">System Payback Period</p>
                              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                                {results.paybackPeriod.toFixed(1)} <span className="text-xl">years</span>
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Savings Breakdown</h3>
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
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-2xl border-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -ml-40 -mb-40 blur-2xl" />
                <CardContent className="p-16 text-center relative">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mb-8">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <Zap className="h-12 w-12 text-white" />
                    </div>
                  </motion.div>

                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Go Solar?</h2>
                  <p className="text-white/90 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
                    Get a personalized quote and free consultation from our solar experts. We'll help you design the perfect system for your needs and maximize your savings!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <Button
                      size="lg"
                      onClick={handleGetQuote}
                      className="bg-white text-orange-600 hover:bg-gray-50 font-bold shadow-2xl text-xl px-10 py-7 rounded-xl transition-transform hover:scale-105"
                    >
                      Get Free Quote
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleReset}
                      className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 font-bold backdrop-blur-sm text-xl px-10 py-7 rounded-xl transition-transform hover:scale-105"
                    >
                      <RotateCcw className="mr-3 h-6 w-6" />
                      Recalculate
                    </Button>
                  </div>

                  <p className="text-white/80 text-base mt-8 font-medium">Join 10,000+ happy customers who've switched to solar</p>
                </CardContent>
              </Card>
            </motion.div>


            <motion.div
              className="grid md:grid-cols-3 gap-8 mt-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >

              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 shadow-xl hover:shadow-2xl transition-all h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Sun className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <Badge className="mb-2 bg-yellow-500 text-white hover:bg-yellow-600">Quality Assured</Badge>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">25+ Year Warranty</h3>
                      </div>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      Premium solar panels with industry-leading warranties and minimal maintenance requirements
                    </p>
                    <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Long-lasting performance guaranteed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>


              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 shadow-xl hover:shadow-2xl transition-all h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Leaf className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <Badge className="mb-2 bg-green-500 text-white hover:bg-green-600">Eco-Friendly</Badge>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">Clean Energy</h3>
                      </div>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      Reduce your carbon footprint and contribute to a cleaner, more sustainable future for generations
                    </p>
                    <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-400 font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Zero emissions, 100% renewable
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>


              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all h-full">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <Badge className="mb-2 bg-blue-500 text-white hover:bg-blue-600">Financial Benefits</Badge>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">Government Incentives</h3>
                      </div>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      Benefit from government subsidies, tax incentives, and net metering programs to maximize savings
                    </p>
                    <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Save more with policy support
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolarCalculatorPage;