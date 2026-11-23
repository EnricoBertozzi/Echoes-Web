import {
  type RouteConfig,
  index,
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
      route(
        "institutions/:institutionId",
        "pages/institutions/InstitutionInfoPage.tsx",
      ),

      route("devices", "pages/devices/Devices.tsx"),

      route("dashboard", "pages/dashboard/Overview.tsx"),

      route("audit", "pages/audit/Audit.tsx"),

      route(
        "institutions/:institutionId/users",
        "pages/users/InstitutionUsersPage.tsx",
      ),

      route(
        "institutions/:institutionId/classrooms",
        "pages/classrooms/ClassroomsPage.tsx",
      ),

      route(
        "institutions/:institutionId/classrooms/:classroomId",
        "pages/classrooms/ClassroomInfoPage.tsx",
      ),

      route(
        "institutions/:institutionId/edit",
        "pages/institutions/InstitutionEditPage.tsx",
      ),
    ]),

    // TEACHER e STUDENT: as turmas em que participam
    layout("layouts/ClassroomMemberLayout.tsx", [
      route("classrooms", "pages/classrooms/MyClassroomsPage.tsx"),

      route(
        "classrooms/:classroomId",
        "pages/classrooms/ClassroomWorkspacePage.tsx",
      ),
    ]),

    layout("layouts/AdminLayout.tsx", [
      route("audit/restorations", "pages/audit/Restorations.tsx"),

      route("audit/restorations/:type/:id", "pages/audit/RestorationDetails.tsx"),

      route("institutions", "pages/institutions/InstitutionsPage.tsx"),

      route("institutions/new", "pages/institutions/InstitutionNewPage.tsx"),

      route("users/admins", "pages/users/AdminUsersPage.tsx"),

      route("animals", "pages/animals/AnimalsPage.tsx"),

      route("animals/:animalId", "pages/animals/AnimalInfoPage.tsx"),
    ]),

    layout("layouts/ManagerLayout.tsx", []),

    route("terms", "pages/terms/index.tsx"),

    route("profile", "pages/profile/ProfilePage.tsx"),

    route(
      "devices/:deviceId/scenarios",
      "pages/devices/DeviceScenariosPage.tsx",
    ),

    route("institutions/:institutionId/devices", "pages/institutions/InstitutionDevicesPage.tsx"),
  ]),
] satisfies RouteConfig;
