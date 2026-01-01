'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: 'What are your shipping options?',
        answer: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders above ₹999.'
    },
    {
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of delivery. Items must be unused and in original packaging. Customized items cannot be returned.'
    },
    {
        question: 'Do you offer Cash on Delivery (COD)?',
        answer: 'Yes, we offer COD for orders within India. A small COD fee may apply depending on your location.'
    },
    {
        question: 'Can I customize my order?',
        answer: 'Yes! Many of our products can be customized. Look for the "Customize" option on product pages. Customization may take additional 3-5 business days.'
    },
    {
        question: 'How do I track my order?',
        answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order from your account dashboard.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards, UPI, net banking, and popular digital wallets through Razorpay. Cash on Delivery is also available.'
    },
    {
        question: 'How do I care for my jewelry?',
        answer: 'Store in a dry place, avoid contact with water and chemicals. Clean gently with a soft cloth. Detailed care instructions are included with each order.'
    },
    {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within India. International shipping will be available soon.'
    },
    {
        question: 'How can I contact customer support?',
        answer: 'You can reach us via email at support@megaartsstore.com or call us at +91-XXXXXXXXXX during business hours (10 AM - 6 PM IST).'
    },
    {
        question: 'Are your products handmade?',
        answer: 'Yes, most of our products are handcrafted by skilled artisans. Each piece is unique and may have slight variations.'
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Find answers to common questions about our products and services
                    </p>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-gray-900 pr-4">
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-center text-white"
                >
                    <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
                    <p className="mb-6 opacity-90">
                        Our customer support team is here to help you
                    </p>
                    <a
                        href="mailto:support@megaartsstore.com"
                        className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
