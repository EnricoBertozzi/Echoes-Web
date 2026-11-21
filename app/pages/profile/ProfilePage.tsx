import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { ProfileDangerZone } from "~/components/organisms/profile/ProfileDangerZone";
import { ProfileDetailsForm } from "~/components/organisms/profile/ProfileDetailsForm";
import { ProfileHeader } from "~/components/organisms/profile/ProfileHeader";
import { ProfilePasswordForm } from "~/components/organisms/profile/ProfilePasswordForm";
import { ProfilePrivacySection } from "~/components/organisms/profile/ProfilePrivacySection";
import { useAuth } from "~/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Main>
      <PageTitle
        title="Meu perfil"
        description="Gerencie seus dados pessoais, senha e conta."
      />

      <div className="flex w-full max-w-5xl flex-col gap-8">
        <ProfileHeader user={user} />

        <ProfileDetailsForm />

        <ProfilePasswordForm />

        <ProfilePrivacySection />

        <ProfileDangerZone />
      </div>
    </Main>
  );
}
