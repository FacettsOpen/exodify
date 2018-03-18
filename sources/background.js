//TODO -> Create exodus-rest.js for reuse across scripts
/*
* Fetches from exodus privacy and returns -1 if unknown, or >0 number of trackers.
*/
function fetchNbTrackersFor(appID,callback,err) {
  var xmlHttp = new XMLHttpRequest();
  
  function reqListener () {
    // console.log(this.responseText);
    try {
      var json = JSON.parse(xmlHttp.responseText);
      if (json[appID] && json[appID]['reports']) {
        const nbReports = json[appID]['reports'].length;
        const lastReport = json[appID]['reports'][nbReports - 1];
        const nbTrackers = lastReport.trackers.length
        callback(appID,nbTrackers)
      } else {
        callback(appID,-1)
      }
    } catch(e) {
    	err()
    }
  }

  xmlHttp.addEventListener("load", reqListener);
  xmlHttp.open( "GET", 'https://reports.exodus-privacy.eu.org/api/search/'+appID );
  xmlHttp.send( null );
  //console.log('Response for '+ appID +'is ' + xmlHttp.responseText)
  
}
function getParameterByName(query, name) {
  var match = new RegExp('[?&]' + name + '=([^&]*)').exec(query);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


//browser.browserAction.setBadgeText({text:'@'})
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.indexOf('://play.google.com/store/apps/details?id=') != -1) {
    // browser.pageAction.show(tab.id);

	var query = tab.url.substring(tab.url.indexOf('?'));
	var appId = getParameterByName(query, 'id')
	fetchNbTrackersFor(appId,function(id,nb){
		//check that tab url still correct (async)
		if (tab.url && tab.url.indexOf('://play.google.com/store/apps/details?id=') != -1) {
			browser.browserAction.setBadgeBackgroundColor({color:'#224955',tabId: tab.id})
			if (nb == -1) {
				// browser.browserAction.setBadgeBackgroundColor({color:'#fff3cd',tabId: tab.id})
				browser.browserAction.setBadgeText({text:'',tabId: tab.id})
			} else if (nb == 0 ) {
				// browser.browserAction.setBadgeBackgroundColor({color:'#d4edda',tabId: tab.id})
				browser.browserAction.setBadgeText({text:'0',tabId: tab.id})
			} else if (nb < 3) {
				// browser.browserAction.setBadgeBackgroundColor({color:'#fff3cd',tabId: tab.id})
				browser.browserAction.setBadgeText({text:''+nb,tabId: tab.id})
			} else {
				// browser.browserAction.setBadgeBackgroundColor({color:'#f8d7da',tabId: tab.id})
				browser.browserAction.setBadgeText({text:''+nb,tabId: tab.id})
			}
			// browser.browserAction.setBadgeText({text:''+nb,tabId: tab.id})

		}
	})
    
  } else {
	browser.browserAction.setBadgeText({text:'',tabId: tab.id})
  }
});

// browser.tabs.query({currentWindow: true}).then(function(tabs) {
// 	for (var tab of tabs) {
// 		if (tab.url && tab.url.indexOf('://play.google.com/store/apps/details?id=') != -1) {
// 			browser.browserAction.setBadgeText({text:'!',tabId: tab.id})
// 		}
// 	}
// })
