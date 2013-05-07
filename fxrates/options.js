// Saves options to localStorage.
function save_options() {
    var refreshTimeInMinsText = document.getElementById("refreshTimeInMins");
    var refreshTimeInMins = refreshTimeInMinsText.value;
    localStorage["refreshTimeInMins"] = refreshTimeInMins;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    setTimeout(function () {
        status.innerHTML = "";
    }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var refreshTimeInMins = localStorage["refreshTimeInMins"];
    if (!refreshTimeInMins) {
        refreshTimeInMins = 10 // default value
    }
    document.getElementById("refreshTimeInMins").value = refreshTimeInMins;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);