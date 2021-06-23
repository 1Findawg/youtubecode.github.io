window.onload = function() {
    siteTitle();
    siteNavigation();
    siteFooter();
}

function siteTitle() {
    if (window.location.href.includes("home.html")) {
        document.getElementById("header").innerHTML += "<h1 class='center'>1Findawg Youtube Projects</h1>";
    }
}

function siteNavigation() {
    var navigationList = ["Home"];
    var navigationPath = ["home"];
    var header = "<div class='navigationList'>";
    for (var i = 0; i < navigationList.length; i++){
        header += "<a class='listItem' href='" + navigationPath[i] + ".html'>" + navigationList[i] + "</a>";
    }
    header += "</div>";
    document.getElementById("header").innerHTML += header;
}

function siteFooter() {
    document.getElementById("footer").innerHTML = "<div class='siteFooter'>Thank you for exploring my projects site. The material is to only be used as an educational tool. Please take visit my <a href='https://www.youtube.com/user/1Findawg'>YouTube Channel</a> to get a more in depth understanding of the coding that went it this site.</div>";
}
