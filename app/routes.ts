import { type RouteConfig, index, prefix, layout, route } from "@react-router/dev/routes";

export default [
  index("pages/landing/index.tsx"),
  ...prefix("dashboard", [
    layout("pages/dashboard/layout.tsx", [
      index("pages/dashboard/devices/index.tsx"),
      route("terms", "pages/dashboard/terms/index.tsx"),
      route("audit", "pages/dashboard/audit/index.tsx"),
      route("settings", "pages/dashboard/settings/index.tsx"),
      route("school", "pages/dashboard/school/index.tsx"),
      route("users", "pages/dashboard/users/index.tsx"),
      route("scene", "pages/dashboard/scene/index.tsx"),
      route("scene/:animalId", "pages/dashboard/scene/animal/index.tsx"),
    ])
  ])
] satisfies RouteConfig;
