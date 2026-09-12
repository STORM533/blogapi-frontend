import SignupForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <SignupForm />
      </div>
    </div>
  );
}
