import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
    success: false
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result);
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          photo: "",
          email: "",
        };
        setUser(signedOutUser);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const handleBlur = (e) => {
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber; 
    }
    if(isFieldValid){ 
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res => {
    // Signed in 
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    // ...
  })
  .catch(error => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
    // ..
  });
    }
    e.preventDefault();
  };
  return (
    <div>
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}

      {user.isSignedIn && (
        <div>
          <p>WelCome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input typr="text" onBlur={handleBlur} name="name" placeholder="Enter Your Name" required></input>
        <br/>
        <input type="text" onBlur={handleBlur} name="email" placeholder="Enter Your Email" required></input>
        <br/>
        <input
          type="password"
          onBlur={handleBlur}
          name="password"
          placeholder="Your Password"
          required
        ></input>
        <br/>
        <input type="submit" value="Submit"/>
      </form>
      <p>{user.error}</p>
      {user.success && <p style={{color:'green'}}>User account created successfully</p>}
    </div>
  );
}

export default App;
