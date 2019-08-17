var calendar = document.getElementById("calendar-table");
var gridTable = document.getElementById("table-body");
var currentDate = new Date();
var selectedDate = currentDate;
var selectedDayBlock = null;
var globalEventObj = {};
var globalDiarytObj = {};
var sidebar = document.getElementById("sidebar");
let uid=localStorage.getItem("uid");

const firebaseConfig = {
	apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};

firebase.initializeApp(firebaseConfig);
function connectToDatabase(){
const db = firebase.database();
  var currentDate = new Date();
  if(uid){
  document.getElementById("showlogin1").innerHTML="Logout";
  document.getElementById("showlogin").innerHTML="Logout";
}
  db.ref(uid+'/events').once("value", function(snapshot) {
    snapshot.forEach(function(dsnapshot) {
      var snapshot1=dsnapshot.val();
      //console.log	('key is=>'+snapshot1.title+snapshot1.desc);
     // globalEventObj[dsnapshot.key][snapshot1.title] = snapshot1.desc;
     var key=dsnapshot.key;
     dsnapshot.forEach(function(dsnapshot2) {


      var d=key.split(" ") ;
       const y=parseInt(d[3]);
      const day=parseInt(d[2]);
      const m=Number(getMonthNumber(d[1]));
      selectedDate = new Date(
       y,
       m-1,
       day
      );
      if(dsnapshot2.key=="diary"){
        addDiary(dsnapshot2.val().desc);
      }else
      addEvent(dsnapshot2.val().title,dsnapshot2.val().desc)
     });


     
    });
   });
 }
 connectToDatabase();
  function addDiary(content){
    if (!globalDiarytObj[selectedDate.toDateString()]) {
      globalDiarytObj[selectedDate.toDateString()] = {};
    }
    globalDiarytObj[selectedDate.toDateString()]["diary"] = content;
   }
function addToDatabase(title,desc,date){
  var d = new Date();
var n = d.getTime();
  firebase.database().ref(uid+'/events/'+date+"/"+n).set({
    title: title,
    desc: desc    
  });
}


function getMonthNumber(monthName){
  var month=01;
  switch(monthName){
    case "Jan":month=01;
               break;
    case "Feb":month=02;
               break;
    case "Mar":month=03;
               break;
    case "Apr":month=04;
               break;
    case "May":month=05;
               break;
    case "Jun":month=06;
               break;
    case "Jul":month=07;
               break;
    case "Aug":month=08;
               break;
               
    case "Sep":month=09;
               break;
    case "Oct":month=10;
               break;
    case "Nov":month=11;
               break;
    case "Dec":month=12;
               break;
  }
  return month;
}
function createCalendar(date, side) {
  var currentDate = date;
  var startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  var monthTitle = document.getElementById("month-name");
  var monthName = currentDate.toLocaleString("en-US", {
    month: "long"
  });
  var yearNum = currentDate.toLocaleString("en-US", {
    year: "numeric"
  });
  monthTitle.innerHTML = `${monthName} ${yearNum}`;

  if (side == "left") {
    gridTable.className = "animated fadeOutRight";
  } else {
    gridTable.className = "animated fadeOutLeft";
  }

  gridTable.innerHTML = "";

  var newTr = document.createElement("div");
  newTr.className = "row";
  var currentTr = gridTable.appendChild(newTr);

  for (let i = 1; i < startDate.getDay(); i++) {
    let emptyDivCol = document.createElement("div");
    emptyDivCol.className = "col empty-day";
    currentTr.appendChild(emptyDivCol);
  }

  var lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  lastDay = lastDay.getDate();

  for (let i = 1; i <= lastDay; i++) {
    if (currentTr.getElementsByTagName("div").length >= 7) {
      currentTr = gridTable.appendChild(addNewRow());
    }
    let currentDay = document.createElement("div");
    currentDay.className = "col";
    if (
      (selectedDayBlock == null && i == currentDate.getDate()) ||
      selectedDate.toDateString() ==
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          i
        ).toDateString()
    ) {
      selectedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );

      document.getElementById(
        "eventDayName"
      ).innerHTML = selectedDate.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });

      selectedDayBlock = currentDay;
      setTimeout(() => {
        currentDay.classList.add("blue");
        currentDay.classList.add("lighten-3");
      }, 900);
    }
    currentDay.innerHTML = i;
    currentTr.appendChild(currentDay);
  }

  for (let i = currentTr.getElementsByTagName("div").length; i < 7; i++) {
    let emptyDivCol = document.createElement("div");
    emptyDivCol.className = "col empty-day";
    currentTr.appendChild(emptyDivCol);
  }

  setTimeout(() => {
    if (side == "left") {
      gridTable.className = "animated fadeInLeft";
    } else {
      gridTable.className = "animated fadeInRight";
    }
  }, 270);

  function addNewRow() {
    let node = document.createElement("div");
    node.className = "row";
    return node;
  }
}

createCalendar(currentDate);

var todayDayName = document.getElementById("todayDayName");
todayDayName.innerHTML =
  "Today is " +
  currentDate.toLocaleString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short"
  });

var prevButton = document.getElementById("prev");
var nextButton = document.getElementById("next");

prevButton.onclick = changeMonthPrev;
nextButton.onclick = changeMonthNext;

function changeMonthPrev() {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  createCalendar(currentDate, "left");
}
function changeMonthNext() {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
  createCalendar(currentDate, "right");
}

function addEvent(title, desc) {
  if (!globalEventObj[selectedDate.toDateString()]) {
    globalEventObj[selectedDate.toDateString()] = {};
  }
  globalEventObj[selectedDate.toDateString()][title] = desc;
  
 // console.log("AddEvent=>"+selectedDate.toDateString()+"=>"+ globalEventObj[selectedDate.toDateString()] );

}

function showEvents() {
  let sidebarEvents = document.getElementById("sidebarEvents");
  let objWithDate = globalEventObj[selectedDate.toDateString()];

  sidebarEvents.innerHTML = "";

  if (objWithDate) {
    let eventsCount = 0;
    for (key in globalEventObj[selectedDate.toDateString()]) {
      let eventContainer = document.createElement("div");
      let eventHeader = document.createElement("div");
      eventHeader.className = "eventCard-header";

      let eventDescription = document.createElement("div");
      eventDescription.className = "eventCard-description";

      eventHeader.appendChild(document.createTextNode(key));
      eventContainer.appendChild(eventHeader);

      eventDescription.appendChild(document.createTextNode(objWithDate[key]));
      eventContainer.appendChild(eventDescription);

      let markWrapper = document.createElement("div");
      markWrapper.className = "eventCard-mark-wrapper";
      let mark = document.createElement("div");
      mark.classList = "eventCard-mark";
      markWrapper.appendChild(mark);
      eventContainer.appendChild(markWrapper);

      eventContainer.className = "eventCard";

      sidebarEvents.appendChild(eventContainer);

      eventsCount++;
    }
    let emptyFormMessage = document.getElementById("emptyFormTitle");
    emptyFormMessage.innerHTML = `${eventsCount} events now`;
  } else {
    let emptyMessage = document.createElement("div");
    emptyMessage.className = "empty-message";
    emptyMessage.innerHTML = "Sorry, no events to selected date";
    sidebarEvents.appendChild(emptyMessage);
    let emptyFormMessage = document.getElementById("emptyFormTitle");
    emptyFormMessage.innerHTML = "No events now";
  }
}

gridTable.onclick = function(e) {
  if (
    !e.target.classList.contains("col") ||
    e.target.classList.contains("empty-day")
  ) {
    return;
  }

  if (selectedDayBlock) {
    if (
      selectedDayBlock.classList.contains("blue") &&
      selectedDayBlock.classList.contains("lighten-3")
    ) {
      selectedDayBlock.classList.remove("blue");
      selectedDayBlock.classList.remove("lighten-3");
    }
  }
  selectedDayBlock = e.target;
  selectedDayBlock.classList.add("blue");
  selectedDayBlock.classList.add("lighten-3");

  selectedDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    parseInt(e.target.innerHTML)
  );

  showEvents();

  document.getElementById(
    "eventDayName"
  ).innerHTML = selectedDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
};

var changeFormButton = document.getElementById("changeFormButton");
var addForm = document.getElementById("addForm");
changeFormButton.onclick = function(e) {
  if(!uid){
    showLogin();
  }else
  addForm.style.top = 0;
};

var cancelAdd = document.getElementById("cancelAdd");
cancelAdd.onclick = function(e) {
  addForm.style.top = "100%";
  let inputs = addForm.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
  let labels = addForm.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    console.log(labels[i]);
    labels[i].className = "";
  }
};
var  diaryEvent=document.getElementById("addDiary");
diaryEvent.onclick=function(e){
  if(uid){
  var content="";
  let date=selectedDate.toDateString();
  if (globalDiarytObj[date]) {
      content= globalDiarytObj[date]["diary"];
      
  }

  //console.log("Diary=>"+content);
  diaryEvent.href="./note.html?date="+selectedDate.toDateString()
   +"&uid="+uid+"&diaryContent="+content;
}else{
  showLogin();
}
};

var addEventButton = document.getElementById("addEventButton");
addEventButton.onclick = function(e) {
  

  let title = document.getElementById("eventTitleInput").value.trim();
  let desc = document.getElementById("eventDescInput").value.trim();

  if (!title || !desc) {
    document.getElementById("eventTitleInput").value = "";
    document.getElementById("eventDescInput").value = "";
    let labels = addForm.getElementsByTagName("label");
    for (let i = 0; i < labels.length; i++) {
      console.log(labels[i]);
      labels[i].className = "";
    }
    return;
  }

  addEvent(title, desc);
  addToDatabase(title,desc,selectedDate.toDateString());
  showEvents();

  if (!selectedDayBlock.querySelector(".day-mark")) {
    console.log("work");
    selectedDayBlock.appendChild(document.createElement("div")).className =
      "day-mark";
  }

  let inputs = addForm.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
  let labels = addForm.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    labels[i].className = "";
  }
};



// LOgin
// var login = document.getElementById("showlogin");
// addEventButton.onclick = function(e) {
//   document.getElementById("loginMain").style="visibilty:visible";
// };
// var login1 = document.getElementById("showlogin1");
// addEventButton.onclick = function(e) {
//   document.getElementById("loginMain").style="visibilty:visible";
// };
// var login2 = document.getElementById("loginMain");
// addEventButton.onclick = function(e) {
//   login2.style="visibilty:none";
//  };
 function showLogin(){
   document.getElementById("loginMain").style="visibility:visible";
 }
 function hideLogin(){
  document.getElementById("loginMain").style="visibility:hidden";
 }
function login(){
    

  var email = document.getElementById("emailLogin").value;
 var password = document.getElementById("pwdLogin").value;
// console.log("Cred"+email+password);


if( document.getElementById("login_btn").innerHTML=="Login"){

  firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    uid=email.replace(".","");

    localStorage.setItem("uid", uid);
    document.getElementById("showlogin1").innerHTML="Logout";
    document.getElementById("showlogin").innerHTML="Logout";
    document.getElementById("loginError").innerHTML="";
     hideLogin();
  database();
  }).catch(function(error) {
    var errorCode = error.code;
    uid="";
    var errorMessage = error.message;
    console.log("Login"+errorMessage);
    console.log("");
    showLogin();
    document.getElementById("loginError").innerHTML=errorMessage;
    
  document.getElementById("showlogin1").innerHTML="Login";
  document.getElementById("showlogin").innerHTML="Login";
  });
 
}else{
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    uid=email.replace(".","");

    localStorage.setItem("uid", uid);
    document.getElementById("showlogin1").innerHTML="Logout";
    document.getElementById("showlogin").innerHTML="Logout";
    document.getElementById("loginError").innerHTML="";
  
    hideLogin();
  database();
  }).catch(function(error) {
    var errorCode = error.code;
    uid="";
    var errorMessage = error.message;
    console.log("Login"+errorMessage);
    console.log("");
    showLogin();
    document.getElementById("loginError").innerHTML=errorMessage;
    
  document.getElementById("showlogin1").innerHTML="Login";
  document.getElementById("showlogin").innerHTML="Login";
  });
}


   

 }
 function checkLoginButton(){
    var text=document.getElementById("showlogin").innerHTML;
    if(!uid){
     // login();
      showLogin();
    }else{
      logout();
      document.getElementById("showlogin").innerHTML="Login";
      document.getElementById("showlogin1").innerHTML="Login";
    }


 }
 function logout(){
  localStorage.setItem("uid", "");
  uid="";
  globalEventObj = {};
  globalDiarytObj = {}; 
 }
 var action = document.getElementById("loginAction");
 action.onclick = function(e) {
   var title=document.getElementById("logintitle");
              if(title.innerHTML=="Login"){
                document.getElementById("loginAction").innerHTML="Already have account? Login";
                document.getElementById("login_btn").innerHTML="Register";
                title.innerHTML="Register"
              }else{
                title.innerHTML="Login"
                document.getElementById("loginAction").innerHTML="Don't have account? Register";
                document.getElementById("login_btn").innerHTML="Login";
              }
 };
