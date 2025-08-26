import { createMetadata } from "@/lib/seo";
import { HealthCheckForm } from "@/components/health/HealthCheckForm";

export const metadata = createMetadata({
  title: "Health Check",
  description: "Comprehensive health assessment using your BMI, calorie needs, and macro balance for personalized wellness insights.",
  path: "/health-check",
});

export default function HealthCheckPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Health</span>{" "}
            <span className="text-neon">
              Check
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Get a comprehensive overview of your health metrics by combining BMI assessment, 
            daily calorie needs, and optimal macro distribution. This integrated health check 
            provides personalized insights to help you make informed decisions about your 
            nutrition and wellness journey.
          </p>
        </div>
        
        <HealthCheckForm />
      </div>
    </div>
  );
}