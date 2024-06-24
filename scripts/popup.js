
var connectcookie = "";

var createdNotices = [];
var createdSubmissions = [];

var ShowOnlyLatestNotice = true;
var ShowOnlyNextSubmission = true;

document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('button-header-marks').addEventListener('click', () => GoToPage("marks"));
    document.getElementById('button-header-home').addEventListener('click', () => GoToPage("home"));
    document.getElementById('button-notices-more').addEventListener('click', () => {
        if(createdNotices.length == 0) return; 
        if (ShowOnlyLatestNotice){
            ShowOnlyLatestNotice = false;

            document.getElementById('button-notices-more').textContent = "Less";

            document.getElementById("input-notices-search").classList.remove("hidden");

            for(let notice of createdNotices){
                notice.element.classList.remove("hidden");
            }

        } else {
            ShowOnlyLatestNotice = true;

            document.getElementById('button-notices-more').textContent = "More";

            for(let notice of createdNotices){
                notice.element.classList.add("hidden");
            }
            createdNotices[0].element.classList.remove("hidden");
            document.getElementById("input-notices-search").classList.add("hidden");
        }
    });

    document.getElementById('button-submissions-more').addEventListener('click', () => {
        if(createdSubmissions.length == 0) return; 
        if (ShowOnlyNextSubmission){
            
            ShowOnlyNextSubmission = false;

            document.getElementById('button-submissions-more').textContent = "Less";

            for(let notice of createdSubmissions){
                notice.element.classList.remove("hidden");
            }

        } else {
            ShowOnlyNextSubmission = true;

            document.getElementById('button-submissions-more').textContent = "More";

            for(let notice of createdSubmissions){
                notice.element.classList.add("hidden");
            }
            createdSubmissions[0].element.classList.remove("hidden");
        }
    });

    document.getElementById("input-notices-search").addEventListener("keyup", () => {
        SearchNotices();
    })

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
    Attendence(0);
    Feed();
    NextSubmissions();
    GetUser(2547313);
    GetClasses();

     
    
    console.log(await (await fetch("https://connect.det.wa.edu.au/group/students/ui/class/learners")).text());


}

async function GetMarks(){

    document.getElementById("label-marks-loading").classList.remove("hidden");

    const classMarkContainer = document.getElementById("container-classmarks");

    while (classMarkContainer.firstChild) {
        classMarkContainer.removeChild(classMarkContainer.firstChild);
    }
    
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                
        if (!tabs[0].url.includes("https://connect.det.wa.edu.au")){
            chrome.tabs.create({
                url: "https://connect.det.wa.edu.au"
            });
        } else {
            chrome.tabs.sendMessage(tabs[0].id, {type: "GetMarks"});
        }

        

        
        
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
    
    if (response.status === "SUCCESS"){
        let usernamelabel = document.getElementById("label-username");
        usernamelabel.textContent = response.items[0].name;
        usernamelabel.classList.remove("invalidusername");
        usernamelabel.classList.add("validusername");
    }

    

    

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

async function VisitNotice(classid, notice){
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                
        chrome.tabs.sendMessage(tabs[0].id, {type: "VIST_URL", data: "/group/students/ui/class/announcements?coisp=DomainSchoolClass:" + classid + "&viewNotice=" + notice}, );
        
    });
}

async function VisitSubmission(classid, submission){
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                
        chrome.tabs.sendMessage(tabs[0].id, {type: "VIST_URL", data: "/group/students/ui/class/submissions?coisp=DomainSchoolClass:" + classid + "&viewSubmission=" + submission}, );
        
    });
}

async function NextSubmissions(){
    
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/app/calendar/next_submissions");
    let submissioncontainer = document.getElementById("container-submissions");

    
    document.getElementById("container-nextsubmission-loading").classList.add("hidden");
    document.getElementById("container-nextsubmission-none").classList.add("hidden");

    if (response.items.length > 0){
        document.getElementById("button-submissions-more").classList.remove("hidden");
        for (let submission of response.items){
            const submissionsInfoContainer = document.createElement("div");
            submissionsInfoContainer.classList.add("container-notices-info");
            submissionsInfoContainer.classList.add("hidden");
            
            

            const submissionName = document.createElement("p");
            submissionName.classList.add("home-notices-name");
            submissionName.textContent = submission.name;
            submissionName.addEventListener("click", () => {
                VisitSubmission(submission.owner.entityId, submission.submission.entityId);
            });

            const submissionClass = document.createElement("p");
            submissionClass.classList.add("home-notices-class");
            submissionClass.textContent = submission.owner.name;
            submissionClass.addEventListener("click", () => {
                VisitClass(submission.owner.entityId);
            })

            const submissionInfo = document.createElement("p");
            submissionInfo.classList.add("home-notices-info");
            const date = new Date(submission.submission.dueDate);
            if (isPastDate(date)){
                submissionInfo.textContent = "CLOSED"
            } else {
                submissionInfo.textContent = timeUntil(date);
            }

            setInterval(() => {
                UpdateSubmissionTime(submission, submissionsInfoContainer);
            }, 100);

            submissionsInfoContainer.appendChild(submissionName);
            submissionsInfoContainer.appendChild(submissionInfo);
            submissionsInfoContainer.appendChild(submissionClass);
            document.getElementById("container-submissions").appendChild(submissionsInfoContainer);
        
            createdSubmissions.push({name: submission.name, element: submissionsInfoContainer});
        }

        createdSubmissions[0].element.classList.remove("hidden");


        
        
    } else {
        document.getElementById("container-nextsubmission-none").classList.remove("hidden");
        document.getElementById("button-submissions-more").classList.add("hidden");
    }

    

}

function SearchNotices(){

    const query = document.getElementById("input-notices-search").value;

    for (let notice of createdNotices){
        if (notice.name.includes(query)){
            notice.element.classList.remove("hidden");
        } else {
            notice.element.classList.add("hidden");
        }
    }

}

async function GetIcon(){
    var response = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/app/profile/avatar/getIcon");
    var usericon = document.getElementById("image-usericon");
    if (response.status == "SUCCESS"){
        usericon.src = "https://connect.det.wa.edu.au/" + response.items[0].fullImageUrl;
    } else {
        usericon.src = "../assets/circle-exclamation-solid.svg"
    }
    
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

function isPastDate(date) {
    const now = new Date();
    const targetDate = new Date(date);
    return targetDate < now;
  }

function timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const difference = now - past;
  
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44)); // Approximate month length
    const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25)); // Approximate year length
  
    if (years > 0) return `${years} year(s) ago`;
    if (months > 0) return `${months} month(s) ago`;
    if (weeks > 0) return `${weeks} week(s) ago`;
    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${seconds} second(s) ago`;
}

function timeUntil(date) {
    const now = new Date();
    const future = new Date(date);
    const difference = future - now;
  
    if (difference < 0) return "The date is in the past";
  
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44)); // Approximate month length
    const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25)); // Approximate year length
  
    if (years > 0) return `${years} year(s) from now`;
    if (months > 0) return `${months} month(s) from now`;
    if (weeks > 0) return `${weeks} week(s) from now`;
    if (days > 0) return `${days} day(s) from now`;
    if (hours > 0) return `${hours} hour(s) from now`;
    if (minutes > 0) return `${minutes} minute(s) from now`;
    return `${seconds} second(s) from now`;
  }

async function Feed(){
    const noticeLoadingContainer = document.getElementById("container-notices-loading");


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

    for (const notice of notices) {
        const noticeInfoContainer = document.createElement("div");
        noticeInfoContainer.classList.add("container-notices-info");
        noticeInfoContainer.classList.add("hidden");


        const noticeName = document.createElement("p");
        noticeName.classList.add("home-notices-name");
        noticeName.textContent = notice.notice.title;
        noticeName.addEventListener("click", () => {
            VisitNotice(notice.owner.entityId, notice.notice.id);
        })
        
        const noticeClass = document.createElement("p");
        noticeClass.classList.add("home-notices-class");
        noticeClass.textContent = notice.owner.name;
        noticeClass.addEventListener("click", () => {
            VisitClass(notice.owner.entityId);
        })
        
        const noticeInfo = document.createElement("p");
        noticeInfo.classList.add("home-notices-info");
        const date = new Date(notice.notice.createdDate);
        noticeInfo.textContent = notice.notice.publishedBy.name + " - " + timeAgo(date);
        
        setInterval(() => {
            UpdateNoticeTime(notice.notice, noticeInfo);
        }, 100);
        
        noticeInfoContainer.appendChild(noticeName);
        noticeInfoContainer.appendChild(noticeInfo);
        noticeInfoContainer.appendChild(noticeClass);
        document.getElementById("container-notices").appendChild(noticeInfoContainer);

        createdNotices.push({ name: notice.notice.title, element:noticeInfoContainer });
    }

    createdNotices[0].element.classList.remove("hidden");

    document.getElementById("button-notices-more").classList.remove("hidden");

    noticeLoadingContainer.classList.add("hidden");
    
    console.log("Found", response.items.length, "feed items.",noticeCount,"notices and",discussionCount,"discussions. With a total of",totalViews,"views and",totalComments,"comments.")
}

function UpdateNoticeTime(notice, noticeInfo){
    const date = new Date(notice.createdDate);
    noticeInfo.textContent = notice.publishedBy.name + " - " + timeAgo(date);
}

function UpdateSubmissionTime(submission, submissionInfo){
    
    const date = new Date(submission.submission.dueDate);
    if (isPastDate(date)){
        submissionInfo.textContent = "CLOSED"
    } else {
        submissionInfo.textContent = timeUntil(date);
    }
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

            const whoami = await request("https://connect.det.wa.edu.au/connectapi/rest/api/v1/basic/whoami");
            if (whoami.status != "SUCCESS"){
                localStorage.removeItem("connect_cookie");
                await GetCookies();
            }

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