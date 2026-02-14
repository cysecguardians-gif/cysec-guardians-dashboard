// livePriority.js
// Data priority configuration

export const LIVE_PRIORITY = {
  HIGH: [
    {
      key: "dashboard_summary",
      url: "/dashboard/summary"
    },
    {
      key: "phishing_campaigns",
      url: "/phishing/campaigns"
    }
  ],

  MEDIUM: [
    {
      key: "phishing_trend",
      url: "/analytics/phishing-trend"
    }
  ],

  LOW: [
    {
      key: "department_risk",
      url: "/analytics/department-risk"
    }
  ]
};
