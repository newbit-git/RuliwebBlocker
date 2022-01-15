var blocked = [];
var blockChecked = false;

$(document).ready(function() {
    load();
});

function load()
{
    chrome.storage.local.get(['rBlock'], (data) => {
        if (undefined == data.rBlock)
            return;

        blocked = JSON.parse(data.rBlock);

        var table_body = '';

        blocked.every(b => {
            table_body+='<tr class="item">';
            table_body+='<td> <input type="checkbox" /></td>';
            table_body+='<td>' + b['id'] + '</td>';
            table_body+='<td>' + b['orig'] + '</td>';
            table_body+='<td> <input type="color" style="width:40px" value="' + b['color'] + '" /></td>';
            table_body+='<td> <input type="text" value="' + b['comment'] + '" /></td>';
            if (false == b['block'])
                table_body+='<td> <input type="checkbox" /></td>';
            else
                table_body+='<td> <input type="checkbox" checked /></td>';
            table_body+='</tr>';

            return true;
        });

        $('#mainTable').html(table_body);
        $('#btnSave').text("저장 (" + blocked.length + "명)");
    });
}

document.getElementById("btnSave").onclick = function()
{
    blocked = [];
    $("tr.item").each(function() {
        var del = $($(this).find('input')[0]).attr('checked');
        var userId = $($(this).find('td')[1]).html();
        var orig = $($(this).find('td')[2]).html();
        var color = $($(this).find('input')[1]).val();
        var comment = $($(this).find('input')[2]).val();
        var checked = $($(this).find('input')[3]).attr('checked');
        if (checked == undefined || false == checked)
            checked = false;
        else
            checked = true;

        if (del == undefined || false == del)
            blocked.push ({id : userId, orig: orig, color: color, comment: comment, block: checked});
    });

    chrome.storage.local.set({rBlock: JSON.stringify(blocked)});

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {},
            function(response) {
                window.close();
            }
        );
    });
}

document.getElementById("btnExport").onclick = function()
{
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blocked));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "block.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

document.getElementById("delHead").onclick = function()
{
   $("tr.item").each(function() {
       $($(this).find('input')[0]).attr('checked', 'checked');
   });
}

document.getElementById("blockHead").onclick = function()
{
    blockChecked = !blockChecked;
    $("tr.item").each(function() {
        $($(this).find('input')[3]).attr('checked', true === blockChecked ? "checked" : false);
    });
}

inputElement.onchange = (e) => {
     const file = inputElement.files[0]
      if (!file) return

     file.text().then(text => 
     {
         try
         {
             chrome.storage.local.set({rBlock: text});
             load();
         }catch(e)
         {

         }
     });
}