window.onload = function(){
    init()
    $("#add_domain").click(function(){add_domain();save()})
    $("#domain_text").keypress(function(event){
        if(event.which ==13)
            add_domain()
    })
    $("#save").click(function(){save()})
}

function init(){
    check_permittion()
    setting = {}
    load_setting()
    write_check_box()
    write_all_domain()
    set_event_to_all_del_button()
}

function load_setting(){
    if(localStorage["domainList"]){
        setting.domainList = JSON.parse(localStorage["domainList"])
    }else{
        setting.domainList = new Array();
    }
    setting.black = (localStorage["black"] == "true")? true:false
}

function check_permittion(){
    chrome.privacy.services.autofillEnabled.get( {}, function(details) {
       if ( ! details.levelOfControl === 'controllable_by_this_extension' ) {
           $("#alert").html("Some extension might have controll for setting. When this extension doesn't work, try turning off these.")
       }
    })
}

function trim_list(list){
    ret = new Array()
    for(var i=0;i<list.length;i++){
        if(list[i])
            ret.push(list[i])
    }
    return ret
}

function save(){
    setting.domainList = trim_list(setting.domainList)
    for(var s in setting){
        switch(s){
            case "domainList":
                var newDl = new Array();
                for(var i=0;i<setting[s].length;i++){
                    if(setting[s][i]) newDl.push(setting[s][i])
                }
                localStorage[s] = JSON.stringify(newDl)
                break
            case "black":
                localStorage[s] = is_black_list_mode()
                break
            default:
                console.log("!!!!!!!! undefined setting parameter found !!!!!!")
                break
        }
    }
    chrome.extension.sendRequest("saved", function(response) {})
    alert("Changes are saved")
}

function add_domain(){
    var domain = $("#domain_text").val()
    if(domain=="")
        return
    if(domain_exists(domain)){
        alert("entered domain already exists")
        return 
    }
    var id = setting.domainList.length
    $("#domain_list").append("<li>" + domain + write_domain_del_button(id) + "</li>")
    setting.domainList.push(domain)
    set_event_to_del_button(id)
    $("#domain_text").val("")
}

function domain_exists(domain){
    if(localStorage.domainList.indexOf(domain) == -1) return false
    else return true
}

function write_all_domain(){
    var dl = setting.domainList
    var ih = ""
    /*for(i=0;i<dl.length;i++){
         ih += "<li>"
            + dl[i]
            + write_domain_del_button(i)
            + "</li>"
    }
    document.getElementById("domain_list").innerHTML = ih
    */

    for(i=0;i<dl.length;i++){
        $("#domain_list").append("<li>" +
                                        dl[i] +
                                        get_domain_del_button(i) +
                                    "</li>")
    }
}

function get_domain_del_button(n){
    return "<input type=\"button\" id=\"del" + n + "\" class=\"domain_delete\" value=\"delete\"/>"
}

function write_check_box(){
    console.log("write check box")
    console.log(setting.black)
    if(setting.black){
        $("input[name='black']").val(["blackList"])
    }else{
        $("input[name='black']").val(["whiteList"])
    }
}

function is_black_list_mode(){
    if( $("input[name='black']:checked").val() == "blackList" )
        return true
    else{
        return false
    }
}

function set_event_to_all_del_button(){
    var buttons = document.getElementsByClassName("domain_delete")
    for(var i=0;i<buttons.length;i++){
        set_event_to_del_button(i)
    }
}

function set_event_to_del_button(id){
    $("#del"+id).click(
    function(){
        $(this).parent().remove()
        delete setting.domainList[id]
        console.log(setting.domainList)
    })
}
