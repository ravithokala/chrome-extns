/**
 *
 * @returns sbiUkData from localstorage
 */
function getData() {
    var data = localStorage["sbiUkData"];
    return JSON.parse(data)
}

/**
 * Stores the data in localStorage only if fxRates are available
 * @param fxRates fxRates
 */
function setData(fxRates, updatedTime) {
    var data = {
        fxRates: fxRates,
        updatedTime: updatedTime
    }
    localStorage["sbiUkData"] = JSON.stringify(data);
}


/**
 *
 * @returns options
 */
function getOptions() {
    var options = localStorage["sbiUkOptions"];
    if (options) {
        return JSON.parse(options)
    } else {
        return {refreshTimeInMins: 10, defaultFxRate: "gbp_inr"}
    }
}

/**
 * Stores the options in localStorage
 * @param options options
 */
function setOptions(refreshTimeInMins, defaultFxRate) {
    var options = {
        refreshTimeInMins: refreshTimeInMins,
        defaultFxRate: defaultFxRate
    }
    localStorage["sbiUkOptions"] = JSON.stringify(options);
    console.log("String" + JSON.stringify(options));
}


function setDefaultOptions() {
    console.log("setting Default Options");
    setOptions(10, "gbp_inr");
}

/**
 *
 * @param num num
 * @returns prefixes with zero if the number is less than 10
 */
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

function setNextAlarm(refreshTimeInMins) {
    console.log('Creating alarm for next update in ' + refreshTimeInMins + " mins.");
    chrome.alarms.create('refresh', {periodInMinutes: refreshTimeInMins});
}

function updateIcon() {
    var sbiUkOptions = getOptions();
    var sbiUkData = getData();
    if (sbiUkData) {
        var fxRates = sbiUkData.fxRates; // Error handling
        chrome.browserAction.setBadgeText({text: fxRates[sbiUkOptions.defaultFxRate] + ""});
    }
    var refreshTimeInMins = +sbiUkOptions.refreshTimeInMins; // converting to int
    setNextAlarm(refreshTimeInMins);
}
