function usinformCheck(){
    var email=$("#J_email"),
        vipname = $("#J_vipname"),
        password = $("#J_password");
        if(email.val()== "" ||!email.val().match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/) ){
            email.parents('.pretty-group').addClass('has-error');
            return false;
        }else if (vipname.val()== ""){
            vipname.parents('.pretty-group').addClass('has-error');
            return false;
        }else if (password.val()== "" || password.length < 8 ){
            password.parents('.pretty-group').addClass('has-error');
            return false;
        }
        else{ 
            return true;
        }
};