# Illustration assets

When you commission real illustrations, drop PNGs here following this layout:

```
public/illustrations/
├── real-feed/
│   ├── ai-office.png
│   ├── market-competition.png
│   ├── wechat-meeting.png
│   ├── crypto-risk.png
│   ├── dutyfree-customer.png
│   ├── hotel-pricing.png
│   ├── airport-traffic.png
│   ├── slang-register.png
│   ├── trust-reliability.png
│   └── music-rhythm.png
├── domain-packs/
│   ├── business-negotiation.png
│   ├── crypto-exchange.png
│   ├── airport-retail.png
│   ├── hotel-operations.png
│   └── ai-productivity.png
└── flashcards/
    ├── baojia.png
    ├── fengxian.png
    ├── ruzhulv.png
    ├── lvkeliuliang.png
    └── hezuo.png
```

Then set `imageSrc` on the matching entry in `data/localIllustrations.ts`.
The Visual layer auto-prefers `imageSrc` over the CSS/SVG scene fallback.

All prompts are stored in `data/localIllustrations.ts` and in each Real
Feed item's `visual.illustrationPrompt`. Every prompt explicitly says
"no text, no logos, no artist likeness".
