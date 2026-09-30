import { LoginForm } from '@/components/admin/LoginForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const instant = false;

export const metadata = { title: 'Admin — Login' };

export default async function LoginPage() {
  // si ya está logueado, redirige directo al dashboard
  const session = await auth();
  if (session) redirect('/admin/dashboard');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm space-y-6 p-8 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
          <p className="text-sm text-gray-400">Ingresá para gestionar tu portfolio</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}