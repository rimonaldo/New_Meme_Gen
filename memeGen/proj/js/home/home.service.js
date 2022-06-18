'use strict'

const ID_KEY = 'IMGID'
const GALLERY_ID = 'IMAGES_GALLERY'

function _findIdxById(id,list) {
    return list.findIndex(item => item.id === id)
}

function addEventListeners(){
    var elImgs = document.querySelectorAll('.gallery-img')
    elImgs.forEach((elImg, idx) => {
        var id = elImg.dataset.id = _makeId()
        gIds.push({ id })
        elImg.addEventListener("click", getMeme)
    })
}


function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}