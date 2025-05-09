declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    [key: string]: any;
  }

  interface WithPWAOptions {
    pwa: PWAOptions;
  }

  const withPWA: (nextConfig: NextConfig & WithPWAOptions) => NextConfig;
  export default withPWA;
}
