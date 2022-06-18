'use strict'
const URL_KEY = 'URL'
const MEME_KEY = 'MEME'
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

var gCanvasCopy
var gCtxCopy
var gStartPos
var gUrl
var gMemes = []
var gCanvas
var gCtx
var gCanvasBottom
var gCtxBottom
var gOpacity = 1
var gIsStroke = false
var gMeme = {
    url: '',
    imgId: 0,
    lineIdx: 0,
    lines: [{
        linePos: { x: 20, y: 100 },
        text: 'ENTER TEXT',
        size: 60,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: false,
        isDrag: false,
        isClicked: false
    },
    {
        linePos: { x: 50, y: 450 },
        text: '',
        size: 60,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: false,
        isDrag: false,
        isClicked: false
    }]
}

/* RENDERS
// -----------------------------------------------------------------*/

function renderCopy(){
    var img = new Image()
    img.src = loadFromStorage(URL_KEY)

    img.onload = () => {

        for (var i = 0; i < gMeme.lines.length; i++) {
            var text = gMeme.lines[i].text
            var { x, y } = gMeme.lines[i].linePos
            drawCopyText(text, i)
        }

    }
}

function drawCopyText(text, idx = gMeme.lineIdx) {
    console.log(idx);
    var line = gMeme.lines[idx]
    var {x,y} = line.linePos
    gCtxCopy.lineWidth = 3
    gCtxCopy.strokeStyle = line.stroke
    gCtxCopy.font = line.size + 'px Impact'
    gCtxCopy.fillStyle = line.color
    gCtxCopy.fillText(text, x, y)
    gCtxCopy.strokeText(text, x, y)
}

function renderMemeImg() {
    var img = new Image()
    img.src = loadFromStorage(URL_KEY)
    gMeme.url = loadFromStorage(URL_KEY)

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        gCtxBottom.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        gCtxCopy.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        setText(getLine().text)
        _clearStroke()
        _strokeRect(getLine().linePos.x,getLine().linePos.y)
        renderLines()
        renderCopy()
    }
}



function renderLines() {
    for (var i = 0; i < gMeme.lines.length; i++) {
        var text = gMeme.lines[i].text
        var { x, y } = gMeme.lines[i].linePos
        drawText(text, i)
    }
}

function addLine() {
    var line = {
        linePos: { x: 50, y: 250 },
        text: '',
        size: 40,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: false,
        isDrag: false,
        isClicked: false
    }
    gMeme.lines.push(line)
}

/* MOUSE and TOUCH
---------------------------------------------------------*/

function selectLine() {

}

function onDown(ev) {
    strokeOff()
    const pos = getEvPos(ev)
    if (!isTextClicked(pos)) return
    // strokeOn()
    const line = getLine()
    line.isDrag = true
    setTextDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    const line = getLine();
    const evPos = getEvPos(ev)
    if (line.isDrag) {
        //Calc the delta , the diff we moved
        const dx = evPos.x - line.linePos.x
        const dy = evPos.y - line.linePos.y
        moveText(dx, dy)
        // strokeOn()
        renderCanvas()
    }
}

function onUp() {
    setTextDrag(false)
    setTextClick()
    
    document.body.style.cursor = 'grab'
}

function setClickedLine(clickedPos) {
    gMeme.lines.forEach((line) => {
        var isClicked = line.isClicked
        const { x, y } = getLinePos(line)
        var yStart = y - 30
        var yEnd = y + 30
        if (clickedPos.y >= yStart && clickedPos.y <= yEnd) {
            line.isClicked = true
            var idx = gMeme.lines.findIndex((line) => {
                return line.linePos.y >= yStart && clickedPos.y <= yEnd
            }) 

            // console.log(gMeme.lines[idx]);
            strokeOn()
            gMeme.lineIdx = idx
            
            return idx
        } 

    })
    console.log(gMeme.lineIdx);
}

function isTextClicked(clickedPos) {
    setClickedLine(clickedPos)

    var isClicked = gMeme.lines.find((line)=>{
        return line.isClicked === true
    })
    console.log(isClicked);
    return isClicked
}

/* HELPERS
------------------------------------------------------------------*/

/* SETTERS
------------------------------------------------------------------*/

function setCanvas() {
    //top layer
    gCanvas = document.querySelector('.canvas')
    gCtx = gCanvas.getContext('2d')
    //bottom layer
    gCanvasBottom = document.querySelector('.canvas-bottom')
    gCtxBottom = gCanvasBottom.getContext('2d')
    // copy for download
    gCanvasCopy = document.querySelector('.canvas-copy')
    gCtxCopy = gCanvasCopy.getContext('2d')
}

function setImgId() {
    gMeme.imgId = loadFromStorage('IMGID')
    saveMeme()
}

function setText(text = getLine().text) {
    var { x, y } = getLinePos()
    clearLine(x, y)
    setInputVal(text)
    drawText(text)
    saveMeme()
}

function setLine(direction, text) {
    if (direction === 'down') {
        gMeme.lineIdx++
    } else gMeme.lineIdx--
    if (gMeme.lineIdx >= gMeme.lines.length || gMeme.lineIdx <= 0) gMeme.lineIdx = 0

}

function setInputVal(text) {
    var elInput = document.querySelector('.txt-input')
    var elSize = document.querySelector('.size-input')
    elSize.value = getLine().size
    elInput.value = text
    getLine().text = text
    saveMeme()
}

function setTextClick(isClicked = false){
    gMeme.lines.forEach((line)=>{
        line.isClicked = isClicked
    })
}

// got render color bug
function setFontColor(hex) {
    getLine().color = hex
    hex = getLine().color
    saveMeme()
    for (var i = 0; i < gMeme.lines.length; i++) {
    }
    renderCanvas()
}

/* GETTERS
 ----------------------------------------------------------*/

function getLine() {
    return gMeme.lines[gMeme.lineIdx]
}

function getLinePos(line = getLine()) {

    var x = line.linePos.x
    var y = line.linePos.y
    return { x, y }
}

function getColor() {
    return getLine().color
}

/* CANVAS
// ------------------------------------------------------*/

function drawText(text, idx = gMeme.lineIdx) {
    
    var line = gMeme.lines[idx]
    var {x,y} = line.linePos
    gCtx.lineWidth = 3
    gCtx.strokeStyle = line.stroke
    gCtx.font = line.size + 'px Impact'
    gCtx.fillStyle = line.color
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}




function clearLine(x = gCanvas.width, y = gCanvas.height) {
    var size = gMeme.lines[gMeme.lineIdx].size
    gCtx.clearRect(x, y - size, gCanvas.width, size + 20);
}

function strokeOn() {
    if (getLine().isStroke) return
    var { x, y } = getLinePos()
    _strokeRect(x, y)
    getLine().isStroke = true
    saveMeme()
}

function strokeOff() {
    if (!getLine().isStroke) return
    var { x, y } = getLinePos()
    _clearStroke(x, y)
    getLine().isStroke = false
    saveMeme()
}

function _strokeRect(x, y) {

    var size = gMeme.lines[gMeme.lineIdx].size

    _drawLine(0, y - (size + 5))
    _drawLine(0, y + size / 2)

}

function _drawLine(x, y, xEnd = gCanvas.width, yEnd = y) {
    gCtx.lineWidth = 1;
    gCtx.moveTo(x, y);
    gCtx.lineTo(xEnd, yEnd);
    gCtx.strokeStyle = 'orange';
    gCtx.stroke();
}

function _clearStroke() {
    var { x, y } = getLinePos()
    var size = gMeme.lines[gMeme.lineIdx].size
    //upper
    gCtx.beginPath();
    gCtx.clearRect(0, y - size - 8, gCanvas.width, 10);
    gCtx.stroke();
    //lower
    gCtx.beginPath()
    gCtx.clearRect(0, y + size / 3.5, gCanvas.width, size / 3);
    gCtx.stroke();

}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

/* STORAGE
// ----------------------------------------------------------*/

function saveMeme(meme = gMeme) {
    saveToStorage(MEME_KEY, meme)
}

function loadMeme() {
    return loadFromStorage(MEME_KEY)
}
