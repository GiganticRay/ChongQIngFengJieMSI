/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: #
 * 
 */
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('注册');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('登录');
    });       
     $('.error').removeClass('alert alert-danger').html(''); 
}

function openLoginModal(){
    showLoginForm();
    $('#loginModal').modal('show');    
//    setTimeout(function(){
//        $('#loginModal').modal('show');    
//    }, 20);
    
}
function openRegisterModal(){
    showRegisterForm();
    $('#loginModal').modal('show'); 
//    setTimeout(function(){
//        $('#loginModal').modal('show');    
//    }, 20);
    
}

function loginAjax() {
    //将表单整体序列化成一个数组提交到后台
    var postData = $("#loginForm").serializeArray();
    $.post( "../Ashx/VerifyIogin.ashx",postData, function( data ) {
            if(data == "ok"){
                $('#loginModal').modal('hide');
                swal({
                    title: "登录成功！",
                    type: "success",
                    timer: 1500
                });
            } else {
                 shakeModal(data); 
            }
        });
}

function shakeModal(data) {
    $('#loginModal .modal-dialog').addClass('shake');
    $('.error').addClass('alert alert-danger').html(data);
             $('input[type="password"]').val('');
             setTimeout( function(){ 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 400 ); 
}

   