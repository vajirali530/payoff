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
        console.log('storing error', error);
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
        if(document.querySelector('#__next div .ldp-root .cashback-banner-container .cashback-desktop .mainTitle')){
          const proTitleArr=document.querySelector('#__next div .ldp-root .cashback-banner-container .cashback-desktop .mainTitle').textContent.split(' ')
          const proTitleBuyIndex=proTitleArr.indexOf('buy')
          proTitle=proTitleArr.splice(proTitleBuyIndex+1,proTitleArr.length).join(' ')
          if((proTitle.startsWith('.'))){
            proTitle = ''
          }
        }
        else{
          if(document.querySelector('#bottom-lead-form section .leadform-section .jsx-1975176684.hidden-xs.hidden-xxs')){
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
        let proBedrooms = 2;
        if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:first-child')){
          if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:first-child').getAttribute('data-testid').includes('beds')){
            var span = document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:first-child span')
            var beds = document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:first-child span').textContent
            if(span && beds != ""){
            proBedrooms = beds
            } 
          }
        }

        // bathroom
        let proBath = 2;
        if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:nth-child(2)')){
          if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:nth-child(2)').getAttribute('data-testid').includes('baths')){
            var span = document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:nth-child(2) span')
            var bath = document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-summary-info-map .listing-summary-info-ref .listing-info .property-meta ul li:nth-child(2) span').textContent
            if(span && bath != ""){
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
        if(document.querySelector('#rdc-ldp-search-filter-tray div div .input-wrapper input')){
          console.log('hello i am in');
          let cityState = document.querySelector('#rdc-ldp-search-filter-tray div div .input-wrapper input').getAttribute('value');
          if(cityState != ''){
            cityState = cityState.split(', ');
            city = cityState[0] ?? '';
            state = cityState[1] ?? '';
          }
        }

        // property type
        let proType = '';
        if(document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-indicatorCont div ul li:first-child svg').getAttribute('data-testid').includes('home')){
          var node = document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-indicatorCont div ul li:first-child div div:last-child')
          var type = document.querySelector('.container div div:last-child .col-main .property-three-sec-view .left-column .listing-summary-info .listing-indicatorCont div ul li:first-child div div:last-child').textContent
          if(node && type != ''){
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
      } 
      else {
        setTimeout(()=>{
          var text='false'

        // title
        // var proTitle = ''
        // if(document.querySelector(".ldp-learn-more-title")){
        //   const proTitleArr=document.querySelector(".ldp-learn-more-title").textContent.split(' ')
        //   const proTitleAboutIndex=proTitleArr.indexOf('about')
        //   const title=proTitleArr.splice(proTitleAboutIndex+1,proTitleArr.length).join(' ')
        //   if(!(title == 'this property'))
        //   {
        //     proTitle = title
        //   }
        //   if((proTitle.startsWith('.'))){
        //     proTitle = ''
        //   }
        // }

        // img
        // var proImg = '';
        // if(document.querySelector('.slick-slider .slick-list .slick-track .slick-active div div picture img')){
        //   proImg = document.querySelector('.slick-slider .slick-list .slick-track .slick-active div div picture img').getAttribute("src");
        // }

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
      console.log('this is a response', response);
      return response;
    });
  }

  
  /**
   * Add message listener from chrome extension
   * Getting the message from popup.js
   */
  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log(msg, sender, response);
    if(document.readyState == 'complete'){
      getRealtorPropDetails();
    }
  });

})();