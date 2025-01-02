import { useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.name}</p>
        <p>Most Used Programming Language: {session.user.mostUsedLanguage ?? "Not available"}</p> {/* Use nullish coalescing to provide a fallback */}
      </div>
    );
  }

  return <p>Please sign in</p>;
};

export default UserProfile;