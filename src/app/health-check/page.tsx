import { createMetadata } from "@/lib/seo";
import { HealthCheckForm } from "@/components/health/HealthCheckForm";

export const metadata = createMetadata({
  title: "Health Check",
  description: "Comprehensive health assessment using your BMI, calorie needs, and macro balance for personalized wellness insights.",
  path: "/health-check",
});

export default function HealthCheckPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Health Check
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Get a comprehensive overview of your health metrics by combining BMI assessment, 
          daily calorie needs, and optimal macro distribution. This integrated health check 
          provides personalized insights to help you make informed decisions about your 
          nutrition and wellness journey.
        </p>
      </div>
      
      <HealthCheckForm />
    </div>
  );
}