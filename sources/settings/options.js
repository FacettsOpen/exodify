//console.log("IOPOPOPOPOPOPOTETETEION")

function saveOptions(e) {
  //console.log("SAVE OPT 1")
  e.preventDefault();
  //console.log("SAVE OPT 2 value is " + document.querySelector("#extendedExodify").checked)
  browser.storage.local.set({
    extendedExodify: (document.querySelector("#extendedExodify").checked)
  });
  //console.log("SAVE OPT 3")
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#extendedExodify").checked = (result.extendedExodify);
  }

  function onError(error) {
    //console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("extendedExodify");
  getting.then(setCurrentChoice, onError);
}
//console.log("Adding content load and submit listeners!!!!!")
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#extendedExodify").addEventListener("change", saveOptions);
