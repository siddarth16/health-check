import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Results",
  description: "View your calculated health metrics including BMI, daily calorie needs, and macro recommendations.",
  path: "/results",
});

export default function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Results
        </h1>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-xl text-muted-foreground">
            Provide inputs to see results.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Complete any of our health calculators to view your personalized results here.
          </p>
        </div>
      </div>
    </div>
  );
}