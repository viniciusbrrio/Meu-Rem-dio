import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAkZKd_3k2VOKbkxKcCGXkHOcbbwQREgGA",
  authDomain: "meuremedio-b6f45.firebaseapp.com",
  projectId: "meuremedio-b6f45",
  storageBucket: "meuremedio-b6f45.appspot.com",
  messagingSenderId: "806868829458",
  appId: "1:806868829458:web:8fd2e37375ede467ac5fcb",
  measurementId: "G-81X65LRFJZ"
};

export const environment = {
  production: false,
  firebaseConfig: {
  apiKey: "AIzaSyAkZKd_3k2VOKbkxKcCGXkHOcbbwQREgGA",
  authDomain: "meuremedio-b6f45.firebaseapp.com",
  projectId: "meuremedio-b6f45",
  storageBucket: "meuremedio-b6f45.appspot.com",
  messagingSenderId: "806868829458",
  appId: "1:806868829458:web:8fd2e37375ede467ac5fcb",
  measurementId: "G-81X65LRFJZ"
}
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

isSupported().then((supported) => {
  if (supported) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app); // Inicializa o Analytics apenas se suportado.
    console.log('Firebase Analytics inicializado com sucesso');
  } else {
    console.warn('O Analytics não é suportado neste ambiente.');
  }
}).catch((error) => {
  console.error('Erro ao verificar o suporte ao Firebase Analytics:', error);
});