import HealthCheckForm from "@/components/health-check-form"
import ParticleBackground from "@/components/particle-background"
import InteractiveGif from "@/components/interactive-gif"

export const metadata = {
  title: "AI Health Check | Tadashi AI - Your Personal Healthcare Companion",
  description: "Complete an AI-powered health check with Tadashi AI to get personalized health recommendations.",
}

export default function HealthCheckPage() {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 relative overflow-hidden">
      <ParticleBackground />
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">AI Health Check</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete this quick health assessment to receive AI-powered personalized health recommendations from Tadashi AI.
            You can also ask follow-up questions about your health concerns.
          </p>
          <div className="flex justify-center mt-6">
            <div className="relative w-32 h-32">
              <InteractiveGif
                src="/images/tadashi-caring.gif"
                alt="Tadashi AI caring"
                width={128}
                height={128}
                floating={true}
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto animate-slideUp">
          <HealthCheckForm />
        </div>
      </div>
    </div>
  )
}