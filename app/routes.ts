import {
  type RouteConfig,
  index,
  prefix,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("pages/login/LoginPage.tsx"),
  route("mfa", "pages/login/MfaPage.tsx"),
  route("register", "pages/register/index.tsx"),
  route("unathorized", "pages/UnathorizedPage.tsx"),
  route("forbidden", "pages/ForbiddenPage.tsx"),
  route("password/forgot", "pages/password/PasswordForgotPage.tsx"),
  route("password/validate", "pages/password/PasswordValidCodePage.tsx"),
  route("password/reset", "pages/password/PasswordResetPage.tsx"),

  layout("layouts/Layout.tsx", [
    layout("layouts/StaffLayout.tsx", [
      route("institutions/:institutionId", "pages/institutions/institution/index.tsx"),
      route("dashboard", "pages/dashboard/Overview.tsx"),
      route("institutions/:institutionId/users", "pages/users/InstitutionUsersPage.tsx"),
      route("institutions/:institutionId/edit", "pages/institutions/institution/edit/index.tsx"),
    ]),
    layout("layouts/AdminLayout.tsx", [
      route("institutions", "pages/institutions/InstitutionsPage.tsx"),
      route("institutions/new", "pages/institutions/new/index.tsx"),
      route("users/admins", "pages/users/AdminUsersPage.tsx"),
      route("devices", "pages/devices/Devices.tsx"),
      route("audit", "pages/audit/Audit.tsx"),
      route("animals", "pages/animals/AnimalsPage.tsx"),
      route("animals/:animalId", "pages/animals/AnimalInfoPage.tsx"),
    ]),
    layout("layouts/ManagerLayout.tsx", [
      
    ]),
    route("terms", "pages/terms/index.tsx"),
  ]),
] satisfies RouteConfig;
