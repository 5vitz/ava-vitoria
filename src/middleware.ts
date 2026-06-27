import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  // Proteger a rota principal e qualquer subrota de /admin, mas garantir que a página de login fique pública
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};
