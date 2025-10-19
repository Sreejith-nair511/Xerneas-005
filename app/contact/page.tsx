import ContactForm from "@/components/contact-form"
import ParticleBackground from "@/components/particle-background"
import InteractiveGif from "@/components/interactive-gif"

export const metadata = {
  title: "Contact | Baymax - Your Personal Healthcare Companion",
  description: "Contact the Baymax team for any questions or support.",
}

export default function ContactPage() {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-baymax-lightBlue dark:bg-gray-800 relative overflow-hidden">
      <ParticleBackground />
      <div className="baymax-container relative z-10">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to the Baymax team and we'll get back to you as soon as
            possible.
          </p>
          <div className="flex justify-center mt-6">
            <div className="relative w-32 h-32">
              <InteractiveGif
                src="/images/tadashi-thumbs-up.gif"
                alt="Baymax giving thumbs up"
                width={128}
                height={128}
                floating={true}
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto animate-slideUp">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}