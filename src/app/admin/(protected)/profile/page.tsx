import { getProfile, updateProfile } from '@/actions/profile';
import { ProfileForm } from '@/components/admin/ProfileForm';

export const metadata = { title: 'Admin — Perfil' };

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">
          Esta información se muestra en la sección &quot;Sobre mí&quot; del portfolio.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <ProfileForm profile={profile} action={updateProfile} />
      </div>
    </div>
  );
}
