// Saves options to localStorage.
function save_options() {
    var refreshTimeInMins = document.getElementById("refreshTimeInMins").value;
    var defaultFxRate = document.getElementById("defaultFxRate").value;

    setOptions(refreshTimeInMins, defaultFxRate);

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    updateIcon();
    setTimeout(function () {
        status.innerHTML = "";
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var sbiUkOptions = getOptions();
    document.getElementById("refreshTimeInMins").value = sbiUkOptions.refreshTimeInMins;
    document.getElementById("defaultFxRate").value = sbiUkOptions.defaultFxRate;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
