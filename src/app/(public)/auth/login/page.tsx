import PublicLayout from '@/components/layout/PublicLayout';
import Link from 'next/link';
import LoginFormWrapper from './LoginFormWrapper';

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <span className="text-4xl">🌿</span>
              <span className="text-2xl font-bold text-primary-700">Unicampo</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Bienvenido de nuevo</h1>
            <p className="text-gray-500 text-sm mt-1">Ingresa a tu cuenta para continuar</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <LoginFormWrapper />
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/registro" className="text-primary-600 font-medium hover:text-primary-700">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
