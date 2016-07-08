//var person = prompt("Wachtwoord");
//
//if (person !== "BITstudents-01") {
//    document.getElementsByTagName("html")[0].innerHTML = "Fout";
//} else {
document.onreadystatechange = () => {
    switch (document.readyState) {
        case "loading":
            // The document is still loading.
            break;
        case "complete":
            // The page is fully loaded.
            login.init();

            if (login.onPage !== true) {
                window.readFragmentButton = document.querySelectorAll("[href='#epubcfi']");
                imageResize.init();
                archive.init();
                loaded();
                getBackspaceButton();
                setPreviousLocation();
                login.ifLoggedIn.init();
                
                // rest code:
                $("[data-role='c-modal-opener']").click(() => {
                    $(".c-overlay")[0].style.cssText="display: flex";
                })
                $(".c-overlay").click(() => {
                    $(".c-overlay")[0].style.cssText="display: none";
                })
                
                // disable buttons
                // Disable function
                jQuery.fn.extend({
                    disable: function (state) {
                        return this.each(function () {
                            this.disabled = state;
                        });
                    }
                });


                // select placeholder
                $(".material-input select").change(function () {
                    $(this).css('color', 'black')
                });

                $(".book-preview").hide();
                $(".detail").show();

                // detect ereader
                if ($(".monochrome-tester")[0]) {
                    var color = window.getComputedStyle($(".monochrome-tester")[0], null).getPropertyValue("color");
                    if (color === "red") {
                        window.monochrome = true;
                    } else {
                        window.monochrome = false;
                    }
                }
            }
            break;
    }
}
