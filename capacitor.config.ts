import type { CapacitorConfig } from '@capacitor/cli';
import { LocalNotifications } from '@capacitor/local-notifications';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Meu_Remedio',
  webDir: 'www',
plugins: {
  LocalNotifications: {
    smallIcon: "ic_notification",
    iconColor: "#488AFF",
    sound: "beep.wav"
  }
}
};


export default config;
