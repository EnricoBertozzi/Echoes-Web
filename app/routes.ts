import { type RouteConfig, index, prefix, layout, route } from "@react-router/dev/routes";

export default [
  index("pages/login/LoginPage.tsx"),
  route("mfa", "pages/login/MfaPage.tsx"),
  route("register", "pages/register/index.tsx"),
  route("password/forgot", "pages/login/PasswordForgotPage.tsx"),
  route("password/validate", "pages/login/PasswordValidCodePage.tsx"),
  route("password/reset", "pages/login/PasswordResetPage.tsx"),
  route("unathorized", "pages/UnathorizedPage.tsx"),
  route("forbidden", "pages/ForbiddenPage.tsx"),
  ...prefix("dashboard", [
    layout("pages/dashboard/Layout.tsx", [
      index("pages/dashboard/devices/index.tsx"),
      route("audit", "pages/dashboard/audit/index.tsx"),
      route("settings", "pages/dashboard/settings/index.tsx"),
      layout("components/atoms/auth/AdminLayout.tsx", [
        route("terms", "pages/dashboard/terms/index.tsx"),
      ]),
      route("school", "pages/dashboard/school/index.tsx"),
      route("school/new", "pages/dashboard/school/new/index.tsx"),
      route("school/:institutionId", "pages/dashboard/school/institution/index.tsx"),
      route("school/:institutionId/edit", "pages/dashboard/school/institution/edit/index.tsx"),
      route("users", "pages/dashboard/users/UsersPage.tsx"),
      route("scene", "pages/dashboard/scene/index.tsx"),
      route("scene/:animalId", "pages/dashboard/scene/animal/index.tsx"),
    ])
  ])

] satisfies RouteConfig; 
