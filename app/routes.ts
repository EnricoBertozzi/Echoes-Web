import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("pages/landing/index.tsx"),
  layout("pages/dashboard/layout.tsx", [
    route("dashboard/school", "pages/dashboard/school/index.tsx"),
    route("dashboard/devices", "pages/dashboard/devices/index.tsx"),
    route("dashboard/scene", "pages/dashboard/scene/index.tsx"),
    route("dashboard/users", "pages/dashboard/users/index.tsx"),
    route("dashboard/terms", "pages/dashboard/terms/index.tsx"),
    route("dashboard/audit", "pages/dashboard/audit/index.tsx"),
    route("dashboard/settings", "pages/dashboard/settings/index.tsx"),
  ]),
] satisfies RouteConfig;
