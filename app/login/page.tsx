import { LoginForm, LoginHeader, LoginDemoInfo, LoginFooter } from "@/modules/auth/components/auth-components"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <LoginHeader />
          <LoginForm />
          <LoginDemoInfo />
        </div>
        <LoginFooter />
      </div>
    </div>
  )
}
