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


function getParameterByName(query, name) {
  var match = new RegExp('[?&]' + name + '=([^&]*)').exec(query);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


function getActiveWindowTabs() {
  return browser.tabs.query({currentWindow: true, active:true});
}

function removeLoader() {
	var els = document.querySelectorAll('.loader')
	for (var i = 0; i < els.length; i++) {
		els[i].parentNode.removeChild(els[i]);
	}
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
			document.getElementById('currentInfo').innerHTML = '<div class="loader"></div>';
			$ep.fetchLatestReportFor(appId,function(id,name,lastReport) {
				if ((name != undefined) && lastReport) {
					function trackersSuccess(trakers) {
						removeLoader() 
						//console.log("######## " + JSON.stringify(trakers))
						var zDiv = document.getElementById('currentInfo')
						var infoP = document.createElement('p')
						var titleSpan = document.createElement('span')
						titleSpan.textContent = name || appId
						titleSpan.className = 'appName'
						infoP.appendChild(titleSpan)
						var versionSpan = document.createElement('span')
						versionSpan.textContent = 'v' + lastReport.version 
						versionSpan.className = 'appVersion'
						infoP.appendChild(versionSpan)
						zDiv.appendChild(infoP)

						if (lastReport.trackers.length == 0 ) {
							var trackerHead = document.createElement('p')
							trackerHead.className = 'trackerListTop'
							trackerHead.textContent = 'The Exodus Privacy analysis did not found the code signature of any known trackers in this application.' 
							zDiv.appendChild(trackerHead)
						} else if (lastReport.trackers.length == 1) {
							var trackerHead = document.createElement('p')
							trackerHead.className = 'trackerListTop'
							trackerHead.textContent = 'The Exodus Privacy analysis did found code signature of 1 tracker in this application.'
							zDiv.appendChild(trackerHead)
						} else {
							var trackerHead = document.createElement('p')
							trackerHead.className = 'trackerListTop'
							trackerHead.textContent = 'The Exodus Privacy analysis did found code signature of ' + lastReport.trackers.length + ' trackers in this application.' //lastReport.trackers.length + ' code signature of trackers found in this app.'
							zDiv.appendChild(trackerHead)
						}
						var ul = document.createElement('ul');
						ul.className = 'trackerList'
						for (var i = 0; i < lastReport.trackers.length; i++) {
							var tracker = lastReport.trackers[i]
							try {
								var tlink = 'https://reports.exodus-privacy.eu.org/trackers/' + tracker + '/'
								ul.appendChild(domCreateTrackerLi(trakers['' + tracker]['name'],/*trakers['' + tracker]['website']*/tlink))
							} catch (e) {
								var li = document.createElement('li');
								li.textContent = trakers['' + tracker]['name']
								ul.appendChild(li)
							}
							
							//TODO add link to tracker https://reports.exodus-privacy.eu.org/trackers/91/
						}
						zDiv.appendChild(ul)

						var moreInfoA = document.createElement('a')
						moreInfoA.target = "_blank";
						if (lastReport.id) {
							moreInfoA.href = 'https://reports.exodus-privacy.eu.org/reports/' + lastReport.id +'/'
						} else {
							moreInfoA.href = 'https://reports.exodus-privacy.eu.org/reports/search/' + id
						}	
						moreInfoA.textContent = 'Get the full report on Exodus Privacy'
						zDiv.appendChild(moreInfoA)

						zDiv.appendChild(document.createElement('hr'));
					}
					$ep.fetchTrackerList(trackersSuccess, function(err) {console.log(err)})
				} 
				else {
					//Remove loader
					removeLoader()
				}
			})
		}
		else if (tab.url && (tab.url.indexOf('://play.google.com/apps') != -1
			|| tab.url.indexOf('://play.google.com/store/search') != -1
			|| tab.url.indexOf('://play.google.com/store/apps') != -1)) {
			browser.tabs.sendMessage(tab.id,{type : 't3'})

			document.getElementById('currentInfo').innerHTML = '<div class="loader"></div>';
			function trackersSuccess(trackers) {
				browser.tabs.sendMessage(tab.id,{type : 't3'}).then(function(e){
					// console.log(JSON.stringify(e))
					// removeLoader();
					createStatInfos(e,trackers)

				}).catch(function(e){
					removeLoader();
					// console.log("COULDNT T_CEKL K " + tab.id)
					// console.log(e)
				});
				// var inputEl = document.getElementById('filter')
				// inputEl.className = '' // remove hidden
				// inputEl.oninput = function(e) {
				// 	var filter = e.target.value
				// 	console.log("value " + filter)
				// 	browser.tabs.sendMessage(tab.id,{filter: filter, type : 't2'})
				// 	//add all trackers that matches
				// 	var listEl = document.getElementById('trackMatch-list')
				// 	listEl.innerHTML = ''
				// 	if (filter.length > 0) {
				// 		for (id in trackers) {
				// 			if (filter == '*' || trackers[id].name.toLowerCase().indexOf(filter.toLowerCase()) != -1) {
				// 				var li = document.createElement('li');
				// 				li.textContent = trackers[id].name
				// 				listEl.appendChild(li)
				// 			}
				// 		}
				// 	}
				// }
			}
			$ep.fetchTrackerList(trackersSuccess, function(err) {
				removeLoader();
				console.log(err);
			})
		}

	}
}); // END getActiveTab

function createStatInfos(infos,trackers) {
	var zDiv = document.getElementById('currentInfo');
	zDiv.innerHTML = ''
	if (infos.length == 0 ) {
		return
	}
	var topHeader = document.createElement('p')
	topHeader.className = 'topStatInfo'
	topHeader.textContent = 'Information on Apps detected on this page.'
	zDiv.appendChild(topHeader)


	var analyzedInfo = infos.filter(function(info) {
	 return Array.isArray(info.trackers)
	})
	// var totalP = document.createElement('p')
	// totalP.textContent = analyzedInfo.length + ' App(s) found.'
	// zDiv.appendChild(totalP)

	zDiv.appendChild(createStatFactHtml(analyzedInfo.length,'App(s) with existing analysis.'))

	// var unknownP = document.createElement('p')
	// unknownP.textContent = (infos.length - analyzedInfo.length) + ' Apps not analyzed yet.'
	// zDiv.appendChild(unknownP)

	if ((infos.length - analyzedInfo.length) > 0 ) {
		zDiv.appendChild(createStatFactHtml((infos.length - analyzedInfo.length),'App(s) not yet analyzed.'))
	}


	var avTrackers = analyzedInfo.map(e => e.trackers.length).reduce((a,b) => a + b , 0) / analyzedInfo.length

	// var avP = document.createElement('p')
	// avP.textContent = avTrackers.toFixed(1) + ' average trackers per app'
	// zDiv.appendChild(avP)
	if (avTrackers) {
		zDiv.appendChild(createStatFactHtml(avTrackers.toFixed(1),'average trackers per App.'))
	}

	var withZero = analyzedInfo.filter( info => info.trackers.length == 0).length
	zDiv.appendChild(createStatFactHtml(withZero,'App(s) with no trackers.'))
	

	// Per tracker stats
	var stats = {}
	for (var i = 0; i < analyzedInfo.length; i++) {
		var ai = analyzedInfo[i]
		for (var j = 0; j < ai.trackers.length; j++) {
			var ti = ai.trackers[j]
			stats[''+ti] = (stats[''+ti]) ? (stats[''+ti] + 1) : 1
		}
	}


	var statArr = []
	for (tid in stats) {
		var added = false
		for (var k = 0; k < statArr.length; k++) {
			var cur = statArr[k];
			if(stats[tid] >= stats[cur]) {
				added = true
				statArr.splice(k,0,tid);
				break;
			}
		}
		if(!added)
			statArr.push(tid)
	}
	// statArr = statArr.sort((a,b) => stats[a] < stats[b])

	var trackerHead = document.createElement('p')
	trackerHead.className = 'trackerListTop'
	trackerHead.textContent = 'List of trackers sorted by presence:'
	zDiv.appendChild(trackerHead)

	var ul = document.createElement('ul');
	ul.className = 'trackerRatio'
	for (var i = 0; i < statArr.length; i++) {
		var tracker = statArr[i]
		// var li = document.createElement('li');
		var percent = (stats[tracker] / analyzedInfo.length * 100).toFixed(0)
		// li.textContent = '' + percent + '% - ' + trackers['' + tracker]['name'] + ' (in ' + stats[tracker] + ' apps)'

		var li = document.createElement('li');
		var appPluralSing = stats[tracker] > 1 ?  ' apps)' :  ' app)'
		li.appendChild(domCreateElement('span','trackerName','' + percent + '% - ' + trackers['' + tracker]['name'] + ' (in ' + stats[tracker] + appPluralSing));
		var link = domCreateElement('a','trackerWebLink','info');
		var tlink = 'https://reports.exodus-privacy.eu.org/trackers/' + tracker + '/'
		link.href = tlink;
		link.target = '_blank';
		li.appendChild(link);


		ul.appendChild(li)
		li.className = 'p' + Math.floor(percent / 10)

		// var lidiv = document.createElement('div');
		// lidiv.className = 'pbar'
		// li.appendChild(lidiv)
		//TODO add link to tracker https://reports.exodus-privacy.eu.org/trackers/91/
	}
	zDiv.appendChild(ul)
}

function domCreateTrackerLi(trackerName, trackerURL) {
	var li = document.createElement('li');
	li.appendChild(domCreateElement('span','trackerName',trackerName));
	var link = domCreateElement('a','trackerWebLink','info');
	link.href = trackerURL;
	link.target = '_blank';
	li.appendChild(link);
	//ul.appendChild(li);
	return li
}

function domCreateElement(name,className,textContent) {
	var el = document.createElement(name);
	el.className = className;
	el.textContent = textContent;
	return el
}

function createStatFactHtml(number, text) {
	var p = document.createElement('p')
	p.className = 'statLine'
	var spanL = document.createElement('span')
	spanL.textContent = '' + number
	spanL.className = 'statNumber'
	p.appendChild(spanL)

	var spanR = document.createElement('span')
	spanR.textContent = text
	spanR.className = 'statText'
	p.appendChild(spanR)

	return p
}