import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Disclaimer",
  description: "Important health and medical disclaimers for HealthCheck calculators.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Disclaimer
        </h1>
        <p className="text-xl text-muted-foreground">
          Important information about our health calculators
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Medical Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none dark:prose-invert">
          <p className="text-muted-foreground leading-relaxed">
            The information provided by HealthCheck and its calculators is for 
            educational purposes only and should not be considered as medical advice, 
            diagnosis, or treatment recommendations. Our BMI, calorie, and macro 
            calculators provide general estimates based on standard formulas and 
            should not replace professional medical consultation.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Not Medical Advice</h3>
              <p className="text-muted-foreground">
                The calculations and recommendations provided are general estimates 
                and may not be appropriate for everyone. Individual health needs vary 
                significantly based on medical history, current health conditions, 
                medications, and other factors.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Consult Healthcare Professionals</h3>
              <p className="text-muted-foreground">
                Before making any significant changes to your diet, exercise routine, 
                or health regimen based on our calculators, please consult with 
                qualified healthcare professionals, including your physician, 
                registered dietitian, or certified fitness trainer.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">No Warranty</h3>
              <p className="text-muted-foreground">
                While we strive for accuracy, we make no warranties about the 
                completeness, reliability, or accuracy of the information provided. 
                Use of our calculators is at your own risk.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Emergency Situations</h3>
              <p className="text-muted-foreground">
                If you have a medical emergency, please contact your local emergency 
                services immediately. Our calculators are not intended for emergency 
                health situations.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-0">
              <strong>Remember:</strong> Your health is unique to you. These tools 
              provide starting points for discussions with healthcare professionals 
              who can provide personalized advice based on your complete health picture.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}