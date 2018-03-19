
//==================
// Configurations params
//==================

window._exodify = {shouldAppExodify : false}


function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


function createInfoElement(nbTrackers, appID) {
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
  poweredBySpan.href = 'https://reports.exodus-privacy.eu.org/reports/search/' + appID;
  counterDiv.appendChild(poweredBySpan)

  return counterDiv
}

function createQuickInfoElement(nbTrackers, appID) {
  var counterDiv = document.createElement('div');
  counterDiv.id = 'exodify-'+appID
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
  
  counterDiv.appendChild(countSpan)

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
  return document.querySelectorAll("c-wiz[jsdata='deferred-i8']")[0]// document.querySelectorAll('div.cover-container')[0] || document.querySelectorAll('div.oQ6oV')[0] || document.querySelectorAll("c-wiz[jsdata='deferred-i8']")[0]
}

function injectHtmlInAppContainer(elem) {
  //Depending on the context, the code is minified/obfuscated, so try different euristics
  var targetElem = mainAppBoxElem()//document.querySelectorAll('div.cover-container')[0] || document.querySelectorAll('div.oQ6oV')[0] || document.querySelectorAll("c-wiz[jsdata='deferred-i8']")[0]
  // if (elems.length == 0) {
  //   elems = document.querySelectorAll('div.oQ6oV')
  // }
  // for (i in elems) {
  //   elems[i].parentNode.insertBefore(elem, elems[i]); 
  //   break;
  // }
  if (targetElem) {
    targetElem.parentNode.insertBefore(elem, targetElem); 
  }
  
  // var elems = document.getElementsByTagName('div'), i;
  //  for (i in elems) {
  //   if((' ' + elems[i].className + ' ').indexOf('cover-container')
  //     > -1) {
  //           // console.log("FOUND THAT ITEM");
  //         elems[i].parentNode.insertBefore(elem, elems[i]); 
  //           }
  // }
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
  return []
}
 

/*
* Fetches from exodus privacy and returns -1 if unknown, or >0 number of trackers.
*/
function fetchNbTrackersFor(appID, el,callback,err) {
  var xmlHttp = new XMLHttpRequest();
  
  function reqListener () {
    // console.log(this.responseText);
    try {
      var json = JSON.parse(xmlHttp.responseText);
      if (json[appID] && json[appID]['reports']) {
        const nbReports = json[appID]['reports'].length;
        const lastReport = json[appID]['reports'][nbReports - 1];
        const nbTrackers = lastReport.trackers.length
        callback(appID,el,nbTrackers)
      } else {
        callback(appID,el,-1)
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

function appXodify() {
  if (!window._exodify.shouldAppExodify) {
    return
  }
  if (window.location.href.indexOf('://play.google.com/apps') == -1 && window.location.href.indexOf('://play.google.com/store/search') == -1 && window.location.href.indexOf('://play.google.com/store/apps') == -1 ) {
      //ignore
      return
  }
  var alternatives = findAlternativeEl()
  for (var i = 0; i < alternatives.length; i++) {
    const existing = document.getElementById('exodify-'+alternatives[i].id)
    if(existing) {
     continue;
    }
    fetchNbTrackersFor(alternatives[i].id,alternatives[i].el, function(id,el,nb) {
      //console.log(id + ':' + nb);
      
      var counterDiv = createQuickInfoElement(nb,id)
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
      var rEL = el.querySelectorAll('.cover')[0]
      //rEL.parentNode.insertAfter(counterDiv, rEL); 
      rEL.appendChild(counterDiv)
     
    })
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

      browser.runtime.sendMessage({appId: appID, nbTrackers: nbTrackers, type : 't1'})

      const existing = getMainExodifyBoxForAppID(appID)//document.getElementById('exodify')
      if(existing) {
        existing.parentElement.removeChild(existing);
      }
      var counterDiv = createInfoElement(nbTrackers,appID)
      // var counterDiv = document.createElement('div');
      // counterDiv.id = 'exodify'
      // counterDiv.innerHTML = "<b>" + nbTrackers + " Trackers</b> <i>- powered by <a href='"+ 'https://reports.exodus-privacy.eu.org/reports/search/' + appID  +"'>Exodus Privacy</a></i>"
      if (nbTrackers == 0) {
        counterDiv.className = 'exodify-trackerInfoBoxClean';
      } else if (nbTrackers < 3) {
        counterDiv.className = 'exodify-trackerInfoBoxMid';
      } else {
        counterDiv.className = 'exodify-trackerInfoBox'
      }
      injectHtmlInAppContainer(counterDiv)
    } else {
      // no reports
      browser.runtime.sendMessage({appId: appID, nbTrackers: -1, type : 't1'})
      const existing = getMainExodifyBoxForAppID(appID)//document.getElementById('exodify')
      if(existing) {
       existing.parentElement.removeChild(existing);
      }
      var counterDiv = createMissingElement(appID)
      counterDiv.className = 'exodify-trackerInfoBoxClean missing';
      injectHtmlInAppContainer(counterDiv)
    }

    var alternatives = findAlternativeEl()
    for (var i = 0; i < alternatives.length; i++) {
      
      fetchNbTrackersFor(alternatives[i].id,alternatives[i].el, function(id,el,nb) {
        //console.log(id + ':' + nb);
        const existing = document.getElementById('exodify-'+id)
        if(existing) {
          existing.parentElement.removeChild(existing);
        }
        var counterDiv = createQuickInfoElement(nb,id)
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
        var rEL = el.querySelectorAll('.cover')[0] || el
        rEL.appendChild(counterDiv)
        // if(el.querySelectorAll('.cover-image-container')[0]) {
        //   var rEL = el.querySelectorAll('.cover-image-container')[0]
        //   rEL.parentNode.insertAfter(counterDiv, rEL); 
        // } else {
        //   el.appendChild(counterDiv)
        // }
       
      })
      
    }
  } catch(e) {
         //Oups
  }
 }
}

exodify()
appXodify()
setInterval(function(){ 
  appXodify()
  exodify()
  //check if path has changed
  // if(!document.getElementById('exodify')) {
  //   exodify()
  // }
}, 3000);

//=================================
//=================================
// PREFERENCES MANAGEMENT
//=================================
//=================================

function onError(error) {
  //console.log(`Error: ${error}`);
}

function onGot(item) {
  if (item.extendedExodify) {
    //TODO why?
    if(typeof(item.extendedExodify) === "boolean"){
      // variable is a boolean
      window._exodify.shouldAppExodify = item.extendedExodify
    } else {
      window._exodify.shouldAppExodify  = item.extendedExodify.newValue || false
    }

  }
  //TODO clear existing?
}

var getting = browser.storage.local.get("extendedExodify");
getting.then(onGot, onError);
browser.storage.onChanged.addListener(onGot)
