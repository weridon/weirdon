 function informCheck(){
    var userna=document.getElementById("TPL_username_1").value,
        passw = document.getElementById("J_StandardPwd").value;
        if(userna== "" || passw == "" ){
            $('.error-notification').show();
            return false;
        }else if (!userna.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/)){
            $('.error-notification').show();
            return false;
        }
        else{ 
            return true;
        }
};