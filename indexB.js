
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAH3YMHxaYAMhjxif4EjR7zcWTAIZcxOr0",
    authDomain: "noit-fc786.firebaseapp.com",
    databaseURL: "https://noit-fc786-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "noit-fc786",
    storageBucket: "noit-fc786.appspot.com",
    messagingSenderId: "643498281516",
    appId: "1:643498281516:web:e7a758cb23c89091b89f89",
    measurementId: "G-LECF2FVC5N"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()




  
  // Set up our register function
  function register () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    full_name = document.getElementById('full_name').value
    device_num = document.getElementById('device_num').value

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
    if (validate_field(full_name) == false || validate_field(device_num) == false) {
      alert('One or More Extra Fields is Outta Line!!')
      return
    }
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        device_num : device_num,
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
  
      // DOne
      alert('Създаден профил!')
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }

  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
     password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      // Done
 
      sessionStorage.setItem("uid", user.uid);
      location.replace("homeB.html");
      
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  

  function get_info(){
    const databaseRef = firebase.database().ref();

      const emailRef = databaseRef.child('users/'+sessionStorage.getItem("uid")+'/email');
      emailRef.once('value', function(snapshot) {
      const email_info = snapshot.val();
      sessionStorage.setItem("email", email_info); 
    })

    const full_nameRef = databaseRef.child('users/'+sessionStorage.getItem("uid")+'/full_name');
    full_nameRef.once('value', function(snapshot) {
    const full_name = snapshot.val();
    sessionStorage.setItem("full_name", full_name);
    })

    const device_numRef = databaseRef.child('users/'+sessionStorage.getItem("uid")+'/device_num');
    device_numRef.once('value', function(snapshot) {
    const device_num_info = snapshot.val();
    sessionStorage.setItem("device_num", device_num_info);
    })


    setTimeout(greeting, 1000);



  }

  function email_info (){
    // import data from firebase 
    const databaseRef = firebase.database().ref();
    const emailRef = databaseRef.child('users/'+sessionStorage.getItem("uid")+'/email');
    emailRef.once('value', function(snapshot) {
    const email_info = snapshot.val();
    sessionStorage.setItem("email", email_info);
    alert(email_info);
    });
}

function full_name_info (){
    // import data from firebase
    const databaseRef = firebase.database().ref();
    const full_nameRef = databaseRef.child('users/'+sessionStorage.getItem("uid")+'/full_name');
    full_nameRef.once('value', function(snapshot) {
    const full_name = snapshot.val();
    sessionStorage.setItem("full_name", full_name);
    alert(full_name);
    });
}

    function  get_device_num (){
    // import data from firebase
    const databaseRef = firebase.database().ref();
    const device_numRef = databaseRef.child('users/'+sessionStorage.getItem("uid")+'/device_num');
    device_numRef.once('value', function(snapshot) {
    const device_num_info = snapshot.val();
    sessionStorage.setItem("device_num", device_num_info);
    alert(device_num_info);
    });
}

    function show_last_value (){
    const databaseRef = firebase.database().ref();
    // import data from firebase
    const deviceRef = databaseRef.child(sessionStorage.getItem("device_num"));
    deviceRef.on('value', function(snapshot) {
        const device_info = snapshot.val();
        const values = [];
        for(var i in device_info){
            values.push(device_info[i]);
        }
        console.log(values[0]);
        sessionStorage.setItem("last_value", values[values.length-1]);
    });
    }

    function change_info(){
        // Get the element with the id "demo"
        show_last_value();
var element = document.getElementById("demo");

// Set the text of the element to a string value
element.innerHTML = sessionStorage.getItem("last_value");
    }

    function separateValues() {


        const input =  sessionStorage.getItem("last_value");

        const regex = /("[^"]+"|[-+]?(?:\d*\.\d+|\d+)),?/g
      
        const match = input.match(regex);
      
        if (match) { // if the pattern matches
          const value1 = parseFloat(match[0]); 
          const value2 = parseFloat(match[1]); 
          const value3 = parseFloat(match[2]); 
      
          console.log(value1, value2, value3);

          var temp_box = document.getElementById("temperature");
          temp_box.innerHTML = value1 + " °C";

          var sat_box = document.getElementById("saturation");
          sat_box.innerHTML = value2 + " %";

          var pulse_box = document.getElementById("pulse");
          pulse_box.innerHTML = value3 + " bpm";

        }
      }
      
      function greeting() {
        var greet_box = document.getElementById("greeting");
          greet_box.innerHTML = "Здравейте, " + sessionStorage.getItem("full_name") + "! Номерът на вашето устройство е " + sessionStorage.getItem("device_num") + ".";
      }  
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }

  function sendChangePasswordEmail() {
    const auth = firebase.auth();
    const email = auth.currentUser.email;
  
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("Изпратен е имейл за смяна на паролата!");

      })
      .catch((error) => {
        console.error(error);
      });
  }
  