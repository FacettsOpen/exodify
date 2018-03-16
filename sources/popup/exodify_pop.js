const button = document.getElementById("test")
button.addEventListener('click', function() { 
	browser.runtime.openOptionsPage() 
});