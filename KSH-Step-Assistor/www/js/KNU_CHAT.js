var  KNU_CHAT = {
        CHAT_TOGGLE: true
     };
KNU_CHAT.SAY = function(div_scroll, message, talker, width) {
    var element_scroll = document.querySelector('#' + div_scroll);

    var div = document.createElement('div');
    div.classList.add('bubble');
    if (talker != undefined) {
    	div.classList.add(talker);
    } else {
        if (KNU_CHAT.CHAT_TOGGLE) {
            div.classList.add('me');
        } else {
            div.classList.add('you');
        }
        KNU_CHAT.CHAT_TOGGLE = !KNU_CHAT.CHAT_TOGGLE;
    }
    if (width != undefined) {
    	div.style.minWidth = width;
    }
//    div.innerHTML = '<xmp>' + message + '</xmp>';
    div.innerHTML = message;
    element_scroll.appendChild(div);

    while (element_scroll.childNodes.length > 100) {
        element_scroll.removeChild(element_scroll.firstChild);
    }
    element_scroll.scrollTop = element_scroll.scrollHeight;

};
