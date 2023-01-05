(function(){
  
  /**
   * Store data in chrome storage as key value pair
   * @param {string} key 
   * @param {value} value 
   * @returns boolen
   */


  function setChromeStorage(key, value) {
    let storingData = {};
    storingData[key] = value;

    try {
        chrome.storage.sync.set(storingData);
        return true;
    } catch (error) {
        return false;
    }

  }

  /**
  * Get data from chrome storage by passing array of keys
  * @param {array} key 
  * @returns Promise
  */
  function getChromeStorage(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, function(result) {
            resolve(result);
        })
    })
  }

  // dom load
  window.addEventListener("load", async function (e) {
    getRealtorPropDetails();
  });

  // get property details from website
  const getRealtorPropDetails = async () => {
    if (document.readyState == "complete") {
      const targetSections = document.querySelectorAll("section");
      var arr = [];
      for (let i = 0; i < targetSections.length; i++) {
        if (targetSections[i].getAttribute("id") == "payment_calculator") {
          document.querySelector("#content-payment_calculator").classList.remove("hide");
          arr.push(targetSections[i]);
          break;
        }
        else{
          arr = []
        }
      }

      if (arr.length > 0) {
        window.scroll({top:1100,behavior:"smooth"}); 
        setTimeout(()=>{
          var text='true' 
        
        // title
        var proTitle = '';
        if(document.querySelector('.listing-summary-info .listing-info .address .address-value')){
          const proTitleArr=document.querySelector('.listing-summary-info .listing-info .address .address-value').textContent.split(',');
          if(proTitleArr.length == 3){
            proTitle = proTitleArr[0];
          }
        }
        else{
          if(document.querySelector('#bottom-lead-form section .leadform-section .hidden-xxs')){
            const proTitleArr=document.querySelector('#bottom-lead-form section .leadform-section h2').textContent.split(' ')
            const proTitleAboutIndex=proTitleArr.indexOf('about')
            proTitle=proTitleArr.splice(proTitleAboutIndex+1,proTitleArr.length).join(' ')
          }
        }

        // img
        var proImg = '';
        if(document.querySelector('.hero-carousel .photo-gallery .slick-slider .slick-list .slick-track .slick-active div .main-carousel picture img')){
          proImg = document.querySelector('.hero-carousel .photo-gallery .slick-slider .slick-list .slick-track .slick-active div .main-carousel picture img').getAttribute("src");
        }
        else{
          if(document.querySelector('#bottom-lead-form section .leadform-section .hires-img-wrapper .hires-image picture img')){
            proImg = document.querySelector('#bottom-lead-form section .leadform-section .hires-img-wrapper .hires-image picture img').getAttribute('src')
          }
        }

        // price
        var proPrice = '';
        if(document.querySelector('.col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .price-section h2 .price-info div div')){
          proPrice = document.querySelector('.col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .price-section h2 .price-info div div').textContent
        }
        else{
          if(document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child .mortgage-components__sc-1ro4z1s-8.csSJoc div .mortgage-components__sc-1ro4z1s-6.mortgage-components__sc-1ro4z1s-7.gPPcfG.criyWf')){
            proPrice = document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child .mortgage-components__sc-1ro4z1s-8.csSJoc div .mortgage-components__sc-1ro4z1s-6.mortgage-components__sc-1ro4z1s-7.gPPcfG.criyWf').textContent
          }
        }

        // downpayment
        var proDownpayment = 20;
        if(document.querySelector('#content-payment_calculator div div:first-child div:first-child div .mortgage-components__sc-p6kdi-0.iAOpUA div:nth-child(2) div:first-child')){
          var str = document.querySelector('#content-payment_calculator div div:first-child div:first-child div .mortgage-components__sc-p6kdi-0.iAOpUA div:nth-child(2) div:first-child').textContent
          str = str.replace(/[^0-9\s]/gi,'');
          if(str != ''){
            str = Number(str.trim());
            proDownpayment = str;
          }
        }

        // estimate closing cost
        var proEstClosingCost = 4;
        if(document.querySelector('#content-payment_calculator div div:first-child div:first-child div .mortgage-components__sc-p6kdi-0.iAOpUA div:nth-child(3) div:first-child')){
          var str = document.querySelector('#content-payment_calculator div div:first-child div:first-child div .mortgage-components__sc-p6kdi-0.iAOpUA div:nth-child(3) div:first-child').textContent
          str = str.replace(/[^0-9\s]/gi,'');
          if(str != ''){
            str = Number(str.trim());
            proEstClosingCost = str;
          }
        }

        // loan term && interest rate
        var proLoanTerm = 30;
        var proInterestRate = 5;
        if(document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child span:nth-child(4) div div:last-child div span')){
          var loanTerm = Number(document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child span:nth-child(4) div div:last-child div span').textContent.split(' ')[0].split('-')[0])
          var interestRate =  document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child span:nth-child(4) div div:last-child div span').textContent.split(' ')
          var fullRate = Number(Math.floor(interestRate[interestRate.length-1].split("%")[0]));
          if(loanTerm != '' || fullRate != '' ){
              proLoanTerm = loanTerm
              proInterestRate = fullRate
          }
        }

        // bedrooms
        var proBedrooms = 2;
        if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:first-child')){
          if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:first-child').getAttribute('data-testid').includes('beds')){
            var span = document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:first-child span')
            var beds = Number(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:first-child span').textContent)
            if(span && beds != "" && Number.isInteger(beds)){
            proBedrooms = beds
            } 
          }
        }
        // bathroom
        var proBath = 2;
        if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:nth-child(2)')){
          if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:nth-child(2)').getAttribute('data-testid').includes('baths')){
            var span = document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:nth-child(2) span')
            var bath = Number(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:nth-child(2) span').textContent)
            if(span && bath != "" && Number.isInteger(bath)){
            proBath = bath
            } 
          }
        }

        // tax
        var proTax = '';
        if(document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child div:nth-child(6) div div:last-child ul li:nth-child(2)')){
          proTax = Number(document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child div:nth-child(6) div div:last-child ul li:nth-child(2)').textContent.replace(/[^0-9\s]/gi,''));
        }

        // home insurance
        var proHomeIns = '';
        if(document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child div:nth-child(6) div div:last-child ul li:nth-child(3)')){
          proHomeIns =  document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child div:nth-child(6) div div:last-child ul li:nth-child(3)').textContent.replace(/[^0-9\s]/gi,'');
        }

        // city/state
        var state = city = '';
        if(document.querySelector('.listing-summary-info .listing-info .address .address-value')){
          const cityState = document.querySelector('.listing-summary-info .listing-info .address .address-value').textContent.split(',');
          if(cityState.length == 3){
            city = cityState[1].trim();
            state = cityState[2].trim().split(' ')[0];
          }
        }

        // property type
        let proType = '';
        let proTypeCheck = document.querySelector('.listing-indicatorCont div ul li:first-child svg'); 
        if(proTypeCheck.getAttribute('data-testid').includes('home') || proTypeCheck.getAttribute('data-testid').includes('icon-home')){
          var node = document.querySelector('.listing-indicatorCont div ul li:first-child div div:last-child');
          if(node != null){
            var type = node.textContent
            proType = type
          }
        }

        // all property details object
        const proDetailsObj = {
          text:text,
          proTitle: proTitle,
          proImg: proImg,
          proPrice: proPrice,
          proDownpayment:proDownpayment,
          proEstClosingCost:proEstClosingCost,
          proLoanTerm:proLoanTerm,
          proInterestRate:proInterestRate,
          proBedrooms:proBedrooms,
          proBath:proBath,
          proTax:proTax,
          proHomeIns:proHomeIns,
          city:city,
          state:state,
          proType:proType
        };

        setChromeStorage("propertyDetails", JSON.stringify(proDetailsObj));
        sendDataWebtoExt(proDetailsObj);
        },2000)
      }else {
        setTimeout(()=>{
          var text='false'

        const proDetailsObj = {
          text:text
          // proTitle: proTitle,
          // proImg: proImg
        };
        setChromeStorage("propertyDetails", JSON.stringify(proDetailsObj));
        sendDataWebtoExt(proDetailsObj);
        },2000)
      }
    }
  };


  
  function sendDataWebtoExt(myObj){
    chrome.runtime.sendMessage(myObj, (response) => {
      return response;
    });
  }
  
  /**
   * Add message listener from chrome extension
   * Getting the message from popup.js
   */
  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.subject == 'login' && msg.login == true) {
      sessionStorage.setItem('UD', encodeURIComponent(JSON.stringify(msg.userData)));
    } else if (msg.subject == 'getuserdata') {
      console.log(msg);
      let userData = sessionStorage.getItem('UD');
      userData = JSON.parse(decodeURIComponent(userData)); 
      
      chrome.runtime.sendMessage(userData, (response) => {
        return response;
      });
    } else if (msg.logout) {
      this.window.sessionStorage.removeItem('UD');
    }

    if(document.readyState == 'complete'){
      getRealtorPropDetails();
    }
  });

})();