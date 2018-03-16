# Exodify [![Mentioned in Awesome Humane Tech](https://awesome.re/mentioned-badge.svg)](https://github.com/engagingspaces/awesome-humane-tech) [![Humane Tech](https://raw.githubusercontent.com/engagingspaces/awesome-humane-tech/master/humane-tech-badge.svg?sanitize=true)](https://humanetech.com)

**Exodify is a Firefox and Chrome add-on that will show you how many trackers there are in the android application you are looking at in the playstore.**

Install on [Firefox](https://addons.mozilla.org/en-US/firefox/addon/exodify/) or [Chrome](https://chrome.google.com/webstore/detail/exodify/imfbjeceaelpdlhbeembaocakecajhlm)

![Screenshot](/doc/img-trackers-full.jpg)

![Screenshot](/doc/img-banks.jpg)

![Screenshot](/doc/img-no-trackers.jpg)

img-trackers-unknown.jpg

## What it does

This extension just includes:

* a content script, "exodify.js", that will fetch from exodus REST API the number of trackers in the application and then modify the page to show it.


## What it shows

* For now only the number of trackers


## How to install dev version

Download the self-signed plugin [here](/dist/exodify-0.1.2-an+fx.xpi), then type about:addons in the firefox URL bar and click on the wheel icon and 'Install Add-On From File...' and select the file downloaded.
