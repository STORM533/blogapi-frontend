import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <LoginForm />
      </div>
    </div>
  );
}
