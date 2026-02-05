import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GithubAuthProvider } from "firebase/auth"; // <--- Import Auth tools

const firebaseConfig = {
  apiKey: "AIzaSyBmdTjeQxgPIr4aVEp4UgNrLZsCU_-kr2I",
  authDomain: "devcommandhub-1.firebaseapp.com",
  projectId: "devcommandhub-1",
  storageBucket: "devcommandhub-1.firebasestorage.app",
  messagingSenderId: "376704616312",
  appId: "1:376704616312:web:0c1dc1dae49d4437b22a8d",
  measurementId: "G-TL9JBPS6L4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app); // <--- Export Auth
export const provider = new GithubAuthProvider(); // <--- Export GitHub Provider