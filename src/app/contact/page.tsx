"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Twitter } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { LottieIcon } from "@/components/LottieIcon";
import { handleApiError, submitContactForm } from "@/lib/api";
import type { ContactFormData } from "@/lib/api";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "akashvis42@gmail.com",
    href: "mailto:akashvis42@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 7275053155",
    href: "tel:+91 7275053155",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kanpur, IN",
    href: null,
  },
];

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Akash-Vishwakarma-dev",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/vishwakarma-akash",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com/Er_akash__",
  },
];

function ContactContent() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
        setShowSuccess(true);
        toast.success(result.message || "Message sent successfully! I'll get back to you soon.");
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });

        // Hide success animation after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      const message = handleApiError(error);
      toast.error(message || "Failed to send message. Please try again or email me directly.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.subject.trim() !== "" &&
    formData.message.trim() !== "";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-card/50 to-transparent py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-4 font-heading text-5xl font-bold md:text-6xl">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Have a project in mind or just want to say hi? I'd love to hear from you.
              Fill out the form below or reach out through any of the channels listed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <Section>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium"
                    >
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project or inquiry..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <MagneticButton>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LottieIcon name="loader" size={20} className="mr-2" />
                          Sending...
                        </>
                      ) : showSuccess ? (
                        <>
                          <LottieIcon name="success" size={20} className="mr-2" />
                          Sent!
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </MagneticButton>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info & Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Contact Information */}
              <Card className="p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium transition-colors hover:text-primary"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-8">
                <h2 className="mb-6 font-heading text-2xl font-bold">
                  Connect with Me
                </h2>

                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <MagneticButton key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-lg bg-card transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    </MagneticButton>
                  ))}
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  I'm most active on GitHub and LinkedIn. Feel free to connect
                  and let's collaborate on something amazing!
                </p>
              </Card>

              {/* Availability */}
              <Card className="border-primary/20 bg-primary/5 p-6">
                <h3 className="mb-2 font-semibold">Currently Available</h3>
                <p className="text-sm text-muted-foreground">
                  I'm open to freelance projects, consulting opportunities, and
                  full-time positions. Let's discuss how we can work together!
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading contact page...</p>
        </div>
      </div>
    }>
      <ContactContent />
    </Suspense>
  );
}
