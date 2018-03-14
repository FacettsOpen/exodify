# Exodify

**Exodify is a Firefox add-on that will show you how many trackers there are in the android application you are looking at in the playstore.**

![Screenshot](/doc/img-trackers-full.jpg)

![Screenshot](/doc/img-trackers-unknown.jpg)

![Screenshot](/doc/img-no-trackers.jpg)

img-trackers-unknown.jpg

## What it does

This extension just includes:

* a content script, "exodify.js", that will fetch from exodus REST API the number of trackers in the application and then modify the page to show it.


## What it shows

* For now only the number of trackers


## How to install dev version

Download the self-signed plugin [here](/dist/exodify-0.1.1-an+fx.xpi), then type about:addons in the firefox URL bar and click on the wheel icon and 'Install Add-On From File...' and select the file downloaded.
