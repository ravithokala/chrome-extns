function getRate(fxPair, rates1HTML, numPlaces, decimalPlaces) {
    var fxPair = new RegExp(fxPair + ": [0-9]{" + numPlaces + "}.[0-9]{" + decimalPlaces + "}", "g").exec(rates1HTML);
    return new RegExp("[0-9]{" + numPlaces + "}.[0-9]{" + decimalPlaces + "}", "g").exec(fxPair);
}

function getFxRatesFromResponse(response) {
    var regEx = new RegExp("Indicative Foreign Exchange Rates.*", "g");
    var ratesHTML = regEx.exec(response);
    var gbp_inr = getRate("GBP/INR", ratesHTML, 2, 2);
    var usd_inr = getRate("USD/INR", ratesHTML, 2, 2);
    var eur_inr = getRate("EUR/INR", ratesHTML, 2, 2);
    var gbp_usd = getRate("GBP/USD", ratesHTML, 1, 4);

    return {
        gbp_inr: gbp_inr,
        usd_inr: usd_inr,
        eur_inr: eur_inr,
        gbp_usd: gbp_usd
    }
}

function getLatestFromSBI(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://www.sbiuk.com/", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status === 200 || xhr.status === 304) {
                setData(getFxRatesFromResponse(xhr.responseText), getCurrentDate());
            }
            callback();
        }
    }
    xhr.send(null);
}

// Binding the events

//Browser Startup Event
if (chrome.runtime && chrome.runtime.onStartup) {
    chrome.runtime.onStartup.addListener(function () {
        console.log('Starting browser... updating icon.');
        getLatestFromSBI(updateIcon);
    });
} else {
    // This hack is needed because Chrome 22 does not persist browserAction icon
    // state, and also doesn't expose onStartup. So the icon always starts out in
    // wrong state. We don't actually use onStartup except as a clue that we're
    // in a version of Chrome that has this problem.
    chrome.windows.onCreated.addListener(function () {
        console.log('Window created... updating icon.');
        getLatestFromSBI(updateIcon);
    });
}

//On Installed Event
chrome.runtime.onInstalled.addListener(function () {
    console.log('onInstalled');
    getLatestFromSBI(updateIcon);
})

// Alarm Event for refresh
chrome.alarms.onAlarm.addListener(function(){
    console.log('Got alarm', new Date());
    getLatestFromSBI(updateIcon);
});
