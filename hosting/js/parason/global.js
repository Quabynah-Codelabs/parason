// Global variables
var auth, firestore, bucket, messaging;
var parasonUser = null;

// Initialize the variables when the page is loaded
$(document).ready(function() {
  // Test firebase integration
  console.log(`Firebase Added as: ${firebase.app().name}`);

  // Initialize variables
  auth = firebase.auth();
  firestore = firebase.firestore();
  messaging = firebase.messaging();
  bucket = firebase.storage().reference;
});

// Create new users
function createUser(email, password) {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userInfo => {
      console.log(userInfo);
      var user = userInfo.user;
      firestore
        .collection("users")
        .doc(user.uid)
        .set({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          token: user.refreshToken
        })
        .then(() => {
          alert("User was created successfully");
        })
        .catch(err => {
          console.log(err.message);
        });
    })
    .catch(err => {
      console.log(err.message);
    });
}

// Sign in exsiting users
function loginUser(email, password) {
  auth
    .signInWithEmailAndPassword(email, password)
    .then(userInfo => {
      console.log(auth.currentUser.uid);
      getCurrentUser();
    })
    .catch(err => {
      console.log(err.message);
    });
}

// Get current user
function getCurrentUser() {
  if (auth.currentUser) {
    firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then(snapshot => {
        parasonUser = snapshot.data();
        console.log(parasonUser);
        return parasonUser;
      })
      .catch(err => {
        console.log(err.message);
        return null;
      });
  } else {
    console.log("No user is logged in");
  }
}
