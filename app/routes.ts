import { type RouteConfig, index, prefix, layout, route } from "@react-router/dev/routes";

export default [
  index("pages/landing/Lading.tsx"),
  route("mfa", "pages/landing/MfaPage.tsx"),
  route("register", "pages/register/index.tsx"),
  route("password/forgot", "pages/landing/PasswordForgot.tsx"),
  route("password/validate", "pages/landing/PasswordValidCode.tsx"),
  route("password/reset", "pages/landing/PasswordReset.tsx"),
  ...prefix("dashboard", [
    layout("pages/dashboard/layout.tsx", [
      index("pages/dashboard/devices/index.tsx"),
      route("terms", "pages/dashboard/terms/index.tsx"),
      route("audit", "pages/dashboard/audit/index.tsx"),
      route("settings", "pages/dashboard/settings/index.tsx"),
      route("school", "pages/dashboard/school/index.tsx"),
      route("school/new", "pages/dashboard/school/new/index.tsx"),
      route("school/:institutionId", "pages/dashboard/school/institution/index.tsx"),
      route("school/:institutionId/edit", "pages/dashboard/school/institution/edit/index.tsx"),
      route("users", "pages/dashboard/users/index.tsx"),
      route("scene", "pages/dashboard/scene/index.tsx"),
      route("scene/:animalId", "pages/dashboard/scene/animal/index.tsx"),
    ])
  ])
] satisfies RouteConfig; 
