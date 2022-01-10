# Exodify [![Mentioned in Awesome Humane Tech](https://awesome.re/mentioned-badge.svg)](https://github.com/engagingspaces/awesome-humane-tech) [![Humane Tech](https://raw.githubusercontent.com/engagingspaces/awesome-humane-tech/master/humane-tech-badge.svg?sanitize=true)](https://humanetech.com)

[Exodify](https://exodify.org) is a web browser extension that will show you how many trackers there are in Android applications you are looking at in the playstore.

**Firefox** &ndash; [Install](https://addons.mozilla.org/firefox/addon/exodify/) &nbsp; ![amo-rating](https://img.shields.io/amo/rating/exodify.svg?style=flat-square) &nbsp; ![amo-rating](https://img.shields.io/amo/users/exodify.svg?style=flat-square) 


**Chrome** &ndash; [Install](https://chrome.google.com/webstore/detail/exodify/imfbjeceaelpdlhbeembaocakecajhlm) &nbsp; ![Chrome Web Store-rating](https://img.shields.io/chrome-web-store/rating/imfbjeceaelpdlhbeembaocakecajhlm.svg?style=flat-square) &nbsp; ![Chrome Web Store-users](https://img.shields.io/chrome-web-store/d/imfbjeceaelpdlhbeembaocakecajhlm.svg?style=flat-square&label=users)


![Screenshot](/doc/img-trackers-full.jpg)

![Screenshot](/doc/img-banks.jpg)

![Screenshot](/doc/img-no-trackers.jpg)


## What it does

This extension includes:

* A content script, "exodify.js" for the play store, that will fetch from exodus REST API the number of trackers in the application and then modify the page to show it.
* A content script, "exodify-sub.js" for Exodus Privacy submit page, that auto fills the search bar with the application ID.
* A browser action, with a popup ("popup/") that shows the trackers name 
* A background script that is used to update the toolbar icon number badge

## What it shows

* Displays the number of trackers of an app when you visit the detail page of this app, and will display the number of trackers on alternative apps.
* When visiting the 'my apps' page or doing a search, the plugin will decorate all applications on screen with trackers info
* Add direct link to the full report on Exodus Privacy.
* Use toolbar button to get more info about trackers and some statistics, with individual link for each tracker.


## How to install from sources

### Automated build

Requirement: [NodeJS](https://nodejs.org) and [Grunt](https://gruntjs.com/getting-started)

Create a config.json file in the base folder (along side gruntfile.js) and add your api token like this:

```json
{
	"apiToken" : "Token <GET_A_TOKEN_FROM_EXODUS_PRIVACY>"
}
```

Then Run:

```bash
> npm install

> npm run package
```
You will find the packed and unpacked extentions in the `dest/` folder.


### Manual Install

Download the `sources/` folder.

Edit the `sources/ep-api.js` and replace the `@@API_TOKEN` with your exodify api token (contact them to get one)

In Firefox type about:addons in the URL and click on the wheel icon and 'Install Add-On From File...' and select the manifest.json file in the source folder.

In chrome, type chrome://extensions/ and then 'Load Unpacked' and point to the 'source' folder.
