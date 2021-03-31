import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
      console.log(result)
      const {displayName, email, photoURL} = result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
  })
  .catch(err => {
    console.log(err);
    console.log(err.message);
  })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: ''
      }
      setUser(signedOutUser)
    })
    .catch(err => {
      console.log(err)
    })
  }
  return (
    <div>
      {
        user.isSignedIn ?  <button onClick={handleSignOut}>Sign Out</button> :  <button onClick={handleSignIn}>Sign In</button>
      }
     
      {
        user.isSignedIn && <div>
          <p>WelCome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      }
    </div>
  );
}

export default App;
