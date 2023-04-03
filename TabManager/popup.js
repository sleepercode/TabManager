var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-361840450']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

const saveAllTabs = document.getElementById("saveAll");
const openAllSavedTabs = document.getElementById("openAllSaved");
const deleteAllTabs = document.getElementById("deleteAll");
const deleteAllSavedTabs = document.getElementById("deleteAllSaved");
const tabList = document.getElementById("tabList");
const savedTabList = document.getElementById("savedTabList");

function displayTabs(tabs) {
  tabList.innerHTML = "";
  tabs.forEach((tab) => {
    const li = document.createElement("li");
   // li.textContent = tab.title;
   
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.onclick = () => saveTab(tab);
    li.appendChild(saveButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Close";
    deleteButton.onclick = () => deleteTab(tab.id);
    li.appendChild(deleteButton);
	
	const favicon = document.createElement("img");
    favicon.src = tab.favIconUrl;
    favicon.width = 16;
    favicon.height = 16;
    favicon.style.marginRight = "4px";
	/*favicon.style.display = "flex";*/
    favicon.style.position = "center";
	
    li.appendChild(favicon);

	
	const tabText = document.createElement("text");
	tabText.textContent += tab.title;
	li.appendChild(tabText);
	
    tabList.appendChild(li);
  });
}

function saveTab(tab) {
  chrome.storage.sync.get(["savedTabs"], (result) => {
    const savedTabs = [...result.savedTabs, tab];
    chrome.storage.sync.set({ savedTabs }, () => {
      displaySavedTabs(savedTabs);
    });
  });
}


function deleteTab(tabId) {
  chrome.tabs.remove(tabId);
}


function openAllSaved() {
  chrome.storage.sync.get(["savedTabs"], (result) => {
    result.savedTabs.forEach((tab) => {
      chrome.tabs.create({ url: tab.url });
    });
  });
}

function deleteAllSaved() {
  chrome.storage.sync.set({ savedTabs: [] }, () => {
    displaySavedTabs([]);
  });
};




saveAllTabs.onclick = () => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    chrome.storage.sync.set({ savedTabs: tabs }, () => {
      displaySavedTabs(tabs);
    });
  });
};

openAllSavedTabs.onclick = openAllSaved;

deleteAllTabs.onclick = () => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const tabIds = tabs.map((tab) => tab.id);
    chrome.tabs.remove(tabIds);
  });
};

deleteAllSavedTabs.onclick = deleteAllSaved;




function displaySavedTabs(savedTabs) {
  savedTabList.innerHTML = "";
  savedTabs.forEach((tab) => {
    const li = document.createElement("li");
	
    //li.textContent = tab.title;
	
    const openButton = document.createElement("button");
    openButton.textContent = "Open";
    openButton.onclick = () => {
      chrome.tabs.create({ url: tab.url });
    };
    li.appendChild(openButton);
	const deleteSavedButton = document.createElement("button");
    deleteSavedButton.textContent = "Delete";
    deleteSavedButton.onclick = () => deleteSavedTab(tab.id);
    li.appendChild(deleteSavedButton);
	
	const tabText = document.createElement("text");

    const favicon = document.createElement("img");
    favicon.src = tab.favIconUrl;
    favicon.width = 16;
    favicon.height = 16;
    favicon.style.marginRight = "4px";
    li.appendChild(favicon);

    //li.textContent += tab.title;
	tabText.textContent += tab.title;
	li.appendChild(tabText);
	
    savedTabList.appendChild(li);
  });
}

function deleteSavedTab(tabId) {
  chrome.storage.sync.get(["savedTabs"], (result) => {
    const newSavedTabs = result.savedTabs.filter((tab) => tab.id !== tabId);
    chrome.storage.sync.set({ savedTabs: newSavedTabs }, () => {
      displaySavedTabs(newSavedTabs);
    });
  });
}


chrome.tabs.query({ currentWindow: true }, displayTabs);
chrome.storage.sync.get(["savedTabs"], (result) => {
  displaySavedTabs(result.savedTabs);
});

