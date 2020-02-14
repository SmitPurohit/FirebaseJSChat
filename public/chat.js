// Your web app's Firebase configuration
var config = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  databaseURL: config.databaseURL,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId

};
// Initialize Firebase
firebase.initializeApp(config);
var database = firebase.database();

//Sets the default room to a room selection
var room = 'Select a Room';
//Sets variables for use later to determine new rooms and room key
var key;
var newRoom;
//The variable that will store the reference to the specific table
var ref;
//These variables serve to make sure no message is sent twice
var oldUsn = " ";
var oldMess = " ";
//Sets the username to a random 3 digit number
usn = Math.floor(Math.random() * (999 - 100 + 1) + 100);

var max = 10; //Max amount of messages that can be stored/read


//function chat()
//Runs whenever either the sent button or the Enter key is pressed
//The chat function specifically sets the message and usn to be sent
function chat() {
  //If the room is not the default
  if (room.localeCompare('Select a Room') != 0) {
    firebase.database().ref(room).push({
      usn: usn + ": ",
      message: document.getElementById("message").value

    });
    //Check the counter to ensure no more than 10 messages can be stored
    checkCounter(room);


    //Sets the message value to nothing so the message field is cleared
    document.getElementById("message").value = "";

  }


}

//function changeRoom()
//This function handles the heavy lifting of the actual chat
//It is run when the room is changed
function changeRoom(roomValue) {
  //If the input to the function is '', the newRoom is a specific roomKey
  if (roomValue == '')
    roomValue = document.getElementById("roomKey").value+"/";
  //Otherwise, its one of the default rooms
  else
    roomValue = document.getElementById("roomSelection").value;
var newRoom = roomValue;


  //If the newRoom is not the default
  if (newRoom.localeCompare('Select a Room') != 0) {
    //Show the input table (usn and message)
    document.getElementById('input').style.display = 'block';
    document.getElementById("header").innerHTML = "<h1>" + room.substring(0,
      room.length - 1) + "</h1>";
    //Is the newRoom different than the current room
    if (newRoom.localeCompare(room) != 0) {
      room = newRoom;
      //Sets the title to the room
      document.getElementById("header").innerHTML = "<h1>" + room.substring(0,
        room.length - 1) + "</h1>";
      document.getElementById("page").innerHTML = "";
      //Sets the reference to the elements to the database+room
      ref = firebase.database().ref(room);

    }
    //A function on ref that runs every time a value in the room is changed
    //In other words, this runs whenever the enter key is pressed
    //after chat() is run
    ref.on('value', function(snapshot) {
      document.getElementById("page").innerHTML = ""; //resets the page

      //Every time a value in the room changes
      firebase.database().ref(room).once("value").then(function(snapshot) {

        document.getElementById("page").innerHTML = ""; //resets the page again, so each message updates for each message
        //Iterates through each message in the room
        var count = max;
        snapshot.forEach(function(childSnapshot) {
          if (count > 0) {
            //Sets values of username and mess to the usn and message
            var username = childSnapshot.val().usn;
            var mess = childSnapshot.val().message;
            mess = mess.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var myUSN = usn + ": ";
            //If the value is not null, add the new username and message to the top of the messages
            if (childSnapshot.val().usn != null)
            //If its your own message the style is changed (with the mypage id)
              if (username == myUSN) {
                document.getElementById("page").innerHTML +=
                  "<span id=\"mypage\">" + username +
                  mess + "</span> <br>"
                  /*+ document.getElementById(
                                   "page").innerHTML*/
                ;
              } else { //other people messages
                document.getElementById("page").innerHTML +=
                  username +
                  mess + "<br>" /*+ document.getElementById("page").innerHTML*/ ;
              }
            count--;
          }
        });
      });
      //run exactly once
      newUsn = snapshot.val().usn;
      newMess = snapshot.val().message;
      newMess = newMess.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      for (var k = 0; k < 1; k++) {
        //Check if the current message is the same as the previous one
        //This is done to ensure a message isn't sent twice by accident
        if (oldUsn.localeCompare(newUsn) != 0 || oldMess.localeCompare(
            newMess) != 0) {

          oldUsn = newUsn;
          oldMess = newMess;
          //Sets the HTML of the element "page" to the usn and the message

        }


      }

    });



  }
  //if the room is default
  else {
    document.getElementById("header").innerHTML = " ";
    //reset the page's HTML
    document.getElementById("page").innerHTML = " ";
    //Hides the inputs
    document.getElementById('input').style.display = 'none';
  }
}
//function checkCounter(room)
//This function handles making sure the amount of messages never gets higher than 10
function checkCounter(thisRoom) {
  //Sets the reference to the counter variable
  ref = firebase.database().ref('/');
  ref = ref.child(thisRoom + '/counter');
  //A transaction that will increase/not do anything to counter
  ref.transaction(function(counter) {
    //If the counter is not the max, add one to the counter
    if (counter != max)
      return counter + 1;
    //If the coutner is max, don't add anything
    else {
      //delete the latest message
      deleteMessage(thisRoom);

    }
  });
}
//This function simply deletes the oldest message once the counter reaches 10
function deleteMessage(refer) {
  //The number of messages to be deleted
  var times = 1;
  console.log("poo")
    //Only run when a value in the room changes
  firebase.database().ref(refer).once("value").then(function(snapshot) {
    //For the first message in the room
    snapshot.forEach(function(childSnapshot) {
      if (times > 0) {
        //delete the message
        firebase.database().ref(room + "/" + childSnapshot.key).set({
          usn: null,
          message: null

        });
      }

      times--;
    });
  });
}
//function checkKey(event)
//Runs when any key is pressed
//If that key is the Enter key, run chat()
function checkKey(e) {
  if (e.keyCode == 13) {
    chat();
  }
}
//function checkKey2(event)
//Runs when the enter key is pressed in the room Key field
function checkKey2(e){
  if (e.keyCode == 13) {
    changeRoom('');
  }
}
