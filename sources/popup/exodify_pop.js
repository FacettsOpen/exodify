const button = document.getElementById("test")
button.addEventListener('click', function() { 
	browser.runtime.openOptionsPage() 
});

// function fetchNbTrackersFor(appID,callback,err) {
//   var xmlHttp = new XMLHttpRequest();
  
//   function reqListener () {
//     // console.log(this.responseText);
//     try {
//       var json = JSON.parse(xmlHttp.responseText);
//       if (json[appID] && json[appID]['reports']) {
//         const nbReports = json[appID]['reports'].length;
//         const lastReport = json[appID]['reports'][nbReports - 1];
//         const nbTrackers = lastReport.trackers.length
//         callback(appID,nbTrackers)
//       } else {
//         callback(appID,-1)
//       }
//     } catch(e) {

//     }
//     if (err) {
//       err()
//     }
//   }
// }

// console.log("Current page is " + window.location)

// function getActiveWindowTabs() {
//   return browser.tabs.query({currentWindow: true, active:true});
// }

// console.log('$$$TAB ' + JSON.stringify(browser.tabs.getCurrent()))

// getActiveWindowTabs().then((tabs) => {
// 	console.log('tabs ' + tabs)
// 	for (let tab of tabs) {
// 		if (let url = tab.url && tab.url.indexOf('://play.google.com/store/apps/details?') != -1) {
// 			//We have a match on an app
// 			console.log('tabUrl: ' + tab.url);
// 		}
		
// 	}
// })
