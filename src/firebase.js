
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  


const firebaseConfig = {
  apiKey: "AIzaSyCe9HjucRA_D3RhjU7bT0b6vHhFi0MHA1k",
  authDomain: "grocery-shopping-list-79cdd.firebaseapp.com",
  projectId: "grocery-shopping-list-79cdd",
  storageBucket: "grocery-shopping-list-79cdd.appspot.com",
  messagingSenderId: "524849009401",
  appId: "1:524849009401:web:8f7825fda8a472b3188828",
  measurementId: "G-059VF42CEZ"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

export { db }; 