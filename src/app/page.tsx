import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ClientRegisterPage() {
  return (
    <AuthLayout
      title="Register as a Client"
      subtitle=""
      footerLinks={[
        {
          text: "Already have a client account?",
          linkText: "Sign in here",
          href: "/client/login",
        },
        {
          text: "Are you an administrator?",
          linkText: "Admin Registration",
          href: "/admin/register",
        },
      ]}
    >
      <RegisterForm userType="client" />
    </AuthLayout>
  );
}
