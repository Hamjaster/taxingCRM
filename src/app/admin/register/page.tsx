import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function AdminRegisterPage() {
  return (
    <AuthLayout
      title="Create Admin Account"
      subtitle=""
      footerLinks={[
        {
          text: "Already have an admin account?",
          linkText: "Sign in here",
          href: "/admin/login",
        },
        {
          text: "Looking for client registration?",
          linkText: "Client Registration",
          href: "/client/register",
        },
      ]}
    >
      <RegisterForm userType="admin" />
    </AuthLayout>
  );
}
