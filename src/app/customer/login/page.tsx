import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function CustomerLoginPage() {
  return (
    <AuthLayout
      title="Customer Login"
      subtitle="Access your customer dashboard"
      footerLinks={[
        {
          text: "Don't have a customer account?",
          linkText: "Register here",
          href: "/customer/register",
        },
      ]}
    >
      <LoginForm userType="client" />
    </AuthLayout>
  );
}
