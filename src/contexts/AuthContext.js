import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
      return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
      return auth.signOut()
    }

    function sendEmailVerification(){
      const actionCodeSettings = {
        url: 'http://localhost:3000/dashboard' ,
      }    
      return currentUser.sendEmailVerification(actionCodeSettings)
    }


    function resetPassword(email) {
      //https://firebase.google.com/docs/auth/web/passing-state-in-email-actions
      const actionCodeSettings = {
        url: 'http://localhost:3000/?email=' + email,
        /*
        iOS: {
          bundleId: 'com.example.ios'
        },
        android: {
          packageName: 'com.example.android',
          installApp: true,
          minimumVersion: '12'
        },
        handleCodeInApp: true,
        // When multiple custom dynamic link domains are defined, specify which
        // one to use.
        dynamicLinkDomain: "example.page.link"
        */
      };
      return auth.sendPasswordResetEmail(email,actionCodeSettings)
    }

    function updatePassword(password) {
      return currentUser.updatePassword(password)
    }

    function updateEmail(email) {
      return currentUser.updateEmail(email)
    }
    function updateProfile(profiledata) {
      return currentUser.updateProfile(profiledata)
    }

    
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        sendEmailVerification,
        updatePassword,
        updateEmail,
        updateProfile
    }

    useEffect(() => {
        // Firebase Authのメソッド。ログイン状態が変化すると呼び出される
        auth.onAuthStateChanged(user => {
          setCurrentUser(user);
          setLoading(false)
        });
      }, []);

    return (
        <AuthContext.Provider value={value}>
           {!loading && children}
        </AuthContext.Provider>
    )
}    


