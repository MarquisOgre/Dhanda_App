import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dc35f2d8684b4db4a83514fc28ae0d49',
  appName: 'dhandaapp',
  webDir: 'dist',
  server: {
    url: 'https://dc35f2d8-684b-4db4-a835-14fc28ae0d49.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
