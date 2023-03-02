document.addEventListener('DOMContentLoaded', restore_options);
function restore_options() {
  chrome.storage.sync.get(["myPortfolioCB","blockedPeople","blockedAssets"])
.then((result) => {
    document.getElementById('myPortfolioCB').checked = result.myPortfolioCB;
	blockedPeople = document.getElementById('blockedPeople')
	result.blockedPeople.forEach(function addblockedPeople(e) {
		addToList(blockedPeople,e)
	});
	
	blockedAssets = document.getElementById('blockedAssets')
	result.blockedAssets.forEach(function addblockedAssets(e) {
		addToList(blockedAssets,e)
	});
	
});
}
function addToList(list,sValue){
	newDiv = document.createElement("div");
	newContent = document.createTextNode(sValue);
	newDiv.appendChild(newContent);
	list.appendChild(newDiv)
}


var newPerson = document.getElementById("newPerson");
newPerson.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
	personToAdd = newPerson.value.replaceAll('@', '').trim().toLowerCase()

	blockedPeople = document.getElementById('blockedPeople')
	addToList(blockedPeople,personToAdd)
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
	addToList(blockedAssets,assetToAdd)
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
