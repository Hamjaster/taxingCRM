import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function AdminLoginPage() {
  return (
    <AuthLayout
      title="Admin Login"
      subtitle="Access your administrator dashboard"
      footerLinks={[
        {
          text: "Don't have an admin account?",
          linkText: "Register here",
          href: "/admin/register",
        },
        {
          text: "Looking for client login?",
          linkText: "Client Login",
          href: "/client/login",
        },
      ]}
    >
      <LoginForm userType="admin" />
    </AuthLayout>
  );
}
