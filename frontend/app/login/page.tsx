import AuthCard from "../components/Auth/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e10]">
      <AuthCard mode="login" />
    </div>
  );
}