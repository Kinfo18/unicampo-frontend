import dynamic from 'next/dynamic';
import PublicLayout from '@/components/layout/PublicLayout';
import Link from 'next/link';

const RegisterForm = dynamic(() => import('./RegisterForm'), { ssr: false });

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <span className="text-4xl">🌿</span>
              <span className="text-2xl font-bold text-primary-700">Unicampo</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Crea tu cuenta</h1>
            <p className="text-gray-500 text-sm mt-1">Regístrate para comprar productos frescos del campo</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <RegisterForm />
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-primary-600 font-medium hover:text-primary-700">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
