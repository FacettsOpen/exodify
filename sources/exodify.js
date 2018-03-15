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
    countSpan.textContent = nbTrackers + ' Trackers  ';
    counterDiv.appendChild(countSpan)

    const poweredBySpan = document.createElement('a');
    poweredBySpan.className = 'exodify-powered'
    poweredBySpan.textContent = 'powered by ExodusPrivacy'
    poweredBySpan.href = 'https://reports.exodus-privacy.eu.org/reports/search/' + appID;
    counterDiv.appendChild(poweredBySpan)

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
    poweredBySpan.href = 'https://reports.exodus-privacy.eu.org/analysis/submit#'+appID;
    counterDiv.appendChild(poweredBySpan)

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
                  }  else {
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
