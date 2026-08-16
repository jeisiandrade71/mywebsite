import type { ReactNode } from "react";
import { auth, signOut } from "@/auth";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administradora",
  teamLead: "Chefe de Equipe",
  helper: "Helper",
};

export default async function TeamLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <div className="min-h-screen bg-zinc-50 dark:bg-black">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <div>
          <span className="font-semibold text-black dark:text-white">
            J&amp;A Cleaning Group
          </span>
          <span className="ml-2 text-sm text-zinc-500">
            {ROLE_LABELS[session.user.role] || session.user.role}
          </span>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/team/login" });
          }}
        >
          <button
            type="submit"
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-white"
          >
            Sair ({session.user.email})
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
