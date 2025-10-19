"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, Mail, Phone, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    })

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsSuccess(false)
    }, 3000)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="bg-baymax-blue dark:bg-baymax-darkBlue p-8 text-white md:col-span-2">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="mb-8">
            We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <Mail className="h-6 w-6 mt-0.5" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-sm opacity-80">contact@sreejith0511@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="h-6 w-6 mt-0.5" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-sm opacity-80">08025618798</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-6 w-6 mt-0.5" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-sm opacity-80">
                  San Fransokyo Institute of Technology(SFIT)
                  <br />
                  San Fransokyo, KRPURAM-69420
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:col-span-3 dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`baymax-input dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.name ? "border-red-500" : ""}`}
                placeholder="Your name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`baymax-input dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.email ? "border-red-500" : ""}`}
                placeholder="Your email"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="dark:text-gray-300">
                Subject
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="baymax-input dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Subject of your message"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="dark:text-gray-300">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`min-h-[120px] rounded-2xl border-baymax-darkGray bg-baymax-gray px-4 py-2 focus:outline-none focus:ring-2 focus:ring-baymax-blue transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                  errors.message ? "border-red-500" : ""
                }`}
                placeholder="Your message"
              />
              {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
            </div>

            <Button
              type="submit"
              className="baymax-button w-full dark:bg-baymax-blue dark:hover:bg-baymax-darkBlue"
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Message Sent!
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
