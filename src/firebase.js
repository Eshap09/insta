import firebase from "firebase";

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyAJRE2yxYAnEHFaGc8Nx7u0QK4ww6JnRBA",
    authDomain: "instagram-clone-de48b.firebaseapp.com",
    projectId: "instagram-clone-de48b",
    storageBucket: "instagram-clone-de48b.appspot.com",
    messagingSenderId: "1023219403286",
    appId: "1:1023219403286:web:4f6b77e9712225f99bc337",
    measurementId: "G-J61FVS6XYV"
});

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();
export  {db,auth,storage};