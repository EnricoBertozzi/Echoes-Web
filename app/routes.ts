import { type RouteConfig, index, prefix, layout } from "@react-router/dev/routes";

export default [
  index("pages/landing/index.tsx"),
  ...prefix("dashboard", [
    layout("pages/dashboard/layout.tsx", [
      index("pages/dashboard/devices/index.tsx")
    ])
  ])
] satisfies RouteConfig;
