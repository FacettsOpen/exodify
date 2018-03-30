
function getParameterByName(query, name) {
  var match = new RegExp('[?&]' + name + '=([^&]*)').exec(query);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


browser.runtime.onMessage.addListener(function(message,sender) {
  //console.log("MMMMMM BACKGROUND" + JSON.stringify(message))
  var tabId = sender.tab.id
  if (message.type == "t1" ) {
    var appId = message.appId
    var nb = message.nbTrackers
    // tabMem[tabId] =  message.nbTrackers
    $ep.fetchLatestReportFor(appId,function(id,name,report){
        const nb = report ? report.trackers.length : -1
    // fetchNbTrackersFor(appId,function(id,nb){
      //check that tab url still correct (async)
        browser.browserAction.setBadgeBackgroundColor({color:'#224955'/*,tabId: tab.id*/})
        if (nb == -1) {
          // browser.browserAction.setBadgeBackgroundColor({color:'#fff3cd',tabId: tab.id})
          browser.browserAction.setBadgeText({text:'',tabId: tabId})
        } else if (nb == 0 ) {
          // browser.browserAction.setBadgeBackgroundColor({color:'#d4edda',tabId: tab.id})
          browser.browserAction.setBadgeText({text:'0',tabId: tabId})
        } else if (nb < 3) {
          // browser.browserAction.setBadgeBackgroundColor({color:'#fff3cd',tabId: tab.id})
          browser.browserAction.setBadgeText({text:''+nb,tabId: tabId})
        } else {
          // browser.browserAction.setBadgeBackgroundColor({color:'#f8d7da',tabId: tab.id})
          browser.browserAction.setBadgeText({text:''+nb,tabId: tabId})
        }
        // browser.browserAction.setBadgeText({text:''+nb,tabId: tab.id})
    })
      
  } else if (message.type == "t4" ) {
    browser.browserAction.setBadgeBackgroundColor({color:'#224955'/*,tabId: tab.id*/})
    var nb = message.nb
    if (nb == 0) {
      browser.browserAction.setBadgeText({text:'',tabId: tabId})
    } else {
      browser.browserAction.setBadgeText({text:''+message.nb,tabId: tabId})
    }
   //browser.browserAction.setBadgeText({text:''})
  }

  }) 

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  browser.browserAction.setBadgeText({text:'',tabId: tabId.tabId})
})


