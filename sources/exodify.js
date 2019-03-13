
//==================
// Configurations params
//==================

window._exodify = {shouldAppExodify : false}


function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


function createInfoElement(nbTrackers, appID, report) {
  var counterDiv = document.createElement('div');
  //counterDiv.id = 'exodify'
  counterDiv.setAttribute('data-xodify',appID)

  const countSpan = document.createElement('span');
  countSpan.className = 'exodify-count';
  if (nbTrackers <= 1) {
    countSpan.textContent = nbTrackers + ' Tracker  ';
  } else {
    countSpan.textContent = nbTrackers + ' Trackers  ';
  }
  counterDiv.appendChild(countSpan)

  const poweredBySpan = document.createElement('a');
  poweredBySpan.className = 'exodify-powered'
  poweredBySpan.textContent = 'powered by ExodusPrivacy'
  if (report && report.id) {
    poweredBySpan.href = 'https://reports.exodus-privacy.eu.org/reports/' + report.id +'/'
  } else {
    poweredBySpan.href = 'https://reports.exodus-privacy.eu.org/reports/search/' + appID;
  }
  
  poweredBySpan.target = '_blank';
  counterDiv.appendChild(poweredBySpan)

  return counterDiv
}

function createQuickInfoElement(nbTrackers, appID,reportID) {
  var counterDiv = document.createElement('div');
  counterDiv.id = 'exodify-'+appID

  var linkWrap =  document.createElement('a');
  linkWrap.target = '_blank';
  if (reportID) {
    linkWrap.href = ('https://reports.exodus-privacy.eu.org/reports/' + reportID +'/')
  }
  counterDiv.appendChild(linkWrap)

  // counterDiv.className = 'exodify'

  const countSpan = document.createElement('p');
  countSpan.className = 'exodifyquick-count';
  if (nbTrackers == -1) {
    countSpan.textContent = 'Unknown'
  } else if  (nbTrackers <= 1) {
    countSpan.textContent = nbTrackers + ' Tracker';
  } else {
    countSpan.textContent = nbTrackers + ' Trackers';
  }
  linkWrap.appendChild(countSpan)
  // counterDiv.appendChild(countSpan)

  // const poweredBySpan = document.createElement('a');
  // poweredBySpan.className = 'exodify-powered'
  // poweredBySpan.textContent = 'powered by ExodusPrivacy'
  // poweredBySpan.href = 'https://reports.exodus-privacy.eu.org/reports/search/' + appID;
  // counterDiv.appendChild(poweredBySpan)

  return counterDiv
}


function createMissingElement(appID) {
  var counterDiv = document.createElement('div');
  //counterDiv.id = 'exodify' 
  counterDiv.setAttribute('data-xodify',appID)
  // counterDiv.className = 'exodify'

  const countSpan = document.createElement('span');
  countSpan.className = 'exodify-count';
  countSpan.textContent = 'Number of trackers unknown ';
  counterDiv.appendChild(countSpan)

  const poweredBySpan = document.createElement('a');
  poweredBySpan.className = 'exodify-powered'
  poweredBySpan.textContent = 'Would you like to let ExodusPrivacy analyze it?'
  poweredBySpan.href = 'https://reports.exodus-privacy.eu.org/analysis/submit/#'+appID;
  poweredBySpan.target = '_blank';
  counterDiv.appendChild(poweredBySpan);

  return counterDiv
}

function mainAppBoxElem(appID) {
  var eurist = document.querySelectorAll('div.cover-container')[0]
  if (eurist) {
    return eurist
  } else {
    //Obfuscted code :/
    var candidates = document.querySelectorAll('div.oQ6oV')
    for (var i = 0; i < candidates.length; i++) {
      if(!candidates[i].offsetParent) {
        continue;
      }
      return candidates[i]
      // var buttons = candidates[i].querySelectorAll('button')
      // for (var j = 0; j < buttons.length; j++) {
      //   var b = buttons[j]
      //   var att = b.getAttribute('data-item-id')
      //   if (att && att.indexOf(appID) != -1) {
      //     return candidates[i]
      //   }
      // }
    }
  }
  //?
  return document.querySelectorAll("c-wiz[jsdata='deferred-i8']")[0]
}

function injectHtmlInAppContainer(elem) {
  //Depending on the context, the code is minified/obfuscated, so try different euristics
  var targetElem = mainAppBoxElem()
  if (targetElem) {
    targetElem.parentNode.insertBefore(elem, targetElem); 
  }
}


function findAlternativeEl() {
  if (!document.querySelectorAll) {
    return []
  }
  var els = document.querySelectorAll('div.card-content[data-docid]');
  if (els.length > 0 ) {
    var results = []
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      //Quick work-around to ignore movies/books .. need to refactor to search for anchors
      let anchors = el.querySelectorAll("a[href^='/store/apps/details?id=']")
      if (anchors.length > 0) {
        var appID = el.getAttribute('data-docid')
        results.push({id: appID, el: el})
      }
    }
    return results
  }

  //Might be the new version obfuscted
  els = document.querySelectorAll("a.AnjTGd[href^='/store/apps/details?id=']");
  if (els.length > 0) {
    var results = []
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      var appID = el.getAttribute('href').substring('/store/apps/details?id='.length)
      results.push({id: appID, el: el.parentNode})  
    }
    return results
  }

  //Might be the new version obfuscted
  els = document.querySelectorAll("a.poRVub[href^='/store/apps/details?id=']");
  if (els.length > 0) {
    var results = []
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      var appID = el.getAttribute('href').substring('/store/apps/details?id='.length)
      results.push({id: appID, el: el.parentNode})  
    }
    return results
  }

  //wish list
  els = document.querySelectorAll("a.card-click-target[href^='/store/apps/details?id=']");
  if (els.length > 0) {
    var results = []
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      var appID = el.getAttribute('href').substring('/store/apps/details?id='.length)
      results.push({id: appID, el: el.parentNode})  
    }
    return results
  }
  
  return []
}
 

// /*
// * Fetches from exodus privacy and returns -1 if unknown, or >0 number of trackers.
// */
// function fetchNbTrackersFor(appID, el,callback,err) {
//   var xmlHttp = new XMLHttpRequest();
  
//   function reqListener () {
//     // console.log(this.responseText);
//     try {
//       var json = JSON.parse(xmlHttp.responseText);
//       if (json[appID] && json[appID]['reports']) {
//         const nbReports = json[appID]['reports'].length;
//         const lastReport = json[appID]['reports'][nbReports - 1];
//         const nbTrackers = lastReport.trackers.length
//         callback(appID,el,nbTrackers)
//       } else {
//         callback(appID,el,-1)
//       }
//     } catch(e) {
//       if (err) {
//         err()
//       }
//     }
   
//   }

//   xmlHttp.addEventListener("load", reqListener);
//   xmlHttp.open( "GET", 'https://reports.exodus-privacy.eu.org/api/search/'+appID );
//   xmlHttp.send( null );
//   //console.log('Response for '+ appID +'is ' + xmlHttp.responseText)
  
// }

function shouldIgnoreXodify() {
  return window.location.href.indexOf('://play.google.com/apps') == -1 && window.location.href.indexOf('://play.google.com/store/search') == -1 && window.location.href.indexOf('://play.google.com/store/apps') == -1 
   && window.location.href.indexOf('://play.google.com/wishlist') == -1 
}

function appXodify() {
  if (!window._exodify.shouldAppExodify) {
    return
  }
  if (shouldIgnoreXodify()) {
      //ignore
      return
  }
  var alternatives = findAlternativeEl()
  //browser.runtime.sendMessage({nb: 0, type : 't4'})
  for (var i = 0; i < alternatives.length; i++) {
    const existing = document.getElementById('exodify-'+alternatives[i].id)
    if(existing) {
     continue;
    }
    var repSuccess = function(id,name,report,meta) {

      //need to check if still in a correct page..
      if (window.location.href.indexOf('play.google.com/store/apps/details?id') !=-1) {
        //ignore
        return
      }
      const nb = report ? report.trackers.length : -1
      const el = meta.el
      const reportID = report ? report.id : null
      var counterDiv = createQuickInfoElement(nb,id, reportID)
      if (nb == -1) {
        counterDiv.className = 'exodify-quickbox mid';
      }
      else if (nb == 0) {
        counterDiv.className = 'exodify-quickbox clean';
      } else if (nb < 3) {
        counterDiv.className = 'exodify-quickbox mid';
      } else {
        counterDiv.className = 'exodify-quickbox'
      }
      counterDiv.setAttribute('data-ep-trackers', report ? JSON.stringify(report.trackers): '')
      counterDiv.setAttribute('data-ep-appid',id)
      counterDiv.setAttribute('data-ep-name',name)
      var rEL = el.querySelectorAll('.cover')[0]
      //rEL.parentNode.insertAfter(counterDiv, rEL); 
      rEL.appendChild(counterDiv)
      browser.runtime.sendMessage({nb: document.querySelectorAll('.exodify-quickbox').length, type : 't4'})
    }
    $ep.fetchLatestReportFor(alternatives[i].id,repSuccess,null,{el: alternatives[i].el})

  }
}


function getMainExodifyBoxForAppID(id,fromEl) {
  var query = (fromEl || document).querySelectorAll("[data-xodify='"+ id +"']")
  if (query[0]) {
    return query[0]
  }
  return null
}
//var currentAppID = getParameterByName('id')
//var currentLocation = window.location

// document.body.style.border = "5px solid red";
function exodify() {
  if (window.location.href.indexOf('play.google.com/store/apps/details?') == -1) {
    //ignore
    return
  }
  var appID = getParameterByName('id')
  // console.log("App id is : " + appID)



  if(appID) {

    /*
    * Check here if the app card is already exodified
    * Notes: depending on whever the playstore is minified or not the page structure changes
    * sometimes previous div of the app is hidden (cache? for back)
    */
    var mainBox = mainAppBoxElem()
    if(mainBox && getMainExodifyBoxForAppID(appID,mainBox.parentNode)) {
      //ignore
      return
    }

    $ep.fetchLatestReportFor(appID, function(id,name,report,meta) {
       const nb = report ? report.trackers.length : -1
    // fetchNbTrackersFor(appID, undefined,function(id,el,nb) {
      const existing = getMainExodifyBoxForAppID(id)//document.getElementById('exodify')
      if(existing) {
        existing.parentElement.removeChild(existing);
      }
      browser.runtime.sendMessage({appId: id, nbTrackers: nb, type : 't1'})
      if (nb == -1) {
      //no reports
        var counterDiv = createMissingElement(appID)
        counterDiv.className = 'exodify-trackerInfoBoxClean missing';
        injectHtmlInAppContainer(counterDiv)
      } else {
        var counterDiv = createInfoElement(nb,id,report)
        if (nb == 0) {
          counterDiv.className = 'exodify-trackerInfoBoxClean';
        } else if (nb < 3) {
          counterDiv.className = 'exodify-trackerInfoBoxMid';
        } else {
         counterDiv.className = 'exodify-trackerInfoBox'
        }
        injectHtmlInAppContainer(counterDiv)
      }

      var alternatives = findAlternativeEl()
      for (var i = 0; i < alternatives.length; i++) {
        var repSuccess = function(id,name,report,meta) {
          const nb = report ? report.trackers.length : -1
          const el = meta.el
          const reportID = report ? report.id : null
          const existing = document.getElementById('exodify-'+id)
          if(existing) {
            existing.parentElement.removeChild(existing);
          }
          var counterDiv = createQuickInfoElement(nb,id,reportID)
          if (nb == -1) {
            
            counterDiv.className = 'exodify-quickbox mid';
          } else if (nb == 0) {
            counterDiv.className = 'exodify-quickbox clean';
          } else if (nb < 3) {
            counterDiv.className = 'exodify-quickbox mid';
          } else {
            counterDiv.className = 'exodify-quickbox'
          }

          var rEL = el.querySelectorAll('.cover')[0] || el
          rEL.appendChild(counterDiv)
        }
        $ep.fetchLatestReportFor(alternatives[i].id,repSuccess,null,{el: alternatives[i].el})
      }
    })
     
  }
}

exodify()
appXodify()
window._exodify.lastQ = window.location.href
setInterval(function(){ 
  appXodify()
  exodify()
  if (window._exodify.lastQ != window.location.href) {
    browser.runtime.sendMessage({nb: 0, type : 't4'})
    window._exodify.lastQ = window.location.href
  }
  //check if path has changed
  // if(!document.getElementById('exodify')) {
  //   exodify()
  // }
}, 3000);


browser.runtime.onMessage.addListener(function(message,sender) {
  //console.log("MMMMMM BACKGROUND" + JSON.stringify(message))
  //var tabId = sender.tab.id

  if (message.type == "t3" ) {
    //get all boxes
    var quickBoxes = document.querySelectorAll('.exodify-quickbox')
    var metaDatas = []
    for (var i = 0; i < quickBoxes.length; i++) {
      var qb = quickBoxes[i];
      var id = qb.getAttribute('data-ep-appid');
      var trackers = qb.getAttribute('data-ep-trackers');
      var name = qb.getAttribute('data-ep-name');
      metaDatas.push({id : id, trackers: trackers ? JSON.parse(trackers) : null, name: name})
    }
    return new Promise(function(resolve) { resolve(metaDatas) })
  }
})

/*
=================================
=================================
PREFERENCES MANAGEMENT
=================================
=================================
*/

function onError(error) {
  //console.log(`Error: ${error}`);
}

function onGot(item) {
  //this item exists in the base
  if (typeof(item.extendedExodify) != "undefined") {
    //Initial?
    if(typeof(item.extendedExodify) === "boolean"){
      // variable is a boolean
      window._exodify.shouldAppExodify = item.extendedExodify
    } else {
      //change listenr
      window._exodify.shouldAppExodify  = item.extendedExodify.newValue
      // if(typeof(item.extendedExodify) == "undefined") {
      //   window._exodify.shouldAppExodify  = true
      // } else {
      //   window._exodify.shouldAppExodify  = item.extendedExodify.newValue
      // }
     
    }
  } else {
    // not in storage, default is trye
    window._exodify.shouldAppExodify = true
  }
  //TODO clear existing?
}

var getting = browser.storage.local.get("extendedExodify");
getting.then(onGot, onError);
browser.storage.onChanged.addListener(onGot)
