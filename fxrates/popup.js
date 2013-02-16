var rates = {
    getLatestFromSBI: function () {
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
                var gbp_inr = rates.getRate("GBP/INR", ratesHTML, 2, 2)
                var usd_inr = rates.getRate("USD/INR", ratesHTML, 2, 2);
                var eur_inr = rates.getRate("EUR/INR", ratesHTML, 2, 2);
                var gbp_usd = rates.getRate("GBP/USD", ratesHTML, 1, 4);
                document.getElementById("gbp_inr").innerHTML = gbp_inr;
                document.getElementById("usd_inr").innerHTML = usd_inr;
                document.getElementById("eur_inr").innerHTML = eur_inr
                document.getElementById("gbp_usd").innerHTML = gbp_usd;
                document.getElementById("curr_time").innerHTML = rates.getCurrentDate();

                document.body.removeChild(hiddenDiv);
                //chrome.browserAction.setBadgeText({text: '' + gbp_inr + ''});
            }
        }
        xhr.send(null);
    },

    getRate: function (fxPair, ratesHTML, numPlaces, decimalPlaces) {
        var fxpair = new RegExp(fxPair + ": [0-9]{" + numPlaces + "}.[0-9]{" + decimalPlaces + "}", "g").exec(ratesHTML);
        return new RegExp("[0-9]{" + numPlaces + "}.[0-9]{" + decimalPlaces + "}", "g").exec(fxpair);
    },

    getCurrentDate: function () {
        var currTime = new Date();
        var date = rates.normalize(currTime.getDate()) + "/"
            + rates.normalize(currTime.getMonth() + 1) + "/"
            + currTime.getFullYear();
        var time = rates.normalize(currTime.getHours()) + ":"
            + rates.normalize(currTime.getMinutes()) + ":"
            + rates.normalize(currTime.getSeconds());
        return date + " " + time;
    },

    normalize: function (num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return "" + num;
        }
    }


};


// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
    rates.getLatestFromSBI();
});
