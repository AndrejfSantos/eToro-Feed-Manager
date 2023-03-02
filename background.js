chrome.runtime.onInstalled.addListener(({ reason, version }) => {
	if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
		console.log("eToro Feed Manager installed, storing default options")
		chrome.storage.sync.set({
			myPortfolioCB: true,
			blockedPeople:
				[
				// These are the spammers that use a private account to spam, paired
				"pooria1", "alexandrearmand",
				"esquis_as","dividends_income",
				"ankershoffen85","jvankershoffen",
				
				// These are spammers who spam old style
				"lucameier",
				"danielrowlands85",
				"iearnings",
				"krejzekemil",
				"hugo13250",
				"lucarampin",
				"estheremilia",
				"liveoffdividends",
				"bhavesh_spx"
				],
			blockedAssets : []
		});
		chrome.contextMenus.create({
		  id :"Block",
		  title: "Block Person/Asset", 
		  contexts:["link"],
		  documentUrlPatterns:["*://*.etoro.com/home*","*://*.etoro.com/people*"]
		});
	}
});

const url = "https://www.etoro.com/home"
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
	if (tab && url == tab.url ){
		if (changeInfo.status == 'complete'){
			chrome.scripting.executeScript({
				files: ['script.js'],
				target:{tabId: tab.id}
			});
		}
	}
});

function blockf(info) {
	s = info.linkUrl
	if (s.includes("/people/")){
		person = s.substring(s.lastIndexOf('/')+1)
		console.log("block person " + person);
		chrome.storage.sync.get(["blockedPeople"])
		.then((result) => {
			result.blockedPeople.push(person)
			chrome.storage.sync.set({blockedPeople: result.blockedPeople});
		});
	} else if (s.includes("/markets/")){
		asset = '$'+s.substring(s.lastIndexOf('/')+1)
		asset = asset.toUpperCase()
		console.log("block asset " + asset);
		chrome.storage.sync.get(["blockedAssets"])
		.then((result) => {
			result.blockedAssets.push(asset)
			chrome.storage.sync.set({blockedAssets: result.blockedAssets});
		});
	}
}
chrome.contextMenus.onClicked.addListener(blockf)

