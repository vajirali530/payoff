import { setChromeStorage, getChromeStorage } from "../../helper.js";

const BASE_URL = "http://192.168.1.6:8000/api/";   

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

// dom load
document.addEventListener('DOMContentLoaded', async function(){
    const storedData = await getChromeStorage(["userData"]);
    
    if (storedData.userData && storedData.userData.length > 0) {
        $('.credifanaLogin').hide()
        determineExtensionProcess(storedData.userData)
    }
    // chrome.storage.sync.get("userData", function (obj) {
    //     if(obj.userData.length>0){
    //     }
    // }); 
})

// login
$('#loginBtn').on('click', function () {
    $('.error-message').hide();

    let formData = new FormData($('#login_form')[0]);
    let isValidated = true;
    formData.forEach((value,  index) => {
        if (index == 'email' && value != '') {
            let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
            if (!(pattern.test(value))) {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').removeClass('d-none');
            } else {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').addClass('d-none');
            }
            return;
        } 

        if (index == 'password' && value != '') {
            if (value.length <= 5) {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').html('Password should be min 6 characters long');
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').removeClass('d-none');
            } else {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').addClass('d-none');
            }
            return;
        }

        if($.trim(value) == '') {
            $(`input[name=${index}]`).siblings('.error-message').removeClass('d-none');
        } else {
            $(`input[name=${index}]`).siblings('.error-message').addClass('d-none');
        }

    })

    $('#loginBtn .error-message').each((index, val) => {
        if(!$(val).hasClass('d-none')) {
            isValidated = false;
        };
    })

    if (isValidated) {
        $('#loginSpinner').show()
        $.ajax({
            type: "post",
            url: BASE_URL+"login",
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'JSON',
            success:function (response){
                $('#loginSpinner').hide()
                if(response.status == 'error') {
                    $('.response_errors').html('');
                    $('.response_errors').append(`<div class="response_error">${response.message}</div>`);
                }else if(response.status == "success"){

                    let userData = response.user_data;
                    setChromeStorage("userData", JSON.stringify(userData)); 
                    $('.credifanaLogin').hide()
                    determineExtensionProcess()
                }
            },
        });
    }
});

// register
$('#registerBtn').on('click', function () { 
    let formData = new FormData($('#register_form')[0]);

    let password = '';
    let isValidated = true;
    formData.forEach((value,  index) => {
        if (index == 'email' && value != '') {
            let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
            if (!(pattern.test(value))) {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').removeClass('d-none');
            } else {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').addClass('d-none');
            }
            return;
        } 

        if (index == 'password' && value != '') {
            if (value.length <= 5) {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').html('Password should be min 6 characters long');
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').removeClass('d-none');
            } else {
                password = value;   
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').addClass('d-none');
            }
            return;
        }

        if (index == 'confirmpassword' && value != '' && password!= '') {
            if (value != password) {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').removeClass('d-none');
            } else {
                $(`input[name=${index}]`).parents('.form-group').find('.error-message').addClass('d-none');
            }
            return;
        }

        if($.trim(value) == '') {
            $(`input[name=${index}]`).siblings('.error-message').removeClass('d-none');
        } else {
            $(`input[name=${index}]`).siblings('.error-message').addClass('d-none');
        }

    })

    $('.error-message').each((index, val) => {
        if(!$(val).hasClass('d-none')) {
            isValidated = false;
        };
    })

    if (isValidated) {
        $('#registerSpinner').show();
        $.ajax({
            type: "post",
            url: BASE_URL+"register",
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'JSON',
            success:function (response){
                $('#registerSpinner').hide();
                if(response.status == 'error') {
                    $('.response_errors').html('');
                    $.each(response.errors, (index, element) => {
                        $('.response_errors').append(`<div class="response_error">${element[0]}</div>`);
                    });
                }else if(response.status == "success"){
                    let userData = response.user_data;
                    setChromeStorage("userData", JSON.stringify(userData));
                    $('.credifanaRegister').hide()
                    determineExtensionProcess()
                }
            }
        });
    }
});

// determine extension process
const determineExtensionProcess = async (userData) => {
    let currentSiteName = '';
    let currentSiteUrl=''

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        currentSiteName = tabs[0].url.split("/")[2].split(".")[1];
        currentSiteUrl = tabs[0].url.split("/").join();
        let isRealtor = false;

        if ( currentSiteName === "realtor" && !currentSiteUrl.includes("realestateandhomes-detail") ) {  
            $('.realtor-site-screen').show()
            $('.logout-btn').show()
            isRealtor = true;
        } else if ( currentSiteName === "realtor" && currentSiteUrl.includes("realestateandhomes-detail")) {
            $('.realtor-property-details').show()
            $('#property_details').show()
            $('.logout-btn').show()
            isRealtor = true;
        } else {
            $('.logout-btn').show()
            $('.realtor-site-screen').show()
        }

        sendChromeTabMessage(true, userData, isRealtor)
    });
  
    return true;
    
}

/**
 * Adding a logout property
 * Emptying the chrome storage
 */
 $('#logout_btn').on("click", function (e) {
    chrome.storage.sync.clear();
    $('.credifanaRegister').hide()
    $('.realtor-site-screen').hide()
    $('.realtor-property-details').hide()
    $('#property_details').hide()
    $('#property-api-data').hide()
    $('.logout-btn').hide()
    $('.response_errors').html('')

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          from: "popup",
          subject: "DOMInfo",
          tabsUrl: tabs[0].url,
          logout: true,
        });
      }
    );

    $('.credifanaLogin').show()
});


  // get datafromwebsite
const getDataFromWebsite = async (msg, response)=>{
    if(msg.text=='true'){
      $('.property-name span').text(msg.proTitle) 
      $('.property-img-price img').attr('src',msg.proImg)

     let userDataCollection = await getChromeStorage(["userData"]);
     
     var finaluserData = JSON.parse(userDataCollection.userData);
     var plainPropertyPrice =  msg.proPrice.replace(/\$|,/g, "");
     
     
      $('#property_price').text(msg.proPrice);
      $(".property-name span").text(msg.proTitle);
      $('#plain_property_price').val(plainPropertyPrice);
      $('#property_type').val(msg.proType);
      $('#property_image').val(msg.proImg);
      $('#property_name').val(msg.proTitle);
      $('#user_id').val(finaluserData.id);

      $('#downpayment').val(msg.proDownpayment)
      $('#closing_cost').val(msg.proEstClosingCost)
      $('#interest_rate').val(msg.proInterestRate)
      $('#loanterm').val(msg.proLoanTerm)
      $('#taxes').val(msg.proTax)
      $('#insurance').val(msg.proHomeIns)
      $('#bedrooms').val(msg.proBedrooms)
      $('#bathrooms').val(msg.proBath)
      $('#city').val(msg.city)
      $('#state').val(msg.state)
      $('#city').text(msg.city)
      $('#state').text(msg.state)
    } else {
      $('.propertyTitle h3').text(msg.proTitle) 
      $('.propertyImg img').attr('src',msg.proImg)
      $('#realtorPropForm table, .evaluate-btn').hide();
      $(".realtorSubscriptionErrors").removeClass("d-none");
      $(".realtorSubscriptionErrors").html("This is Rental property. Extension only works with Sale property.");
    }
}


//get plan details

$("#plan_details_btn").on("click", async function () {
    $('#planSpinner').show();
    let userDataCollection = await getChromeStorage(["userData"]);
    var finaluserData = JSON.parse(userDataCollection.userData);
    var result = await fetchDetails(BASE_URL + "getsubscription-details/" + finaluserData.id);
    if(result.status == 'success'){
        $('#planSpinner').hide();
        $(".used-clicks").text(result.data.used_click);
        $(".total-clicks").text(result.data.total_click);
        $(".active-plan").text(result.data.plan);
        $(".expired-date").text(result.data.plan_end);
        $(".change-plan").attr('href',result.data.change_plan);
        if(result.data.is_cancelled == 1){
            $(".plan-cancel-status").show();
        }

        if(result.data.plan != 'basic' && result.data.is_cancelled == 0){
            $("#cancel_btn_cntnr").removeClass('d-none');
        }
    }else{
      $('.loader').addClass('d-none')
      $('#realtorPlanDetailContainer .realtorPlan .realtorPlanErrors').removeClass('d-none')
      $('#realtorPlanDetailContainer .realtorPlan .realtorPlanErrors').html(result.message)
      $('.cancelPlan').addClass('d-none')  
    }
  });


  /**
 * Getting credit card detials from database
 * And setting user email to the database
 * @param {string} url
 * @param {} postData
 * @returns boolean
 */
const fetchDetails = async (url, postData=false) => {
    let settings = {
      method: "GET",
    };
    if (postData) {
      settings = {
        method: "POST",
        body: postData,
      };
    }
  
    try {
      const response = await fetch(url, settings);
      const results = await response.json();
  
      return results;
    } catch (error) {
      console.log(error);
      return false;
    }
};


/**
 * Send message to contentScript.js
 * @param {boolean} checked
 * @param {object} userDetails
 */
const sendChromeTabMessage = (checked, userDetails = null, realtor=false) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
        // lastFocusedWindow: true
      }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          from: "popup",
          subject: "DOMInfo",
          tabsUrl: tabs[0].url,
          userData: userDetails ? JSON.stringify(userDetails) : "",
          realtor: realtor
        });
      }
    );
};

/**
 * Add message listener from chrome extension
 * Getting the message from popup.js
 */
chrome.runtime.onMessage.addListener((msg,response) => {
    // console.log(msg, response);
    getDataFromWebsite(msg,response);
})


$('#evalute_btn').click(function(){
    $('.prop-data').each(function(idx,val){
        $(val).text('')
    })
    $('.error-message').hide();
    var error = 0;
    $('.req-input').each(function() {
        if ($(this).val() == '') {
            $(this).siblings('.error-message').show();
            error++;
        }
    });
    
    if (error > 0) {
        return;
    }

    $('.evaluteSpinner').show();
    let formData = new FormData($('#property_details')[0]);
    $.ajax({
        type: "post",
        url: BASE_URL+"getproperty-details",
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'JSON',
        success:function (response){
            $('.evaluteSpinner').hide();
            if(response.status == 'error') {
                $('.response_errors').html('');
                $('.response_errors').html(`${response.message}`);
            }else if(response.status == "success"){
                $('#property_details').hide();
                $('#property-api-data').show();
                
                $.each( response.data, function( key, value ) {
                    $("#property-api-data span#"+key).text(value);
                });
                
            }
        },
    });
});



$('.back-btn .btn').click(function(){
    $('#property-api-data').hide();
    $('#property_details').show();
})

//get property history
$('#property_history_btn').on('click', async function () {  
    let storedUserData = await getChromeStorage(["userData"]);
    let userData = JSON.parse(storedUserData.userData);
    var result = await fetchDetails(BASE_URL + "getproperty-history/" + userData.id);
    if(result.data.length == 0){
        $(".property-history-wrapper").html('<h4>No property found.</h4>');
    }else{
        $(".property-history-wrapper").html('');
        $.each( result.data, function( key, value ) {
            var pro_detail = JSON.parse(value.pro_detail);
            $(".property-history-wrapper").append(`
                <div class="property-history">
                    <div class="property-history-img">
                        <img src="${pro_detail.property_image}" alt="" style="height: 83px; width:135px;">
                    </div>
                    <div class="property-history-priceBtn">
                        <div class="property-history-price">
                            <div>
                                <span>${pro_detail.property_name}</span>
                            </div>
                            <div>
                                <span>$${pro_detail.property_price}</span>
                            </div>
                        </div>
                        <div class="property-history-btn">
                            <button type="button" class="btn">EVALUATE</button>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    $('.property-history-btn .btn').click(function(){
        $("#property_details_btn").trigger('click');
        $('#property_details').hide();
        $('#property-api-data').show();
    })

});

//cancel subscription
$('#cancel_btn').on('click', async function () {  
    let storedUserData = await getChromeStorage(["userData"]);
    let userData = JSON.parse(storedUserData.userData);
    var result = await fetchDetails(BASE_URL + "cancel-subscription/" + userData.id);
    if(result.status == 'success'){
        $("#cancel_btn_cntnr").addClass('d-none');
        $(".plan-cancel-status").show();
    }
});

//check range between 1 to 100
$('.req-input-range').blur(function () {
    if (($(this).val() < 1) || ($(this).val() > 100) || isNaN($(this).val()) ) {
        $(this).val(1);
    }
});


//Required input
$('.req-input').blur(function () {
    if($(this).attr('type') == 'number') {
        if (isNaN($(this).val())) {
            $(this).val('');
        }
    }
    if ($(this).val() == '') {
        $(this).siblings('.error-message').show();
    } else {
        $(this).siblings('.error-message').hide();
    }
})


