# Exodify [![Mentioned in Awesome Humane Tech](https://awesome.re/mentioned-badge.svg)](https://github.com/engagingspaces/awesome-humane-tech) [![Humane Tech](https://raw.githubusercontent.com/engagingspaces/awesome-humane-tech/master/humane-tech-badge.svg?sanitize=true)](https://humanetech.com)

Exodify is a Firefox and Chrome add-on that will show you how many trackers there are in the android application you are looking at in the playstore.

**Firefox** &ndash; [Install](https://addons.mozilla.org/en-US/firefox/addon/exodify/) &nbsp; ![amo-rating](https://img.shields.io/amo/rating/exodify.svg?style=flat-square) &nbsp; ![amo-rating](https://img.shields.io/amo/users/exodify.svg?style=flat-square) 


**Chrome** &ndash; [Install](https://chrome.google.com/webstore/detail/exodify/imfbjeceaelpdlhbeembaocakecajhlm) &nbsp; ![Chrome Web Store-rating](https://img.shields.io/chrome-web-store/rating/imfbjeceaelpdlhbeembaocakecajhlm.svg?style=flat-square) &nbsp; ![Chrome Web Store-users](https://img.shields.io/chrome-web-store/d/imfbjeceaelpdlhbeembaocakecajhlm.svg?style=flat-square&label=users)


![Screenshot](/doc/img-trackers-full.jpg)

![Screenshot](/doc/img-banks.jpg)

![Screenshot](/doc/img-no-trackers.jpg)


## What it does

This extension just includes:

* a content script, "exodify.js", that will fetch from exodus REST API the number of trackers in the application and then modify the page to show it.


## What it shows

* For now only the number of trackers


## How to install dev version

Download the self-signed plugin [here](/dist/exodify-0.1.2-an+fx.xpi), then type about:addons in the firefox URL bar and click on the wheel icon and 'Install Add-On From File...' and select the file downloaded.
