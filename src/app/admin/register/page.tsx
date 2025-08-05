import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function AdminRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80">
            TaxingCRM
          </Link>
        </div>
        
        <RegisterForm userType="admin" />
        
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an admin account?{' '}
            <Link href="/admin/login" className="font-medium text-primary hover:text-primary/80">
              Sign in here
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <Link href="/client/register" className="font-medium text-primary hover:text-primary/80">
              Client Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
