import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function AdminRegisterPage() {
  return (
    <AuthLayout
      title="Register as an Admin"
      subtitle=""
      footerLinks={[
        {
          text: "Already have an admin account?",
          linkText: "Sign in here",
          href: "/admin/login",
        },
        {
          text: "Are you a client?",
          linkText: "Client Login",
          href: "/client/login",
        },
      ]}
    >
      <RegisterForm userType="admin" />
    </AuthLayout>
  );
}
