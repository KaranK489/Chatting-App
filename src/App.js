import React, {useState, useEffect, Fragment, useRef} from "react";
import firebase from "./firebase"
import { v4 as uuidv4} from 'uuid';
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import Login from "./Login";
import "./App.css"
// import {BrowserRouter as Router, Route, Switch} from "react-router-dom";


//Firebase:
//https://console.firebase.google.com/u/0/project/chatting-app-56fa8/firestore/data/~2Fchats~2F6ef96003-0de5-4baf-84d2-0ffc35268094
//https://www.youtube.com/watch?v=3ZEz-iposj8&list=PLpPVLI0A0OkJ-bu1zSiknRYEUIy33gCwp&index=1&ab_channel=DevWorld
//https://www.youtube.com/watch?v=VJmNtYZl8i4&list=PLpPVLI0A0OkJ-bu1zSiknRYEUIy33gCwp&index=2&ab_channel=DevWorld

// Google auth:
//https://www.youtube.com/watch?v=wUhcIVJml1w&ab_channel=BornToCode

function App() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState('');
  const [message, setMessage] = useState('');
  // const [desc, setDesc] = useState('');

  var uID;
  var signInState = "Sign in with Google";

  //USES unix time to order chats
  var unix = new Date().valueOf();

  const ref = firebase.firestore().collection("chats");

  //REALTIME GET FUNCTION
  function getChats() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });

      setChats(items);



      for (var i=0;i<items.length;i++){
          document.getElementById(items[i].id).hidden = true;

          console.log("UID: " + uID);
          console.log("ARRAY USER ID: " + items[i].userID);

          if (uID!=null && items[i].userID === uID){
              document.getElementById(items[i].id).hidden = false;
          }
      }


      setLoading(false);
    });


  }

  useEffect(() => {
    getChats();
      }, []);

  //ADD FUNCTION
  function addChat(newChat){

    ref
        .doc(newChat.id)
        .set(newChat)
        .catch((err) => {
          console.error(err);
        });

      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });

  }

    // EDIT FUNCTION
    function editChat(updatedChat){
      setLoading();
      ref
          .doc(updatedChat.id)
          .update(updatedChat)
          .catch((err) => {
            console.error(err);
          });



    }


  const SignInWithFirebase = ()=>{
    var google_provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(google_provider)
        .then((re) =>{
          console.log(re);

          uID = firebase.auth().currentUser.displayName;
            setUserID(uID);

            document.getElementById("signInBtn").innerText="Switch accounts";
            document.getElementById("text1").innerText="Signed in as " + uID;
            getChats();
        })
        .catch((err) =>{
          console.log(err);
        })


  }


  return (



      <div className="App">

          <div className = "section1">




              <button onClick = {SignInWithFirebase} id = "signInBtn">Please Sign In</button>
              &nbsp;&nbsp;

              <text id = "text1"></text>


              <h1>Chatting App</h1>

                <div className="inputBox">

                  <h3>Send Message:</h3>

                  <input
                      type="text"
                      placeholder={"Message"}
                      id={"sendMessage"}
                      title="sendMessage"
                      size ="40"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                  />
                    &nbsp;

                  {/*<textarea value={desc} onChange={(e) => setDesc(e.target.value)} />*/}
                  <button onClick={() => {

                      if(userID === ""||userID==null){

                          alert("Please sign in before sending a message");

                      } else {

                          if (message !== "") {



                              var myCurrentDate = new Date();
                              var month = (myCurrentDate.getMonth() + 1);
                              var date = myCurrentDate.getDate();
                              var hours = myCurrentDate.getHours();
                              var dayNight;
                              if (hours>=12){
                                  if (hours === 12){
                                      hours = 12;
                                  } else {
                                      hours%=12;
                                  }
                                  dayNight = "PM";
                              }else {
                                  dayNight = "AM";
                              }
                              if (hours == 24 || hours == 0) {
                                  hours = 12;
                                  dayNight = "AM";
                              }

                              var minutes = myCurrentDate.getMinutes()
                              if (minutes < 10) {
                                  minutes = "0" + minutes;
                              }

                              var dateTime = month + '/' + date + ' ' + hours + ':' + minutes + ' ' + dayNight;

                              addChat({message, userID, dateTime, id: new Date().valueOf().toString()});

                              setMessage("");


                          }
                      }





                  }}>

                   Send
                  </button>
                </div>

              <hr/>

          </div>


        <div className="section2">

        {loading ? <h1>Loading...</h1> : null}
        {chats.slice(0).reverse().map((chat) => (

              <div className="chat" key={chat.id}>
                  <h3 >{chat.userID} <small> <small>{chat.dateTime}</small> </small></h3>
                <p>{chat.message}</p>


                  {/*<button onClick={() => {*/}
                  {/*    deleteChat(chat)*/}

                  {/*}}>DELETE</button>*/}


                  <button
                      id = {chat.id}
                      onClick={() =>{
                          if (message!==""){
                          editChat({message, id: chat.id })
                      }

                      } }
                  >
                    EDIT
                  </button>



                <hr >
                </hr>
              </div>


        ))}

        </div>

      </div>


  );
}

export default App;
