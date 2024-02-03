import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.prasi.wrap",
  appName: "Prasi Wrapper",
  // webDir: 'dist',

  server: {
    url: "http://10.0.2.2:1234",
    androidScheme: "https",
  },
};

export default config;
