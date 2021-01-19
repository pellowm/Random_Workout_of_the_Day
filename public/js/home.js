var AMRAP = [];
const minReps = 5;
const repMultiple = 5;
const maxReps = 30;
const minTime = 8;
const maxTime = 20;

//create button for equipment list (created in handlebars file)
getEquip();

function getEquip()
{
  var getWOD = document.createElement("button");
  getWOD.textContent = "Get W.O.D.!";
  getWOD.className = "buttons btn btn-primary btn-lg";
  getWOD.addEventListener("click", getWODClick);
  document.getElementById("equipDiv").appendChild(getWOD);
}

// button click callback function
function getWODClick() 
{
  var hasEquip = false;
  var userEquipment = {checkedEquip: []};
  var checkboxArray = document.querySelectorAll('.equipCheck'); 

   //prep list of checked equipment to be sent
   for (var i = 0; i < checkboxArray.length; i++)
   {
      if (checkboxArray[i].checked)
      {
          userEquipment.checkedEquip.push(checkboxArray[i].name);
      }
    }

    if (!(userEquipment.checkedEquip["Bodyweight"]))
    {
      //include bodyweight automatically if no other equipment checked
      userEquipment.checkedEquip.push("Bodyweight");
    }
   
    //send http POST request
    var req = new XMLHttpRequest();
  
    //asynchronous response callback function
    req.addEventListener('load', () => { 

      if(req.status < 200 || req.status >= 400 ) {
        console.log("response error"); 
        return;
      }
  
      //prepare the incoming WOD data to be rendered on the page
      threeMoveObj = JSON.parse(req.responseText)
      loadWODTable(threeMoveObj);

    });

    req.open("POST", "/getwod", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(userEquipment));
    
    console.log("sent http post request");
    // browser will call event listenener when http response is received
}

function loadWODTable(threeMoveObj) 
{  
  //clear out any previous WODs
  document.getElementById("tableDiv").innerHTML = "";
  //find the workout length in minutes
  var randNum = Math.floor(Math.random() * (maxTime - minTime) + minTime);

  //header with AMRAP format
  var instructions = document.createElement("P");
  instructions.id = "AMRAP";
  var timeSpan = document.createElement("span");
  timeSpan.id = "timeSpan";
  instructions.textContent = "As Many Rounds as Possible in "; 
  timeSpan.textContent = randNum;
  instructions.appendChild(timeSpan);
  var minutes = document.createElement("span");
  minutes.textContent = " minutes:"; 
  instructions.appendChild(minutes);
  document.getElementById('tableDiv').appendChild(instructions);

  //create list for the 3 movements
  var AMRAPlist = document.createElement("ul");
  AMRAPlist.id = "AMRAPlist";
  document.getElementById("tableDiv").appendChild(AMRAPlist);

  //create random reps and format data for display
  for (var i = 0; i < threeMoveObj.length; i++)
  {
    if (threeMoveObj[i].name === "Run" || 
    threeMoveObj[i].name === "Bike" || 
    threeMoveObj[i].name === "Row")
    {
      var metersArray = [200, 400, 600, 800, 1000];
      var randIdx = Math.floor(Math.random() * metersArray.length);
      threeMoveObj[i].reps = metersArray[randIdx] + " Meter";
    }
    else if (threeMoveObj[i].name.includes("Handstand Walk / Bear Crawl") || 
    threeMoveObj[i].name.includes("Carry"))
    {
      var metersArray = [50, 100, 150];
      var randIdx = Math.floor(Math.random() * metersArray.length);
      threeMoveObj[i].reps = metersArray[randIdx] + " Meter";
    }
    else
    {
      do
      {
        threeMoveObj[i].reps = Math.floor(Math.random() * (maxReps - minReps) + minReps)
      }  while (threeMoveObj[i].reps % repMultiple !== 0 || threeMoveObj[i].reps === 0);
      if (threeMoveObj[i].name.includes("Hold"))
      {
        threeMoveObj[i].reps = threeMoveObj[i].reps + " Second";
      }
    }

    threeMoveObj[i].weight = "(" + threeMoveObj[i].weight + " lbs)";
    if (threeMoveObj[i].weight === "(0 lbs)")
    {
      threeMoveObj[i].weight = "";
    }

    //put the data in a string format and append to the displayed list
    var movement = [];
    AMRAP[i] = threeMoveObj[i].reps + " " + threeMoveObj[i].name + " " + threeMoveObj[i].weight;
    movement[i] = document.createElement("li");
    movement[i].className = "AMRAPlistLI";
    document.getElementById("tableDiv").appendChild(movement[i]);
    movement[i].textContent = AMRAP[i];
  }
  
  //give the user the option to save the WOD

  var saveForm = document.createElement("form");
  saveForm.id = "saveForm";
  document.getElementById("tableDiv").appendChild(saveForm);

  var WODnameDir = document.createElement("span");
  WODnameDir.textContent = "Want to save this W.O.D. for later? Give it a name: ";
  saveForm.appendChild(WODnameDir);

  //user input WOD name
  var WODnameText = document.createElement("input");
  WODnameText.type = "text";      
  WODnameText.id = "WODname";
  saveForm.appendChild(WODnameText);

  //create button for saving the WOD
  var saveWOD = document.createElement("button");
  saveWOD.textContent = "Save W.O.D.";
  saveWOD.className = "buttons btn btn-primary btn-md";
  saveWOD.addEventListener("click", saveWODClick);
  saveForm.appendChild(saveWOD);
}

function saveWODClick(e) 
{
  e.preventDefault(); 

  //prepare WOD data to be sent to the server/database
  var saveObj = {};
  saveObj.WODname = document.querySelector('#WODname').value.toUpperCase();
  saveObj.time = document.querySelector('#timeSpan').textContent;
  saveObj.movement = AMRAP;
  console.log(saveObj);

  //check if user has named the WOD
  if (saveObj.WODname === "")
  {
    alert("You didn't give your W.O.D. a name!");
    return;
  }

  //send the WOD data
  var req = new XMLHttpRequest();
  req.open("POST", "/savewod", true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){

    if(req.status >= 200 && req.status < 400){
      // success
      document.querySelector('#WODname').value = "";
      if(document.querySelector("#newName"))
      {
        alert("You have already saved this WOD");
        return;
      }
      //if successfully saved, display the WOD with its given name
      var newName = document.createElement("p");
      newName.id = "newName";
      newName.textContent = saveObj.WODname;
      var AMRAPNode = document.querySelector('#AMRAP');
      document.getElementById('tableDiv').insertBefore(newName, AMRAPNode);
      //clear save button
      document.getElementById("saveForm").innerHTML = "";
    }
    else {
      // error
      alert(req.responseText);
    }
   });

  //send the data to the server/database
  req.send(JSON.stringify(saveObj));   
  console.log("sent http post request");

}