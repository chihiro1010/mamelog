declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  interface WithPWAOptions {
    pwa: PWAOptions;
  }

  const withPWA: (nextConfig: NextConfig & WithPWAOptions) => NextConfig;
  export default withPWA;
}
