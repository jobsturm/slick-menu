// This script is in place to replace the blurred 10px x 10px images, with their
// original counterparts.


// bigImg element
class BigImg {
    constructor (originalImg) {
        this.src = originalImg.src;
        this.alt = originalImg.getAttribute("alt");
        this.width = originalImg.offsetWidth;
        this.height = originalImg.offsetHeight;

        let img = document.createElement("img");
        img.src = this.src.replace("small", "big");
        img.alt = this.alt;
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        img.className = "bigImg";
        this.el = img;
    }
}

// main function
const imageResize = {
    replace: (originalImg, newImg) => {
        // get the parent element
        var parent = originalImg.parentElement;
        // get the location of the image in the parent element
        var nodeIndexOriginalImg = [].indexOf.call(originalImg.parentNode.children, originalImg);
        // insert new image before old image
        parent.insertBefore(newImg, parent.children[nodeIndexOriginalImg]);
        newImg.onload = function () {
            setTimeout(function () {
            parent.removeChild(originalImg);
            }, 800);
        }
    },
    index: () => {
        var elements = document.querySelectorAll("[data-image-resize]");
        return elements;
    }
};

// pipeline
imageResize.init = () => {
    var imgElements = imageResize.index();
    // looping over all [data-image-resize]
    [].forEach.call(imgElements, (img) => {
        // creating the original image
        var bigImg = new BigImg(img);
        // replacing the old image with the new image
        imageResize.replace(img, bigImg.el);
    });
};
