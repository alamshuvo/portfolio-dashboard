import LoginForm from "@/component/module/auth/LoginForm";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.user?.accessToken;

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {accessToken ? (
        <Link href="/admin">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Go to Admin Panel
          </button>
        </Link>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

