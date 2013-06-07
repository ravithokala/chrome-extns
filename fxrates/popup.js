function updateDom() {
    var sbiUkData = getData();
    var fxRates = sbiUkData.fxRates;
    var updatedTime = sbiUkData.updatedTime;
    if (fxRates) {
        document.getElementById("gbp_inr").innerHTML = fxRates.gbp_inr;
        document.getElementById("usd_inr").innerHTML = fxRates.usd_inr;
        document.getElementById("eur_inr").innerHTML = fxRates.eur_inr
        document.getElementById("gbp_usd").innerHTML = fxRates.gbp_usd;
        document.getElementById("lastUpdated").innerHTML = updatedTime;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateDom();
});
