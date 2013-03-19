setting = {}
init()

// Apply changes to existing tabs when the save button is pushed
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      if(request == "saved")
        init()
  }
)

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    do_it(setting)
})

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
    do_it(setting)
})

chrome.windows.onFocusChanged.addListener(function(windowId) {
    do_it(setting)
})

function init(){
    load_setting()
}

function load_setting(){
    setting = {}
    if(localStorage["domainList"]){
        setting.domainList = JSON.parse(localStorage["domainList"])
    }else{
        setting.domainList = new Array();
    }
    setting.black = (localStorage["black"] == "true")? true:false
    return setting
}

function do_it(setting){
    chrome.tabs.getSelected(null, function(tab) {
        for(var i=0;i<setting.domainList.length;i++){
             // if url of current tab exists in domainList
             if (tab.url.indexOf(setting.domainList[i]) != -1){
                 if(setting.black){
                    //disable auto suggestion
                    set_auto_suggestion(false);
                    return 
                 }else{
                    //enable auto suggestion
                    set_auto_suggestion(true);
                    return 
                 }

             }
        }
        // if url of current tab doesn't exist in domainList
        console.log("not included")
        if(setting.black){
           //enable auto suggestion
           set_auto_suggestion(true);
        }else{
           //disable auto suggestion
           set_auto_suggestion(false);
        }
    })
}

function set_auto_suggestion(v){
    chrome.privacy.services.autofillEnabled.set( { value: v }, function() {
      if (chrome.extension.lastError === undefined)
        if(v) console.log("autofill TRUE");
        else console.log("autofiil FALSE");
      else
        console.log("error", chrome.extension.lastError);
    })
}
