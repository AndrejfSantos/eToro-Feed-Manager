console.log("eToro Feed Manager running!")

myPortfolioCB = true
blockedPeople = []
blockedAssets = []

chrome.storage.sync.get(["myPortfolioCB","blockedPeople","blockedAssets"])
.then((result) => {
	console.log("myPortfolioCB currently is " + result.myPortfolioCB);
	console.log("blockedPeople currently is " + result.blockedPeople);
	console.log("blockedAssets currently is " + result.blockedAssets);
	myPortfolioCB = result.myPortfolioCB;
	blockedPeople = new Set( result.blockedPeople);
	blockedAssets = result.blockedAssets;
});


// Timeout of the hideSpamFromFeed, to avoid multiple calls
var timeoutID;

function filterSetup() {
	feed = document.querySelector("div.feed-container.home-feed")
	if (feed){
		filterRun(feed)
		
		const callback = (mutationList, observer) => {
		  for (const mutation of mutationList) {
			if (mutation.type === 'childList') {
				//A child node has been added or removed.
				clearTimeout(timeoutID)
				timeoutID = setTimeout(filterRun, 50,feed)
			}
		  }
		};
		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);

		const config = { attributes: false, childList: true, subtree: true };
		// Start observing the target node for configured mutations
		observer.observe(feed, config);
		
	}else{
		console.log("feed not found")
		setTimeout(filterSetup, 250)
	}
}
function filterRun(feed){
	posts = feed.querySelectorAll("et-post")
	for (let i = 0; i < posts.length-1; i++) {
		checkPost(posts[i])
	}
	console.log("filter done")
}

okPosts = new Set()

function checkPost(post) {
	if (okPosts.has(post.id)){
		// This is and old post that has already been checked
		return
	}
	
	person = post.getElementsByClassName("post-user-name et-link")[0].getInnerHTML()

	if (person){
		// removes @ to match set
		person = person.substring(1,person.length);
		// some times there are whitespaces in at the end
		person = person.trim()
		// to match the name on the set
		person = person.toLowerCase()

		if (blockedPeople.has(person)){
			console.log("blockedPeople "+person)
			removePost(post);
			return;
		}

		mainBody = post.getElementsByTagName("et-showhide")[0]

		if(myPortfolioCB){
			if (checkMyPortfolioIs(mainBody)){
				console.log("MyPortfolio from "+person)
				removePost(post);
				return;
			}
		}

		if (checkBlockedAssets(mainBody)){
			removePost(post);
			return;
		}
		
		okPosts.add(post.id)
	}
}

function removePost(post){
	post.remove();
}

function checkBlockedAssets(mainBody) {
	t = mainBody.textContent
	
	for (let i = 0; i < blockedAssets.length; i++) {
		blockedAsset = blockedAssets[i]
		if (t.includes(blockedAsset)){
			console.log("BlockedAsset "+blockedAsset)
			return true
		}
	}
	return false
}
function checkMyPortfolioIs(mainBody) {
	t = mainBody.textContent
	return t.includes("My portfolio is") && t.includes("check it out")
}

setTimeout(filterSetup, 500)

