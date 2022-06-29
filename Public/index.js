function openLeftMenu() {
  document.getElementById("leftMenu").style.display = "block";
}

function closeLeftMenu() {
  document.getElementById("leftMenu").style.display = "none";
  document.getElementById("smallmenu").style.display = "none";
  cbtnpress = true;
  document.getElementById("smallmenu1").style.display = "none";
  sbtnpress = true;
  document.getElementById("smallmenu2").style.display = "none";
  sbtnpress = true;
}
// <!-- pencil rect line code  -->

let cTool = "pencil";
let canvasBoard = document.querySelector("canvas");
let tool = canvasBoard.getContext("2d");
let body = document.querySelector("body");
canvasBoard.height = window.innerHeight;
canvasBoard.width = window.innerWidth;

// canavas board -> left  point kitna aage  hai 
let boardLeft = canvasBoard.getBoundingClientRect().left;
let boardTop = canvasBoard.getBoundingClientRect().top;
let iX, iY, fX, fY;
let drawingMode = false;

canvasBoard.addEventListener("mousedown", function (e) {
  // iX = e.clientX - boardLeft
  // iY = e.clientY - boardTop
  // if (cTool == "pencil" || cTool == "eraser") {
  //     drawingMode = true;
  //     tool.beginPath();
  //     tool.moveTo(iX, iY);
  // }
  drawingMode = true;
  iX = e.clientX - boardLeft,
 iY = e.clientY - boardTop
 if(cTool == "rect"){
   return;
 }
 
  let data = {
   iX ,
   iY
  }
  socket.emit("beginstroke", data);

})

function beginstroke(data) {

  tool.beginPath();
  tool.moveTo(data.iX, data.iY);
}
canvasBoard.addEventListener("mouseup", function (e) {
  drawingMode = false;
  
  if (cTool == "rect" || cTool == "line") {
    // rect, line
    let data = {
      fX : e.clientX + boardLeft,
    fY : e.clientY - boardTop,
    iX : iX,
    iY : iY,
    cTool : cTool,
    color : tool.strokeStyle,
   width : tool.lineWidth,
   
   }
   socket.emit("drawstroke",data);
  }
  
})
canvasBoard.addEventListener("mousemove", function (e) {
  if (drawingMode == false)
    return;

if(cTool == "pencil" || cTool == "eraser"){
  let data = {
    fX : e.clientX + boardLeft,
  fY : e.clientY - boardTop,
  iX : iX,
  iY : iY,
  cTool : cTool,
  color : tool.strokeStyle,
 width : tool.lineWidth,
 
 }
 socket.emit("drawstroke",data);
}


})
function drawstroke(data){

  tool.strokeStyle = data.color;
  tool.lineWidth = data.width;
  let width = data.fX - data.iX;
  let height = data.fY - data.iY;
  if(data.cTool == "pencil" || data.cTool == "eraser"){
   
     tool.lineTo(data.fX, data.fY);
     tool.stroke();
     // iX = fX;
     // iY = fY;  
     }else {
        if (data.cTool == "rect") {
    
      tool.strokeRect(data.iX, data.iY, width, height);
  } else if (data.cTool == "line") {
     //  tool.beginPath();
     //  tool.moveTo(data.iX, data.iY);
      tool.lineTo(data.fX, data.fY);
      tool.stroke();
      console.log("line tool is pending")
  }
  let url = canvasBoard.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length-1;
  
     }
  
  
  }
let themebtn = true;

// <!-- tool change -->
let undoRedoTracker = []; //Data
let track = 0; // Represent which action from tracker array
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let rect = document.querySelector(".rect");
let line = document.querySelector(".line");
let options = document.querySelectorAll(".size-box");
let shapes = document.querySelector(".shapes");
let download = document.querySelector(".download");
let upload = document.querySelector(".upload");
let sticky = document.querySelector(".sticky");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");


//   let theme = document.querySelector(".round");


//  theme.addEventListener("click", function(){
//   themechnge();
//  })

shapes.addEventListener("click", function (e) {
  canvasBoard.classList.add("cursor1");
  canvasBoard.classList.remove("cursor2");
})
// identify -> click  -> again click
pencil.addEventListener("click", function (e) {

  cTool = "pencil";

  canvasBoard.classList.add("cursor1");
  canvasBoard.classList.remove("cursor2");


})
eraser.addEventListener("click", function (e) {

  // eraser.style.border = "1px solid red";
  // koi aur clicked aur usko options visible to wo remove ho jaaye 
  cTool = "eraser";
  if (themebtn) {
    tool.strokeStyle = "white";
  } else {

    tool.strokeStyle = "black";
  }

  canvasBoard.classList.remove("cursor1");
  canvasBoard.classList.add("cursor2");
})
rect.addEventListener("click", function (e) {
  cTool = "rect";

})
line.addEventListener("click", function (e) {
  cTool = "line";
})

let redColor = document.querySelector(".red");
let greenColor = document.querySelector(".green");
let blueColor = document.querySelector(".blue");
redColor.addEventListener("click", function () {
  tool.strokeStyle = "red";
})
greenColor.addEventListener("click", function () {
  tool.strokeStyle = "green";
})
blueColor.addEventListener("click", function () {
  tool.strokeStyle = "blue";
})


let sizeBoxArr = document.querySelector(".size-box");
// currentTarget
sizeBoxArr.addEventListener("click", function (e) {
  // actual event  occur -> target
  let elems = ["size1", "size2", "size3", "size4"];
  // class
  // jispe 
  // console.log(e.target);
  let allTheClasses = e.target.classList;
  let firstClass = allTheClasses[0];
  let test = elems.includes(firstClass);
  if (test) {
    // size waale button click;
    if (firstClass == "size1") {
      tool.lineWidth = 1;
    } else if (firstClass == "size2") {
      tool.lineWidth = 4;
    } else if (firstClass == "size3") {
      tool.lineWidth = 7;
    } else if (firstClass == "size4") {
      tool.lineWidth = 10;
    }
  }


  // event listener -> currentTarget
  // console.log(e.currentTarget)
})
let allclear = document.querySelector(".clear");
allclear.addEventListener("click", function (e) {
  tool.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
  track++;
})
let cbtnpress = true;
let sbtnpress = true;
let shbtnpress = true;

function openSmallMenu() {
  if (cbtnpress) {
    document.getElementById("smallmenu").style.display = "block";
    cbtnpress = false;
  } else {
    document.getElementById("smallmenu").style.display = "none";
    cbtnpress = true;
  }

}
function openSmallMenu1() {
  if (sbtnpress) {
    document.getElementById("smallmenu1").style.display = "block";
    sbtnpress = false;
  } else {
    document.getElementById("smallmenu1").style.display = "none";
    sbtnpress = true;
  }
}
function openSmallMenu2() {
  if (sbtnpress) {
    document.getElementById("smallmenu2").style.display = "block";
    sbtnpress = false;
  } else {
    document.getElementById("smallmenu2").style.display = "none";
    sbtnpress = true;
  }
}

function themechnge() {
  pencil.click();
  if (themebtn) {
    themebtn = false;
    canvasBoard.classList.toggle("theme1");
    tool.strokeStyle = "white";
    tool.clearRect(0, 0, canvasBoard.width, canvasBoard.height);

  } else {
    themebtn = true;
    canvasBoard.classList.remove("theme1");
    tool.strokeStyle = "black";
    document.getElementById("mytheme").src = "Icons/moon.png";
    tool.clearRect(0, 0, canvasBoard.width, canvasBoard.height);

  }
}
document.querySelector('.checkbox').addEventListener('change', () => {
  // document.querySelectorAll('.night-mode-available').forEach(ele=>{
  //   ele.classList.toggle('night');
  // })
  themechnge();
});
download.addEventListener("click", (e) => {
  let url = canvasBoard.toDataURL();

  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
})

upload.addEventListener("click", (e) => {
  // Open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyTemplateHTML = `
      <div class="header-cont">
          <div class="minimize"></div>
          <div class="remove"></div>
      </div>
      <div class="note-cont">
          <img src="${url}"/>
      </div>
      `;
    createSticky(stickyTemplateHTML);
  })
})

sticky.addEventListener("click", (e) => {
  let stickyTemplateHTML = `
  <div class="header-cont">
      <div class="minimize"></div>
      <div class="remove"></div>
  </div>
  <div class="note-cont">
      <textarea spellcheck="false"></textarea>
  </div>
  `;

  createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML) {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = stickyTemplateHTML;
  document.body.appendChild(stickyCont);

  let minimize = stickyCont.querySelector(".minimize");
  let remove = stickyCont.querySelector(".remove");
  noteActions(minimize, remove, stickyCont);

  stickyCont.onmousedown = function (event) {
    dragAndDrop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
}

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  })
  minimize.addEventListener("click", (e) => {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") noteCont.style.display = "block";
    else noteCont.style.display = "none";
  })
}

function dragAndDrop(element, event) {

  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = 'absolute';
  element.style.zIndex = 1000;

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + 'px';
    element.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener('mousemove', onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener('mousemove', onMouseMove);
    element.onmouseup = null;
  };
}
undo.addEventListener("click", (e) => {
  if (track >= 0) track--;
  // track action
  let data = {
    trackValue: track,
    undoRedoTracker
  }
  undoRedoCanvas(data);

})
redo.addEventListener("click", (e) => {
  if (track < undoRedoTracker.length - 1) track++;
  // track action
  let data = {
    trackValue: track,
    undoRedoTracker
  }
  undoRedoCanvas(data);
})

function undoRedoCanvas(trackObj) {
  track = trackObj.trackValue;
  undoRedoTracker = trackObj.undoRedoTracker;
  tool.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
  let url = undoRedoTracker[track];
  let img = new Image(); // new image reference element
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvasBoard.width, canvasBoard.height);
  }
}

canvasBoard.addEventListener("mousedown", function () {
  closeLeftMenu();
})
socket.on("beginstroke",(data)=>{
  beginstroke(data);
})
socket.on("drawstroke",(data)=>{
  drawstroke(data);
})