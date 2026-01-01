'use client';

import React, { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // TODO: Implement actual form submission
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setSubmitting(false);
        }, 1000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const whatsappNumber = '+919876543210';
    const whatsappMessage = 'Hello! I have a question about your products.';

    return (
        <div>
            {/* Hero */}
            <section className="section-padding bg-gradient-to-br from-gold-50 to-maroon-50">
                <div className="container-custom text-center">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                        Get in <span className="gradient-text">Touch</span>
                    </h1>
                    <div className="gold-divider"></div>
                    <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
                        We'd love to hear from you. Reach out with any questions or inquiries.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <Card>
                                <CardBody>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-gold-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Email Us</h3>
                                            <p className="text-gray-600">info@megaartsstore.com</p>
                                            <p className="text-gray-600">support@megaartsstore.com</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Call Us</h3>
                                            <p className="text-gray-600">+91 98765 43210</p>
                                            <p className="text-sm text-gray-500">Mon-Sat, 10 AM - 7 PM IST</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-maroon-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Visit Us</h3>
                                            <p className="text-gray-600">
                                                123 Heritage Lane<br />
                                                Jaipur, Rajasthan 302001<br />
                                                India
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                                <CardBody>
                                    <div className="flex items-center space-x-4">
                                        <MessageCircle className="w-12 h-12" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-2">Chat on WhatsApp</h3>
                                            <a
                                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-white text-emerald-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                                            >
                                                Start Chat
                                            </a>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardBody>
                                    <h2 className="text-3xl font-serif font-bold mb-6">Send us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Your Name"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                            />
                                            <Input
                                                label="Email Address"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Phone Number"
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 98765 43210"
                                            />
                                            <Input
                                                label="Subject"
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                placeholder="Product Inquiry"
                                            />
                                        </div>

                                        <Textarea
                                            label="Message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder="Tell us how we can help you..."
                                        />

                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full md:w-auto"
                                        >
                                            {submitting ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section className="section-padding bg-gray-100">
                <div className="container-custom">
                    <Card>
                        <CardBody className="p-0">
                            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227748.3825624477!2d75.65046970458873!3d26.88514139469916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </section>
        </div>
    );
}
