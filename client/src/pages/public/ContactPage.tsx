import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle } from "lucide-react";
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubmitContactMutation } from '@/redux/apis/contact.api';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Building,
  Users,
  HeadphonesIcon,
  Send,
  Loader2
} from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(2, 'Company name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  inquiryType: z.enum(['sales', 'support', 'partnership', 'general'])
    .refine(val => !!val, { message: "Please select inquiry type" }),

  message: z.string().min(10, 'Message must be at least 10 characters'),
});
import { ChevronDown, ChevronUp } from "lucide-react";
type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const [submitContact, { isLoading }] = useSubmitContactMutation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const onSubmit = async (data: ContactFormData) => {
    try {
      const result = await submitContact(data).unwrap();
      toast.success(result.message || 'Thank you! We\'ll get back to you within 24 hours.');
      reset();
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '80877388863';
    const message = encodeURIComponent('Hi! I would like to learn more about your energy management platform.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'support@newragrids.com',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      action: () => window.open('mailto:hello@energyplatform.com')
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 6pm',
      details: '+91 8087-738-8863',
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
      action: () => window.open('tel:+91 80877388863')
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      description: 'Quick chat on WhatsApp',
      details: 'Message us instantly',
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
      action: openWhatsApp
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come say hello at our office',
      details: 'NewRa GridsH/40, beside Kalyan Kale,Chhatrapati Sambhajinagar',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
      action: () => window.open('https://maps.google.com/?q=123+Energy+St,+San+Francisco,+CA+94105')
    }
  ];

  const departments = [
    {
      title: 'Sales Team',
      description: 'Get a demo and discuss pricing',
      email: 'sales@newragrid.com.com',
      phone: '+91 (808) 77-388863',
      icon: Building,
      color: 'bg-green-600'
    },
    {
      title: 'Customer Support',
      description: 'Technical help and account issues',
      email: 'support@newragrid.com.com',
      phone: '+91 (808) 77-388863',
      icon: HeadphonesIcon,
      color: 'bg-blue-600'
    },
    {
      title: 'Partnerships',
      description: 'Explore partnership opportunities',
      email: 'partners@newragrid.com.com',
      phone: '+91 (808) 77-388863',
      icon: Users,
      color: 'bg-purple-600'
    }
  ];
  const faqs = [
    {
      question: "How quickly can I get started?",
      answer:
        "Most customers are up and running within 24-48 hours of signup. Our onboarding team will guide you through the entire process.",
    },
    {
      question: "Do you offer training for my team?",
      answer:
        "Yes! We provide comprehensive training sessions, documentation, and ongoing support to ensure your team gets the most out of our platform.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We offer 24/7 technical support, dedicated customer success managers for enterprise clients, and a comprehensive knowledge base.",
    },
    {
      question: "Can I integrate this platform with other tools?",
      answer:
        "Absolutely! Our platform offers APIs and pre-built integrations with popular tools like Slack, Zapier, and Salesforce to streamline your workflow.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial for all new customers, so you can explore the platform and its features before making a commitment.",
    },
  ];
  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-800 dark:to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">


          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <motion.div
              className="flex items-center justify-center mb-3"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            <motion.h3
              className="text-5xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get In Touch
            </motion.h3>

            <motion.p
              className="text-xl text-green-100 leading-relaxed mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Ready to transform your energy management? Our team of experts is here to help
              you get started with the right solution for your organization.
            </motion.p>
          </motion.div>

        </div>
      </section>


      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card
                  className="text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 border-0 shadow-lg"
                  onClick={info.action}
                >
                  <motion.div
                    className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <info.icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{info.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{info.description}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{info.details}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">

            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl text-gray-900 mb-2">Send us a message</CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        {...register('company')}
                        placeholder="Company Name"
                      />
                      {errors.company && (
                        <p className="text-sm text-red-600">{errors.company.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select onValueChange={(value) => setValue('inquiryType', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales & Demo</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.inquiryType && (
                      <p className="text-sm text-red-600">{errors.inquiryType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Tell us about your energy management needs..."
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                  {/* <div className="flex-1 h-[500px] lg:h-auto">
                    <iframe
                      title="NewRa Grids Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.824956384787!2d75.36299561526951!3d19.887264318447153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bded8b0b0e7c111%3A0x0000000000000000!2sNewRa%20GridsH%2F40!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div> */}
                </form>
              </CardContent>
            </Card>


            <div className="space-y-8">
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl text-gray-900 mb-4">Contact Our Teams</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-6">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <dept.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{dept.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{dept.description}</p>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">{dept.email}</p>
                            <p className="text-sm font-medium text-gray-900">{dept.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl text-gray-900 mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium text-gray-900">8:00 AM - 6:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-gray-900">9:00 AM - 5:00 PM PST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium text-gray-900">Closed</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emergency Support</span>
                        <span className="font-medium text-green-600">24/7 Available</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl mb-4">Ready to get started?</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <p className="text-green-100 mb-4">
                    Book a personalized demo and see how our platform can transform
                    your energy management in just 30 minutes.
                  </p>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Schedule Demo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">

            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-500 rounded-full p-4 inline-flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Can't find what you're looking for? Contact our support team.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  {openIndex === index && (
                    <p className="text-gray-600 mt-2">{faq.answer}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              className="flex items-center justify-center mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="bg-green-500 rounded-full p-5 inline-flex items-center justify-center shadow-lg animate-pulse">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Our Location
            </h2>
            <p className="text-gray-600">
              Find us here at our office
            </p>
          </div>

          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="NewRa Grids Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.824956384787!2d75.36299561526951!3d19.887264318447153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bded8b0b0e7c111%3A0x0000000000000000!2sNewRa%20GridsH%2F40!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;