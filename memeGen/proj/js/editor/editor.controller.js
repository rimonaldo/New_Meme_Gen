'use strict'

function init() {
    setCanvas()
    renderMemeImg()
    addListeners()
    setImgId()
    gCtx.textAlign = 'left'
}

function renderCanvas() {
    renderMemeImg()
    saveMeme()
    // setText()
}

function downloadCanvas(elLink,ev) {
    
    var img = new Image()
    img.src = loadFromStorage(URL_KEY)
    
    img.onload = () => { 
        gCtxCopy.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        setCanvasCopy()
    }


    var data = gCanvasCopy.toDataURL();
    elLink.href = data;
    elLink.download = 'puski';

  
}

function setDownload(elLink,ev){
    // ev.preventDefault()
    downloadCanvas(elLink)

}

function setCanvasCopy(){
    renderCopy()
}

function onPallete(val){
    setFontColor(val)
   
    renderCanvas()
}
// add a new line
function onAddLine() {
    addLine()
}

// sets the line the user is editing

function onInputText(){
    _strokeRect()
    setTimeout(()=>{
        _clearStroke()
    },3000)
}

function onSetLine(direction){
    _clearStroke()
    setLine(direction, getLine().text)
    var { x, y } = getLinePos()
    setInputVal(getLine().text)
    _strokeRect(x, y)  
    
    saveMeme()
}

function setFontSize(size){
    _clearStroke()
    var {x,y} = getLinePos()  
    clearLine(x, y)   
    getLine().size = +size
    drawText(getLine().text)
    saveMeme()
}

function onAlign(direction){
    if (direction === 'left') return
    if (direction === 'center') getLine().align = 'center'
    if (direction === 'right') getLine().align = 'right'
}

function onDeleteLine() {
    clearCanvas()
}






function setTextDrag(isDrag) {
    var line = getLine()
    line.isDrag = isDrag
}

function getEvPos(ev) {

    //Gets the offset pos , the default pos
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }

    // Check if its a touch ev
    if (gTouchEvs.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function moveText(dx, dy) {
    var { x, y } = getLinePos()
    var line = getLine()
    // add diff
    var diff = (line.text.length) ? line.text.length * 16 : 160

    x += dx - diff 
    y += dy 
    // sets position in line object pos
    line.linePos.x = x
    line.linePos.y = y
}


// EVENT LISTENERS
// ----------------------------------------------------------------
function addListeners() {
    _addMouseListeners()
    _addTouchListeners()
}

function _addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function _addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}
