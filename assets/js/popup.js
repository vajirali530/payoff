import { setChromeStorage, getChromeStorage } from "../../helper.js";

// const BASE_URL = "https://credifana.com/";   
const BASE_URL = "http://192.168.1.13:8000/";   
const API_URL = BASE_URL+"api/";   
const BILLING_URL = BASE_URL+"billing/";
const PRIVACY_POLICY_URL = BASE_URL+"privacy-policy/";
const TERMS_AND_CONDITION_URL = BASE_URL+"terms-of-use/";
const FORGOTPASSWORD_URL = BASE_URL+"forgot-password/";
var site_data, property_data = '';

var userCurrentPlan = '';

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
    const currentURL = await getChromeStorage(["currentURL"]);
    const evaluatedData = await getChromeStorage(["evaluatedData"]);

    if (storedData.userData && storedData.userData.length > 0) {
        $('.credifanaLogin').hide()
        determineExtensionProcess(storedData.userData);
    }
})

// login
$('#loginBtn').on('click', function () {
    $(".error-message").addClass("d-none");

    let formData = new FormData($('#login_form')[0]);
    let error = 0;
    formData.forEach((value,  index) => {
        if (index == 'email' && value != '') {
            let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
            if (!(pattern.test(value))) {
                $(`input[name=${index}]`).parents('#login_form .form-group').find('.error-message').removeClass('d-none');
                error++;
            } else {
                $(`input[name=${index}]`).parents('#login_form .form-group').find('.error-message').addClass('d-none');
            }
            return;
        }

        if (index == 'password' && value != '') {
            if (value.length <= 5) {
                $(`input[name=${index}]`).parents('#login_form .form-group').find('.error-message').html('Password should be min 6 characters long');
                $(`input[name=${index}]`).parents('#login_form .form-group').find('.error-message').removeClass('d-none');
                error++;
            } else {
                $(`input[name=${index}]`).parents('#login_form .form-group').find('.error-message').addClass('d-none');
            }
            return;
        }

        if($.trim(value) == '') {
            $(`input[name=${index}]`).siblings('#login_form .error-message').removeClass('d-none');
            error++;
        } else {
            $(`input[name=${index}]`).siblings('#login_form .error-message').addClass('d-none');
        }

    })

    // $('#loginBtn .error-message').each((index, val) => {
    //     if(!$(val).hasClass('d-none')) {
    //         isValidated = false;
    //     };
    // })


    if (error == 0) {
        $('#loginSpinner').show()
        $.ajax({
            type: "post",
            url: API_URL+"login",
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'JSON',
            success:function (response){
                $('#loginSpinner').hide()
                if(response.status == 'error') {
                    $('#login_form .response_errors').html('');
                    $('#login_form .response_errors').append(`<div class="response_error">${response.message}</div>`);
                } else if(response.status == "success"){
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
    let error = 0;
    formData.forEach((value,  index) => {
        if (index == 'email' && value != '') {
            let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
            if (!(pattern.test(value))) {
                $(`input[name=${index}]`).parents('#register_form .form-group').find('.error-message').removeClass('d-none');
                error++;
            } else {
                $(`input[name=${index}]`).parents('#register_form .form-group').find('.error-message').addClass('d-none');
            }
            return;
        } 

        if (index == 'password' && value != '') {
            if (value.length <= 5) {
                $(`input[name=${index}]`).parents('#register_form .form-group').find('.error-message').html('Password should be min 6 characters long');
                $(`input[name=${index}]`).parents('#register_form .form-group').find('.error-message').removeClass('d-none');
                error++;
            } else {
                password = value;   
                $(`input[name=${index}]`).parents('#register_form .form-group').find('.error-message').addClass('d-none');
            }
            return;
        }

        if (index == 'confirmpassword' && value != '' && password!= '') {
            if (value != password) {
                $(`input[name=${index}]`).parents('#register_form .form-group').find('.error-message').removeClass('d-none');
                error++;
            } else {
                $(`input[name=${index}]`).parents('#register_form .form-group').find('.error-message').addClass('d-none');
            }
            return;
        }

        if($.trim(value) == '') {
            $(`input[name=${index}]`).siblings('#register_form .error-message').removeClass('d-none');
            error++;
        } else {
            $(`input[name=${index}]`).siblings('#register_form .error-message').addClass('d-none');
        }

    })

    if (error == 0) {
        
        $('#registerSpinner').show();
        $.ajax({
            type: "post",
            url: API_URL+"register",
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
            $('.prop-details-spinner').removeClass('d-none')
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
    let currentSiteName = '';
    let currentSiteUrl=''
    let cachedURL = await getChromeStorage(["currentURL"]);
    let chachedData = await getChromeStorage(["evaluatedData"]);
    cachedURL = cachedURL.currentURL;
    chachedData = chachedData.evaluatedData;
    
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        currentSiteName = tabs[0].url.split("/")[2].split(".")[1];
        currentSiteUrl = tabs[0].url.split("/").join();
    
        if ( currentSiteName === "realtor" && currentSiteUrl.includes("realestateandhomes-detail")){
            $('.prop-details-spinner').addClass('d-none');
            $('.realtor-property-details').show();
            $('#property_details').show();
        }
    });

    const storedData = await getChromeStorage(["userData"]);
    var userInfo = JSON.parse(storedData.userData);
    $.get(API_URL+'user-detail/'+userInfo.id,function(response){
       if(response.status == 'success'){
            userCurrentPlan = response.data.plan_name;
       }
    });
    

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

        currentSiteUrl = currentSiteUrl.split(',').join('/');
        
        if(cachedURL == currentSiteUrl && Object.keys(chachedData).length > 0) {
            let defaultData = chachedData[Object.keys(chachedData)[0]];
            $('.bed_bath_container').html('');
            $('.recall-api-disabled').removeAttr('disabled');
            if ((defaultData.extra_bed_bath) && (defaultData.extra_bed_bath.length > 1)) {
                for (let i = 0; i < defaultData.extra_bed_bath.length; i++) { 
                    let currBed = defaultData.extra_bed_bath[i].split('_')[0];
                    let currBath = defaultData.extra_bed_bath[i].split('_')[1];
                    let avgPrice = chachedData[currBed+'_'+currBath].average_rent;
                    $('.bed_bath_container').append(
                        `
                        <div class="extra_bedroom_bathroom ${i==0 ? 'active_box' : ''}" data-clicktype="changeProDetails" data-bedbath="${currBed+'_'+currBath}">
                            <span>Average Rent : ${avgPrice} </span>
                            <span>Bedroom : ${currBed} </span>
                            <span>Bathroom : ${currBath} </span>
                        </div>
                        `                                
                    ); 
                }
                $('.bed_bath_container').show();
            }
            defaultData.user_current_plan_name == 'basic' ? $('.full-access').show() : $('.full-access').hide();
            $('#rate_container_city').text(defaultData.city)
            $('#rate_container_state').text(defaultData.state)
            $('#property_details').hide();
            $('#property-api-data').show();
            $.each( defaultData, function( key, value ) {
                if(value == '' && defaultData.user_current_plan_name == 'basic'){
                    $("#property-api-data span#"+key).html('<a href="'+BILLING_URL+'?token='+finaluserData.token+'" target="blank">subscribe</a>');
                }else{
                    $("#property-api-data span#"+key).html(value);
                }
            });
            $('#property_id').val(chachedData.last_id);
        }

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
        if(msg.proType == 'multi family' || msg.proType == 'Multi-Family'){
            $('#bedrooms, #bathrooms, #unit').val('');
        }else{
            $('#unit').prop('readonly', true).css('cursor','not-allowed');
        }

    } else {
        $('#pills-tabContent').hide();
        $(".rent-property").removeClass("d-none");
    }
}


//get plan details

$("#plan_details_btn").on("click", async function () {
    $('#planSpinner').show();
    let userDataCollection = await getChromeStorage(["userData"]);
    var finaluserData = JSON.parse(userDataCollection.userData);
    var result = await fetchDetails(API_URL + "getsubscription-details/" + finaluserData.id);
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
chrome.runtime.onMessage.addListener(async (msg,response) => {
    console.log('Content Script recieve data', msg, response);
    property_data = msg;
    site_data = response;
    const loginInfo = await getChromeStorage(["userData"]);
    if (loginInfo.userData && typeof loginInfo.userData != 'undefined' ) {
        const loginInfoObj = JSON.parse(loginInfo.userData)
        if(loginInfoObj.email.length>0){
            getDataFromWebsite(msg,response);
        }
    }
})


$('#evalute_btn').click(async function(){

    $(this).css('pointer-events','none');

    $('.prop-data').each(function(idx,val){
        $(val).text('')
    })
    $('.error-message').removeClass('d-none').hide();
    var error = 0;
    $('.req-input').each(function() {
        if ($(this).val() == '') {
            $(this).siblings('.error-message').show();
            error++;
        }
    });

    if (error > 0) {
        $(this).css('pointer-events','auto');
        return;
    }

    $('.evaluteSpinner').show();
    let formData = new FormData($('#property_details')[0]);
    $.ajax({
        type: "post",
        url: API_URL+"getproperty-details",
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'JSON',
        success:function (response){
        
            $('#evalute_btn').css('pointer-events','auto');
            
            $('.evaluteSpinner').hide();
            if(response.status == 'error') {
                $('.response_errors').html('');
                $('.response_errors').html(`${response.message}`);
            }else if(response.status == "success"){
                
                chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
                    setChromeStorage('currentURL', tabs[0].url);
                    setChromeStorage('evaluatedData', response.data);
                });
                let default_data = response.data[Object.keys(response.data)[0]];
                
                // if(response.data.user_current_plan_name != 'basic'){
                    $('.bed_bath_container').html('');
                    $('.recall-api-disabled').removeAttr('disabled');
                    if ((default_data.extra_bed_bath) && (default_data.extra_bed_bath.length > 1)) {
                        for (let i = 0; i < default_data.extra_bed_bath.length; i++) { 
                            let currBed = default_data.extra_bed_bath[i].split('_')[0];  
                            let currBath = default_data.extra_bed_bath[i].split('_')[1];
                            let avgPrice = response.data[currBed+'_'+currBath].average_rent;

                            $('.bed_bath_container').append(
                                `
                                <div class="extra_bedroom_bathroom ${i==0 ? 'active_box' : ''}" data-clicktype="changeProDetails" data-bedbath="${currBed+'_'+currBath}">

                                    <span>Average Price : ${avgPrice} </span>
                                    <span>Bedroom : ${currBed} </span>
                                    <span>Bathroom : ${currBath} </span>
                                </div>
                                `                                
                            ); 
                        }
                        $('.bed_bath_container').show();
                    }
                // }else{
                    default_data.user_current_plan_name == 'basic' ? $('.full-access').show() : $('.full-access').hide();
                // }
                $('#rate_container_city').text(default_data.city)
                $('#rate_container_state').text(default_data.state)
                $('#property_details').hide();
                $('#property-api-data').show();
                $.each( default_data, function( key, value ) {
                    if(value == '' && default_data.user_current_plan_name == 'basic'){
                        $("#property-api-data span#"+key).html('<a href="'+BILLING_URL+'" target="blank">subscribe</a>');
                    }else{
                        $("#property-api-data span#"+key).html(value);
                    }
                });
                $('#property_id').val(response.data.last_id);
            }
        },
    });
});



$('.back-btn .btn').click(async function(){
    $('#property-api-data').hide();
    $('#property_details').show();

    let propertyDataCollection = await getChromeStorage(["propertyDetails"]);
    
    let finalpropertyData =  JSON.parse(propertyDataCollection.propertyDetails);
    
    $(".property-img-price img").attr("src", finalpropertyData.proImg);
    $("#property_price").html(finalpropertyData.proPrice);
    $(".property-name span").text(finalpropertyData.proTitle);
    // getDataFromWebsite(property_data, site_data);

})

//get property history
$('#property_history_btn').on('click', async function () {
    let storedUserData = await getChromeStorage(["userData"]);
    let userData = JSON.parse(storedUserData.userData);
    var result = await fetchDetails(API_URL + "getproperty-history/" + userData.id);
    $(".property-history-wrapper").html('');

    if (result.data.user_plan_name == 'basic') {
        $('.property-history-wrapper').html('<span><a href="'+BILLING_URL+'?token='+userData.token+'" target="blank">Subscribe To Access Property History</a></span>');  
    } else {
        if(result.data.proHistoryData.length == 0){
            $(".property-history-wrapper").html('<h4>No property found.</h4>');
        }else{
            $.each( result.data.proHistoryData, function( key, value ) {
                var pro_detail = JSON.parse(value.pro_detail);
                pro_detail = Object.keys(pro_detail)[0] ? pro_detail[Object.keys(pro_detail)[0]] : pro_detail;

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
                                <input class="pro-id" type="hidden" value='${value.id}' />
                                <input class="pro-json-data" type="hidden" value='${value.pro_detail}' />
                                <button type="button" class="btn">EVALUATE</button>
                            </div>
                        </div>
                    </div>
                `);
            });
        }
    }



});

$(document).on('click','.property-history-btn .btn',function(){
    $("#property_details_btn").trigger('click');
    $('.recall-api-disabled').removeAttr('disabled');
    $('#property_details').hide();
    $('#property-api-data').show();
    $(".prop-data").text('');
    var jsonData = $(this).siblings(".pro-json-data").val();
    var property_id = $(this).siblings(".pro-id").val();
    var property_details = JSON.parse(jsonData);
    var pro_detail = property_details[Object.keys(property_details)[0]];
    
    $(".property-img-price img").attr("src", pro_detail["property_image"]);
    $("#property_price").html("$" + pro_detail["property_price"]);
    $(".property-name span").text(pro_detail["property_name"]);
    $(".property-city-state #city").text(pro_detail["city"]);
    $(".property-city-state #state").text(pro_detail["state"]);
    $("#rate_container_city").text(pro_detail["city"]);
    $("#rate_container_state").text(pro_detail["state"]);
    $("#property_id").val(property_id);
    $('.bed_bath_container').html('');

    if (pro_detail.user_current_plan_name != 'basic') {
        if (pro_detail.extra_bed_bath && (pro_detail.extra_bed_bath.length > 1)) {
            for (let i = 0; i < pro_detail.extra_bed_bath.length; i++) {
                let currBed = pro_detail.extra_bed_bath[i].split('_')[0];
                let currBath = pro_detail.extra_bed_bath[i].split('_')[1];
                let avgPrice = property_details[currBed+'_'+currBath].average_rent;
                 
                $('.bed_bath_container').append(
                    `
                    <div class= "extra_bedroom_bathroom ${i==0 ? 'active_box' : ''}" data-clicktype="changeProDetails" data-bedbath="${currBed+'_'+currBath}">
                        <span>Average Rent : ${avgPrice} </span>
                        <span>Bedroom : ${currBed} </span>
                        <span>Bathroom : ${currBath} </span>
                    </div>
                    `                                
                ); 
            }
            $('.bed_bath_container').show();
        }
    }
    
    $('.recall-api').css('backgroundColor', '#748EFF');
    $('.api-data .recall-api').css('backgroundColor','white')
    $('.api-data .recall-api span').css('color','#241F1F')

    $.each(pro_detail, function (key, value) {
      $("#property-api-data span#" + key).text(value);
    });
})

//cancel subscription
$('#cancel_btn').on('click', async function () {  
    $('#cancel_spinner').removeClass('d-none')
    let storedUserData = await getChromeStorage(["userData"]);
    let userData = JSON.parse(storedUserData.userData);
    $.ajax({
        type: "post",
        url: API_URL + "cancel-subscription",
        data: {'id':userData.id},
        dataType: "JSON",
        success: function (response) {
            $('#cancel_spinner').addClass('d-none')
            $(".evaluteSpinner").hide();
            if (response.status == "success") {
                $("#cancel_btn_cntnr").addClass('d-none');
                $(".plan-cancel-status").show();
                }
        }
    });
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

// bootstrap tooltip for unit
// var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
// var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
//   return new bootstrap.Tooltip(tooltipTriggerEl)
// })


$('.recall-api').click(async function(){
    $('.recall-api').css('backgroundColor','#748EFF')
    $('.api-data .recall-api').css('backgroundColor','white')
    $('.api-data .recall-api span').css('color','#241F1F')
    if($(this).parents('div').hasClass("api-highest-rent") || $(this).parents('div').hasClass("api-average-rent")){
        $(this).find('span').css('color','white');
    }
    $(this).css('backgroundColor','#374eb4')
    $('.recall-api').prop('disabled', true);
    $(".rate-error").html("");

    const userInfo = await getChromeStorage(["userData"]);
    const userInfoObj = JSON.parse(userInfo.userData);
    let proid = $('#property_id').val();
    let active_unit = $('.active_box').data('bedbath');
    let clicktype = $(this).data('rentoption');
    let rentValue = $(this).data('rentvalue');

    $.ajax({
        url: API_URL + "property-regenerate-details",
        method: "POST",
        data: {user_id : userInfoObj.id, property_id : proid, clicktype : clicktype, rentValue : rentValue, active_unit: active_unit},
        success:function (response){
            
            if(response.data.user_current_plan_name != 'basic'){
                $('.recall-api-disabled').removeAttr('disabled');
            }
            $('.recall-api-default').removeAttr('disabled');

            $(".prop-data").text("");
            
            if(response.status == 'success'){
                $.each(response.data, function (key, value) {
                    if(value == '' && response.data.user_current_plan_name == 'basic'){
                        $("#property-api-data span#"+key).html('<a href="'+BILLING_URL+'" target="blank">subscribe</a>');
                    } else {
                        $("#property-api-data span#" + key).text(value);
                    }
                });
                $("#property_id").val(response.data.last_id);
            }else{
               $('.rate-error').show().html(response.message);
            }
        },
    });
});

$("#unit").change(function() {
    // if(userCurrentPlan != '' && userCurrentPlan != 'basic'){
        var totalUnit = parseInt($(this).val());
        $("#extra_bed_bath").html('');
        $("#bedrooms, #bathrooms").val('');
        if(totalUnit > 1) {
            $('.up_arrow').show();
            $('.down_arrow').hide();
            
             var append_bed_bath = '';
             
             for(var i = 2; i <= totalUnit; i++){
                 append_bed_bath += `<div class="details-container">
                                         <div class="bedrooms">
                                             <span>Bedrooms<em>*</em></span>
                                             <div>
                                                 <input type="number" class="form-control req-input extra-bedrooms" placeholder="Number of Bedroom" name="extra_bedrooms[]" ${userCurrentPlan == '' || userCurrentPlan == 'basic' ? 'readonly style="cursor:not-allowed;"' : '' }>
                                                 <div class="error-message">Please enter number of bedrooms</div>
                                             </div>
                                         </div>
                                         <div class="bathrooms">
                                             <span>Bathrooms<em>*</em></span>
                                             <div>
                                                 <input type="number" class="form-control req-input extra-bathrooms" placeholder="Number of Bathroom" name="extra_bathrooms[]" ${userCurrentPlan == '' || userCurrentPlan == 'basic' ? 'readonly style="cursor:not-allowed;"' : '' }>
                                                 <div class="error-message">Please enter number of bathrooms</div>                                            
                                             </div>
                                         </div>
                                     </div>`;
             }
             $("#extra_bed_bath").append(append_bed_bath).show();
        } else {
            $('.up_arrow').hide();
            $('.down_arrow').hide();
        }
    // }
});

$("#bedrooms, #bathrooms").change(function (){
    if (userCurrentPlan == 'basic') {
        if($(this).attr('name') == 'bedrooms'){
            $("#extra_bed_bath .extra-bedrooms").val($(this).val());
        }
    
        if($(this).attr('name') == 'bathrooms'){
            $("#extra_bed_bath .extra-bathrooms").val($(this).val());
        }
    }
});

$('.up_arrow').on('click', function () {  
    $('#extra_bed_bath').css('transition', '0.6s').hide();
    $(this).hide();
    $('.down_arrow').show()
});

$('.down_arrow').on('click', function () {  
    $('#extra_bed_bath').css('transition', '0.6s').show();
    $(this).hide();
    $('.up_arrow').show()
});

// privacy_policy / terms_of_service
$('#privacy_policy').click(function(){
    $(this).attr('href',PRIVACY_POLICY_URL);
});

$('#terms_of_service').click(function(){
    $(this).attr('href',TERMS_AND_CONDITION_URL);
});

$('.forgotLink').click(function(){
    $(this).attr('href',FORGOTPASSWORD_URL);
});

$(document).on('keyup', async function (e) {
    if (e.key == 'Enter') {
        let userData = await getChromeStorage(['userData']);
        if (userData.userData && typeof userData.userData != 'undefined') {
            userData = JSON.parse(userData.userData);
            if (typeof userData == 'object' && Object.keys(userData).length > 0 && $("#pills-property-details").hasClass("active")) {
                $('#evalute_btn').trigger('click');         
            }
        } else {
            if(typeof $(".credifanaLogin").attr('style') == 'undefined' || $(".credifanaLogin").attr('style') == ''){
                $('#loginBtn').trigger('click');            
            }
        }
    }
});


$(document).on('click', '.extra_bedroom_bathroom', async function () {  
    if (!$(this).hasClass('active_box')) {
        
        $('.extra_bedroom_bathroom').removeClass('active_box');
        $('.recall-api').attr('disabled', true);
        $('.extra_bedroom_bathroom').attr('disabled', true);
        $('.recall-api').css('backgroundColor','#748EFF');
        $('.api-data .recall-api').css('backgroundColor','white');
        $('.api-data .recall-api span').css('color','#241F1F');
        $(this).addClass('active_box');

        const userInfo = await getChromeStorage(["userData"]);
        const userInfoObj = JSON.parse(userInfo.userData);

        let clicktype = $(this).data('clicktype');
        let active_unit = $(this).data('bedbath');
        let property_id = $('#property_id').val();
        
        $.ajax({
            url: API_URL + "property-regenerate-details",
            method: "POST",
            data: {user_id : userInfoObj.id, property_id : property_id, clicktype : clicktype, active_unit: active_unit},
            success:function (response){

                if(response.data.user_current_plan_name != 'basic'){
                    $('.recall-api-disabled').removeAttr('disabled');
                }
                $('.recall-api-default').removeAttr('disabled');

                $(".prop-data").text("");
                
                if(response.status == 'success'){
                    $.each(response.data, function (key, value) {
                        if(value == '' && response.data.user_current_plan_name == 'basic'){
                            $("#property-api-data span#"+key).html('<a href="'+BILLING_URL+'" target="blank">subscribe</a>');
                        } else {
                            $("#property-api-data span#" + key).text(value);
                        }
                    });
                    $("#property_id").val(response.data.last_id);
                    
                    $('.recall-api').attr('disabled', false);
                    $('.extra_bedroom_bathroom').attr('disabled', false);
                }else{
                $('.rate-error').show().html(response.message);
                }
            },
        });        
    }

});
