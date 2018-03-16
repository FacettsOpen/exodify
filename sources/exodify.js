
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
  counterDiv.id = 'exodify'
  // counterDiv.className = 'exodify'

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
  counterDiv.id = 'exodify'
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

function injectHtmlInAppContainer(elem) {
  var elems = document.getElementsByTagName('div'), i;
   for (i in elems) {
    if((' ' + elems[i].className + ' ').indexOf('cover-container')
      > -1) {
            // console.log("FOUND THAT ITEM");
          elems[i].parentNode.insertBefore(elem, elems[i]); 
            }
  }
}

function injectHtmlInAltAppContainer(elem) {
  var elems = document.getElementsByTagName('div'), i;
   for (i in elems) {
    if((' ' + elems[i].className + ' ').indexOf('cover-container')
      > -1) {
            // console.log("FOUND THAT ITEM");
          elems[i].parentNode.insertBefore(elem, elems[i]); 
            }
  }
}

function findAlternativeEl() {
  if (!document.querySelectorAll) {
    return []
  }
  var els = document.querySelectorAll('div.card-content[data-docid]');
  if (!els) {
    return []
  }
  var results = []
  for (var i = 0; i < els.length; i++) {
    var el = els[i]
    var appID = el.getAttribute('data-docid')
    results.push({id: appID, el: el})
  }
  return results
}

/*
* Fetches from exodus privacy and returns -1 if unknown, or >0 number of trackers.
* throw if network/parse error
*/
function fetchNbTrackersFor(appID, el,callback) {
  var xmlHttp = new XMLHttpRequest();
  // TODO async
  xmlHttp.open( "GET", 'https://reports.exodus-privacy.eu.org/api/search/'+appID, false ); // false for synchronous request
  xmlHttp.send( null );
  //console.log('Response for '+ appID +'is ' + xmlHttp.responseText)
  var json = JSON.parse(xmlHttp.responseText);
  if (json[appID] && json[appID]['reports']) {
    const nbReports = json[appID]['reports'].length;
    const lastReport = json[appID]['reports'][nbReports - 1];
    const nbTrackers = lastReport.trackers.length
    callback(appID,el,nbTrackers)
    return
  } else {
    callback(appID,el,-1)
  }
  throw "oups"
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
    try {
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
        var rEL = el.querySelectorAll('.cover-image-container')[0]
        //rEL.parentNode.insertAfter(counterDiv, rEL); 
        rEL.appendChild(counterDiv)
       
      })
    } catch(et) {
      //console.log(et)
    }
  }
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
      const existing = document.getElementById('exodify')
      if(existing) {
       existing.parentElement.removeChild(existing);
      }
      var counterDiv = createMissingElement(appID)
      counterDiv.className = 'exodify-trackerInfoBoxClean missing';
      injectHtmlInAppContainer(counterDiv)
    }

    var alternatives = findAlternativeEl()
    for (var i = 0; i < alternatives.length; i++) {
      try {
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
          var rEL = el.querySelectorAll('.cover-image-container')[0]
          //rEL.parentNode.insertAfter(counterDiv, rEL); 
          rEL.appendChild(counterDiv)
         
        })
      } catch(et) {
        //console.log(et)
      }
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
  //check if path has changed
  if(!document.getElementById('exodify')) {
    exodify()
  }}, 3000);

//=================================
//=================================
// PREFERENCES MANAGEMENT
//=================================
//=================================

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  if (item.extendedExodify) {
   window._exodify.shouldAppExodify  = item.extendedExodify.newValue || false
  }
  //TODO clear existing?
}

var getting = browser.storage.local.get("extendedExodify");
getting.then(onGot, onError);
browser.storage.onChanged.addListener(onGot)
