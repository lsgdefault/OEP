//Get Display Name
function getuserdata() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
                
            if (user != null) {
                var name = user.displayName;
                dp.src = user.photoURL;
                document.getElementById("username").innerHTML = name;
            }
        } else {
            window.location.href = "login.html";
        }
    });

}

function getuserdata1() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var name = user.displayName;
                var useremail1 = user.email;
                var instname;
                console.log(useremail1);
                console.log(uid);
                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail1).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                        });

                    sessionStorage.setItem("instname", instname);
                    document.getElementById("instname").innerHTML = "All classes from " + instname;
                });


            }
        } else {
            window.location.href = "login.html";
        }
    });

}


//Registration
function facultyRegister() {

    firebase.auth().signOut().then((user) => {}).catch((error) => {
        // An error happened.
    });
    var fname = document.getElementById('fname').value;
    var mname = document.getElementById('mname').value;
    var lname = document.getElementById('lname').value;
    var email = document.getElementById('email').value;
    var phnum = document.getElementById('phone').value;
    var iname = document.getElementById('dinstitute').value;
    var pass = document.getElementById('pass').value;
    var cpass = document.getElementById('cpass').value;
    var defaultdpurl = "https://firebasestorage.googleapis.com/v0/b/oepproject-10f9c.appspot.com/o/users%2Fdefault%2Fprofile.jpg?alt=media&token=59ab59ed-a05f-4ee0-bf4b-75d53afb0a8b"

    if (0 != fname.length & 0 != mname.length & 0 != lname.length & 0 != email.length & 0 != phnum.length & 0 != iname.length) {
        if (pass.length > 5) {
            if (pass == cpass) {
                firebase.auth().createUserWithEmailAndPassword(email, pass).then((user) => {
                    // Signed in 
                    let auth = firebase.auth().currentUser;
                    var institute = iname;
                    let uid = auth.uid;
                    if (user) {
                        auth.updateProfile({
                            displayName: fname + " " + lname ,
                            photoURL: defaultdpurl
                        })
                    }
                    setTimeout(() => {
                        let yourdata = { Name: fname, MiddleName: mname, LastName: lname, contact: phnum, mailid: email , ProfilePicture : defaultdpurl}
                        firebase.database().ref(institute + '/Faculty').child(uid).set(yourdata).then(ok => window.location.href = "index.html").catch(console.error);
                        firebase.storage().ref('users/' + uid + '/profile.jpg').put(defaultdpurl).then(function() {console.log("Successfully Uploaded.")}).catch(Error => {console.log(error.message)})
                    }, 500);


                    // ...
                }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage);

                    // ...
                });
            } else {
                alert("Password Don't Match");
            }
        } else {
            alert("Password Must be More than 6 characters")
        }
    } else {
        alert("All field must be filled")
    }


}

//Institute Registration

function insituteRegister() {
    var iname = document.getElementById('i_name').value;
    var iphnum = document.getElementById('i_phno').value;
    var iaddress = document.getElementById('i_address').value;
    var iPin = document.getElementById('i_pin').value;

    var institute = iname;
    //Insert
    let yourdata = { I_name: iname, I_Phnum: iphnum, I_Address: iaddress, PIN: iPin }
    firebase.database().ref(institute + '/info').set(yourdata).then(ok => window.location.href = "register.html").catch(console.error);

}


//Login
function facultylogin() {

    var email = document.getElementById('email').value;
    var pass = document.getElementById('pass').value;

    firebase.auth().signInWithEmailAndPassword(email, pass).then((user) => {

        let auth = firebase.auth().currentUser;
        let uid = auth.uid;


        firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(email).on("value", function(snapshot) {
            snapshot.forEach(
                function check() {
                    if (snapshot.exists()) {
                        window.location.href = "index.html";
                    }

                }
            );


        });


        firebase.database().ref().orderByChild('Student/' + uid + '/mailid').equalTo(email).on("value", function(snapshot) {
            snapshot.forEach(
                function check() {
                    if (snapshot.exists()) {
                        window.location.href = "studentindex.html";
                    }

                }
            );


        });
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);

        window.alert(error)

        // ...
    });

}

//PassReset
function passreset() {
    var email = document.getElementById('email').value;

    firebase.auth().sendPasswordResetEmail(email).then(function() {
        window.alert("Email has been sent.");
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Eroor Msg" + errorMessage);
    });
}

function logout() {

    firebase.auth().signOut().then((user) => {
        window.location.href = "login.html";
    }).catch((error) => {
        // An error happened.
    });
}


// Insitute Dropdown
function adddata(I_name) {
    var inamed = document.getElementById("dinstitute");
    let newOption = new Option(I_name);
    inamed.add(newOption);
}

function getinstitute() {
    firebase.database().ref().on('value', function(snapshot) {
        var i = 0;
        snapshot.forEach(
            function(ChildSnapshot) {
                let i_name = Object.keys(snapshot.val())[i];
                i++;
                adddata(i_name);

            }
        );
    });
}

//Retreiving User Profile
function retr() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;

                
                    
                    img.src = user.photoURL;
                    

                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).on("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                        });

                    document.getElementById("pname").value = name;
                    document.getElementById("pemail").value = useremail;
                    document.getElementById("pinst").value = instname;

                    firebase.database().ref(instname + '/Faculty/' + uid).on("value", function(snapshot) {
                        document.getElementById("pfname").value = snapshot.val().Name;
                        document.getElementById("pmname").value = snapshot.val().MiddleName;
                        document.getElementById("plname").value = snapshot.val().LastName;
                        document.getElementById("pnum").value = snapshot.val().contact;
                    })
                });
            }
        } else {
            window.location.href = "login.html";
        }
    });
}

//Retreiving student User Profile
function retrs() {
    var ClassID;
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;
                img.src = user.photoURL;

                firebase.database().ref().orderByChild('Student/' + uid + '/mailid').equalTo(useremail).on("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                        });

                    document.getElementById("pname").value = name;
                    document.getElementById("pemail").value = useremail;
                    document.getElementById("pinst").value = instname;


                    firebase.database().ref(instname + '/Student/' + uid).on("value", function(snapshot) {
                        document.getElementById("pfname").value = snapshot.val().Name;
                        document.getElementById("pmname").value = snapshot.val().MiddleName;
                        document.getElementById("plname").value = snapshot.val().LastName;
                        document.getElementById("penroll").value = snapshot.val().Enroll;
                        ClassID=snapshot.val().ClassID;

                        firebase.database().ref(instname + '/Class/').on("value", function(snapshot){
                            snapshot.forEach(function(ChildSnapshot){
                                if(ClassID==ChildSnapshot.key)
                                {
                                    document.getElementById("penClass").value = ChildSnapshot.val().ClassName;
                                }
                            });
                        });

                    })
                });
              
            }
        } else {
            window.location.href = "login.html";
        }
    });
}
//Updating User Profile
function updatepdata() {
    var user = firebase.auth().currentUser;
    var pdname = document.getElementById('pname').value;
    var pemail = document.getElementById('pemail').value;
    var pfname = document.getElementById('pfname').value;
    var pmname = document.getElementById('pmname').value;
    var plname = document.getElementById('plname').value;
    var pnum = document.getElementById('pnum').value;
    var instname = document.getElementById('pinst').value;
    var uid = user.uid;
    if (user == "" || pdname == "" || pemail == "" || pfname == "" || plname == "" || pnum == "") {
        alert("Enter all details!!");
        window.location.href = "profile.html";
    } else {
        firebase.database().ref(instname + '/Faculty/' + uid).set({
            mailid: pemail,
            LastName: plname,
            MiddleName: pmname,
            Name: pfname,
            contact: pnum
        });

        if (user) {
            user.updateEmail(pemail).then(function() {})
            user.updateProfile({
                displayName: pdname
            })
        }

        setTimeout(() => {
            location.reload();
        }, 500);
    }
}

//Global Variable for uploading Profile Pic
// img = document.getElementById('img');

// let file = {};

// function chooseFile(e){
//         file = e.target.files[0];
// }

//Upload Profile Pic
// function updatepic(){
//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//             var uid = firebase.auth().currentUser;
//             if (user != null) {
//                 var uid = user.uid;
//                 var name = user.displayName;
//                 var useremail1 = user.email;
//                 var instname;
//                 console.log(useremail1);
//                 console.log(uid);
                
//                 setTimeout(() => {
//                     firebase.storage().ref('users/' + uid + '/profile.jpg').put(file).then(function() {
//                         console.log("Successfully Uploaded.")
//                     }).catch(Error => {
//                         console.log(Error.message);
//                     })
//                     firebase.storage().ref('users/' + uid + '/profile.jpg').getDownloadURL().then(imgURL =>{
//                         user.updateProfile({
                            
//                             photoURL: imgURL
//                           }).then(function() {
//                             // Update successful.
//                             console.log(imgURL)
//                             console.log("Pofile Done")
//                           }).catch(function(error) {
//                             // An error happened.
//                           });
//                     })
//                 }, 500);
                
//             }
//         } else {
//             window.location.href = "login.html";
//         }
//     });
    
    
// }

//updating student User Profile
function updatepdatas() {
    var user = firebase.auth().currentUser;
    var pdname = document.getElementById('pname').value;
    var pemail = document.getElementById('pemail').value;
    var pfname = document.getElementById('pfname').value;
    var pmname = document.getElementById('pmname').value;
    var plname = document.getElementById('plname').value;
    var penroll = document.getElementById('penroll').value;
    var instname = document.getElementById('pinst').value;
    var uid = user.uid;

    firebase.database().ref(instname + '/Student/' + uid).set({
        mailid: pemail,
        LastName: plname,
        MiddleName: pmname,
        Name: pfname,
        Enroll: penroll
    });

    if (user) {
        user.updateEmail(pemail).then(function() {})
        user.updateProfile({
            displayName: pdname
        })
    }

    setTimeout(() => {
        location.reload();
    }, 500);
}

// Pass Update
function changepass() {
    var oldpass = document.getElementById("poldpass").value;
    var newpass = document.getElementById("pnewpass").value;
    var newcpass = document.getElementById("pcnewpass").value;
    if (newpass == newcpass) {

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var useremail = user.email;
                console.log(useremail)

                console.log(oldpass);
                console.log(newpass);
                firebase.auth().signInWithEmailAndPassword(useremail, oldpass).then(function(user) {


                    firebase.auth().currentUser.updatePassword(newpass).then(function() {

                        setTimeout(() => {
                            location.reload();
                            alert("Password Changed");
                        }, 500);

                    }).catch(function(err) {
                        alert("Password Incorrect.Please Enter Correct Password");
                    });

                }).catch(function(err) {
                    alert("Password Incorrect.Please Enter Correct Password");
                    location.reload();
                });
            } else {
                alert("Unknown Error. Logout And Login Again")
            }
        });
    } else {
        alert("Password Don't Match");
    }



}


// Generate Link
function generateLink() {
    var from = document.getElementById('from').value;
    var to = document.getElementById('to').value;
    var pass = document.getElementById('password').value;
    var sem = document.getElementById('sem').value;
    if (from == "" || to == "" || pass == "" || sem == "") {
        alert("pls Enter all Details!!");
    } else {
        firebase.auth().onAuthStateChanged((user) => {

            if (user) {
                var uid = firebase.auth().currentUser;
                if (user != null) {
                    var uid = user.uid;
                    var useremail = user.email;
                    var name = user.displayName;;
                    var instname;

                    firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).on("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {
                                instname = parent.key;

                            });


                        var faculty_id = uid;

                        var genlink = document.getElementById('genlink');

                        genlink.value = "file:///D:/Github/MadX/OEP1/table2.html?from=" + from + "&to=" + to + "&pass=" + pass + "&faculty_id=" + faculty_id + "&i_name=" + instname;
                    });
                }
            }
        });
    }

}


//Class ID Generation
function genID() {
    var Classname = document.getElementById("classname").value;
    var sem = document.getElementById('sem').value;
    var i =false;
    if (Classname == "" || sem == "") {
        alert("Pls enter all details!!");
    } else {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = firebase.auth().currentUser;
                if (user != null) {
                    var uid = user.uid;
                    var useremail = user.email;
                    var name = user.displayName;
                    var instname;
                    firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {
                                instname = parent.key;
                            });

                        let yourdata = { ClassName: Classname, Sem: sem, HostFaculty: uid }
                        firebase.database().ref(instname + "/Class").once("value", function(snapshot) {
                            if (snapshot.exists()) 
                            {
                                snapshot.forEach(function(ChildSnapshot){
                                    if(Classname==ChildSnapshot.child("ClassName").val())
                                    {
                                        alert("Class Already Exists");
                                        window.location.href="index.html";
                                    }
                                });
                              
                               
                                firebase.database().ref(instname + "/Class").orderByKey().limitToLast(1).once("value", function(snapshot)
                                {
                                snapshot.forEach(function(parent) 
                                    {
                                        var key = parent.key;
                                        key = parseInt(key) + 1;
                                    
                                        firebase.database().ref(instname + "/Class").child(key).set(yourdata).then(ok =>alert("Successful")).catch(console.error);
                                    }
                                )
                                 });
                    
                            } else 
                            {
                                firebase.database().ref(instname + "/Class").child("1").set(yourdata).then(ok => alert("Successful")).catch(console.error);
                            }
                        }).catch(function(error) {
                            alert(error);
                        });
                    });
                }
            } else 
            {
                window.location.href="login.html";
            }
        });
    }

}


//Class Dropdown
function addclassData(class_name) {
    var classname = document.getElementById("classdrop");
    
    let newOption = new Option(class_name);
    
    classname.add(newOption);

}

function addclassData1(class_name) {
    
    var classname1 = document.getElementById("classdrop1");
   
    let newOption1 = new Option(class_name);

    classname1.add(newOption1);

}

function addclassDataAll(class_name){
    
    var classname2 = document.getElementById("classdropAll");
   
    let newOption2 = new Option(class_name);

    classname2.add(newOption2);

}

function getClass() {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;

                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                        });

                        firebase.database().ref(instname + "/Class").once('value', function(snapshot) {
                            snapshot.forEach(function(ChildSnapshot) 
                            {
                                var key = ChildSnapshot.key;
                                let class_name = ChildSnapshot.child("ClassName").val();
                                  if(ChildSnapshot.child("HostFaculty").val()==uid)
                                  {
                                  
                                    addclassData(class_name);
                                    addclassData1(class_name);
                                    addclassDataAll(class_name);
                                  }
                                  else
                                  {
                                    var i =0;
                                    firebase.database().ref(instname + "/Class/"+key+"/Subject").once('value',function(snapshot){
                                        snapshot.forEach(function(ChildSnapshot)
                                        { 
                                            
                                                    if(ChildSnapshot.child("Faculty").val()==uid)
                                                    {
                                                        if(i==0)
                                                        {
                                                            addclassData(class_name);
                                                            addclassData1(class_name);
                                                            addclassDataAll(class_name);
                                                          
                                                        }
                                                        i++
                                                    }
                                        });
                                      });
                                  }
                                   
                             });
                           
                        });









                    // firebase.database().ref(instname + "/Class").once('value', function(snapshot) {
                    //     snapshot.forEach(function(ChildSnapshot) 
                    //     {
                    //             let class_name = ChildSnapshot.child("ClassName").val();

                    //             addclassData(class_name);
                    //         }

                    //     );
                       
                    //     snapshot.forEach(
                    //         function(ChildSnapshot) {
                    //             let class_name = ChildSnapshot.child("ClassName").val();

                    //             addclassData1(class_name);
                                

                    //         }

                    //     );
                    // });

                });

            }
        } else {
            window.location.href = "login.html";
        }
    });

}



function getClassViewStudent() {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;

                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                        });

                        firebase.database().ref(instname + "/Class").once('value', function(snapshot) {
                            snapshot.forEach(function(ChildSnapshot) 
                            {
                                var key = ChildSnapshot.key;
                                let class_name = ChildSnapshot.child("ClassName").val();
                                  if(ChildSnapshot.child("HostFaculty").val()==uid)
                                  {
                                  
                                    addclassData(class_name);
                              
                                  }
                                  else
                                  {
                                    firebase.database().ref(instname + "/Class/"+key+"/Subject").once('value',function(snapshot){
                                        snapshot.forEach(function(ChildSnapshot)
                                        {
                                                        
                                                    if(ChildSnapshot.child("Faculty").val()==uid)
                                                    {
                                                     
                                                        addclassData(class_name);
                                              
                                                    }
                                        });
                                      });
                                  }
                                   
                             });
                           
                        });









                    // firebase.database().ref(instname + "/Class").once('value', function(snapshot) {
                    //     snapshot.forEach(function(ChildSnapshot) 
                    //     {
                    //             let class_name = ChildSnapshot.child("ClassName").val();

                    //             addclassData(class_name);
                    //         }

                    //     );
                       
                    //     snapshot.forEach(
                    //         function(ChildSnapshot) {
                    //             let class_name = ChildSnapshot.child("ClassName").val();

                    //             addclassData1(class_name);
                                

                    //         }

                    //     );
                    // });

                });

            }
        } else {
            window.location.href = "login.html";
        }
    });

}


function callhome() {
    window.location.href = "index.html";
}

function callhome1() {
    window.location.href = "studentindex.html";
}

function callviewexam() {
    window.location.href = "viewexam.html";
}

function callresult() {
    window.location.href = "result.html";
}
//Faculty DropDown 
function addfacultyData(faculty_name) {
    var facultyname = document.getElementById("facultydrop");
    let newOption = new Option(faculty_name);
    facultyname.add(newOption);
}

function getfaculty() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;

                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;

                        });

                    firebase.database().ref(instname + "/Faculty").once('value', function(snapshot) {

                        snapshot.forEach(
                            function(ChildSnapshot) {
                                let facultyfirst_name = ChildSnapshot.child("Name").val();
                                let facultylast_name = ChildSnapshot.child("LastName").val();
                                let faculty_mail = ChildSnapshot.child("mailid").val();

                                let faculty_name = facultyfirst_name + " " + facultylast_name + " (" + faculty_mail + ")";




                                addfacultyData(faculty_name);

                            }
                        );
                    });

                });
            }
        } else {
            window.location.href = "login.html";
        }
    });
}

//Getting Class ID and Insert Subject
function getClassID() {
    var subjectname = document.getElementById("subjectname").value;
    var classkey = sessionStorage.getItem("classid");
    var facultyName = document.getElementById("facultydrop").value;
    if (subjectname == ""  || facultyName == "") {
        alert("Enter all details!!");
    } else {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {

                var uid = firebase.auth().currentUser;
                if (user != null) {

                    var uid = user.uid;
                    var useremail = user.email;
                    var name = user.displayName;
                    var instname;


                    firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {
                                instname = parent.key;

                            });



                        firebase.database().ref(instname + "/Class").orderByKey().once("value", function(snapshot) {
               


                                    var n = facultyName.indexOf(" (");
                                    var n2 = facultyName.indexOf(")");

                                    var mail = facultyName.substr(n + 2, n2 - n - 2);

                                            firebase.database().ref(instname + "/Faculty").orderByKey().once("value", function(snapshot) {
                                                snapshot.forEach(function(parent) {
                                                    if (parent.child("mailid").val() == mail) {
                                                        var fid = parent.key;
                                                        let yourdata = { SubjectName: subjectname, Faculty: fid }
                                                        firebase.database().ref(instname + "/Class/" + classkey + "/Subject/").once("value", function(snapshot) {
                                                            if (snapshot.exists())
                                                             {
                                                                snapshot.forEach(function(ChildSnapshot)
                                                                {
                                                                    if(subjectname==ChildSnapshot.child("SubjectName").val())
                                                                    {
                                                                        alert("Subject ALready Exists!!");
                                                                        window.location.href="showclassdetail.html";
                                                                    }
                                                                });
                                                                
                                                                firebase.database().ref(instname + "/Class/" + classkey + "/Subject/").orderByKey().limitToLast(1).once("value", function(snapshot) {
                                                                    snapshot.forEach(function(parent) 
                                                                    {
                                                                            var key = parent.key;
                                                                            key = parseInt(key) + 1;
                                                                            firebase.database().ref(instname + "/Class/" + classkey + "/Subject/").child(key).set(yourdata).then(ok => alert("Successful123")).catch(console.error);
                                                                        }
                                                                    );
                                                                });
                                                            } else 
                                                            {
                                                                firebase.database().ref(instname + "/Class/" + classkey + "/Subject/").child("1").set(yourdata).then(ok => alert("Successful")).catch(console.error);
                                                            }
                                                        }).catch(function(error)
                                                         {
                                                            alert(error);
                                                        });

                                                    }

                                                });

                                            });


                                  

                        
                        });
                    });
                }
            } else {
                window.location.href = "login.html";
            }
        });
    }

}



// Get Exam Info (Scam)

function getexaminfos() {
    var subname = document.getElementById('sub').value;
    var ename = document.getElementById('ename').value;
    var edate = document.getElementById('edate').value;
    var etime = document.getElementById('starttime').value;
    var duration = document.getElementById('Duration').value;
    var totalque = document.getElementById('totalque').value;
    var marperque = document.getElementById('marksperque').value;
    var classid = sessionStorage.getItem("classid");
    if (subname == "" || ename == "" || edate == "" || etime == "" || duration == "" || totalque == "" || marperque == "") {
        alert("Enter all Details!!");
    } else {
        dArr = edate.split("-");
        var abcd = dArr[2] + "-" + dArr[1] + "-" + dArr[0].substring();

        var dateString = abcd + ' ' + etime,
            dateTimeParts = dateString.split(' '),
            timeParts = dateTimeParts[1].split(':'),
            dateParts = dateTimeParts[0].split('-'),
            date;

        date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);

        console.log(date.getTime());
        console.log(date);
        var etimestamp = date.getTime();
        console.log(etimestamp);

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {

                var uid = firebase.auth().currentUser;
                if (user != null) {

                    var uid = user.uid;
                    var useremail = user.email;
                    var name = user.displayName;
                    var instname;
                    var subkey;
                    let yourdata = { Ename: ename, Etimestamp: etimestamp, EDuration: duration, totalque: totalque, Marksperque: marperque }


                    firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {
                                instname = parent.key;
                            });

                        firebase.database().ref(instname + "/Class/" + classid + "/Subject").once("value", function(snapshot) {
                            snapshot.forEach(function(parent) {

                                firebase.database().ref(instname + "/Class/" + classid + "/Subject").once("value", function(snapshot) {
                                    if (parent.child("SubjectName").val() == subname) {
                                        subkey = parent.key;
                                        firebase.database().ref(instname + "/Class/" + classid + "/Subject/" + subkey + "/Exam").once("value", function(snapshot) {
                                            if (snapshot.exists()) {
                                                firebase.database().ref(instname + "/Class/" + classid + "/Subject/" + subkey + "/Exam").orderByKey().limitToLast(1).once("value", function(snapshot) {
                                                    snapshot.forEach(
                                                        function(parent) {
                                                            var key = parent.key;
                                                            key = parseInt(key) + 1;
                                                            sessionStorage.setItem("totalque", totalque);
                                                            sessionStorage.setItem("examkey", key);
                                                            sessionStorage.setItem("subkey", subkey);
                                                            firebase.database().ref(instname + "/Class/" + classid + "/Subject/" + subkey + "/Exam").child(key).set(yourdata).then(ok => window.location.href = "question.html").catch(console.error);

                                                        }
                                                    )
                                                });
                                            } else {
                                                var key1 = 1;
                                                sessionStorage.setItem("totalque", totalque);
                                                sessionStorage.setItem("examkey", key1);
                                                sessionStorage.setItem("subkey", subkey);
                                                firebase.database().ref(instname + "/Class/" + classid + "/Subject/" + subkey + "/Exam").child(key1).set(yourdata).then(ok => window.location.href = "question.html").catch(console.error);
                                            }
                                        });
                                    }
                                });

                            })

                        });




                    });
                }
            } else {
                window.location.href = "login.html";
            }
        });

    }


}

// Subject dropdown (Create Exam)

function addSubData(class_name) {
    var classname = document.getElementById("sub");
    let newOption = new Option(class_name);
    classname.add(newOption);
}

function getSub() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;
                var classid = sessionStorage.getItem("classid");
                console.log(classid)

                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                        });

                    firebase.database().ref(instname + "/Class/" + classid ).once('value', function(snapshot) {
                       
                             if(snapshot.child("HostFaculty").val()==uid)
                             {
                                firebase.database().ref(instname + "/Class/" + classid+"/Subject").once('value', function(snapshot){
                                    snapshot.forEach(function(ChildSnapshot) 
                                    {
                                            let class_name = ChildSnapshot.child("SubjectName").val();
                                            addSubData(class_name);
                                    });
                                }); 
                             }
                             else
                             {
                                firebase.database().ref(instname + "/Class/" + classid+"/Subject").once('value', function(snapshot){
                                    snapshot.forEach(function(ChildSnapshot) 
                                    {
                                            if(ChildSnapshot.child("Faculty").val()==uid)
                                            {
                                                let class_name = ChildSnapshot.child("SubjectName").val();
                                                addSubData(class_name);
                                            }
                                    });
                                }); 
                             }
                            
                     
                    });

                });

            }
        } else {
            window.location.href = "login.html";
        }
    });

}

//Display All Exams
var instname;
var ClassID;
var SubjectKey;
var EID;
var uid ;
var currentDate;
var endTimestamp ;
var Etimestamp;
var cell7 ;
var examid = [];
var subid = [];
var stime = [];
var endtime = [];
var totalq=[];
function getAllExams() {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;
                var classid = sessionStorage.getItem("classid");
             

                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                            sessionStorage.setItem("instname",instname);
                       
                        });

                    firebase.database().ref(instname + "/Class/" + classid ).once('value', function(snapshot) {
                
                             if(snapshot.child("HostFaculty").val()==uid)
                             {
                           
                                firebase.database().ref(instname + "/Class/" + classid+"/Subject").once('value', function(snapshot){
                                    var i = 0;
                                    var j=0;
                                    snapshot.forEach(function(ChildSnapshot) 
                                    {
                                      
                                            let SubjectName = ChildSnapshot.child("SubjectName").val();
                                            SubjectKey=ChildSnapshot.key;
                                           
                                            firebase.database().ref(instname + '/Class/' + classid + '/Subject/' + SubjectKey + '/Exam').once('value', function(snapshot) {
                                                console.log(instname + '/Class/' + classid + '/Subject/' + SubjectKey + '/Exam');
                                                snapshot.forEach(function(ChildSnapshot) {
                                               
                                                    EID = ChildSnapshot.key;
                                                    // var subjectid = subid[j];
                                                 
                                                    examid.push(EID);
                                                //     sub.push(subjectid);
                                                //    console.log(j+"J");
                                                    var sid1 = ChildSnapshot.ref.parent.parent.key;
                                                    subid.push(sid1);
                                                    var Ename = ChildSnapshot.child("Ename").val();
                                                    var EDuration = ChildSnapshot.child("EDuration").val();
                                                    Etimestamp = ChildSnapshot.child("Etimestamp").val();
                                                    var Marksperque = ChildSnapshot.child("Marksperque").val();
                                                    totalque = ChildSnapshot.child("totalque").val();
                                                    var Marks = Marksperque * totalque;
                                                    var Edate = new Date(Etimestamp);
                                                    var date = Edate.toDateString();
                                                    var time = Edate.toLocaleTimeString();
                                                    var n = date.indexOf(" ");
                                                    var DATE = date.substr(n);
                                                    endTimestamp =Etimestamp + EDuration * 60000;
                                                    sessionStorage.setItem("endTimestamp", endTimestamp);
                                                    stime.push(Etimestamp);
                                                    endtime.push(endTimestamp);
                                                    totalq.push(totalque);
                
                                                    firebase.database().ref('/.info/serverTimeOffset').once('value').then(function stv(data) {
                
                                                        currentDate = data.val() + Date.now();
                                                    }, function(err) {
                                                        return err;
                                                    });
                
                
                
                                                    var table = document.getElementById('dataTableAll');
                
                                                    var classname = ".row-data-" + i;
                
                                                    var rowCount = table.rows.length;
                                                    row = table.insertRow(rowCount);
                
                                                    row.id = i;
                                                    var cell1 = row.insertCell(0);
                                                    cell1.className += classname;
                                                    cell1.innerHTML = Ename ;
                                                    var e1 = examid[i];
                                                    var totalq1 = totalq[i];
                                                    var start = stime[i];
                                                    var end = endtime[i];
                                                    var cell2 = row.insertCell(1);
                                                    cell2.className += classname;
                                                    cell2.innerHTML = SubjectName;
                                         
                
                                                    var cell3 = row.insertCell(2);
                                                    cell3.className += classname;
                                                    cell3.innerHTML = EDuration + " Minutes";
                
                                                    var cell4 = row.insertCell(3);
                                                    cell4.className += classname;
                                                    cell4.innerHTML = Marks;
                
                                                   
                                                    var cell5 = row.insertCell(4);
                                                    cell5.className += classname;
                                                    cell5.innerHTML = DATE;
                
                                                    var cell6 = row.insertCell(5);
                                                    cell6.innerHTML = time;
                                                
                                                 
                                                   cell7 = row.insertCell(6);
                                                    cell7.id = sid1+"-"+e1;
                                                    var element5 = document.createElement("input");
                                                    element5.id = i + "button";
                                                    element5.type = "button";
                                                    element5.name = "submit[]";
                                                    element5.value = "Delete";
                                                    element5.onclick = function() { removeExam() };
                
                
                                 
                
                                                    cell7.appendChild(element5);
                                        
                                                    i++;
                
                
                                                });
                                           
                
                                            });
                                    });
                                }); 
                             }
                             else
                             {
                                firebase.database().ref(instname + "/Class/" + classid+"/Subject").once('value', function(snapshot){
                                    var i = 0;
                                    var j=0;
                                    snapshot.forEach(function(ChildSnapshot) 
                                    {
                                            if(ChildSnapshot.child("Faculty").val()==uid)
                                            {
                                                let SubjectName = ChildSnapshot.child("SubjectName").val();
                                               
                                                    SubjectKey=ChildSnapshot.key;
                                                    
                                                    firebase.database().ref(instname + '/Class/' + classid + '/Subject/' + SubjectKey + '/Exam').once('value', function(snapshot) {
                                                        console.log(instname + '/Class/' + classid + '/Subject/' + SubjectKey + '/Exam');
                                                        snapshot.forEach(function(ChildSnapshot) {
                                                        
                                                            EID = ChildSnapshot.key;
                                                            // var subjectid = subid[j];
                                                            
                                                            examid.push(EID);
                                                        //     sub.push(subjectid);
                                                        //    console.log(j+"J");
                                                            var sid1 = ChildSnapshot.ref.parent.parent.key;
                                                            subid.push(sid1);
                                                            var Ename = ChildSnapshot.child("Ename").val();
                                                            var EDuration = ChildSnapshot.child("EDuration").val();
                                                            Etimestamp = ChildSnapshot.child("Etimestamp").val();
                                                            var Marksperque = ChildSnapshot.child("Marksperque").val();
                                                            totalque = ChildSnapshot.child("totalque").val();
                                                            var Marks = Marksperque * totalque;
                                                            var Edate = new Date(Etimestamp);
                                                            var date = Edate.toDateString();
                                                            var time = Edate.toLocaleTimeString();
                                                            var n = date.indexOf(" ");
                                                            var DATE = date.substr(n);
                                                            endTimestamp =Etimestamp + EDuration * 60000;
                                                            sessionStorage.setItem("endTimestamp", endTimestamp);
                                                            stime.push(Etimestamp);
                                                            endtime.push(endTimestamp);
                                                            totalq.push(totalque);
                        
                                                            firebase.database().ref('/.info/serverTimeOffset').once('value').then(function stv(data) {
                        
                                                                currentDate = data.val() + Date.now();
                                                            }, function(err) {
                                                                return err;
                                                            });
                        
                        
                        
                                                            var table = document.getElementById('dataTableAll');
                        
                                                            var classname = ".row-data-" + i;
                        
                                                            var rowCount = table.rows.length;
                                                            row = table.insertRow(rowCount);
                        
                                                            row.id = i;
                                                            var cell1 = row.insertCell(0);
                                                            cell1.className += classname;
                                                            cell1.innerHTML = Ename ;
                                                            var e1 = examid[i];
                                                            var totalq1 = totalq[i];
                                                            var start = stime[i];
                                                            var end = endtime[i];
                                                            var cell2 = row.insertCell(1);
                                                            cell2.className += classname;
                                                            cell2.innerHTML = SubjectName;
                                                    
                        
                                                            var cell3 = row.insertCell(2);
                                                            cell3.className += classname;
                                                            cell3.innerHTML = EDuration + " Minutes";
                        
                                                            var cell4 = row.insertCell(3);
                                                            cell4.className += classname;
                                                            cell4.innerHTML = Marks;
                        
                                                            
                                                            var cell5 = row.insertCell(4);
                                                            cell5.className += classname;
                                                            cell5.innerHTML = DATE;
                        
                                                            var cell6 = row.insertCell(5);
                                                            cell6.innerHTML = time;
                                                        
                                                            
                                                            cell7 = row.insertCell(6);
                                                            cell7.id = sid1+"-"+e1;
                                                            var element5 = document.createElement("input");
                                                            element5.id = i + "button";
                                                            element5.type = "button";
                                                            element5.name = "submit[]";
                                                            element5.value = "Delete";
                                                            element5.onclick = function() { removeExam() };
                        
                        
                                            
                        
                                                            cell7.appendChild(element5);
                                                
                                                            i++;
                        
                        
                                                        });
                                                    
                        
                                                    });
                                            
                                        
                                            }
                                    });
                                }); 
                             }   
                     
                    });

                });

            }
        } else {
            window.location.href = "login.html";
        }
    });

}

function removeExam()
  {
   
    var rowId = event.target.parentNode.parentNode.id;
    var classname = ".row-data-" + rowId
    var x = document.getElementsByClassName(classname);
    var classid = sessionStorage.getItem("classid");
    var instname = sessionStorage.getItem("instname");

    var sid = subid[rowId];
    var EID = examid[rowId];


    firebase.database().ref( instname+ '/Class/'+classid+'/Subject/'+sid+'/Exam/').child(EID).remove();

    document. location. reload() ;
 
    // var Ename = x[0].innerHTML;
    // var subjectname = x[1].innerHTML;
  }

//Get Class ID FOR EXAM
function getClassid1() {
    var className = document.getElementById('classdrop').value;
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;


                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;

                        });



                    firebase.database().ref(instname + "/Class").orderByKey().once("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {

                                firebase.database().ref(instname + "/Class/").once("value", function(snapshot) {
                                    if (parent.child("ClassName").val() == className) {

                                        var classkey = parent.key;
                                        sessionStorage.setItem("classid", classkey);

                                        window.location.href = "exam.html";

                                    }

                                });

                            }
                        )
                    });
                });
            }
        } else {
            window.location.href = "login.html";
        }
    });
}

//Get Class ID FOR CLASS
function getClassid12() {
    var className = document.getElementById('classdrop1').value;
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;


                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;

                        });



                    firebase.database().ref(instname + "/Class").orderByKey().once("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {

                                firebase.database().ref(instname + "/Class/").once("value", function(snapshot) {
                                    if (parent.child("ClassName").val() == className) {

                                        var classkey = parent.key;
                               
                                        sessionStorage.setItem("classid", classkey);

                                        window.location.href = "showclassdetail.html";

                                    }

                                });

                            }
                        )
                    });
                });
            }
        } else {
            window.location.href = "login.html";
        }
    });
}

// GET CLASS ID FOR ALL EXAMS
function getClassidAll() {
   
    var className = document.getElementById('classdropAll').value;
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;


                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;

                        });



                    firebase.database().ref(instname + "/Class").orderByKey().once("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {

                                firebase.database().ref(instname + "/Class/").once("value", function(snapshot) {
                                    if (parent.child("ClassName").val() == className) {

                                        var classkey = parent.key;
                                        
                                        alert(classkey);
                                        sessionStorage.setItem("classid", classkey);

                                        window.location.href = "allexam.html";

                                    }

                                });

                            }
                        )
                    });
                });
            }
        } else {
            window.location.href = "login.html";
        }
    });
}

//Get SUBJECT
function getsubject() {
    var className = document.getElementById('classdrop').value;
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;


                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;

                        });



                    firebase.database().ref(instname + "/Class").orderByKey().once("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {

                                firebase.database().ref(instname + "/Class/").once("value", function(snapshot) {
                                    if (parent.child("ClassName").val() == className) {

                                        var classkey = parent.key;
                                        sessionStorage.setItem("classid", classkey);

                                        window.location.href = "exam.html";

                                    }

                                });

                            }
                        )
                    });
                });
            }
        } else {
            window.location.href = "login.html";
        }
    });
}

var instname;
var ClassID;
var SubjectKey;
var EID;
var uid ;
var currentDate;
var endTimestamp ;
var Etimestamp;
var cell7 ;
var examid = [];
var subid = [];
var stime = [];
var endtime = [];
var totalq=[];

//Exam List
function viewexam() {
 
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;

                firebase.database().ref().orderByChild('Student/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                            ClassID = parent.child('Student/' + uid + '/ClassID').val();
                     
                        });

                    firebase.database().ref(instname + '/Class/' + ClassID + '/Subject').once('value', function(snapshot) {
                    
                        var i = 0;
                        var j=0;
                        snapshot.forEach(function(ChildSnapshot) {
                            let SubjectName = ChildSnapshot.child("SubjectName").val();
                            SubjectKey = ChildSnapshot.key;
                            subid.push(SubjectKey);
                        
                     
                            firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + SubjectKey + '/Exam').once('value', function(snapshot) {
                          
                                snapshot.forEach(function(ChildSnapshot) {
                               
                                    EID = ChildSnapshot.key;
                                    // var subjectid = subid[j];
                                    examid.push(EID);
                                //     sub.push(subjectid);
                                //    console.log(j+"J");
                                    var sid1 = ChildSnapshot.ref.parent.parent.key;
                              
                                    var Ename = ChildSnapshot.child("Ename").val();
                                    var EDuration = ChildSnapshot.child("EDuration").val();
                                    Etimestamp = ChildSnapshot.child("Etimestamp").val();
                                    var Marksperque = ChildSnapshot.child("Marksperque").val();
                                    totalque = ChildSnapshot.child("totalque").val();
                                    var Marks = Marksperque * totalque;
                                    var Edate = new Date(Etimestamp);
                                    var date = Edate.toDateString();
                                    var time = Edate.toLocaleTimeString();
                                    var n = date.indexOf(" ");
                                    var DATE = date.substr(n);
                                    endTimestamp =Etimestamp + EDuration * 60000;
                                 
                                    stime.push(Etimestamp);
                                    endtime.push(endTimestamp);
                                    totalq.push(totalque);

                                    firebase.database().ref('/.info/serverTimeOffset').once('value').then(function stv(data) {

                                        currentDate = data.val() + Date.now();
                                    }, function(err) {
                                        return err;
                                    });



                                    var table = document.getElementById('dataTable1');

                                    var classname = ".row-data-" + i;

                                    var rowCount = table.rows.length;
                                    row = table.insertRow(rowCount);

                                    row.id = i;
                                    var cell1 = row.insertCell(0);
                                    cell1.className += classname;
                                    cell1.innerHTML = Ename ;
                                    var e1 = examid[i];
                                    var totalq1 = totalq[i];
                                    var start = stime[i];
                                    var end = endtime[i];
                                    var cell2 = row.insertCell(1);
                                    cell2.className += classname;
                                    cell2.innerHTML = SubjectName;
                         

                                    var cell3 = row.insertCell(2);
                                    cell3.className += classname;
                                    cell3.innerHTML = EDuration + " Minutes";

                                    var cell4 = row.insertCell(3);
                                    cell4.className += classname;
                                    cell4.innerHTML = Marks;

                                   
                                    var cell5 = row.insertCell(4);
                                    cell5.className += classname;
                                    cell5.innerHTML = DATE;

                                    var cell6 = row.insertCell(5);
                                    cell6.innerHTML = time;
                                
                                 
                                   cell7 = row.insertCell(6);
                                    cell7.id = sid1+"-"+e1;
                                    var element5 = document.createElement("input");
                                    element5.id = i + "button";
                                    element5.type = "button";
                                    element5.name = "submit[]";
                                    element5.value = "Start";
                                    element5.onclick = function() { passexaminfo() };


                                    var element6 = document.createElement("input");
                                    element6.id = i + "button";
                                    element6.type = "button";
                                    element6.name = "submit[]";
                                    element6.value = "Continue";
                                    element6.style= " display:none;";
                                    element6.onclick = function() { passexaminfo() };

                                    cell7.appendChild(element5);
                                    cell7.appendChild(element6);
                                    i++;

                               
                                
                                    firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + sid1+ '/Exam/' +  e1 + '/Answer/' + uid ).once('value', function(snapshot) {
                                        
                                        var c7 = document.getElementById( sid1+"-"+e1);
                                    
                               
                                        if(snapshot.exists())
                                        {
                                            firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + sid1+ '/Exam/' +  e1 + '/Answer/' + uid ).orderByKey().limitToLast(1).once("value", function(snapshot) {
                                            snapshot.forEach(function(parent) {
                                                  var anskey = parent.key;
                                                  if(anskey==totalq1)
                                                  {
                                                    c7.innerHTML = "Already Given !!";
                                                  }
                                                  else if(currentDate>=start && currentDate<=end)
                                                  {
                                                    element5.style= " display:none;";
                                                    element6.style= " display:normal;";
                                                  }
                                                  else if(currentDate>end)
                                                  {
                                                      c7.innerHTML = "Time is UP";
                                                  }
                                                });
                                           });
                                           
                                        }
                                         else if(currentDate>=start && currentDate<=end)
                                        {
                                          element5.disabled=false;
                                        }
                                        else if(currentDate>end)
                                        {
                                            c7.innerHTML = "Time is UP";
                                        }
                                   
                                        else if(currentDate<start)
                                        {
                                         element5.disabled = false;  
                                        }

                                 
                                    });
                                 
                        
                           

                                });
                           

                            });


                        });

                     
                    });

                  
                });

            }
      
        } else {
            window.location.href = "login.html";
        }
    });
}



//PassExam Information
function passexaminfo() {
    var instname;
    var ClassID;
    var rowId = event.target.parentNode.parentNode.id;
    var classname = ".row-data-" + rowId
    var x = document.getElementsByClassName(classname);
    var endTime=endtime[rowId];
    sessionStorage.setItem("endTimestamp", endTime);
    var Ename = x[0].innerHTML;
    var subjectname = x[1].innerHTML;

   
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;

                firebase.database().ref().orderByChild('Student/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                            ClassID = parent.child('Student/' + uid + '/ClassID').val();
                          
                        });

                    firebase.database().ref(instname + '/Class/' + ClassID + '/Subject').once('value', function(snapshot) {
                        var i = 0;
                     
                        snapshot.forEach(function(ChildSnapshot) {
                         
                            if (subjectname == ChildSnapshot.child("SubjectName").val()) {
                                var SubjectKey = ChildSnapshot.key;
                               
                                firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + SubjectKey + '/Exam').once('value', function(snapshot) {
                                    snapshot.forEach(function(ChildSnapshot) {
                                        if (Ename == ChildSnapshot.child("Ename").val()) {
                                            var EID = ChildSnapshot.key;

                                            sessionStorage.setItem("ClassID", ClassID);
                                            sessionStorage.setItem("SubjectKey", SubjectKey);
                                            sessionStorage.setItem("EID", EID);
                                            
                                            window.location.href = "answerexam.html";
                                        }
                                    });

                                });
                            }

                        });

                    });
                });

            }
        } else {
            window.location.href = "login.html";
        }
    });

}

var Examid = [];
var SubID = [];
function viewresult() {
    var instname;
    var ClassID;
    var SubjectKey;
    var EID;

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;

                firebase.database().ref().orderByChild('Student/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                            ClassID = parent.child('Student/' + uid + '/ClassID').val();
                            sessionStorage.setItem("instname",instname);
                            sessionStorage.setItem("ClassID",ClassID);
                            sessionStorage.setItem("StudentID",uid);
                        });

                    firebase.database().ref(instname + '/Class/' + ClassID + '/Subject').once('value', function(snapshot) {

                        var i = 0;
                        snapshot.forEach(function(ChildSnapshot) {
                            let SubjectName = ChildSnapshot.child("SubjectName").val();
                            let SubjectKey = ChildSnapshot.key;
                    
                            



                            firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + SubjectKey + '/Exam').once('value', function(snapshot) {
                                snapshot.forEach(function(ChildSnapshot) {
                                    var sid1 = ChildSnapshot.ref.parent.parent.key;
                                    SubID.push(sid1);
                                    EID = ChildSnapshot.key;
                                    Examid.push(EID);
                                    var Ename = ChildSnapshot.child("Ename").val();
                                    var EDuration = ChildSnapshot.child("EDuration").val();
                                    var Etimestamp = ChildSnapshot.child("Etimestamp").val();
                                    var Marksperque = ChildSnapshot.child("Marksperque").val();
                                    var totalque = ChildSnapshot.child("totalque").val();
                                    var Marks = Marksperque * totalque;
                                    var Edate = new Date(Etimestamp);
                                    var date = Edate.toDateString();
                                    var time = Edate.toLocaleTimeString();
                                    var n = date.indexOf(" ");
                                    var DATE = date.substr(n);
                                    var endTimestamp = new Date(Etimestamp + EDuration * 60000);
                                    var gainedmarks = ChildSnapshot.child('/Result/' + uid + '/Marks/').val();


                                    firebase.database().ref('/.info/serverTimeOffset').once('value').then(function stv(data) {

                                        currentDate = data.val() + Date.now();
                                    }, function(err) {
                                        return err;
                                    });

                                    var table = document.getElementById('dataTable2');

                                    var classname = ".row-data-" + i;

                                    var rowCount = table.rows.length;
                                    row = table.insertRow(rowCount);
                                
                                    row.id = i;
                                    var cell1 = row.insertCell(0);
                                    cell1.className += classname;
                                    cell1.innerHTML = Ename;

                                    var cell2 = row.insertCell(1);
                                    cell2.className += classname;
                                    cell2.innerHTML = SubjectName;



                                    var cell3 = row.insertCell(2);
                                    cell3.className += classname;
                                    cell3.innerHTML = DATE;

                                    var cell4 = row.insertCell(3);
                                    cell4.className += classname;
                                    cell4.innerHTML = Marks;


                                    var cell5 = row.insertCell(4);
                                    cell5.className += classname;

                         

                                    var element5 = document.createElement("input");
                                    element5.id = i + "button";
                                    element5.type = "button";
                                    element5.name = "submit[]";
                                    element5.value = "Show Details";
                                    element5.style= " display:none;";
                                    element5.onclick = function() {  passexaminfoRDetailsS()};

                                    var cell7 = row.insertCell(5);
                                    cell7.className += classname;
                                    cell7.appendChild(element5);

                                    i++;
                                
                                    var subkey = sessionStorage.getItem("SubjectKey");
                                    firebase.database().ref(instname + "/Class/" + ClassID + "/Subject/" + SubjectKey + "/Exam/" + EID + "/Result/" + uid).once('value', function(snapshot) {


                                     
                                        if (snapshot.exists()) {
                                            if (currentDate > endTimestamp) {

                                                cell5.innerHTML = gainedmarks;
                                                element5.style= " display:normal;";

                                            } else if (currentDate <= endTimestamp) {
                                                cell5.innerHTML = "Please Wait Till Exam Time Is Over !!";
                                            }
                                        } else {
                                            cell5.innerHTML = "Exam Not Given Yet!!";
                                        }

                                    });


                                });

                            });

                        });

                    });
                });

            }
        } else {
            window.location.href = "login.html";
        }
    });
}

function passexaminfoRDetailsS()
{
    var rowId = event.target.parentNode.parentNode.id;
    var classname = ".row-data-" + rowId;
    var x = document.getElementsByClassName(classname);
    var ExamID= Examid[rowId];
    var SID= SubID[rowId];
    sessionStorage.setItem("EID",ExamID);
    sessionStorage.setItem("SubjectKey",SID);
    
    // sessionStorage.setItem("StudentID", StudentID);
    window.location.href = "answerperqueS.html";
}

function viewresultf() {
    var instname;
    var ClassID = sessionStorage.getItem("classid");
    var SubjectKey;
    var EID;


    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;


                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                            console.log(instname)
                                // ClassID = parent.child('Faculty/'+uid+'/ClassID').val();  
                                // console.log(ClassID)       
                        });

                    firebase.database().ref(instname + '/Class/' + ClassID + '/Subject').once('value', function(snapshot) {

                        var i = 0;
                        snapshot.forEach(function(ChildSnapshot) {
                            let SubjectName = ChildSnapshot.child("SubjectName").val();
                            SubjectKey = ChildSnapshot.key;

                            console.log(SubjectKey)

                            firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + SubjectKey + '/Exam').once('value', function(snapshot) {
                                snapshot.forEach(function(ChildSnapshot) {

                                    EID = ChildSnapshot.key;
                                    var Ename = ChildSnapshot.child("Ename").val();
                                    var EDuration = ChildSnapshot.child("EDuration").val();
                                    var Etimestamp = ChildSnapshot.child("Etimestamp").val();
                                    var Marksperque = ChildSnapshot.child("Marksperque").val();
                                    var totalque = ChildSnapshot.child("totalque").val();
                                    var Marks = Marksperque * totalque;
                                    var Edate = new Date(Etimestamp);
                                    var date = Edate.toDateString();
                                    var time = Edate.toLocaleTimeString();
                                    var n = date.indexOf(" ");
                                    var DATE = date.substr(n);
                                    var endTimestamp = new Date(Etimestamp + EDuration * 60000);

                                    firebase.database().ref('/.info/serverTimeOffset').once('value').then(function stv(data) {

                                        currentDate = data.val() + Date.now();
                                    }, function(err) {
                                        return err;
                                    });

                                    var table = document.getElementById('dataTable2');

                                    var classname = ".row-data-" + i;

                                    var rowCount = table.rows.length;
                                    row = table.insertRow(rowCount);
                                  
                                    row.id = i;
                                    var cell1 = row.insertCell(0);
                                    cell1.className += classname;
                                    cell1.innerHTML = Ename;

                                    var cell2 = row.insertCell(1);
                                    cell2.className += classname;
                                    cell2.innerHTML = SubjectName;



                                    var cell3 = row.insertCell(2);
                                    cell3.className += classname;
                                    cell3.innerHTML = DATE;

                                    var cell4 = row.insertCell(3);
                                    cell4.className += classname;
                                    cell4.innerHTML = Marks;


                                    var cell5 = row.insertCell(4);
                                    cell5.className += classname;





                                    var element5 = document.createElement("input");
                                    element5.id = i + "button";
                                    element5.type = "button";
                                    element5.name = "submit[]";
                                    element5.value = "Show Result";
                                    element5.onclick = function() { passexaminfoR() };

                                    cell5.appendChild(element5);
                                    console.log(EID);
                                    i++;
                                    //  firebase.database().ref(instname + "/Class/"+ClassID+"/Subject/"+SubjectKey+"/Exam/"+EID+"/Result/"+uid).once('value',function(snapshot){


                                    //    if(snapshot.exists())
                                    //    {
                                    //      if(currentDate>endTimestamp)
                                    //      {
                                    //            cell5.innerHTML = snapshot.child("Marks").val();   
                                    //      }
                                    //      else if(currentDate<=endTimestamp)
                                    //      {
                                    //        cell5.innerHTML= "Please Wait Till Exam Time Is Over !!";
                                    //      }
                                    //    }
                                    //    else 
                                    //    {
                                    //      cell5.innerHTML="Exam Not Given Yet!!";
                                    //    }

                                    //  });


                                });

                            });

                        });

                    });
                });

            }
        } else {
            window.location.href = "login.html";
        }
    });
}

//Get Class ID Result
function getsubjectR() {

    var className = document.getElementById('classdrop').value;
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;
                var instname;


                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;

                        });



                    firebase.database().ref(instname + "/Class").orderByKey().once("value", function(snapshot) {
                        snapshot.forEach(
                            function(parent) {

                                firebase.database().ref(instname + "/Class/").once("value", function(snapshot) {
                                    if (parent.child("ClassName").val() == className) {

                                        var classkey = parent.key;
                                        sessionStorage.setItem("classid", classkey);
                                        viewresultf();


                                    }

                                });

                            }
                        )
                    });
                });
            }
        } else {
            window.location.href = "login.html";
        }
    });
}

//Pass exam Info result
function passexaminfoR() {
    var instname;
    var ClassID = sessionStorage.getItem("classid");
    var rowId = event.target.parentNode.parentNode.id;
    var classname = ".row-data-" + rowId;
    var x = document.getElementsByClassName(classname);


    var Ename = x[0].innerHTML;
    var subjectname = x[1].innerHTML;
    var date = x[2].innerHTML;
    var totalmarks = x[3].innerHTML;
    sessionStorage.setItem("totalmarks", totalmarks);
 alert(Ename);


    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;

                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;

                        });

                    firebase.database().ref(instname + '/Class/' + ClassID + '/Subject').once('value', function(snapshot) {
                        var i = 0;
                        snapshot.forEach(function(ChildSnapshot) {
                            if (subjectname == ChildSnapshot.child("SubjectName").val()) {
                                var SubjectKey = ChildSnapshot.key;
                                
                                firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + SubjectKey + '/Exam').once('value', function(snapshot) {
                                    snapshot.forEach(function(ChildSnapshot) {
                                        if (Ename == ChildSnapshot.child("Ename").val()) {
                                            var EID = ChildSnapshot.key;
                                            console.log(EID, subjectname, Ename);
                                            sessionStorage.setItem("ClassID", ClassID);
                                            sessionStorage.setItem("SubjectKey", SubjectKey);
                                            sessionStorage.setItem("EID", EID);

                                            sessionStorage.setItem("date", date);
                                            sessionStorage.setItem("subjectname", subjectname);


                                            window.location.href = "subresult.html";
                                        }
                                    });

                                });
                            }

                        });

                    });
                });

            }
        } else {
            window.location.href = "login.html";
        }
    });
}

//Student Result in Faculty Side
var Sid=[];
function viewStudentResultf() {
    var instname;
    var ClassID = sessionStorage.getItem("classid");
    var SubjectKey = sessionStorage.getItem("SubjectKey");
    var EID = sessionStorage.getItem("EID");
    var subjectname = sessionStorage.getItem("subjectname");
    var date = sessionStorage.getItem("date");
    var totalmarks = sessionStorage.getItem("totalmarks");


    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = firebase.auth().currentUser;
            if (user != null) {

                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;


                firebase.database().ref().orderByChild('Faculty/' + uid + '/mailid').equalTo(useremail).once("value", function(snapshot) {
                    snapshot.forEach(
                        function(parent) {
                            instname = parent.key;
                            sessionStorage.setItem("instname",instname);
                            console.log(SubjectKey);
                                // ClassID = parent.child('Faculty/'+uid+'/ClassID').val();  
                                      
                        });


                    firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + SubjectKey + '/Exam/' + EID + '/Result').orderByChild("Enroll").once('value', function(snapshot) {
                     
                        var i = 0;
                        snapshot.forEach(function(ChildSnapshot) {
                         
                            var sid = ChildSnapshot.key;
                            var marks = ChildSnapshot.child("Marks").val();
                         
                            
                            firebase.database().ref(instname + '/Student/' + sid).once('value', function(snapshot) {

                                var sname = snapshot.child("Name").val();
                                var slname = snapshot.child("LastName").val();
                                var enroll = snapshot.child("Enroll").val();

                                var name = sname + " " + slname;
                                Sid.push(sid);
                                console.log(name, marks, subjectname, date, totalmarks);

                                var table = document.getElementById('dataTable3');

                                var classname = ".row-data-" + i;

                                var rowCount = table.rows.length;
                                row = table.insertRow(rowCount);
                                
                                row.id = i;

                                var cell1 = row.insertCell(0);
                                cell1.className += classname;
                                cell1.innerHTML = enroll;

                                var cell2 = row.insertCell(1);
                                cell2.className += classname;
                                cell2.innerHTML = name;

                                var cell3 = row.insertCell(2);
                                cell3.className += classname;
                                cell3.innerHTML = subjectname;



                                var cell4 = row.insertCell(3);
                                cell4.className += classname;
                                cell4.innerHTML = date;

                                var cell5 = row.insertCell(4);
                                cell5.className += classname;
                                cell5.innerHTML = marks;

                                var cell6 = row.insertCell(5);
                                cell6.className += classname;
                                cell6.innerHTML = totalmarks;

                                
                                var element5 = document.createElement("input");
                                element5.id = i + "button";
                                element5.type = "button";
                                element5.name = "submit[]";
                                element5.value = "Show Details";
                                element5.onclick = function() {  passexaminfoRDetails()};

                                var cell7 = row.insertCell(6);
                                cell7.className += classname;
                                cell7.appendChild(element5);
                                console.log(EID);
                                i++;
                              



                            });
                        });

                    });

                });

            }
        } else {
            window.location.href = "login.html";
        }
    });
}

function passexaminfoRDetails() {
   
    var rowId = event.target.parentNode.parentNode.id;
    var classname = ".row-data-" + rowId;
    var x = document.getElementsByClassName(classname);
    var StudentID = Sid[rowId];

    
    sessionStorage.setItem("StudentID", StudentID);
    window.location.href = "answerperque.html";
}

// Question Wise Result in Faculty Side

function quewiseResultF()
{
    var ClassID = sessionStorage.getItem("ClassID");
    var SubjectKey = sessionStorage.getItem("SubjectKey");
    var EID = sessionStorage.getItem("EID");
    var instname = sessionStorage.getItem("instname");
    var sid =  sessionStorage.getItem("StudentID");
alert(instname);
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = firebase.auth().currentUser;
            if (user != null) {
                var uid = user.uid;
                var useremail = user.email;
                var name = user.displayName;

                
     

                    firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + SubjectKey + '/Exam/' + EID + '/Answer/' + sid).once('value', function(snapshot) {
                       var i=0;
                        snapshot.forEach(function(ChildSnapshot) {
                            var Studentans = ChildSnapshot.child('Ans').val();
                            var q = ChildSnapshot.key;
                            firebase.database().ref(instname + '/Class/' + ClassID + '/Subject/' + SubjectKey + '/Exam/' + EID + '/Question/' + q).once('value', function(snapshot) {
                                var Correct = snapshot.child('correct').val();
                                var question = snapshot.child('question').val();
                                var ansDetail = snapshot.child('option'+Studentans).val();
                                var correctAnsDetail = snapshot.child('option'+Correct).val();
                          

                                var table = document.getElementById('dataTable3');

                                var classname = ".row-data-" + i;

                                var rowCount = table.rows.length;
                                row = table.insertRow(rowCount);
                                
                                row.id = i;

                                var cell1 = row.insertCell(0);
                                cell1.className += classname;
                                cell1.innerHTML = q;

                                var cell2 = row.insertCell(1);
                                cell2.className += classname;
                                cell2.innerHTML = question;

                                var cell3 = row.insertCell(2);
                                cell3.className += classname;
                                cell3.innerHTML = Studentans+" "+"("+ansDetail+")";

                                var cell4 = row.insertCell(3);
                                cell4.className += classname;

                                if (Studentans == Correct)
                                {
                                
                                    cell4.innerHTML = "✔";
                                }  
                                else
                                {
                                    cell4.innerHTML = "✘ <br> Correct Answer is:"+Correct+" "+"("+correctAnsDetail+")";
                                    cell1.style = "color: red";
                                    cell2.style = "color: red";
                                    cell3.style = "color: red";
                                    cell4.style = "color: red";
                                  
                                    document.getElementById(i).style.backgroundColor = "#F0C0C0";
                                }
                                i++;
                            });

                        });
                    });
 
            }
        } else {
            window.location.href = "login.html";
        }
    });


}