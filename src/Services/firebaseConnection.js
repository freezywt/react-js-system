import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyBNqjvlYD5MVnRHYGEkPMU1NbxZ6c8JoyY",
    authDomain: "system-21d91.firebaseapp.com",
    projectId: "system-21d91",
    storageBucket: "system-21d91.appspot.com",
    messagingSenderId: "824479878009",
    appId: "1:824479878009:web:73b24c0dbcd43af605fda8",
    measurementId: "G-1PCSWN1T2G"
};

if(!firebase.apps.lenght){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
