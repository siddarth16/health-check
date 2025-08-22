# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "HealthCheck" [ref=e4] [cursor=pointer]:
        - /url: /
      - navigation [ref=e5]:
        - link "Home" [ref=e6] [cursor=pointer]:
          - /url: /
        - button "Calculators" [ref=e7]:
          - text: Calculators
          - img
        - link "Health Check" [active] [ref=e8] [cursor=pointer]:
          - /url: /health-check
        - link "Pricing" [ref=e9] [cursor=pointer]:
          - /url: /pricing
  - main [ref=e10]:
    - generic [ref=e12]:
      - heading "Health Check" [level=1] [ref=e13]
      - paragraph [ref=e14]: Get a comprehensive overview of your health metrics by combining BMI assessment, daily calorie needs, and optimal macro distribution. This integrated health check provides personalized insights to help you make informed decisions about your nutrition and wellness journey.
  - contentinfo [ref=e16]:
    - generic [ref=e18]:
      - paragraph [ref=e19]: © 2024 HealthCheck. All rights reserved.
      - navigation [ref=e20]:
        - link "Disclaimer" [ref=e21] [cursor=pointer]:
          - /url: /disclaimer
  - alert [ref=e22]: Health Check | HealthCheck
```