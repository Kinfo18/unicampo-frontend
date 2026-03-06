'use client';

import dynamic from 'next/dynamic';

const RegisterForm = dynamic(() => import('./RegisterForm'), {
  ssr: false,
  loading: () => (
    <div className="space-y-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  ),
});

export default function RegisterFormWrapper() {
  return <RegisterForm />;
}
