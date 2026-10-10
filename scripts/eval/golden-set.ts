import { BrainRecord } from "@/lib/types";

export interface GoldenTestCase {
  id: string;
  question: string;
  expectedSections: string[];
  expectedKeywords: string[];
  fixtureBrain: BrainRecord;
}

export const FIXTURE_BRAIN_AGENCY: BrainRecord = {
  meta: {
    id: "fixture-agency-01",
    businessName: "Acme Digital Agency",
    businessType: "agency",
    generatedAt: new Date().toISOString(),
    sessionDuration: 15,
  },
  knowledge: {
    operatingModel: "B2B digital marketing agency offering retainer-based SEO and PPC management.",
    clientProfile: "Mid-market e-commerce brands with $1M-$10M ARR.",
    pricingModel: "Monthly retainer starting at $3,500/month plus 5% of ad spend.",
    teamStructure: "Account Director, SEO Lead, PPC Lead, Content Writer.",
    keyMetrics: ["Client LTV", "Monthly Churn Rate (<2%)", "RoAS (>4.0x)"],
  },
  processes: [
    {
      id: "p1",
      name: "Client Onboarding",
      owner: "Account Director",
      trigger: "Signed contract and deposit paid",
      decisionPoints: ["Access granted to ad accounts", "Kickoff call scheduled"],
      steps: [
        { order: 1, action: "Send onboarding questionnaire", owner: "Account Director", output: "Completed intake form" },
        { order: 2, action: "Audit ad accounts & analytics", owner: "PPC Lead", output: "Audit report" },
      ],
    },
  ],
  judgment: {
    qualityCriteria: "All ad copy must pass brand voice guideline check and receive double-approval.",
    hardRules: [
      "Never launch ad campaigns without explicit client budget sign-off in writing.",
      "Discounts above 15% require Founder approval.",
    ],
    scoringFramework: "Monthly client health score evaluated on 1-10 scale based on RoAS and response time.",
    approvalRequired: ["Custom client pricing", "Contract scope changes", "Ad spend budget increases >20%"],
  },
  skills: [
    {
      name: "ad_account_audit",
      description: "Perform comprehensive PPC and SEO account audit.",
      inputs: ["Google Ads Account ID", "GA4 Access"],
      outputs: ["Audit PDF Report", "Action Item List"],
      steps: ["Check conversion tracking", "Review keyword match types", "Analyze negative keyword list"],
    },
  ],
  markdown: {
    knowledge_md: `# KNOWLEDGE.md - Acme Digital Agency\n\n## Operating Model\nB2B digital marketing agency offering retainer-based SEO and PPC management.\n\n## Client Profile\nMid-market e-commerce brands with $1M-$10M ARR.\n\n## Pricing Model\nMonthly retainer starting at $3,500/month plus 5% of ad spend.\n\n## Team Structure\nAccount Director, SEO Lead, PPC Lead, Content Writer.\n\n## Key Metrics\n- Client LTV\n- Monthly Churn Rate (<2%)\n- RoAS (>4.0x)`,
    processes_md: `# PROCESSES.md - Acme Digital Agency\n\n## Client Onboarding Workflow\n- Owner: Account Director\n- Trigger: Signed contract and deposit paid\n- Step 1: Send onboarding questionnaire\n- Step 2: Audit ad accounts & analytics`,
    judgment_md: `# JUDGMENT.md - Acme Digital Agency\n\n## Hard Rules\n- Never launch ad campaigns without explicit client budget sign-off in writing.\n- Discounts above 15% require Founder approval.\n\n## Approvals Required\n- Custom client pricing\n- Contract scope changes\n- Ad spend budget increases >20%`,
  },
};

export const GOLDEN_SET: GoldenTestCase[] = [
  {
    id: "eval-01",
    question: "Who must approve discounts over 15%?",
    expectedSections: ["JUDGMENT.md"],
    expectedKeywords: ["Founder", "15%"],
    fixtureBrain: FIXTURE_BRAIN_AGENCY,
  },
  {
    id: "eval-02",
    question: "What is the starting monthly retainer price?",
    expectedSections: ["KNOWLEDGE.md"],
    expectedKeywords: ["$3,500", "retainer"],
    fixtureBrain: FIXTURE_BRAIN_AGENCY,
  },
  {
    id: "eval-03",
    question: "What is the trigger for starting the Client Onboarding workflow?",
    expectedSections: ["PROCESSES.md"],
    expectedKeywords: ["Signed contract", "deposit"],
    fixtureBrain: FIXTURE_BRAIN_AGENCY,
  },
  {
    id: "eval-04",
    question: "Can we launch ad campaigns without written client budget sign-off?",
    expectedSections: ["JUDGMENT.md"],
    expectedKeywords: ["Never", "sign-off"],
    fixtureBrain: FIXTURE_BRAIN_AGENCY,
  },
];
