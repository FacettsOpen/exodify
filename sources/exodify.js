function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//var currentAppID = getParameterByName('id')
//var currentLocation = window.location

// document.body.style.border = "5px solid red";
function exodify() {
	var appID = getParameterByName('id')
	console.log("App id is : " + appID)
	if(appID) {
		var xmlHttp = new XMLHttpRequest();
	    xmlHttp.open( "GET", 'https://reports.exodus-privacy.eu.org/api/search/'+appID, false ); // false for synchronous request
	    xmlHttp.send( null );

		// console.log("Response is : " + xmlHttp.responseText)
	    try
		{
		   var json = JSON.parse(xmlHttp.responseText);
		   if (json[appID] && json[appID]['reports']) {
		   		const nbReports = json[appID]['reports'].length;
		   		const lastReport = json[appID]['reports'][nbReports - 1];
		   		const nbTrackers = lastReport.trackers.length
	    		// console.log("Found " + nbTrackers + " Trackers");

	    		const existing = document.getElementById('exodify')
	    		if(existing) {
	    			existing.parentElement.removeChild(existing);
	    		}
				var counterDiv = document.createElement('div');
				counterDiv.id = 'exodify'
				counterDiv.innerHTML = "<b>" + nbTrackers + " Trackers</b> <i>- powered by <a href='"+ 'https://reports.exodus-privacy.eu.org/reports/search/' + appID  +"'>Exodus Privacy</a></i>"
				counterDiv.className = (nbTrackers > 0)?'exodify-trackerInfoBox':'exodify-trackerInfoBoxClean';

			    var elems = document.getElementsByTagName('div'), i;
			    for (i in elems) {
			        if((' ' + elems[i].className + ' ').indexOf('cover-container')
			                > -1) {
			        	// console.log("FOUND THAT ITEM");
			        	elems[i].parentNode.insertBefore(counterDiv, elems[i]); 
			        }
			    }
		   }
		}
		catch(e)
		{
		   //Oups
		}
	}
}

exodify()
setInterval(function(){ 
	//check if path has changed
	if(!document.getElementById('exodify')) {
		exodify()
	}
}, 3000);
