
import LoginForm from "@/component/module/auth/LoginForm";

export default async function Home() {

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
