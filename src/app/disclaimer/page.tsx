import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Disclaimer",
  description: "Important health and medical disclaimers for HealthCheck calculators.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-transparent bg-gradient-to-r from-neon-secondary to-neon-purple bg-clip-text">
              Disclaimer
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Important information about our health calculators
          </p>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-foreground">Medical Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none dark:prose-invert text-base">
          <p className="text-muted-foreground leading-relaxed">
            The information provided by HealthCheck and its calculators is for 
            educational purposes only and should not be considered as medical advice, 
            diagnosis, or treatment recommendations. Our BMI, calorie, and macro 
            calculators provide general estimates based on standard formulas and 
            should not replace professional medical consultation.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Medical Disclaimer</h3>
              <p className="text-muted-foreground">
                The calculations and recommendations provided are general estimates 
                and may not be appropriate for everyone. Individual health needs vary 
                significantly based on medical history, current health conditions, 
                medications, age, pregnancy status, metabolic disorders, and other factors. 
                These tools should never replace professional medical advice.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Calculator Limitations</h3>
              <p className="text-muted-foreground">
                Our calculators use established scientific formulas (such as the Mifflin-St Jeor 
                equation for BMR) that provide reasonable estimates for most adults. However, 
                these formulas may be less accurate for certain populations including athletes 
                with high muscle mass, elderly individuals, those with metabolic conditions, 
                or people taking medications that affect metabolism.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Consult Healthcare Professionals</h3>
              <p className="text-muted-foreground">
                Before making any significant changes to your diet, exercise routine, 
                or health regimen based on our calculators, please consult with 
                qualified healthcare professionals, including your physician, 
                registered dietitian, or certified fitness trainer. This is especially 
                important if you have pre-existing health conditions, take medications, 
                are pregnant or nursing, or have a history of eating disorders.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">No Liability & Warranty</h3>
              <p className="text-muted-foreground">
                While we strive for accuracy in our calculations and educational content, 
                we make no warranties about the completeness, reliability, or accuracy 
                of the information provided. HealthCheck, its creators, and affiliates 
                are not liable for any damages or health issues that may result from 
                using this information. Use of our calculators is at your own risk.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Emergency Situations</h3>
              <p className="text-muted-foreground">
                If you have a medical emergency, please contact your local emergency 
                services immediately (such as 911 in the US, 999 in the UK, or 112 in Europe). 
                Our calculators are not intended for emergency health situations or 
                acute medical conditions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Special Populations</h3>
              <p className="text-muted-foreground">
                These calculators are designed for healthy adults aged 18-65. They may 
                not be appropriate for children, adolescents, elderly individuals, 
                pregnant or breastfeeding women, competitive athletes, or individuals 
                with medical conditions such as diabetes, eating disorders, thyroid 
                conditions, or other metabolic disorders.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Privacy</h3>
              <p className="text-muted-foreground">
                We do not store or transmit your personal health data entered into our 
                calculators. All calculations are performed in your browser for privacy. 
                However, we recommend not using these tools on shared or public computers 
                if privacy is a concern.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950/20 dark:border-amber-900">
            <p className="text-sm text-amber-800 dark:text-amber-200 mb-0">
              <strong>Important:</strong> Your health is unique to you. These tools 
              provide educational starting points for discussions with healthcare professionals 
              who can provide personalized advice based on your complete health picture, 
              medical history, and individual circumstances. Never ignore professional 
              medical advice or delay seeking treatment because of information from this website.
            </p>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            <p>Last updated: August 2024</p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}