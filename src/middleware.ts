import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Proteger qualquer subrota de /admin, mas garantir que a página de login fique pública
  // O next-auth/middleware exclui automaticamente a página de signIn configurada para evitar loops
  matcher: [
    "/admin/:path*",
  ],
};
