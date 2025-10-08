import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";

export default function CustomerRegisterPage() {
  return (
    <AuthLayout
      title="Create Customer Account"
      subtitle="Join our platform as a customer"
      footerLinks={[
        {
          text: "Already have a customer account?",
          linkText: "Sign in here",
          href: "/customer/login",
        },
      ]}
    >
      <RegisterForm userType="client" />
    </AuthLayout>
  );
}
