const firebaseConfig = {
    apiKey: "AIzaSyBrJxq9jSa767pl_rgOw1VNRPLHcqOzVsI",
    authDomain: "mojocomments.firebaseapp.com",
    databaseURL: "https://mojocomments.firebaseio.com",
    projectId: "mojocomments",
    storageBucket: "mojocomments.appspot.com",
    messagingSenderId: "401017330826",
    appId: "1:401017330826:web:e07772889156d41e7aa173"
  };

firebase.initializeApp(firebaseConfig);


const dbRef = firebase.firestore();
const commentsRef = dbRef.collection('commentx');

export { commentsRef }
