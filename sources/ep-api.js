/* Define ep API namespace*/
var $ep = {}
const authToken = "@@API_TOKEN"

$ep.fetchLatestReportFor = function(appID,success,error,meta) {
  var xmlHttp = new XMLHttpRequest();

  function reqListener () {
    // console.log(this.responseText);
    try {
      var json = JSON.parse(xmlHttp.responseText);
      if (json[appID] && json[appID]['reports']) {
        const nbReports = json[appID]['reports'].length;
        const lastReport = json[appID]['reports'][nbReports - 1];
        success(appID,json[appID]['name'],lastReport,meta)
      } else {
        success(appID,null,null,meta)
      }
    } catch(e) {
    	if (error)
    		error(e)
    }
  }
  xmlHttp.addEventListener("load", reqListener);
  xmlHttp.open( "GET", 'https://reports.exodus-privacy.eu.org/api/search/'+appID );
  xmlHttp.setRequestHeader("Authorization", authToken);
  xmlHttp.send( null );
  //console.log('Response for '+ appID +'is ' + xmlHttp.responseText)

}


$ep.fetchTrackerList =  function(success,error) {
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
	    	if (error)
    			error(e)
	    }
	 }
	xmlHttp.addEventListener("load", reqListener);
	xmlHttp.open( "GET", 'https://reports.exodus-privacy.eu.org/api/trackers');
  	xmlHttp.setRequestHeader("Authorization", authToken);
	xmlHttp.send( null );
}