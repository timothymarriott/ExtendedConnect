
console.log(document.cookie);

async function navigateTo(url) {
    return new Promise((resolve) => {
      // Store the destination URL in sessionStorage
      sessionStorage.setItem('navigateTo', url);
      sessionStorage.setItem('navigateTimestamp', Date.now());
  
      // Add an event listener to detect the page load
      window.addEventListener('load', () => {
        console.log('Page has loaded');
        resolve();
      });

      
  
      // Set the window location to the desired URL
      window.location.href = url;
    });
  }

async function GetMarks(){
    const frame = document.createElement("iframe");
    console.log(frame);
    frame.src = "https://connect.det.wa.edu.au/group/students/ui/my-settings/assessment-outlines"
    

    frame.style = "visibility: hidden; width:0; height:0;";
    

    

    setTimeout(() => {
        const markscontainer = frame.contentWindow.document.querySelector("#v-studentassessmentoutlineportlet_WAR_connectrvportlet_INSTANCE_RpxlkUYQqwjo_LAYOUT_233 > div > div.v-csslayout.v-layout.v-widget > div.v-csslayout.v-layout.v-widget.cvr-u-padding--md.v-csslayout-cvr-u-padding--md.eds-s-is-last.v-csslayout-eds-s-is-last > div > div > div.v-csslayout.v-layout.v-widget.eds-s-is-first.v-csslayout-eds-s-is-first.cvr-u-margin-bottom--xs.v-csslayout-cvr-u-margin-bottom--xs");
        var subjects = [];
        if (markscontainer == null){
            console.log("Error: No marks container");
            return;
        }
        for(let subject of markscontainer.childNodes){
            const markContainer = subject.firstChild.childNodes[1].firstChild.childNodes[2];
            if (markContainer.childNodes.length > 0){
                console.log(markContainer);
                var mark = markContainer.firstChild.childNodes[2].firstChild.firstChild.firstChild.firstChild.textContent;
                subjects.push({class:subject.firstChild.firstChild.firstChild.textContent,mark:mark});
            }
            
        }

        chrome.runtime.sendMessage({
            type:"Marks",
            data:subjects
        })

        document.body.removeChild(frame);
    
        
    }, 4000);

    

    
    
}

const navigateToStore = sessionStorage.getItem('navigateTo');
const navigateTimestamp = sessionStorage.getItem('navigateTimestamp');

if (navigateToStore && navigateTimestamp) {
    console.log("Went to", navigateToStore);
    
    if (navigateToStore === "/group/students/ui/my-settings/assessment-outlines"){
        
        
    }

    setTimeout(() => {
        chrome.runtime.sendMessage({
            type:"VisitComplete",
            data:navigateToStore
        })
    }, 3000);

    

    // Clear the sessionStorage items to avoid repeating the log
    sessionStorage.removeItem('navigateTo');
    sessionStorage.removeItem('navigateTimestamp');
}

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    
    
    if (message.type === "CONNECT_COOKIE_REQUEST") {
        sendResponse({data: document.cookie})
      
    }

    if (message.type === "VIST_URL") {
        console.log("Going to",message.data);
        await navigateTo(message.data);
        console.log("Went to",message.data);

        
        
    }

    if (message.type === "GetMarks"){

        GetMarks();

        
    }

  });