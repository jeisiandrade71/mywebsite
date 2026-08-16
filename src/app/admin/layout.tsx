import type { ReactNode } from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AdminLayout({
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
        <nav className="flex gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/admin" className="hover:text-black dark:hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/services" className="hover:text-black dark:hover:text-white">
            Serviços
          </Link>
          <Link href="/admin/conversations" className="hover:text-black dark:hover:text-white">
            Conversas
          </Link>
          <Link href="/admin/bookings" className="hover:text-black dark:hover:text-white">
            Agenda
          </Link>
          <Link href="/admin/settings" className="hover:text-black dark:hover:text-white">
            Configurações
          </Link>
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="text-sm text-zinc-500 hover:text-black dark:hover:text-white"
          >
            Sair ({session.user?.email})
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
