import { setChromeStorage, getChromeStorage } from "../../helper.js";

const BASE_URL = "http://192.168.1.18:8000/api/";   

// event listner
$('.registerLink').add('.loginLink').on('click',loginRegister);

// login_Register (hide/show)
function loginRegister(e){
    if($(e.target).attr('class') == "registerLink"){
        $('.credifanaLogin').hide()
        $('.credifanaRegister').show()
    }
    else if($(e.target).attr('class') == "loginLink"){
        $('.credifanaLogin').show()
        $('.credifanaRegister').hide() 
    }
}

// register data
$('.registerBtn').on('click', function () {
    let formData = new FormData($('#register_form')[0]);
    $.ajax({
        type: "post",
        url: BASE_URL+"register",
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'JSON',
        success:function (response){
            console.log(response);
        }
    });
});
