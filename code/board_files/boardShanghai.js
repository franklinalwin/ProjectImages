const url = 'http://127.0.0.1:5000/darts/'
var countHits = 0
var color;
var idSection = null;
var changedIdSections = ""
opacityValue = "0.25"
testShanghai = 1
currentShanghaiNumber = 0
holdPlayerName = ""



var ws = null
$(document).ready(function()
{
  document.getElementById("divPoints").style.display = "none"

  $("#dartboard #areas g").children().click(function()
  {

    alert($(this).attr("id"));

  });

  initGame()
  loadSortedPlayers();


});


function showPoints()
{

  document.getElementById("divPoints").style.display = "block"

  setTimeout(function()
  {

    document.getElementById("divPoints").style.display = "none"

  }, 4000);


}

function lauch(hit)
{


  var path = url + "Shanghai";
  var data = {};
  data.gameState = "THROW"
  data.hit = hit
  var json = JSON.stringify(data);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", path, true);
  xhr.setRequestHeader('Content-type', 'application/json');



  xhr.onload = function()
  {
    var resp = JSON.parse(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == "200")
    {

      console.log("SERVICE RESPONSE  " + resp.COMMAND);
      if (resp.COMMAND == "NEXT_THROW")
      {
        document.getElementById("points").innerHTML = resp.currentPoints
        showPoints()

      }
      else if (resp.COMMAND == "NEXT_PLAYER")
      {

        document.getElementById("points").innerHTML = resp.currentPoints
        showPoints()

        holdPlayerName = resp.player;



      }
      else if (resp.COMMAND == "NEXT_SHANGHAI")
      {
        document.getElementById("points").innerHTML = resp.currentPoints
        showPoints()

        holdPlayerName = resp.player;
        currentShanghaiNumber = resp.shanghaiNumber;


      }

      else if (resp.COMMAND == "END_SHANGHAI")
      {
        document.getElementById("points").innerHTML = resp.currentPoints
        document.getElementById("namePlayer").innerHTML = "";
        document.location.href = "logo.html"
      }


      loadSortedPlayers()


    }

  }
  xhr.send(json);


}

function initGame()
{

  var path = url + "Shanghai";
  var data = {};
  data.gameState = "INIT"

  var json = JSON.stringify(data);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", path, true);
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.onload = function()
  {
    var resp = JSON.parse(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == "200")
    {

      document.getElementById("namePlayer").innerHTML = resp.player
      setOpacityBoard()
      lightShanghai(resp.shanghaiNumber);
      currentShanghaiNumber = resp.shanghaiNumber;


      ws = new WebSocket("ws://127.0.0.1:9000/");
      console.log("Hits:" + changedIdSections)


      ws.onmessage = function(event)
      {

        hitsString = event.data
        boardCaptureData(hitsString)
      }
    }

  }
  xhr.send(json);
}
numberMiss = 0
stringHitsTemp = ""
hit_1 = ""
hit_2 = ""
hit_3 = ""

function boardCaptureData(hitsString)
{
  console.log("hitsString: " + hitsString)

  if (!hitsString.includes('INFO') && !hitsString.includes('ERROR') && !
    hitsString.includes('CLEAN') && !hitsString.includes('READY') && !
    hitsString.includes('REMOVE_DARTS'))
  {
    if (countHits < 3)
    {

      stringHitsTemp = hitsString;
      hits = hitsString.split(",");
      for (i = 0; i < hits.length; i++)
      {
        idSection = "#" + hits[i]
        $(idSection).css("fill", "#10ff00");

      }
      changedIdSections += "," + hitsString


      countHits++
      $("#dart" + countHits).css("fill", "#0cff00");

      if (hits.length + numberMiss < countHits)
      {
        numberMiss++;
        console.log("New throw: MISS");
        lauch("MISS")

      }
      else
      {
        newHit = ""
        if (countHits == 1)
        {
          newHit = hits[0]
          hit_1 = newHit
        }
        else if (countHits == 2)
        {
          stringHitsTemp = stringHitsTemp.replace(",", "")
          stringHitsTemp = stringHitsTemp.replace(hit_1, "")
          newHit = stringHitsTemp
          hit_2 = newHit

        }
        else if (countHits == 3)
        {
          stringHitsTemp = stringHitsTemp.replace(",", "")
          stringHitsTemp = stringHitsTemp.replace(",", "")

          stringHitsTemp = stringHitsTemp.replace(hit_1, "")
          stringHitsTemp = stringHitsTemp.replace(hit_2, "")
          newHit = stringHitsTemp

        }

        console.log("New throw: " + newHit + " hit_1:" + hit_1 + " hit_2:" +
          hit_2);
        lauch(newHit)


      }

    }


  }
  else if (hitsString == "REMOVE_DARTS")
  {
    console.log("IN REMOVE_DARTS")
    document.getElementById("divNamePlayer").style.display = "none";
    document.getElementById("divMessage").style.display = "block";


    document.getElementById("message").innerHTML = "Remove Darts";



  }
  else if (hitsString == "READY" && countHits >= 3)
  {
    console.log("IN READY")

    document.getElementById("divNamePlayer").style.display = "block";
    document.getElementById("divMessage").style.display = "none";

    document.getElementById("namePlayer").innerHTML = holdPlayerName;



    countHits = 0
    cleanBoard()
    $("#dart1").css("fill", "white");
    $("#dart2").css("fill", "white");
    $("#dart3").css("fill", "white");

    console.log("currentShanghaiNumber: ", currentShanghaiNumber)
    lightShanghai(currentShanghaiNumber);

    numberMiss = 0
    stringHits = ""
    hit_1 = ""
    hit_2 = ""
    hit_3 = ""


  }

}

function cleanBoard()
{
  arrayIdsSections = changedIdSections.split(",")
  for (i = 0; i < arrayIdsSections.length; i++)
  {

    idSection = "#" + arrayIdsSections[i]
      //console.log("to clean " + idSection)

    if (arrayIdsSections[i].includes("R"))
    {
      $(idSection).css("fill", "#ED3737");
    }
    else if (arrayIdsSections[i].includes("G"))
    {

      $(idSection).css("fill", "#4F9962");
    }
    else if (arrayIdsSections[i].includes("W"))
    {

      $(idSection).css("fill", "#F7E9CD");
    }
    else if (arrayIdsSections[i].includes("B"))
    {

      $(idSection).css("fill", "black");
    }


  }
}

function loadSortedPlayers()
{


  var myNode = document.getElementById("uiListPlayers");
  while (myNode.firstChild)
  {
    myNode.removeChild(myNode.firstChild);
  }


  var path = url + "sortedPlayers";
  var data = {};


  var xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.onload = function()
  {

    var resp = JSON.parse(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == "200")
    {

      //  console.log(resp)

      for (var i = 0; i < resp.length; i++)
      {
        var obj = resp[i];
        addPlayer(obj.name, obj.pointsGame)

      }


    }
  }
  xhr.send();

}


function addPlayer(namePlayer, pointPlayer)
{
  uiListPlayers = document.getElementById("uiListPlayers")

  e_li = document.createElement('li');
  e_time = document.createElement('time');
  e_span = document.createElement('span');
  e_span.className = "day"
  e_span.innerHTML = pointPlayer

  e_div = document.createElement('div');
  e_div.className = "info"
  e_p = document.createElement('p');
  e_p.className = "desc";
  e_p.innerHTML = namePlayer;

  e_time.appendChild(e_span)
  e_div.appendChild(e_p)

  e_li.appendChild(e_time)
  e_li.appendChild(e_div)

  uiListPlayers.appendChild(e_li)

}



function setopacityValue(id, opacity)
{

  if (document.getElementById(id))
  {
    document.getElementById(id).style.opacity = opacity;
  }

}

function lightShanghai(number)
{
  setOpacityBoard();
  if (number == 1)
  {
    $("#1-G-1").css("fill", "#ff00cb");
    $("#1-W-1").css("fill", "#ff00cb");
    $("#1-G-2").css("fill", "#ff00cb");
    $("#1-W-2").css("fill", "#ff00cb");


    document.getElementById("1-G-1").style.opacity = 1;
    document.getElementById("1-W-1").style.opacity = 1;
    document.getElementById("1-G-2").style.opacity = 1;
    document.getElementById("1-W-2").style.opacity = 1;
    document.getElementById("s1").style.opacity = 1;
  }
  else if (number == 2)
  {
    $("#1-G-1").css("fill", "#4F9962");
    $("#1-W-1").css("fill", "#F7E9CD");
    $("#1-G-2").css("fill", "#4F9962");
    $("#1-W-2").css("fill", "#F7E9CD");

    $("#2-R-1").css("fill", "#ff00cb");
    $("#2-B-1").css("fill", "#ff00cb");
    $("#2-R-2").css("fill", "#ff00cb");
    $("#2-B-2").css("fill", "#ff00cb");

    document.getElementById("2-R-1").style.opacity = 1;
    document.getElementById("2-B-1").style.opacity = 1;
    document.getElementById("2-R-2").style.opacity = 1;
    document.getElementById("2-B-2").style.opacity = 1;
    document.getElementById("s2").style.opacity = 1;

  }
  else if (number == 3)
  {

    $("#2-R-1").css("fill", "#ED3737");
    $("#2-B-1").css("fill", "#000");
    $("#2-R-2").css("fill", "#ED3737");
    $("#2-B-2").css("fill", "#000");

    $("#3-R-1").css("fill", "#ff00cb");
    $("#3-B-1").css("fill", "#ff00cb");
    $("#3-R-2").css("fill", "#ff00cb");
    $("#3-B-2").css("fill", "#ff00cb");

    document.getElementById("3-R-1").style.opacity = 1;
    document.getElementById("3-B-1").style.opacity = 1;
    document.getElementById("3-R-2").style.opacity = 1;
    document.getElementById("3-B-2").style.opacity = 1;
    document.getElementById("s3").style.opacity = 1;

  }
  else if (number == 4)
  {
    $("#3-R-1").css("fill", "#ED3737");
    $("#3-B-1").css("fill", "#000");
    $("#3-R-2").css("fill", "#ED3737");
    $("#3-B-2").css("fill", "#000");


    $("#4-G-1").css("fill", "#ff00cb");
    $("#4-W-1").css("fill", "#ff00cb");
    $("#4-G-2").css("fill", "#ff00cb");
    $("#4-W-2").css("fill", "#ff00cb");

    document.getElementById("4-G-1").style.opacity = 1;
    document.getElementById("4-W-1").style.opacity = 1;
    document.getElementById("4-G-2").style.opacity = 1;
    document.getElementById("4-W-2").style.opacity = 1;
    document.getElementById("s4").style.opacity = 1;

  }
  else if (number == 5)
  {

    $("#4-G-1").css("fill", "#4F9962");
    $("#4-W-1").css("fill", "#F7E9CD");
    $("#4-G-2").css("fill", "#4F9962");
    $("#4-W-2").css("fill", "#F7E9CD");

    $("#5-G-1").css("fill", "#ff00cb");
    $("#5-W-1").css("fill", "#ff00cb");
    $("#5-G-2").css("fill", "#ff00cb");
    $("#5-W-2").css("fill", "#ff00cb");

    document.getElementById("5-G-1").style.opacity = 1;
    document.getElementById("5-W-1").style.opacity = 1;
    document.getElementById("5-G-2").style.opacity = 1;
    document.getElementById("5-W-2").style.opacity = 1;
    document.getElementById("s5").style.opacity = 1;

  }
  else if (number == 6)
  {
    $("#5-G-1").css("fill", "#4F9962");
    $("#5-W-1").css("fill", "#F7E9CD");
    $("#5-G-2").css("fill", "#4F9962");
    $("#5-W-2").css("fill", "#F7E9CD");

    $("#6-G-1").css("fill", "#ff00cb");
    $("#6-W-1").css("fill", "#ff00cb");
    $("#6-G-2").css("fill", "#ff00cb");
    $("#6-W-2").css("fill", "#ff00cb");

    document.getElementById("6-G-1").style.opacity = 1;
    document.getElementById("6-W-1").style.opacity = 1;
    document.getElementById("6-G-2").style.opacity = 1;
    document.getElementById("6-W-2").style.opacity = 1;
    document.getElementById("s6").style.opacity = 1;

  }
  else if (number == 7)
  {

    $("#6-G-1").css("fill", "#4F9962");
    $("#6-W-1").css("fill", "#F7E9CD");
    $("#6-G-2").css("fill", "#4F9962");
    $("#6-W-2").css("fill", "#F7E9CD");

    $("#7-R-1").css("fill", "#ff00cb");
    $("#7-B-1").css("fill", "#ff00cb");
    $("#7-R-2").css("fill", "#ff00cb");
    $("#7-B-2").css("fill", "#ff00cb");

    document.getElementById("7-R-1").style.opacity = 1;
    document.getElementById("7-B-1").style.opacity = 1;
    document.getElementById("7-R-2").style.opacity = 1;
    document.getElementById("7-B-2").style.opacity = 1;
    document.getElementById("s7").style.opacity = 1;



  }



}

function hide()
{
  setOpacityBoard()
}

function show()
{
  clearOpacityBoard()
}

function clearOpacityBoard()
{
  document.getElementById("EYE-G").style.opacity = 1;
  document.getElementById("EYE-R").style.opacity = 1;

  for (var i = 1; i <= 20; i++)
  {
    idSectionW_1 = i + "-W-1"
    idSectionW_2 = i + "-W-2"

    idSectionR_1 = i + "-R-1"
    idSectionR_2 = i + "-R-2"

    idSectionG_1 = i + "-G-1"
    idSectionG_2 = i + "-G-2"

    idSectionB_1 = i + "-B-1"
    idSectionB_2 = i + "-B-2"

    setopacityValue(idSectionW_1, 1)
    setopacityValue(idSectionW_2, 1)
    setopacityValue(idSectionR_1, 1)
    setopacityValue(idSectionR_2, 1)
    setopacityValue(idSectionG_1, 1)
    setopacityValue(idSectionG_2, 1)
    setopacityValue(idSectionB_1, 1)
    setopacityValue(idSectionB_2, 1)

    setopacityValue("s" + i, 1)

  }

}

function setOpacityBoard()
{


  document.getElementById("EYE-G").style.opacity = opacityValue;
  document.getElementById("EYE-R").style.opacity = opacityValue;

  for (var i = 1; i <= 20; i++)
  {
    idSectionW_1 = i + "-W-1"
    idSectionW_2 = i + "-W-2"

    idSectionR_1 = i + "-R-1"
    idSectionR_2 = i + "-R-2"

    idSectionG_1 = i + "-G-1"
    idSectionG_2 = i + "-G-2"

    idSectionB_1 = i + "-B-1"
    idSectionB_2 = i + "-B-2"

    setopacityValue(idSectionW_1, opacityValue)
    setopacityValue(idSectionW_2, opacityValue)
    setopacityValue(idSectionR_1, opacityValue)
    setopacityValue(idSectionR_2, opacityValue)
    setopacityValue(idSectionG_1, opacityValue)
    setopacityValue(idSectionG_2, opacityValue)
    setopacityValue(idSectionB_1, opacityValue)
    setopacityValue(idSectionB_2, opacityValue)

    setopacityValue("s" + i, opacityValue)

  }



}
