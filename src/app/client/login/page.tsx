import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ClientLoginPage() {
  return (
    <AuthLayout
      title="Client Login"
      subtitle="Access your client dashboard"
      footerLinks={[
        {
          text: "Are you an administrator?",
          linkText: "Admin Login",
          href: "/admin/login",
        },
      ]}
    >
      <LoginForm userType="client" />
    </AuthLayout>
  );
}
