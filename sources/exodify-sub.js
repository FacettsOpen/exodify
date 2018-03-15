function getHashParams() {

    var hashParams = [];
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);

    while (e = r.exec(q))
       hashParams.push(d(e[1]))

    return hashParams;
}

const appID = getHashParams()
const inputEl = document.getElementById('handle')
if (inputEl && appID && appID[0]) {
	inputEl.value = appID[0]
}