import { auth } from "./auth";
import Main from "@/components/main-content/main";
import { SessionProvider } from "@/components/SessionProvider/sessionProvider";
import UserProfile from "@/components/UserProfile";

export default async function Home() {
  const session = await auth();

  return (
    <SessionProvider initialData={session}>
      <main>
        <UserProfile />
        <Main />
      </main>
    </SessionProvider>
  );
}