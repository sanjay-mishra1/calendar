const firebaseConfig = {
	apiKey: "AIzaSyCt3lbyHBij3lcjLFvxX_DBn6IT5GZg_zs",
    authDomain: "usercalender.firebaseapp.com",
    databaseURL: "https://usercalender.firebaseio.com",
    projectId: "usercalender",
    storageBucket: "usercalender.appspot.com",
    messagingSenderId: "104529036841"
};

firebase.initializeApp(firebaseConfig);

function login(){
    

     var email = document.getElementById("emailLogin").value;
    var password = document.getElementById("pwdLogin").value;
    console.log("Cred"+email+password);
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Login"+errorMessage);
        console.log("");
                // ...
      });
      

    }
    var user = firebase.auth().currentUser;

    if (user != null) {
      user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
    }else{
        console.log("login is null");
    }