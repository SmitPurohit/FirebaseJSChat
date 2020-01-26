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

//The variable that will store the reference to the specific table
var ref;
//These variables serve to make sure no message is sent twice
var oldUsn = " ";
var oldMess = " ";
usn = Math.floor(Math.random()*(999-100+1)+100);



//function chat()
//Runs whenever either the sent button or the Enter key is pressed
//The chat function specifically sets the message and usn to be sent
function chat() {
    //If the room is not the default
    if(room.localeCompare('Select a Room')!=0){
    firebase.database().ref(room).set({
        usn: usn + ": ",
        message: document.getElementById("message").value

    });
    //Sets the message value to nothing so the message field is cleared
    document.getElementById("message").value = "";
  }


}

//function changeRoom()
//This function handles the heavy lifting of the actual chat
//It is run when the room is changed
function changeRoom() {
    //newRoom is used to see if the room actually changed
    var newRoom = document.getElementById("roomSelection").value;

    console.log(newRoom);
    //If the newRoom is not the default
    if(newRoom.localeCompare('Select a Room')!=0){
      //Show the input table (usn and message)
      document.getElementById('input').style.display='block';
      //Is the newRoom different than the current room
      if (newRoom.localeCompare(room) != 0) {
          room = newRoom;


          //Sets the title to the room
          document.getElementById("page").innerHTML = "<h1>" + room.substring(0, room.length - 1) + "</h1>";

          ref = firebase.database().ref(room);

        }
        //A function on ref that runs every time a value in the room is changed
        //In other words, this runs whenever the enter key is pressed
        //after chat() is run
          ref.on('value', function (snapshot) {
            //run exactly once
            for(var k = 0;k<1;k++){
              //Check if the current message is the same as the previous one
              //This is done to ensure a message isn't sent twice by accident
              if(oldUsn.localeCompare(snapshot.val().usn) != 0 ||oldMess.localeCompare(snapshot.val().message) !=0){

                oldUsn =snapshot.val().usn;
                oldMess = snapshot.val().message;
                //Sets the HTML of the element "page" to the usn and the message
                document.getElementById("page").innerHTML += snapshot.val().usn + snapshot.val().message + "<br>";
              }


              }

          });




  }
  //if the room is default
  else{
    //reset the page's HTML
    document.getElementById("page").innerHTML = " ";
    //Hides the inputs
    document.getElementById('input').style.display='none';
  }
}
//function checkKey(event)
//Runs when any key is pressed
//If that key is the Enter key, run chat()
function checkKey(e) {
    if (e.keyCode == 13) {
        chat();
    }
}
