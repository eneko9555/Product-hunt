// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import  { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxl94QFzAXKE4YjDXWZSreMUB7Z8TebYs",
  authDomain: "product-hunt-534f2.firebaseapp.com",
  projectId: "product-hunt-534f2",
  storageBucket: "product-hunt-534f2.appspot.com",
  messagingSenderId: "495490369791",
  appId: "1:495490369791:web:074af62faf68d38be3a4ca"
};

// Initialize Firebase
 export const appFirebase = initializeApp(firebaseConfig);

 export const auth = getAuth(appFirebase)
 
 export const db = getFirestore(appFirebase)

 export const storage = getStorage(appFirebase)
