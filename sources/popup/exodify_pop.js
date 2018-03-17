/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 * github: https://github.com/FacettsOpen/exodify
 * @author: valere
 */

//console.log("YOOOOO !!");
const button = document.getElementById("test");
button.addEventListener('click', function() {
	browser.runtime.openOptionsPage()
});



function fetchTrackerList(success,error) {
	var xmlHttp = new XMLHttpRequest();

	  function reqListener () {
	    // console.log(this.responseText);
	    try {
	      var json = JSON.parse(xmlHttp.responseText);
	      if (json['trackers']) {
	        success(json['trackers'])
	      } else {
	        error('no trackers')
	      }
	    } catch(e) {
	    	error(e)
	    }
	 }
	xmlHttp.addEventListener("load", reqListener);
	xmlHttp.open( "GET", 'https://reports.exodus-privacy.eu.org/api/trackers');
	xmlHttp.send( null );
}

function getParameterByName(query, name) {
  var match = new RegExp('[?&]' + name + '=([^&]*)').exec(query);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/*
* Fetches from exodus privacy and returns the latest report if exists.
*/
function fetchLatestReportFor(appID,callback,err) {
  var xmlHttp = new XMLHttpRequest();

  function reqListener () {
    // console.log(this.responseText);
    try {
      var json = JSON.parse(xmlHttp.responseText);
      if (json[appID] && json[appID]['reports']) {
        const nbReports = json[appID]['reports'].length;
        const lastReport = json[appID]['reports'][nbReports - 1];
        //const nbTrackers = lastReport['trackers'].length;
        callback(appID,json[appID]['name'],lastReport)
      } else {
        callback(appID)
      }
    } catch(e) {

    }
    if (err) {
      err()
    }
  }
  xmlHttp.addEventListener("load", reqListener);
  xmlHttp.open( "GET", 'https://reports.exodus-privacy.eu.org/api/search/'+appID );
  xmlHttp.send( null );
  //console.log('Response for '+ appID +'is ' + xmlHttp.responseText)

}

//console.log("Current page is " + window.location);

function getActiveWindowTabs() {
  return browser.tabs.query({currentWindow: true, active:true});
}

//console.log('$$$TAB ' + JSON.stringify(browser.tabs.getCurrent()));

getActiveWindowTabs().then(function(tabs) {
	document.getElementById('currentInfo').innerHTML = '';
	for (var tab of tabs) {
        //console.log('**** tab ' + JSON.stringify(tab));
		if (tab.url && tab.url.indexOf('://play.google.com/store/apps/details?id=') != -1) {
			//We have a match on an app
			//console.log('tabUrl: ' + tab.url);
			//is it an app details page?
			var query = tab.url.substring(tab.url.indexOf('?'));
			//console.log('query is: ' + query)
			var appId = getParameterByName(query,'id');
			fetchLatestReportFor(appId,function(id,name,lastReport) {
				if (name && lastReport) {
					function trackersSuccess(trakers) {
						//console.log("######## " + JSON.stringify(trakers))
						var zDiv = document.getElementById('currentInfo')
						var infoP = document.createElement('p')
						var titleSpan = document.createElement('span')
						titleSpan.textContent = name 
						titleSpan.className = 'appName'
						infoP.appendChild(titleSpan)
						var versionSpan = document.createElement('span')
						versionSpan.textContent = 'v' + lastReport.version 
						versionSpan.className = 'appVersion'
						infoP.appendChild(versionSpan)
						zDiv.appendChild(infoP)
						var ul = document.createElement('ul');
						ul.className = 'trackerList'
						for (var i = 0; i < lastReport.trackers.length; i++) {
							var tracker = lastReport.trackers[i]
							var li = document.createElement('li');
							li.textContent = trakers['' + tracker]['name']
							ul.appendChild(li)
						}
						zDiv.appendChild(ul)

						var moreInfoA = document.createElement('a')
						if (lastReport.id) {
							moreInfoA.href = 'https://reports.exodus-privacy.eu.org/reports/' + lastReport.id +'/'
						} else {
						moreInfoA.href = 'https://reports.exodus-privacy.eu.org/reports/search/' + id
						}	
						moreInfoA.textContent = 'Get the full report on Exodus Privacy'
						zDiv.appendChild(moreInfoA)

						zDiv.appendChild(document.createElement('hr'));
					}
					fetchTrackerList(trackersSuccess, function(err) {console.log(err)})
				}
			})
		}

	}
});
