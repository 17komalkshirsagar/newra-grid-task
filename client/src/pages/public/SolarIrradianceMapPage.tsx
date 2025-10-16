import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sun,
  MapPin,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  CloudSun,
  TrendingUp,
  Map as MapIcon
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';


interface SolarData {
  city: string;
  state: string;
  lat: number;
  lng: number;
  irradiance: number;
  annualAvg: number;
  peakMonths: string;
}

const solarIrradianceData: SolarData[] = [
  { city: 'Jaisalmer', state: 'Rajasthan', lat: 26.9157, lng: 70.9083, irradiance: 6.5, annualAvg: 2372, peakMonths: 'Mar-Jun' },
  { city: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, irradiance: 6.3, annualAvg: 2299, peakMonths: 'Mar-Jun' },
  { city: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, irradiance: 6.2, annualAvg: 2263, peakMonths: 'Apr-Jun' },
  { city: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369, irradiance: 5.8, annualAvg: 2117, peakMonths: 'Mar-May' },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, irradiance: 5.7, annualAvg: 2080, peakMonths: 'Mar-May' },
  { city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, irradiance: 5.5, annualAvg: 2007, peakMonths: 'Apr-May' },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, irradiance: 5.4, annualAvg: 1971, peakMonths: 'Mar-May' },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, irradiance: 5.2, annualAvg: 1898, peakMonths: 'Feb-Apr' },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, irradiance: 5.3, annualAvg: 1934, peakMonths: 'Mar-May' },
  { city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, irradiance: 5.4, annualAvg: 1971, peakMonths: 'Mar-May' },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, irradiance: 5.3, annualAvg: 1934, peakMonths: 'Feb-May' },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, irradiance: 5.0, annualAvg: 1825, peakMonths: 'Feb-Apr' },
  { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, irradiance: 5.6, annualAvg: 2044, peakMonths: 'Apr-May' },
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, irradiance: 5.5, annualAvg: 2007, peakMonths: 'Apr-May' },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, irradiance: 6.0, annualAvg: 2190, peakMonths: 'Mar-Jun' },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, irradiance: 5.2, annualAvg: 1898, peakMonths: 'Apr-May' },
  { city: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, irradiance: 5.5, annualAvg: 2007, peakMonths: 'Apr-Jun' },
  { city: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, irradiance: 5.3, annualAvg: 1934, peakMonths: 'May-Jun' },
  { city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, irradiance: 5.2, annualAvg: 1898, peakMonths: 'May-Jun' },
  { city: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, irradiance: 4.8, annualAvg: 1752, peakMonths: 'Apr-Jun' },
  { city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, irradiance: 5.0, annualAvg: 1825, peakMonths: 'Apr-May' },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, irradiance: 4.7, annualAvg: 1715, peakMonths: 'Mar-May' },
  { city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, irradiance: 5.1, annualAvg: 1861, peakMonths: 'Mar-May' },
  { city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, irradiance: 4.5, annualAvg: 1642, peakMonths: 'Mar-Apr' },
  { city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, irradiance: 4.9, annualAvg: 1788, peakMonths: 'Feb-Apr' },
  { city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, irradiance: 4.8, annualAvg: 1752, peakMonths: 'Feb-Apr' },
];


const MapBounds = ({ data }: { data: SolarData[] }) => {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      const bounds = data.map(point => [point.lat, point.lng] as LatLngExpression);
      map.fitBounds(bounds as any, { padding: [50, 50] });
    }
  }, [data, map]);

  return null;
};

const SolarIrradianceMapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<SolarData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const mapRef = useRef<HTMLDivElement>(null);

  const getColorByIrradiance = (irradiance: number) => {
    if (irradiance >= 6.0) return { color: '#dc2626', label: 'Excellent' };
    if (irradiance >= 5.5) return { color: '#ea580c', label: 'Very Good' };
    if (irradiance >= 5.0) return { color: '#f59e0b', label: 'Good' };
    if (irradiance >= 4.5) return { color: '#84cc16', label: 'Moderate' };
    return { color: '#22c55e', label: 'Fair' };
  };

  const getMarkerSize = (irradiance: number) => {
    if (irradiance >= 6.0) return 18;
    if (irradiance >= 5.5) return 15;
    if (irradiance >= 5.0) return 12;
    if (irradiance >= 4.5) return 10;
    return 8;
  };

  const filteredData = solarIrradianceData.filter(location => {
    if (filter === 'all') return true;
    if (filter === 'high') return location.irradiance >= 5.8;
    if (filter === 'medium') return location.irradiance >= 5.0 && location.irradiance < 5.8;
    if (filter === 'low') return location.irradiance < 5.0;
    return true;
  });

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
        ease: "easeInOut" as const
      }
    }
  };

  const centerPosition: LatLngExpression = [20.5937, 78.9629];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 dark:from-orange-700 dark:via-red-700 dark:to-pink-800 text-white py-20">

        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl"
            animate={floatingAnimation}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"
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
                <MapIcon className="inline h-4 w-4 mr-2" />
                Interactive Solar Map
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
                Solar Irradiance Map
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-orange-50 leading-relaxed max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Explore solar energy potential across India. Discover the best locations for solar
              installations with our interactive irradiance map showing real-time data.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 pt-4"
              variants={fadeInUp}
            >
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2 text-sm">
                <Sun className="h-4 w-4 mr-2" />
                26+ Locations
              </Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2 text-sm">
                <CloudSun className="h-4 w-4 mr-2" />
                Real-time Data
              </Badge>
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2 text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Annual Averages
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>


      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-6">

            <motion.div
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >

              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-orange-600" />
                    Irradiance Scale
                  </CardTitle>
                  <CardDescription>kWh/m²/day</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { range: '≥ 6.0', color: '#dc2626', label: 'Excellent' },
                    { range: '5.5 - 5.9', color: '#ea580c', label: 'Very Good' },
                    { range: '5.0 - 5.4', color: '#f59e0b', label: 'Good' },
                    { range: '4.5 - 4.9', color: '#84cc16', label: 'Moderate' },
                    { range: '< 4.5', color: '#22c55e', label: 'Fair' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full shadow-md"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500">{item.range}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>


              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Filter Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { value: 'all', label: 'All Locations', count: solarIrradianceData.length },
                    { value: 'high', label: 'Excellent Sites', count: solarIrradianceData.filter(d => d.irradiance >= 5.8).length },
                    { value: 'medium', label: 'Good Sites', count: solarIrradianceData.filter(d => d.irradiance >= 5.0 && d.irradiance < 5.8).length },
                    { value: 'low', label: 'Moderate Sites', count: solarIrradianceData.filter(d => d.irradiance < 5.0).length },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={filter === option.value ? 'default' : 'outline'}
                      className="w-full justify-between"
                      onClick={() => setFilter(option.value as any)}
                    >
                      <span>{option.label}</span>
                      <Badge variant="secondary">{option.count}</Badge>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <Sun className="h-12 w-12 mx-auto text-orange-600" />
                    <p className="text-3xl font-bold text-orange-600">
                      {filteredData.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Locations Displayed
                    </p>
                  </div>
                </CardContent>
              </Card>


              {selectedLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-600" />
                        Selected Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedLocation.city}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedLocation.state}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Daily Avg:
                          </span>
                          <span className="text-sm font-bold text-orange-600">
                            {selectedLocation.irradiance} kWh/m²/day
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Annual Avg:
                          </span>
                          <span className="text-sm font-bold text-orange-600">
                            {selectedLocation.annualAvg} kWh/m²/year
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Peak Months:
                          </span>
                          <span className="text-sm font-bold text-orange-600">
                            {selectedLocation.peakMonths}
                          </span>
                        </div>
                        <div className="pt-2">
                          <Badge className={`${getColorByIrradiance(selectedLocation.irradiance).color === '#dc2626' ? 'bg-red-600' : ''}`}>
                            {getColorByIrradiance(selectedLocation.irradiance).label} Location
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>


            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className={`shadow-2xl border-0 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <MapIcon className="h-6 w-6 text-orange-600" />
                      India Solar Irradiance Map
                    </CardTitle>
                    <CardDescription>
                      Click on markers to view detailed solar data
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    ref={mapRef}
                    className={`${isFullscreen ? 'h-screen' : 'h-[600px]'} w-full relative`}
                  >
                    <MapContainer
                      center={centerPosition}
                      zoom={5}
                      className="h-full w-full z-0"
                      zoomControl={true}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <MapBounds data={filteredData} />

                      {filteredData.map((location, index) => {
                        const { color, label } = getColorByIrradiance(location.irradiance);
                        const markerSize = getMarkerSize(location.irradiance);

                        return (
                          <CircleMarker
                            key={index}
                            center={[location.lat, location.lng]}
                            radius={markerSize}
                            pathOptions={{
                              fillColor: color,
                              fillOpacity: 0.7,
                              color: color,
                              weight: 2,
                              opacity: 0.9,
                            }}
                            eventHandlers={{
                              click: () => setSelectedLocation(location),
                              mouseover: (e) => {
                                e.target.setStyle({ fillOpacity: 1, weight: 3 });
                              },
                              mouseout: (e) => {
                                e.target.setStyle({ fillOpacity: 0.7, weight: 2 });
                              },
                            }}
                          >
                            <Popup>
                              <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-lg mb-2">{location.city}</h3>
                                <p className="text-sm text-gray-600 mb-3">{location.state}</p>
                                <div className="space-y-1.5">
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-600">Daily Avg:</span>
                                    <span className="text-xs font-bold" style={{ color }}>
                                      {location.irradiance} kWh/m²/day
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-600">Annual Avg:</span>
                                    <span className="text-xs font-bold" style={{ color }}>
                                      {location.annualAvg} kWh/m²/year
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-xs text-gray-600">Peak:</span>
                                    <span className="text-xs font-bold" style={{ color }}>
                                      {location.peakMonths}
                                    </span>
                                  </div>
                                  <div className="pt-2 border-t mt-2">
                                    <span
                                      className="text-xs font-semibold px-2 py-1 rounded"
                                      style={{
                                        backgroundColor: `${color}20`,
                                        color: color,
                                      }}
                                    >
                                      {label} Location
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Popup>
                          </CircleMarker>
                        );
                      })}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>


          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Sun className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Highest Potential</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rajasthan leads with solar irradiance values exceeding 6.0 kWh/m²/day,
                    making it ideal for large-scale solar farms.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                    <CloudSun className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Seasonal Variation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Peak solar irradiance occurs during March-June across most regions,
                    optimizing energy production during summer months.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Growing Adoption</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    India's solar capacity is expanding rapidly, with favorable irradiance
                    conditions supporting the renewable energy transition.
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

export default SolarIrradianceMapPage;
