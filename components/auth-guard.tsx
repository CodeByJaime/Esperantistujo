"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const authRoutes = ["/eniri", "/registri"];
const protectedRoutes = ["/komenci"];

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (loading) return;

      // Si está en ruta pública y no es la raíz, y está autenticado
      if (authRoutes.includes(pathname) && user) {
        router.replace("/komenci");
        return;
      }

      // Si está en ruta protegida y no está autenticado
      if (protectedRoutes.includes(pathname) && !user) {
        router.replace("/eniri");
        return;
      }

      // Si está en la raíz y está autenticado
      if (pathname === "/" && user) {
        router.replace("/komenci");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [user, loading, pathname, router]);

  // Mostrar pantalla de carga mientras verifica
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="spin w-6 h-6 text-esperanto-verda" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <title>Ŝarĝado</title>
              <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </div>
          <p className="text-white/60 text-sm">Kontrolante seancon...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
