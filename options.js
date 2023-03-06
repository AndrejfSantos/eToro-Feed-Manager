document.addEventListener('DOMContentLoaded', restore_options);
function restore_options() {
  chrome.storage.sync.get(["myPortfolioCB","blockedPeople","blockedAssets"])
.then((result) => {
    document.getElementById('myPortfolioCB').checked = result.myPortfolioCB;
	blockedPeople = document.getElementById('blockedPeople')
	result.blockedPeople.forEach(function addblockedPeople(e) {
		addToList(blockedPeople,e,'blockedPeople')
	});
	
	blockedAssets = document.getElementById('blockedAssets')
	result.blockedAssets.forEach(function addblockedAssets(e) {
		addToList(blockedAssets,e,'blockedAssets')
	});
	
});
}

function createonRemoveClickfunc(div,sValue,blockedList) {
  return function() {
    div.remove();
	chrome.storage.sync.get([blockedList])
	.then((result) => {
	toSave = {}
	toSave[blockedList] = result[blockedList].filter(word => word != sValue);
	chrome.storage.sync.set(toSave);
	});
  };
}

function addToList(list,sValue,blockedList){
	newDiv = document.createElement("div");
	sSpan = document.createElement("SPAN");
	newContent = document.createTextNode(sValue);
	sSpan.appendChild(newContent);
	sSpan.classList.add("asset")
	newDiv.appendChild(sSpan);
	

	xBtn = document.createElement("SPAN");
	deleteEmoji = document.createTextNode("❌");
	xBtn.classList.add("tooltip")
	xBtn.appendChild(deleteEmoji);
	xBtn.addEventListener("click", createonRemoveClickfunc(newDiv,sValue,blockedList));
	
	hoverspan = document.createElement("SPAN");
	hoverspanText = document.createTextNode("Remove");
	hoverspan.classList.add("tooltiptext")
	hoverspan.appendChild(hoverspanText);
	xBtn.appendChild(hoverspan);
	
	newDiv.appendChild(xBtn);
	list.appendChild(newDiv)
}

var newPerson = document.getElementById("newPerson");
newPerson.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
	personToAdd = newPerson.value.replaceAll('@', '').trim().toLowerCase()

	blockedPeople = document.getElementById('blockedPeople')
	addToList(blockedPeople,personToAdd,'blockedPeople')
	blockedPeople.scrollTop = blockedPeople.scrollHeight;
	
	chrome.storage.sync.get(["blockedPeople"])
	.then((result) => {
		result.blockedPeople.push(personToAdd)
		chrome.storage.sync.set({blockedPeople: result.blockedPeople});
	});
	newPerson.value = ''
  }
});

var newAsset = document.getElementById("newAsset");
newAsset.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
	assetToAdd = newAsset.value.trim()

	blockedAssets = document.getElementById('blockedAssets')
	addToList(blockedAssets,assetToAdd,'blockedAssets')
	blockedAssets.scrollTop = blockedAssets.scrollHeight;
	
	chrome.storage.sync.get(["blockedAssets"])
	.then((result) => {
		result.blockedAssets.push(assetToAdd)
		chrome.storage.sync.set({blockedAssets: result.blockedAssets});
	});
	newAsset.value = ''
  }
});

document.getElementById('myPortfolioCB').addEventListener("change", onChangeCB);
function onChangeCB() {
  var myPortfolioCB = document.getElementById('myPortfolioCB').checked;
  chrome.storage.sync.set({
    myPortfolioCB: myPortfolioCB
  });
}
