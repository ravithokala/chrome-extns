function getRate(fxPair, ratesHTML) {
    var onlyFxPair =  new RegExp(fxPair + ": \\d+.\\d* ", "g").exec(ratesHTML);
    return  new RegExp("\\d+.\\d*", "g").exec(onlyFxPair);
}

function getFxRatesFromResponse(response) {
    var regEx = new RegExp("Indicative Foreign Exchange Rates.*", "g");
    var ratesHTML = regEx.exec(response);
    var gbp_inr = getRate("GBP/INR", ratesHTML);
    var usd_inr = getRate("USD/INR", ratesHTML);
    var eur_inr = getRate("EUR/INR", ratesHTML);
    var gbp_usd = getRate("GBP/USD", ratesHTML);

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


function setAlarmForNextUpdate(){
    var sbiUkOptions = getOptions();
    var refreshTimeInMins = +sbiUkOptions.refreshTimeInMins; // converting to int
    setNextAlarm(refreshTimeInMins);
}

// Binding the events

//Browser Startup Event
if (chrome.runtime && chrome.runtime.onStartup) {
    chrome.runtime.onStartup.addListener(function () {
        console.log('Starting browser... updating icon.');
        getLatestFromSBI(updateIcon);
        setAlarmForNextUpdate();
    });
}

//On Installed Event
chrome.runtime.onInstalled.addListener(function(details){
    console.log('Event: onInstalled ' + details.reason);
    getLatestFromSBI(updateIcon);
    setAlarmForNextUpdate();
});

// Alarm Event for refresh
chrome.alarms.onAlarm.addListener(function(){
    console.log('Got alarm', new Date());
    getLatestFromSBI(updateIcon);
    setAlarmForNextUpdate();
});
