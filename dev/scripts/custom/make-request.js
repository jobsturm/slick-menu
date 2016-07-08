var request = (info) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI(info.url));
    xhr.onload = function() {
        if (xhr.readyState === 4 || xhr.status === 200) {
            info.succes(xhr.responseText);
        } else {
            alert(info.url + " ---- " + xhr.responseText);
        }
    };
    xhr.send();
};