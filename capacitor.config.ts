import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.prasi.wrap",
  appName: "Prasi Wrapper",
  webDir: 'dist',

  server: {
    // url: "http://192.168.1.22:1234",
    androidScheme: "https",
  },
};

export default config;
