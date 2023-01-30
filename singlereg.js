var institute;
var fuid;

function ststudent()
{
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var ffuid = firebase.auth().currentUser;
          if(user != null){
            var ffuid= user.uid;
            fuid=user.uid;
            var name = user.displayName;
            var email= user.email;        
            firebase.database().ref().orderByChild('Faculty/'+ffuid+'/mailid').equalTo(email).on("value", function(snapshot) {
                snapshot.forEach(
                  function(parent) { 
                    institute = parent.key;
                    
                  });
              });                
          }
        }else {
            window.location.href="login.html";
          }
        });
}


function singlestudentreg()
{
    var fname=document.getElementById('stfname').value; 
    var enroll=document.getElementById('stenroll').value; 
    var mname=document.getElementById('stmname').value;
    var lname=document.getElementById('stlname').value;
    var email=document.getElementById('stemail').value;
    var pass=document.getElementById('stpass').value;
    var fpass = document.getElementById('verifypass').value;
    var fuseremail ;
    var defaultdpurl = "https://firebasestorage.googleapis.com/v0/b/oepproject-10f9c.appspot.com/o/users%2Fdefault%2Fprofile.jpg?alt=media&token=59ab59ed-a05f-4ee0-bf4b-75d53afb0a8b"

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = firebase.auth().currentUser;
          if(user != null){
            fuseremail = user.email;
            var name = user.displayName;
            var uuid =user.uid;
          }
        }else {
          }
        });

        setTimeout(() => {

      
      firebase.auth().signInWithEmailAndPassword(fuseremail, fpass).then(function(user) {


        firebase.auth().createUserWithEmailAndPassword(email, pass).then((user) => {
          // Signed in 
          let auth=firebase.auth().currentUser;
          let uid = auth.uid;
          
        
          
          let yourdata = {facultyid : fuid, Enroll : enroll, Name: fname , MiddleName: mname, LastName : lname, mailid :email , profilepic : defaultdpurl}   
          firebase.database().ref( institute+'/Student').child(uid).set(yourdata).then(ok => console.log("Done")).catch(console.error) ;
           
          if(user){
            auth.updateProfile({
               displayName: fname+ " " + lname ,
               photoURL: defaultdpurl
            })
          }
          alert("Student Account Created");
    
          // ...
        }).catch(function(error) {
          // Handle Errors here.
          var errorMessage = error.message;
          alert("Error Msg "  + errorMessage);
    
        });
  
  
      setTimeout(() => {
        firebase.auth().signInWithEmailAndPassword(fuseremail, fpass).then(function(user) {
          location.reload();
  
      }).catch(function(err) {
          alert("Password Incorrect.Please Enter Correct Password");
      })
    }, 500);

    }).catch(function(err) {
        alert("Password Incorrect.Please Enter Correct Password");
    })

  }, 500);
}
  

    
