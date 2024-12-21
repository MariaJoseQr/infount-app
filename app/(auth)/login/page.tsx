import LoginForm from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex justify-around items-center h-screen bg-secondary">
      <div className="flex justify-center items-center min-w-96">
        <LoginForm />
      </div>
    </main>
  );
}
