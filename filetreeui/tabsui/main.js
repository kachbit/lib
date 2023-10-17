const marker = document.createElement("div");
const placeholder = document.createElement("div");
marker.classList.add("marker");
let drag = null;
let lastDragOver = null;
const tabbars = [document.querySelector('#tabs')];
tabbars[0].ondrop = () => barDrop(event)
tabbars[0].ondragend = () => barEnd(event)
tabbars[0].ondragover = () => barOver(event)
function select(tab) {
  tabClick(tab)
}
function getPanel(tab) {
  return document.querySelector("#"+tab.panel)
}
function tabList() {
  return tabbars[0].querySelectorAll(".tab");
}
function selectedTab(tabbar) {
  if(tabbar) {
    return tabbar.querySelector(".active.tab");
  } else {
    return tabbars[0].querySelector(".active.tab");
  }
}
function updateTab() {
  // if there is no selected tab, select the first one
  if(!selectedTab(tabbars[0])) {   
    tabClick("",tabbars[0].querySelector(".tab"));
  }
  // if tab does not match panel, reselect tab
if(document.querySelector("#"+selectedTab(tabbars[0]).panel).style.visibility !== "visible") {
    tabClick("",selectedTab(tabbars[0]));
  }
  // if there is more than one selected tab, unselect all and updateTab()
  if(tabbars[0].querySelectorAll(".tab.active").length > 1) {
  document.querySelectorAll(".tab.active").forEach(tab1 => tab1.classList.remove("active"));
    updateTab()
  }
  // if tab is not selected, hide its panel
  tabbars[0].querySelectorAll(".tab").forEach((tab1) => 
 {tab1.classList.contains("active") ? getPanel(tab1).style.visibility = "visible" : getPanel(tab1).style.visibility = "hidden"                                       
})
}
function tabClick(event, tab) {
	const active = tabbars[0].querySelector(".tab.active");
	if(active) {
		active.classList.remove("active");
	}
	tab.classList.add("active");
	if(tab.classList.contains('active')) {
		document.querySelectorAll('.materialBoard').forEach((e) => {
			e.style.visibility = 'hidden';
		})
		document.querySelector("#" + tab.panel).style.visibility = 'visible';
		setTimeout(function() {
			document.querySelector("#" + tab.panel).querySelector('textarea').focus()
		}, 0);
    updateTab()
	}
	//document.querySelector("#"+tab.panel).style.visibility = document.querySelector("#"+tab.panel).style.visibility === 'visible'? 'hidden': 'visible'
}

function tabUp(event, tab) {}

function tabStart(event, tab) {
	event.dataTransfer.setData("text/plain", tab.textContent);
	event.dataTransfer.dropEffect = "move";
	drag = event.target;
	drag.classList.add("dragging");
	tabbars[0].classList.add("dragging-in-progress");
  updateTab()
}

function tabOver(event, tab) {
	event.preventDefault();
	event.stopPropagation();
	event.dataTransfer.dropEffect = "move";
	if(tab === drag) return;
	if(tab === lastDragOver) return;
	if(lastDragOver) lastDragOver.classList.remove("drag-over");
	lastDragOver = tab;
	tab.classList.add("drag-over");
	tabbars[0].insertBefore(marker, tab);
}

function tabDrop(event, tab) {
	event.preventDefault();
	event.stopPropagation();
	swap(drag, tab);
  updateTab()
}

function barOver(event) {
	event.preventDefault();
	event.dataTransfer.dropEffect = "move";
	if(tabbars[0] === lastDragOver) return;
	if(lastDragOver) lastDragOver.classList.remove("drag-over");
	lastDragOver = tabbars[0];
	tabbars[0].append(marker);
}

function barEnd() {
	if(lastDragOver) lastDragOver.classList.remove("drag-over");
	lastDragOver = null;
	drag.classList.remove("dragging");
	drag = null;
	tabbars[0].classList.remove("dragging-in-progress");
	tabbars[0].removeChild(marker);
}

function barDrop(event) {
	event.preventDefault();
	tabs.appendChild(drag);
}

function swap(n1, n2) {
	if(n1 === n2) return;
	const parent = n1.parentNode;
	parent.replaceChild(placeholder, n1);
	parent.insertBefore(n1, n2);
	parent.insertBefore(n2, placeholder);
	parent.removeChild(placeholder);
  updateTab()
}

function remTab(tab) {
	tab.remove()
  getPanel(tab).remove()
  updateTab()
}
var count = -1;

function newTab(text, content, type, path) {
	count += 1;
	var e = document.createElement('div');
	e.className = "tab";
	e.setAttribute("ondrop", "tabDrop(event,this)");
	e.setAttribute("ondragover", "tabOver(event,this)");
	e.setAttribute("ondragstart", "tabStart(event,this)");
	e.setAttribute("onmousedown", "tabClick(event,this)");
	e.setAttribute("onmouseup", "tabUp(event,this)");
	e.setAttribute("draggable", "true");
	e.innerText = text;
	e.innerHTML += `<div class='t-x'><svg stroke='white' fill='transparent' stroke-width='5' viewbox="0 0 40 40"><path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" /></svg></div>`
	e.querySelector('.t-x').onclick = () => {
		remTab(e)
	};
	e.type = type;
	e.path = path;
	e.iden = text + count;
	e.panel = "b-" + text + count;
	var p = document.createElement('div');
	p.className = "materialBoard";
	p.id = e.panel;
	if(content) {
		p.innerHTML = content
	} else {
		p.innerHTML = `<textarea>${text}</textarea>`
	}
	document.querySelector('.boards').appendChild(p);
	tabbars[0].appendChild(e);
  updateTab()
	return e;
}
function newTabBtn() {
	var newtab = newTab('+');
	newtab.querySelector(".t-x").style.display = "none";
	newtab.style.maxWidth = "25px !important";
	newtab.style.minWidth = "25px !important";
	newtab.style.fontSize = ('40px');
	newtab.draggable = false;
	newtab.classList.add('newtab')
	
	newtab.setAttribute("ondrop", "");
	newtab.setAttribute("ondragover", "");
	newtab.setAttribute("ondragstart", "");
	newtab.setAttribute("onmousedown", "");
	newtab.setAttribute("onmouseup", "");
	
	newtab.onclick = function() {
    	   newTabBtn();
	   newtab.remove();
	}
}
tabbars[0].onload = () => {
  setTimeOut(() => updateTab(), 500)
}
