import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false);

    const phoneNumber = "8087388863";
    const defaultMessage =
        "Hi! I'm interested in NewRa Grid services. Can we discuss my project requirements?";

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 no-print">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4"
                    >
                        <Card className="w-80 mvad-glass shadow-2xl border-0">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                            <FaWhatsapp className="h-6 w-6 text-white" />
                                        </div>
                                        Start a conversation
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsOpen(false)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Hi there! 👋 How can we help you today? Click below to start a WhatsApp conversation with our team.
                                </p>
                                <Button
                                    onClick={handleWhatsAppClick}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                                    size="sm"
                                >
                                    <FaWhatsapp className="mr-2 h-16 w-16" />
                                    Chat on WhatsApp
                                </Button>
                                <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                                    Usually replies within 1 hour
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
            >
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="size-10 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl hover:shadow-green-500/25 p-0 flex justify-center items-center"
                    aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
                >
                    {isOpen ? <X className="h-9 w-9" /> : <FaWhatsapp size={25} className="" />}
                </div>
            </motion.div>
        </div>
    );
}
