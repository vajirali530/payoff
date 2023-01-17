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
        var topTitle = document.querySelector('.address');
        var bottomTitle = document.querySelector('#bottom-lead-form');
        if(topTitle){
          var topTitleAttr = topTitle.getAttribute('data-testid');
          if(topTitleAttr == 'address'){
            var address = document.querySelector('.address-value').textContent.split(',')[0];
            proTitle = address;
          }
        }
        else{
          if(bottomTitle){
            var bottomTitleAttr = bottomTitle.getAttribute('data-testid');
            if(bottomTitleAttr == 'bottom-leadform-container'){
              var address = document.querySelector('.leadform-section h2').textContent.split(' ');
              var aboutIndex = address.indexOf('about');
              proTitle = address.splice(aboutIndex+1,address.length).join(' ');
            }
          }
        }

        // img
        var proImg = '';
        var topImg = document.querySelector('.main-carousel');
        var bottomImg = document.querySelector('#bottom-lead-form');
        if(topImg){
          var topImgAttr = topImg.getAttribute('data-testid');
          if(topImgAttr == 'gallery-item'){
            proImg = document.querySelector('.main-carousel picture img').getAttribute("src");
          }
        }
        else{
          if(bottomImg){
            var bottomImgAttr = topTitle.getAttribute('data-testid');
            if(bottomImgAttr == 'bottom-leadform-container'){
              var img = document.querySelector('.hires-image');
              if(img){
                proImg = document.querySelector('.hires-image picture img').getAttribute('src');
              }
            }
          }
        }

        // price
        var proPrice = '';
        var topPrice = document.querySelector('.list-price');
        var bottomPrice = document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child .mortgage-components__sc-1ro4z1s-8.csSJoc div .mortgage-components__sc-1ro4z1s-6.mortgage-components__sc-1ro4z1s-7.gPPcfG.criyWf');
        if(topPrice){
          var topPriceAttr = topPrice.getAttribute('data-testid');
          if(topPriceAttr == 'list-price'){
            proPrice = topPrice.textContent;
          }
        }
        else{
          if(bottomPrice){
            proPrice = bottomPrice.textContent;
          }
        }

        // downpayment
        var proDownpayment = 20;
        var downpayment = document.querySelector('#content-payment_calculator div div:first-child div:first-child div .mortgage-components__sc-p6kdi-0.iAOpUA div:nth-child(2) div:first-child');
        if(downpayment){
          var str = downpayment.textContent;
          str = str.replace(/[^0-9\s]/gi,'');
          if(str != ''){
            str = Number(str.trim());
            proDownpayment = str;
          }
        }

        // estimate closing cost
        var proEstClosingCost = 4;
        var estClosingCost = document.querySelector('#content-payment_calculator div div:first-child div:first-child div .mortgage-components__sc-p6kdi-0.iAOpUA div:nth-child(3) div:first-child');
        if(estClosingCost){
          var str = estClosingCost.textContent;
          str = str.replace(/[^0-9\s]/gi,'');
          if(str != ''){
            str = Number(str.trim());
            proEstClosingCost = str;
          }
        }

        // loan term && interest rate
        var proLoanTerm = 30;
        var proInterestRate = 5;
        var loan = document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child span:nth-child(4) div div:last-child div span');
        if(loan){
          var loanTerm = Number(loan.textContent.split(' ')[0].split('-')[0])
          var interestRate =loan.textContent.split(' ');
          var fullRate = Number(Math.floor(interestRate[interestRate.length-1].split("%")[0]));
          if(loanTerm != '' || fullRate != '' ){
              proLoanTerm = loanTerm
              proInterestRate = fullRate
          }
        }

        // bedrooms
        var proBedrooms = 2;
        var bed = document.querySelector('#section_summary [data-testid=property-meta-beds]'); 
        if (bed) {
          var findDot = bed.textContent.includes('.');
          if(findDot){
            proBedrooms = bed.textContent.split('.')[0];
          }
          else{
            proBedrooms = bed.textContent;
          }
        }

        // bathroom
        var proBath = 2;
        var bath = document.querySelector('#section_summary [data-testid=property-meta-baths]'); 
        if (bath) {
          var findDot = bath.textContent.includes('.');
          if(findDot){
            proBath = bath.textContent.split('.')[0];
          }
          else{
            proBath = bath.textContent;
          }
        }

        // tax
        var proTax = '';
        var taxBarchart = document.querySelector('#payment_calculator [data-testid=bar-chart]');
        var propertyTax = document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child div:nth-child(6) div div:last-child ul li:nth-child(2)')
        if(taxBarchart){
          var tax = document.querySelector('#payment_calculator [data-testid=bar-chart] [data-testid=tax] .tooltiptext');
          if(tax){
            proTax = tax.lastChild.textContent.replace(/[^0-9\s]/gi,'');
          }
        }
        else{
          if(propertyTax){
            proTax = propertyTax.textContent.replace(/[^0-9\s]/gi,'');
          }
        }

        // home insurance
        var proHomeIns = '';
        var homeBarchart = document.querySelector('#payment_calculator [data-testid=bar-chart]');
        var propertyHomeInsurance = document.querySelector('#content-payment_calculator div div:first-child div:first-child div div:first-child div:nth-child(6) div div:last-child ul li:nth-child(3)');
        if(homeBarchart){
          var insurance = document.querySelector('#payment_calculator [data-testid=bar-chart] [data-testid=hoi] .tooltiptext');
          if(insurance){
            proHomeIns = insurance.lastChild.textContent.replace(/[^0-9\s]/gi,'');
          }
        }
        else{
          if(propertyHomeInsurance){
            proHomeIns = propertyHomeInsurance.textContent.replace(/[^0-9\s]/gi,'');
          }
        }

        // city/state
        var state = city = '';
        var stateCity = document.querySelector('.address');
        var searchInput = document.querySelector('#searchbox-input');
        if(stateCity){
          var stateCityAttr = stateCity.getAttribute('data-testid');
          if(stateCityAttr == "address"){
            city = document.querySelector('.address-value').textContent.split(',')[1].trim();
            state = document.querySelector('.address-value').textContent.split(',')[2].split(' ')[0];
          }
        }
        else{
          if(searchInput){
            city = searchInput.value.split(',')[0];
            state = searchInput.value.split(',')[1];
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