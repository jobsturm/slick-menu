const api = {};

api.requestRecent = (onSucces) => {
    request({
        url: "/wp-json/books/recent",
        succes: (data) => {
            api.recent = $.map(JSON.parse(data), (value, index) => {
                return [value];
            });
            
            api.recentOriginal = api.recent;

            api.recent.push(api.recent.shift());
            api.recent.push(api.recent.shift());
            api.recent.push(api.recent.shift());
            api.recent.push(api.recent.shift());
            api.recent.push(api.recent.shift());
            api.new = api.recent;

            onSucces.succes();
        }
    });
};
api.requestAll = (onSucces) => {
    request({
        url: "/wp-json/books/all",
        succes: (data) => {
            api.all = $.map(JSON.parse(data), (value, index) => {
                value.date_start_nummeric = "";
                value.date_start_nummeric = value.date_start.replace("Januari", "01")
                value.date_start_nummeric = value.date_start_nummeric.replace("Februari", "02")
                value.date_start_nummeric = value.date_start_nummeric.replace("Maart", "03")
                value.date_start_nummeric = value.date_start_nummeric.replace("April", "04")
                value.date_start_nummeric = value.date_start_nummeric.replace("Mei", "05")
                value.date_start_nummeric = value.date_start_nummeric.replace("Juni", "06")
                value.date_start_nummeric = value.date_start_nummeric.replace("Juli", "07")
                value.date_start_nummeric = value.date_start_nummeric.replace("Augustus", "08")
                value.date_start_nummeric = value.date_start_nummeric.replace("September", "09")
                value.date_start_nummeric = value.date_start_nummeric.replace("Oktober", "10")
                value.date_start_nummeric = value.date_start_nummeric.replace("November", "11")
                value.date_start_nummeric = value.date_start_nummeric.replace("December", "12");
                value.date_start_nummeric = parseInt(value.date_start_nummeric.replace(/ /g, ''));
                return [value];
            });

            // sort array, because backenders...
            api.all.sort(function (a, b) {
                var nameA = a.date_start_nummeric; // ignore upper and lowercase
                var nameB = b.date_start_nummeric; // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });

            onSucces.succes();
        }
    });
};
api.requestISBN = (onSucces) => {
    var isbn = document.URL.split("?")[1];
    if (isbn && isbn.indexOf("&") > -1) {
        isbn = isbn.split("&")[0];
    }

    if ($('[data-slider-loop="api.featured"]').length > 0) {
        var sliderContainer = $('[data-slider-loop="api.featured"]')[0];
        sliderContainer.setAttribute("data-slider-loop", `api.${fill.api}`)
    }

    if (isbn !== undefined) {
        request({
            url: "/wp-json/books/retrieve/" + isbn,
            succes: (data) => {
                api.handleISBNdata(data);
                onSucces.succes();
            }
        });
    }
}

api.requestFeatured = (onSucces) => {
    request({
        url: "/wp-json/books/featured/",
        succes: (data) => {
            api.featured = $.map(JSON.parse(data), (value, index) => {
                return [value];
            });
            onSucces.succes();
        }
    });
};

// READ
api.readBook = (onSucces) => {
    var isbn = document.URL.split("?")[1];
    if (isbn && isbn.indexOf("&") > -1) {
        isbn = isbn.split("&")[0];
    }

    var fail = () => {
        if (api.currentDetail && api.currentDetail.price_normal === "gratis") {
            $("a[href='#epubcfi']").each((n, el) => {
                var message = "Gratis lezen?";
                
                if (login.response && login.response.succes === true) {
                    message = "Lees dit boek";
                }
                
                el.innerHTML = message;
                el.setAttribute("disabled", "false");
            });
            window.loggedInFreeBook = false;
        }
    };

    if (api.currentDetail && api.currentDetail.price_normal === "gratis") {
        $("a[href='#epubcfi']").each((n, el) => {
            el.innerHTML = "...";
            el.setAttribute("disabled", "true");
            window.loggedInFreeBook = "loading";
        });
    }

    request({
        url: "/wp-json/books/read/" + isbn,
        succes: (data) => {
            try {
                var data = JSON.parse(data);
                if (data.preview_url) {
                    onSucces.succes(data);
                } else {
                    fail();
                }
            } catch (e) {
                fail();
            }

        }
    });
};

api.handleISBNdata = (data) => {
    api.currentDetail = JSON.parse(data);
    api.currentDetail.cover.tablet = api.currentDetail.cover.tablet;
    if (api.currentDetail.price_normal === "0,00") api.currentDetail.price_normal = "gratis";
    if (api.currentDetail.price_retail === "0,00") api.currentDetail.price_retail = "gratis";
    if (api.currentDetail.price_sale === "0,00") api.currentDetail.price_sale = "gratis";
    loadedISBN();
    afterDraw.copyright.init();
    api.readBook();
}

// find in API
api.findIn = (index, where, what) => {
    var house = api[index],
        result = false;

    house.forEach((room, n) => {
        if (room[where] == what) {
            result = {
                room: room,
                index: n
            };
        }
    });

    return result;
}
