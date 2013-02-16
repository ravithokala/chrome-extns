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
                var gbp_inr = /GBP\/INR: [0-9]{2}.[0-9]{2}/g.exec(ratesHTML)
                document.getElementById("sbi_response").innerHTML = gbp_inr;
                document.body.removeChild(hiddenDiv);
            }
        }
        xhr.send(null);
    }

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
    rates.getLatestFromSBI();
});
