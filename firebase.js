import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCRVqBCqJHVeIX42ugcH7OOBu8VgcOjtrY",
  authDomain: "fitconnect1-ac0fc.firebaseapp.com",
  projectId: "fitconnect1-ac0fc",
  storageBucket: "fitconnect1-ac0fc.firebasestorage.app",
  messagingSenderId: "956421374922",
  appId: "1:956421374922:web:0d0e9b4919ea5142ec8533"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);
