/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
   * Mark 'pg' (node-postgres) as a server-only external package.
   * This prevents Next.js from trying to bundle it for the browser
   * and avoids "Module not found: Can't resolve 'pg-native'" errors
   * on Vercel / Edge environments.
   */
  serverExternalPackages: ['pg'],
};

export default nextConfig;
