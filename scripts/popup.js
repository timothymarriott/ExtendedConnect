
var connectcookie = "";

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('button-whoami').addEventListener('click', () => makeManualRequest(whoami));
    document.getElementById('button-submissions').addEventListener('click', () => makeManualRequest(NextSubmissions));
    document.getElementById('button-requsetsubmit').addEventListener('click', () => manualrequest(document.getElementById("input-request").value));
    
    document.getElementById('button-header-marks').addEventListener('click', () => GoToPage("marks"));
    document.getElementById('button-header-home').addEventListener('click', () => GoToPage("home"));
    
    OnLoad();
});

function GoToPage(page){
    for (let page of document.getElementsByClassName("button-header-selected")){
        page.className = "button-header"
    };
    document.getElementById("button-header-" + page).className = "button-header-selected";

    for(let page of document.getElementsByClassName("page")){
        page.classList.add("hidden");
    };
    document.getElementById("page-" + page).classList.remove("hidden");

    switch (page) {
        case "marks":
            GetMarks();
            break;
    }
}

async function OnLoad(){
    await GetCookies();
    whoami();
    GetIcon();
    NextSubmissions();
    Attendence(0);
    Feed();
    GetUser(2547313);
    GetClasses();

     
    
    console.log(await (await fetch("https://connect.det.wa.edu.au/group/students/ui/class/learners")).text());


}

async function GetMarks(){

    document.getElementById("label-marks-loading").classList.remove("hidden");
    
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                
        chrome.tabs.sendMessage(tabs[0].id, {type: "GetMarks"});

        
        
    });
    
}

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse){
    console.log(message);
    if (message.type === "CONNECT_COOKIE") {
        // Relay the message to the popup
        
        connectcookie = message.data;
    }

    if (message.type === "Marks"){
        document.getElementById("label-marks-loading").classList.add("hidden");

        const classMarkContainer = document.getElementById("container-classmarks");

        while (classMarkContainer.firstChild) {
            classMarkContainer.removeChild(classMarkContainer.firstChild);
        }
        
        for (let mark of message.data){
            const item = document.createElement("div");
            item.classList.add("item-classmark");
            classMarkContainer.appendChild(item);
            const classLabel = document.createElement("p");
            classLabel.textContent = mark.class;
            classLabel.classList.add("label-mark-classname");
            item.appendChild(classLabel);

            const markLabel = document.createElement("p");
            markLabel.textContent = mark.mark;
            item.appendChild(markLabel);
            console.log("Mark for",mark.class,"is",mark.mark);
        }
    }

    if (message.type === "VisitComplete"){
        if (message.data === "/group/students/ui/my-settings/assessment-outlines"){
            
        }
    }
  });
  
function getCookie(cname) {
    let name = cname + "=";
    let ca = connectcookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

async function manualrequest(url){
    console.log(url);
    let result = await request(url);
    document.getElementById("label-response").textContent = JSON.stringify(result, null, 4);
}

async function whoami(){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/basic/whoami");
    

    let usernamelabel = document.getElementById("label-username");
    usernamelabel.textContent = response.items[0].name;

    

}

async function GoToMarks(){
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                
        chrome.tabs.sendMessage(tabs[0].id, {type: "VIST_URL", data: "/group/students/ui/my-settings/assessment-outlines"});

        
        
    });
}

async function VisitClass(id){
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                
        chrome.tabs.sendMessage(tabs[0].id, {type: "VIST_URL", data: "/group/students/ui/class/summary?coisp=DomainSchoolClass:" + id}, );
        
    });
}

async function NextSubmissions(){
    
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/app/calendar/next_submissions");
    let submissioncontainer = document.getElementById("container-submissions");

    while (submissioncontainer.firstChild) {
        submissioncontainer.removeChild(submissioncontainer.firstChild);
    }

    for (let submission of response.items){
        let submissionlink = document.createElement("button");
        console.log("Making link to: " + "/group/students/ui/class/submissions?coisp=DomainSchoolClass:" + submission.owner.entityId)
        submissionlink.addEventListener('click', () => {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                
                chrome.tabs.sendMessage(tabs[0].id, {type: "VIST_URL", data: "/group/students/ui/class/submissions?coisp=DomainSchoolClass:" + submission.owner.entityId + "&viewSubmission=" + submission.submission.entityId}, );
                console.log("Sending visit request to ", tabs[0].id);
            });
        });
        submissionlink.textContent = submission.name;
        submissioncontainer.appendChild(submissionlink);
    }

    

}

async function GetIcon(){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/app/profile/avatar/getIcon");
    var usericon = document.getElementById("image-usericon");
    usericon.src = "https://connect.det.wa.edu.au/" + response.items[0].fullImageUrl;
}

async function MyTeachers(){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/app/student/my_teachers");
}

async function Attendence(student){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/app/student/attendance_details?studentId=" + student);
    console.log(response);
}

async function GetClasses(){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/app/my_classes/?range=9999");
    
    let classcontainer = document.getElementById("container-classlist");

    return;

    while (classcontainer.firstChild) {
        classcontainer.removeChild(classcontainer.firstChild);
    }

    for (let schoolclass of response.items){
        let classbutton = document.createElement("button");
        let linebreak = document.createElement("br");
        console.log("Found", schoolclass.name, "with id",schoolclass.entityId);
        classbutton.addEventListener('click', () => {
            VisitClass(schoolclass.entityId);
        });
        classbutton.textContent = schoolclass.name;
        classcontainer.appendChild(classbutton);
        classcontainer.appendChild(linebreak);
    }
}

async function Feed(){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/stream/list?channel=ALL&itemTypeFilter=EVERYTHING&eventTypeFilter=ALL&start=0&range=128&stats=true&follow=true&perms=true&attachments=true&imageGallery=true&audience=true");
    var discussionCount = 0;
    var noticeCount = 0;
    var totalViews = 0;
    var totalComments = 0;
    var notices = [];
    
    for (let feedItem of response.items){
        console.log(feedItem);
        if (feedItem.hasOwnProperty("notice")){
            notices.push(feedItem);
            noticeCount += 1;
            totalViews += feedItem.notice.extras.stats.viewCount;
            totalComments += feedItem.notice.extras.stats.commentCount;
        } else if (feedItem.hasOwnProperty("discussion")){
            discussionCount += 1;
            totalViews += feedItem.discussion.extras.stats.viewCount;
            totalComments += feedItem.discussion.extras.stats.commentCount;

        }
    }


    const noticeName = document.getElementById("home-latestnotice-name");
    noticeName.textContent = notices[0].notice.title;

    const noticeClass = document.getElementById("home-latestnotice-class");
    noticeClass.textContent = notices[0].owner.name;

    const noticeDate = document.getElementById("home-latestnotice-date");
    noticeDate.textContent = notices[0].notice.createdDate;
    
    console.log("Found", response.items.length, "feed items.",noticeCount,"notices and",discussionCount,"discussions. With a total of",totalViews,"views and",totalComments,"comments.")
}

async function GetUser(user){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/common/user/" + user + "/?perms=true&orgs=true&datanav=true&year=2024&scale=30");
    console.log("Got user", user, "received data", response)
}

async function SetIcon(icon){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/app/profile/avatar/addIconFromLibrary", icon)
    if (response.status == "INVALID"){
        console.error("Error setting icon to", icon);
    }
}

async function request(url, body = null){
    const requestOptions = {
        method: "POST",
        headers: DefaultHeaders(),
        redirect: "follow",
        body: body
        };
    return await (await fetch(url, requestOptions)).json();
}

function DefaultHeaders(){
    const myHeaders = new Headers();
    myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"");
    myHeaders.append("Accept", "application/json, text/plain, */*");
    myHeaders.append("DNT", "1");
    myHeaders.append("X-XSRF-TOKEN", getCookie("CONNECT_XSRF"));
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36");
    myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("host", "connect.det.wa.edu.au");
    
    myHeaders.append("Cookie", connectcookie);
    return myHeaders;
}

async function makeManualRequest(callback){
    if (connectcookie.includes("CONNECT_XSRF")){
        await callback();
    }
}



async function GetCookies(){
    if (!connectcookie.includes("CONNECT_XSRF")){
        
        if (localStorage.getItem("connect_cookie") != null){
            connectcookie = localStorage.getItem("connect_cookie");
        } else {
            const response = await new Promise((resolve, reject) => {
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    
                    chrome.tabs.sendMessage(tabs[0].id, {type: "CONNECT_COOKIE_REQUEST", data: ""}, function(response) {
                        console.log(response);
                        resolve(response.data);
                    });
                });
            });

            
            connectcookie = response;
            localStorage.setItem("connect_cookie", connectcookie);
        }
    
        
    }
    
    
}
/*
async function GetCookies(){
    if (!connectcookie.includes("CONNECT_XSRF")){
    
    
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "CONNECT_COOKIE_REQUEST", data: ""}, function(response) {
                console.log("Response from content script:", response.cookie);
                connectcookie = response.cookie;
                // Exit async function
            });
        });
    }
}
    */

async function makeRequest(url){
    if (connectcookie.includes("CONNECT_XSRF")){
    

        const requestOptions = {
        method: "POST",
        headers: DefaultHeaders(),
        redirect: "follow"
        };
        console.log("Making request to: ", url)
        var response = await fetch(url, requestOptions);
        return await response.json();
        
    } else{
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "CONNECT_COOKIE_REQUEST", data: ""}, function(response) {
                console.log("Response from content script:", response.cookie);
                connectcookie = response.cookie;
                makeRequest(url);
            });
        });
    }
}