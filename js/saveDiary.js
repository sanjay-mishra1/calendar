const firebaseConfig = {
	apiKey: "AIzaSyCt3lbyHBij3lcjLFvxX_DBn6IT5GZg_zs",
    authDomain: "usercalender.firebaseapp.com",
    databaseURL: "https://usercalender.firebaseio.com",
    projectId: "usercalender",
    storageBucket: "usercalender.appspot.com",
    messagingSenderId: "104529036841"
};

firebase.initializeApp(firebaseConfig);
function addToDatabase(uid,title,date){
  console.log(uid+" =>"+title+" =>"+date);
  //title=title.replace("\n","<br>");
  title = title.replace(/(?:\r\n|\r|\n)/g, '<br>');

  console.log(title);
  firebase.database().ref(uid+'/events/'+date+"/diary").set({
     desc: title
  
  });
}
var addEventButton = document.getElementById("addEventButton");
addEventButton.onclick = function(e) {
  let title = document.getElementById("msg").value.trim();
  console.log("diary=>"+title);
  var url = new URL(url_string);
var c = url.searchParams.get("date");
 var uid=url.searchParams.get("uid");
  addToDatabase(uid,title,c)
 }