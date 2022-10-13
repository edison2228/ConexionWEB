/**
* This javascript file checks for the brower/browser tab action.
* It is based on the file menstioned by Daniel Melo.
* Reference: http://stackoverflow.com/questions/1921941/close-kill-the-session-when-the-browser-or-tab-is-closed
*/
var validNavigation = false;
var mobile = false;

function wireUpEvents() {
    /**
    * For a list of events that triggers onbeforeunload on IE
    * check http://msdn.microsoft.com/en-us/library/ms536907(VS.85).aspx
    *
    * onbeforeunload for IE and chrome
    * check http://stackoverflow.com/questions/1802930/setting-onbeforeunload-on-body-element-in-chrome-and-ie-using-jquery
    */
    function historyclick(e)
    {
        validNavigation = true;
    }
    var device = navigator.userAgent;

    if (device.match(/Android/i)|| device.match(/J2ME/i)|| device.match(/BlackBerry/i)|| device.match(/Opera Mini/i)||
        device.match(/IEMobile/i)|| device.match(/Mobile/i)|| device.match(/Windows Phone/i)|| device.match(/windows mobile/i)||
        device.match(/windows ce/i)|| device.match(/webOS/i)|| device.match(/palm/i)|| device.match(/bada/i)||
        device.match(/series60/i)|| device.match(/nokia/i)|| device.match(/symbian/i)|| device.match(/HTC/i)||
        document.documentElement.clientWidth <= 800) {
        mobile = true;
    }

    var dont_confirm_leave = 1; //set dont_confirm_leave to 1 when you want the user to be able to leave without confirmation
    var leave_message = 'You sure you want to leave?';
    function goodbye(e) {
        if (!validNavigation && !mobile) {
            if (dont_confirm_leave!==1) {
                if(!e) e = window.event;
                //e.cancelBubble is supported by IE - this will kill the bubbling process.
                e.cancelBubble = true;
                e.returnValue = leave_message;
                //e.stopPropagation works in Firefox.
                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            //return works for Chrome and Safari
            return leave_message;
            }
            var posting = $.post('/logout/', {});
            posting.done(function (data) {});
        }
        else
            validNavigation = false;
    }
    //Attach the history events?
    window.onpopstate = historyclick;

    window.onbeforeunload=goodbye;

    // Attach the event keypress to exclude the F5 refresh
    $(document).bind('keypress', function(e) {
        if (e.keyCode == 116){
            validNavigation = true;
        }
    });

    // Attach the event click for all links in the page
    $("a").bind("click", function() {
        validNavigation = true;
    });

    // Attach the event submit for all forms in the page
    $("form").bind("submit", function() {
        validNavigation = true;
    });

    // Attach the event click for all inputs in the page
    $("input[type=submit]").bind("click", function() {
        validNavigation = true;
    });
}


// JavaScript Demonium
$(document).ready(function(){
    var device = navigator.userAgent;

    if (device.match(/Android/i)|| device.match(/J2ME/i)|| device.match(/BlackBerry/i)|| device.match(/Opera Mini/i)||
        device.match(/IEMobile/i)|| device.match(/Mobile/i)|| device.match(/Windows Phone/i)|| device.match(/windows mobile/i)||
        device.match(/windows ce/i)|| device.match(/webOS/i)|| device.match(/palm/i)|| device.match(/bada/i)||
        device.match(/series60/i)|| device.match(/nokia/i)|| device.match(/symbian/i)|| device.match(/HTC/i)||
        document.documentElement.clientWidth <= 800) {
        mobile = true;
    }
    if (mobile == false) {
        var links = document.getElementsByTagName("a");


        for (var i = 0; i < links.length; i++) {
            if (links[i].getAttribute("href") != null) {
                links[i].setAttribute("data-href", links[i].getAttribute("href"));
                links[i].setAttribute("data-target", links[i].getAttribute("target"));
                links[i].removeAttribute("href");
                links[i].removeAttribute("target");
                links[i].onclick = function () {
                    validNavigation = true;
                    if (this.getAttribute("data-target") == "_blank")
                        window.open(this.getAttribute("data-href"));
                    else
                        window.location = this.getAttribute("data-href");
                };
            }
        }
    }
    wireUpEvents();
    $('#nav').slicknav();
});

