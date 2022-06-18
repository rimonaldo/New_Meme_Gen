'use strict'

var gImgs = []
var gIds = []

function initg() {
    // gImgs = loadFromStorage(GALLERY_ID)
    addMemes()
    renderGallery()
    saveGallery()
}

function saveGallery(){
    saveToStorage(GALLERY_ID, gImgs)
}

function renderGallery() {
    var elGallery = document.querySelector('.gallery-container')
    var innerHTML = ""
    var startHtml = `<div class="upload"><a href="#" class="fa fa-solid fa-upload gallery-img"> <input onchange="onLoadImg(value)" id="image-input" accept="image/png, image/jpeg" type="file"></a></div>`
    gImgs.forEach((img) => {
        console.log(img);
        innerHTML += ` <a href="editor.html"> <img  onclick="getMeme(${img.id})" class="gallery-img" id="${img.id}" src='${img.url}' alt=""></a>`
        console.log(elGallery.innerHTML);
    })
    elGallery.innerHTML = startHtml+ innerHTML
    
}

function renderUploadedImg(url){
    addMemes(url)
    renderGallery()
}

function getMeme(img) {
    var id = img.id
    var idx = _findIdxById(id, gImgs)
    gUrl = gImgs[idx].url
    console.log(gUrl);

    saveToStorage(URL_KEY, gUrl)
    saveToStorage(ID_KEY, id)

}


function addMemes(url) {  
    

    if(!url){
        for (var i = 0; i < 15; i++) {
            var id = _makeId()
            gImgs.push({
                tags: ['funny'],
                id,
                url: `memeGen/meme-imgs (square)/${i + 1}.jpg`
            })
        }
    } else{
        console.log('new img');
        var id = _makeId()
        gImgs.unshift({
            tags: ['funny', 'new'],
            id,
            url
        })
    }


}



var imageInput = document.querySelector('#image-input')
var uploadedImg = ""

function onLoadImg(val) {
    console.log(val);
    var file = document.querySelector('#image-input').files[0]
    var fReader = new FileReader()
    console.log(file);
    fReader.readAsDataURL(file)
    
    fReader.onloadend = function (event) {

        renderUploadedImg(event.target.result)
        saveGallery()
    }

}
