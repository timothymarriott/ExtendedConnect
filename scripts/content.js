var script = document.createElement('script');
script.src = chrome.runtime.getURL('scripts/inject.js');
(document.head || document.documentElement).appendChild(script);


chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {

    if (message.pass){
        console.log("Passing " + message.type + " to injected script.")
        window.postMessage({
            type:message.type,
            data:message.data
        })
        
    }


  });

  window.addEventListener('message', function(event) {
    if (event.source != window) return;

    if (event.data.type && event.data.type == 'QUESTIONS_RESPONSE') {
        console.log('Content script received:', event.data.text);
        
        chrome.runtime.sendMessage({
            type:"RES_QUESTIONS",
            data:event.data.text
        })
        
        // Process the data from languagenutControllerObject here
    }

    
}, false);