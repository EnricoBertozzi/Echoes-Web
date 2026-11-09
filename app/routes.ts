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
  route("password/forgot", "pages/login/PasswordForgotPage.tsx"),
  route("password/validate", "pages/login/PasswordValidCodePage.tsx"),
  route("password/reset", "pages/login/PasswordResetPage.tsx"),
  route("unathorized", "pages/UnathorizedPage.tsx"),
  route("forbidden", "pages/ForbiddenPage.tsx"),
  ...prefix("dashboard", [
    layout("pages/dashboard/Layout.tsx", [
      layout("components/atoms/auth/AdminLayout.tsx", [
        route("admins", "pages/dashboard/users/AdminUsersPage.tsx"),
        route("schools", "pages/dashboard/school/Schools.tsx"),
        route("devices", "pages/dashboard/devices/Devices.tsx"),
        route("audit", "pages/dashboard/audit/Audit.tsx"),
      ]),
      layout("components/atoms/auth/ManagerLayout.tsx", [
        route(
          "users/:institutionId",
          "pages/dashboard/users/InstitutionUsersPage.tsx",
        ),
      ]),
      layout("components/atoms/auth/StaffLayout.tsx", [
        route("overview", "pages/dashboard/overview/Overview.tsx"),
      ]),
      route("terms", "pages/dashboard/terms/index.tsx"),
      route("school/new", "pages/dashboard/school/new/index.tsx"),
      route(
        "school/:institutionId",
        "pages/dashboard/school/institution/index.tsx",
      ),
      route(
        "school/:institutionId/edit",
        "pages/dashboard/school/institution/edit/index.tsx",
      ),
      route("scene", "pages/dashboard/scene/index.tsx"),
      route("scene/:animalId", "pages/dashboard/scene/animal/index.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
