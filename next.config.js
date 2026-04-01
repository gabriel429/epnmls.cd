/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['tatbiurcijezsxsokwlh.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://tatbiurcijezsxsokwlh.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdGJpdXJjaWplenN4c29rd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTY4ODUsImV4cCI6MjA5MDM5Mjg4NX0.aMC8Qi5EJMHmmd-4rmI17c4O4rCqErAxKtY9WS596p8',
  },
};

module.exports = nextConfig;
