var blocked = [];

$(document).ready(function() {
    init(false);
});

function load()
{
    chrome.storage.local.get(['rBlock'], (data) => {
        if (undefined == data.rBlock)
            blocked = [];
        else
            blocked = JSON.parse(data.rBlock);
    });
}

function init(refresh)
{
    chrome.storage.local.get(['rBlock'], (data) => {
        if (undefined == data.rBlock)
            blocked = [];
        else
            blocked = JSON.parse(data.rBlock);

        block(refresh);
    });
}

// 신규 등록
function addNew(userId, orig) 
{
    document.addEventListener('contextmenu', onRightClick, false);

    var found = blocked.filter(b => b.id == userId);

    if (undefined == found || null == found || '' == found)
    {
        setTimeout(() => { 
           blocked.push ({id : userId, orig: orig, color: "#666666", comment: orig, block: false});
        
           chrome.storage.local.set({rBlock: JSON.stringify(blocked)});

           $('div#push_bar').html('<p>' + orig + ' 등록' + '</p>');
           $('div#push_bar').show();
           setTimeout(() => { 
                  $('div#push_bar').fadeOut();
           }, 5000);
         
            block(true);
            document.removeEventListener('contextmenu',onRightClick);
        }, 150);
    }else
    {
         document.removeEventListener('contextmenu',onRightClick);
    }
}

function onRightClick(e)
{
     e.preventDefault();
}

function block(refresh)
{
    // PC-List
    $('td.writer').each(function() {
        var a = this.children[0];
        var id = '';

        if (undefined == a) // for the 'best' page
            a = this;
        else
        {
            var idEnds = ('' + $(a).attr('onclick')).lastIndexOf(',') - 1;
            id = ('' + $(a).attr('onclick')).slice(0, idEnds);
            idEnds = (id).lastIndexOf(',') + 3;
            id = id.slice(idEnds);
        }

        blocked.every(b => {
            if (('' + $(a).attr('onclick')).includes(b["id"])
                || ('' !== b["orig"] && $(a).text().trim() == b["orig"]))
            {
                $(a).css("color", b["color"]);
                if ('' !== b["comment"])
                    $(a).text(b["comment"]);

                var subj = $($($(this).prev())[0]).children()[0];
                if (undefined != $(subj).children("a.deco")[0])
                    subj = $(subj).children("a.deco")[0];
                $(subj).css("color", b["color"]);
                
                if (true === b["block"])
                {
                    $(subj).text("차단 (" + b["comment"] + ")");
                    $(subj).css("font-weight","Bold");
                }

                return false;
            }

            return true;
        });
        
        // 우클릭으로 유저 추가
        if ('' != id & undefined != id && false === refresh)
            $(this).mousedown(function(event) {
                 switch (event.which) {
                    case 3:
                        addNew(id, $(a).text().trim());
                        break;
                 }
            });
    });

    // mobile list
    $('span.writer').each(function() {
        var id = $($(this).find('input')[0]).val();

         blocked.every(b => {
            if (id == b['id'])
            {
                $(this).css("color", b["color"]);
                if ('' !== b["comment"])
                    $(this).text(b["comment"]);

                var subj = $($($($(this).parent()).prev())[0]).children()[1];
                if (undefined != $(subj).children("a.deco")[1])
                    subj = $(subj).children("a.deco")[1];
                $(subj).css("color", b["color"]);
                
                if (true === b["block"])
                {
                    $(subj).text("차단");
                    $(subj).css("font-weight","Bold");
                }

                return false;
            }

            return true;
        });

        // 우클릭으로 유저 추가
        if ('' != id & undefined != id && false === refresh)
            $(this).mousedown(function(event) {
                 switch (event.which) {
                    case 3:
                        addNew(id, $(this).text().trim());
                        break;
                 }
            });
    });

    // PC-댓글
    $('td.user').each (function () {
        var a = $(this).find('a').first();
        var id = $($(this).find('input')[0]).val();

        blocked.every(b => {
            if (id == b["id"])
            {
                 $(a).css("color", b["color"]);
                if ('' !== b["comment"])
                    $(a).text(b["comment"]);

                var subj = $($($(this).next())[0]).children()[0];
                $($(subj).children("span.text")[0]).css("color", b["color"]);
                
                if (true === b["block"])
                {
                    $($(subj).children("a")[0]).text("이미지 차단 (" + b["comment"] + ")");
                    if (null != $($(subj).children("span.text")[0]).text() && undefined != $($(subj).children("span.text")[0]).text())
                        $($(subj).children("span.text")[0]).text("차단 (" + b["comment"] + ")");
                    $($(subj).children("span.text")[0]).css("font-weight","Bold");
                }

                return false;
            }

            return true;
        });

        // 우클릭으로 유저 추가
        if ('' != id & undefined != id && false === refresh)
            $(this).mousedown(function(event) {
                 switch (event.which) {
                    case 3:
                        addNew(id, $(a).text().trim());
                        break;
                 }
            });
    });

    // Mobile-댓글
    $('div.user').each (function () {
        var id = $($(this).find('input')[0]).val();
        var a = $(this).find('a')[0];

        blocked.every(b => {
            if (id == b["id"])
            {
                $(a).css("color", b["color"]);
                if ('' !== b["comment"])
                    $(a).text(b["comment"]);

                var subj = $($($(this).prev())[0]).find('p, span').last();
                if (undefined == subj)
                    subj = $($($(this).prev())[0]).find('span').last();
                $(subj).css("color", b["color"]);
                
                if (true === b["block"])
                {
                     $($($(this).prev())[0]).find('a').last().text("이미지 차단 (" + b["comment"] + ")");
                     if (null != $(subj).text() && undefined != $(subj).text())
                        $(subj).text("차단 " + b["comment"]);
                     $(subj).css("font-weight","Bold");
                }

                return false;
            }

            return true;
        });

         // 우클릭으로 유저 추가
        if ('' != id & undefined != id && false === refresh)
            $(this).mousedown(function(event) {
                 switch (event.which) {
                    case 3:
                        addNew(id, $(a).text().trim());
                        break;
                 }
            });
    });

    // 상단 best
     $('ul.col_6 > li.item > a.deco').each (function () {
        blocked.every(b => {
            if (('' + $(this).attr('data-user')) === b["id"])
            {
                 $(this).css("color", b["color"]);

                if (true === b["block"])
                {
                    $(this).text("차단 (" + b["comment"] + ")");
                    $(this).css("font-weight","Bold");
                }

                return false;
            }

            return true;
        });
    });
}

// 'save' button pressed from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    init(true);
    sendResponse({});
});