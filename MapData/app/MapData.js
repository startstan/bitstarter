 /*
  * MapData.js
  * Written for logging distance and duration in traffic between two points periodically
  */  
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var textFileAsBlob = new Blob(["Start:"], {type:'text/plain'});
var mapDataHolder = document.createElement('mapDataHolder');
var intervalCalRoute = 0;
var intervalBlinker = 0;
var intervalVariable = 0;
var intervalCheckTime = 0;
var changeIntervalTo = 0;
var currentSlot = 0;
var lineCounter = 0;
var lineLimit = 10;
function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:7,
    center: chicago
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  var start = document.getElementById('start');
  var end = document.getElementById('end');
  var request = {
      origin:start.value,
      destination:end.value,
  	  durationInTraffic: true,      
  	  provideRouteAlternatives: true,  	  
      travelMode: google.maps.TravelMode.DRIVING
  };
  var startLabel = start.options[start.selectedIndex].innerHTML;
  var endLabel = end.options[end.selectedIndex].innerHTML;  
  var mapData = [startLabel + "-" + endLabel];
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
    	len = response.routes.length;
    	if(response.Xb.durationInTraffic){
      	  mapData.push((new Date()).toISOString());
      	  mapData.push(len);
        }     
	     for (var i = 0; i < len; i++) {
	    	/* 
	        new google.maps.DirectionsRenderer({
	            //map: mapObject,
	            directions: response,
	            routeIndex: i
	        });
	    	*/
	        if(response.Xb.durationInTraffic){      	
	      		//alert(response.routes[i].summary +" : " + response.routes[i].legs[0].duration.text);
	      		//console.log(response.routes[i].summary +" : " + response.routes[i].legs[0].duration.text);
	      		mapData.push(response.routes[i].summary + " : " + 
	      		response.routes[i].legs[0].duration.value + " : " + 
	      		response.routes[i].legs[0].distance.value);      		
	      	}        
	      }
    }
  // Method 1
  /*
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  	window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
	  window.requestFileSystem(PERSISTENT, grantedBytes, onInitFsWrite, errorHandler);
	  window.requestFileSystem(PERSISTENT, grantedBytes, onInitFsRead, errorHandler);
	}, function(e) {
	  console.log('Error', e);
	});  
  	
  	*/
	//window.requestFileSystem(window.PERSISTENT, 1024*1024, onInitFsWrite(fs,mapData), errorHandler);

	//window.requestFileSystem(window.PERSISTENT, 1024*1024, onInitFsRead, errorHandler);
	
	// Method 2
   //saveTextAsFile(mapData);
	
	//Method 3
	var mapDataTextBox = document.getElementById('mapDataTextBox');
	mapDataTextBox.value = mapDataTextBox.value + "\n" + mapData;
	lineCounter++;   
	if(lineCounter>=lineLimit){
		saveAsCustom();
	}	
  });
}

function selectIntervalType(objButton){
    if(objButton.value == 'Using Slots'){
    	objButton.value = 'Using Input';
    }
    else{
    	objButton.value = 'Using Slots';
    }
}

// This function is used to blink the recording image and run the time checker to change recording frequency based on current time.
function blinker(start){
	var img = document.getElementById('blinking_image');
	var intType = document.getElementById('selectIntervalType').value;
	if(start){
		intervalBlinker = window.setInterval(function(){	
		    if(img.style.visibility == 'hidden'){
		        img.style.visibility = 'visible';
		    }else{
		        img.style.visibility = 'hidden';
		    }
		}, 500); //the 1000 here is milliseconds and determines how often the interval should be run.
	}
	else{
		clearInterval(intervalBlinker);
		img.style.visibility = 'visible';
	}
	
}

function elementValue(Id){
	var el = document.getElementById(Id);
	var placeholder = el.getAttribute("placeholder");
	var value = el.value;
	if(value){
		return value;
	}
	else{
		return placeholder;
	}		
}

function logger(start) {
	// example 2
	//var counter = 0;
	/*
	if((document.getElementById('selectIntervalType').value) == 'Using Input'){
		var inputLogInterval = document.getElementById('inputLogInterval').value;
		if(isNaN(inputLogInterval) || inputLogInterval <= 0){
			inputLogInterval = 5; // default to 5 min interval
			document.getElementById('inputLogInterval').value = inputLogInterval;
		}
		//var intervalID = setInterval(function() { alert("#"+counter++); }, inputLogInterval);
		if(start)
		intervalCalRoute = setInterval(function() { calcRoute(); }, inputLogInterval*1000); //enter interval in seconds as we are multiplying by 1000 here
		else{
			clearInterval(intervalCalRoute);
		}
	}
	*/
	var intType = document.getElementById('selectIntervalType').value;

	if(start){
		if(intType == 'Using Input'){
			setVariableInterval(elementValue('inputLogInterval'));
		}
		else if(intType == 'Using Slots'){		
			intervalCheckTime = window.setInterval(function() { checkTime(); }, 500);			
		}		
		loggerWithSlots(start);
	}
	else{
		clearInterval(intervalVariable);
		clearInterval(intervalCheckTime);
	}
}


function setVariableInterval(intervalLength){
	clearInterval(intervalVariable);
	if(isNaN(intervalLength) || intervalLength <= 0){
		intervalLength = 5; // default to 5 min interval
	}
	intervalVariable = setInterval(function() { calcRoute(); }, intervalLength  * 1000  ); // converts the minutes to microseconds
}

function checkTime(){
	var newDate = new Date();
	var slot1Start = elementValue('slot1Start');
	var slot2Start = elementValue('slot2Start');
	var slot3Start = elementValue('slot3Start');
	var slot4Start = elementValue('slot4Start');
	var slot5Start = elementValue('slot5Start');
	var slot6Start = elementValue('slot6Start');
	var slot1Interval = determineInterval('slot1Interval');
	var slot2Interval = determineInterval('slot2Interval');
	var slot3Interval = determineInterval('slot3Interval');
	var slot4Interval = determineInterval('slot4Interval');
	var slot5Interval = determineInterval('slot5Interval');
	var slot6Interval = determineInterval('slot6Interval');
	var timeNow = newDate.timeNowHHMM();
	changeInterval = true;
	if(timeNow >= slot1Start && timeNow < slot2Start && (changeIntervalTo != slot1Interval || currentSlot!=1)){
		changeIntervalTo = slot1Interval;
		currentSlot = 1;
	}
	else if(timeNow >= slot2Start && timeNow < slot3Start && (changeIntervalTo != slot2Interval || currentSlot!=2)){
		changeIntervalTo = slot2Interval;
		currentSlot = 2;
	}
	else if(timeNow >= slot3Start && timeNow < slot4Start && (changeIntervalTo != slot3Interval || currentSlot!=3)){
		changeIntervalTo = slot3Interval;
		currentSlot = 3;
	}
	else if(timeNow >= slot4Start && timeNow < slot5Start && (changeIntervalTo != slot4Interval || currentSlot!=4)){
		changeIntervalTo = slot4Interval;
		currentSlot = 4;
	}
	else if(timeNow >= slot5Start && timeNow < slot6Start && (changeIntervalTo != slot5Interval || currentSlot!=5)){
		changeIntervalTo = slot5Interval;
		currentSlot = 5;
	}
	else if(timeNow >= slot6Start && timeNow <= slot6End && (changeIntervalTo != slot6Interval || currentSlot!=6)){
		changeIntervalTo = slot6Interval;
		currentSlot = 6;
	}
	else{
		changeInterval = false;
	}
    document.getElementById("slot"+currentSlot+"Row").classList.toggle('background-color-yellow');

	if(changeInterval){
		setVariableInterval(changeIntervalTo);
	}
	
	
}


function determineInterval(Id){
	var el = document.getElementById(Id);
	var placeholder = el.getAttribute("placeholder");
	var value = el.value? el.value : placeholder;
	if(value == 'High' || value == 'high'){
		return elementValue('highInterval');
	}
	else if(value == 'Med' || value == 'med'){
		return elementValue('medInterval');
	}
	else if(value == 'Low' || value == 'low'){
		return elementValue('lowInterval');
	}	
}

function loggerWithSlots(start){
	
}
//For todays date;
Date.prototype.today = function(){ 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear() 
};

Date.prototype.timeNowHHMMSS = function(){
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
};

Date.prototype.timeNowHHMM = function(){
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes();
};


function saveAsCustom() {
	// Pre save
	logger(false); blinker(false);
	document.getElementById('stopLog').disabled=true;
	// Save
	var mapDataTextBox = document.getElementById('mapDataTextBox');
	var mapData = mapDataTextBox.value;
	var blob = new Blob([mapData], {type: "text/plain;charset=utf-8"});
	var fileName = "MapData-" + (new Date()).toISOString().slice(0,19).replace(/[^0-9]/g, "") +".txt"; //gives YYYYMMDDHHMMSS
    saveAs(blob, fileName);
    
    // Post save
    mapDataTextBox.value = "";
    if(lineCounter>=lineLimit){
    	lineCounter = 0;
    	currentSlot = 0;
    	changeIntervalTo = 0;
    	document.getElementById('startLog').disabled=true;
        document.getElementById('stopLog').disabled=false;
    	logger(true); blinker(true);  
    }	
    else{
    	document.getElementById('startLog').disabled=false;
        document.getElementById('stopLog').disabled=true;
    }
    
    
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onInitFs1(fs) {
  console.log('Opened file system: ' + fs.name);
}
function onInitFsWrite(fs, mapData) {

  fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
      var blob = new Blob([mapData], {type: 'text/plain'});

      fileWriter.write(blob);
      

    }, errorHandler);

  }, errorHandler);

}
function onInitFsRead(fs) {

  fs.root.getFile('log.txt', {}, function(fileEntry) {

    // Get a File object representing the file,
    // then use FileReader to read its contents.
    fileEntry.file(function(file) {
       var reader = new FileReader();

       reader.onloadend = function(e) {
         var txtArea = document.createElement('textarea');
         txtArea.value = this.result;
         document.body.appendChild(txtArea);
         console.log("Reader Start");
         console.log(this.result);
         console.log("Reader End");
       };

       reader.readAsText(file);
    }, errorHandler);

  }, errorHandler);

}


function toArray(list) {
  return Array.prototype.slice.call(list || [], 0);
}

function listResults(entries) {
  // Document fragments can improve performance since they're only appended
  // to the DOM once. Only one browser reflow occurs.
  var fragment = document.createDocumentFragment();

  entries.forEach(function(entry, i) {
    //var img = entry.isDirectory ? '<img src="folder-icon.gif">' : '<img src="file-icon.gif">';
    var li = document.createElement('li');
    li.innerHTML = [ '<span>', entry.name, '</span>'].join('');
    fragment.appendChild(li);
  });

  document.querySelector('#filelist').appendChild(fragment);
}

function onInitFs(fs) {

  var dirReader = fs.root.createReader();
  var entries = [];

  // Call the reader.readEntries() until no more results are returned.
  var readEntries = function() {
     dirReader.readEntries (function(results) {
      if (!results.length) {
        listResults(entries.sort());
      } else {
        entries = entries.concat(toArray(results));
        readEntries();
      }
    }, errorHandler);
  };

  readEntries(); // Start reading dirs.

}

function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

function saveTextAsFile(mapTextToWrite)
{
	var textToWrite = "Hello FileSaver"; //document.getElementById("inputTextToSave").value;
	
	var fileNameToSaveAs = "FileSaver.txt"; //document.getElementById("inputFileNameToSaveAs").value;

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

function loadFileAsText()
{
	var fileToLoad = document.getElementById("fileToLoad").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) 
	{
		var textFromFileLoaded = fileLoadedEvent.target.result;
		document.getElementById("inputTextToSave").value = textFromFileLoaded;
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}


var cleanUp = function(a) {
  a.textContent = 'Downloaded';
  a.dataset.disabled = true;

  // Need a small delay for the revokeObjectURL to work properly.
  setTimeout(function() {
    window.URL.revokeObjectURL(a.href);
  }, 1500);
};

var downloadFile = function() {
  window.URL = window.webkitURL || window.URL;

  var prevLink = output.querySelector('a');
  if (prevLink) {
    window.URL.revokeObjectURL(prevLink.href);
    output.innerHTML = '';
  }

  var bb = new Blob([typer.textContent], {type: MIME_TYPE});

  var a = document.createElement('a');
  a.download = container.querySelector('input[type="text"]').value;
  a.href = window.URL.createObjectURL(bb);
  a.textContent = 'Download ready';

  a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
  a.draggable = true; // Don't really need, but good practice.
  a.classList.add('dragout');

  output.appendChild(a);

  a.onclick = function(e) {
    if ('disabled' in this.dataset) {
      return false;
    }

    cleanUp(this);
  };
};




