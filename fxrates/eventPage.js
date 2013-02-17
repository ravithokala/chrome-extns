var REFRESH_TIME_IN_MINS = 60;  // Every hour

function normalize(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return "" + num;
    }
}

function getCurrentDate() {
    var currTime = new Date();
    var date = normalize(currTime.getDate()) + "/"
        + normalize(currTime.getMonth() + 1) + "/"
        + currTime.getFullYear();
    var time = normalize(currTime.getHours()) + ":"
        + normalize(currTime.getMinutes()) + ":"
        + normalize(currTime.getSeconds());
    return date + " " + time;
}

function updateIcon() {
    chrome.browserAction.setBadgeText({
        text: localStorage.defaultFxrate + ""
    });
}

function updateDefaultFxRate(fxRates) {
    localStorage.defaultFxrate = fxRates.gbp_inr;
    updateIcon();

    console.log('Creating alarm for next update');
    chrome.alarms.create('refresh', {periodInMinutes: REFRESH_TIME_IN_MINS});
}

function getRate(fxPair, rates1HTML, numPlaces, decimalPlaces) {
    var fxpair = new RegExp(fxPair + ": [0-9]{" + numPlaces + "}.[0-9]{" + decimalPlaces + "}", "g").exec(rates1HTML);
    return new RegExp("[0-9]{" + numPlaces + "}.[0-9]{" + decimalPlaces + "}", "g").exec(fxpair);
}

function getLatestFromSBI(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.sbiuk.com/", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // WARNING! Might be injecting a malicious script!
            var hiddenDiv = document.createElement("div");
            document.body.appendChild(hiddenDiv);
            hiddenDiv.style.display = "none";
            hiddenDiv.innerHTML = /<body[^>]*>([\s\S]+)<\/body>/i.exec(xhr.responseText)[1];
            var ratesHTML = hiddenDiv.getElementsByClassName("scroller")[0].childNodes[1].innerHTML;
            var gbp_inr = getRate("GBP/INR", ratesHTML, 2, 2);
            var usd_inr = getRate("USD/INR", ratesHTML, 2, 2);
            var eur_inr = getRate("EUR/INR", ratesHTML, 2, 2);
            var gbp_usd = getRate("GBP/USD", ratesHTML, 1, 4);
            var fxRates = {
                gbp_inr: gbp_inr,
                usd_inr: usd_inr,
                eur_inr: eur_inr,
                gbp_usd: gbp_usd
            }
            callback(fxRates);
        }
    }
    xhr.send(null);
}

function onInit() {
    console.log('onInit');
    getLatestFromSBI(updateDefaultFxRate);
}

function onAlarm(alarm) {
    console.log('Got alarm', new Date());
    getLatestFromSBI(updateDefaultFxRate);
}

// Binding the events

//Browser Startup Event
if (chrome.runtime && chrome.runtime.onStartup) {
    chrome.runtime.onStartup.addListener(function () {
        console.log('Starting browser... updating icon.');
        getLatestFromSBI(updateDefaultFxRate);
    });
} else {
    // This hack is needed because Chrome 22 does not persist browserAction icon
    // state, and also doesn't expose onStartup. So the icon always starts out in
    // wrong state. We don't actually use onStartup except as a clue that we're
    // in a version of Chrome that has this problem.
    chrome.windows.onCreated.addListener(function () {
        console.log('Window created... updating icon.');
        getLatestFromSBI(updateDefaultFxRate);
    });
}

//On Installed Event
chrome.runtime.onInstalled.addListener(function () {
    onInit();
})

// Alarm Event for refresh
chrome.alarms.onAlarm.addListener(onAlarm);
