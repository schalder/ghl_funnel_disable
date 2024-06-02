$(document).ready(function() {
  const ghlcs_loadEmbed = (url, cb) => { 
     var xmlhttp; 
     xmlhttp = new XMLHttpRequest(); 
     xmlhttp.onreadystatechange = function(){ 
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){ 
           cb(xmlhttp.responseText); 
        } 
     }
     xmlhttp.open('GET', url, true); 
     xmlhttp.send(); 
  }

  const the_ark = function(){ 
     var ark = ''; 
     var ark_att = document.getElementById('ghlcs-funnel-disable'); 
     if($(ark_att).length > 0) { 
        if(ark_att.hasAttribute('data-ark')){ 
           ark = ark_att.getAttribute('data-ark'); 
        } 
     } 
     return ark; 
  }

  // check to make sure agency is allowed to run scripts 
  ghlcs_loadEmbed('https://auth.locationapi.co/resources1?d=' + location.host + '&source=dashboard', function(j){ 
      let r = JSON.parse(j);
      if(r.e) {
          loadDisabled();

          // reapply for location change
          const ghlcs_observe_location_change = function(){

            const targetNode = document.querySelector('#app');
            const config = { attributes: true };
            const observer = new MutationObserver(function(mutations) {
              loadDisabled();
            });
            observer.observe(targetNode, config);
          }
          ghlcs_observe_location_change();

          window.addEventListener('locationchange', function (event) {
              loadDisabled();
          });

          // nav click
          waitForElementToDisplay('#sb_sites',function(){
              document.getElementById('sb_sites').addEventListener('click', function () {
                  loadDisabled();
              });
          },50,20000);
      }
  });
});

function loadDisabled () {
  console.log('running funnel disable script');
  // check to see if on funnel page
  // var page_url = document.location.href;
  // if(page_url.endsWith("/funnels-websites/funnels") ){
    setTimeout(function() {
      let funnelCount = 0;

      // count each funnel
      $('.funnel').each(function() { 
        funnelCount += 1;
      });

      // if greater than or equal to 3, disable new funnel button
      if(funnelCount >= 3) {
        $('.ghl_controls--right .ghl-btn').each(function() {
          if($(this).find('span').text().trim() == 'New Funnel') {
            $(this).prop('disabled');
            $(this).attr('disabled', true);
          }
        })
      } else {
        $('.ghl_controls--right .ghl-btn').each(function() {
          if($(this).find('span').text().trim() == 'New Funnel') {
            $(this).prop('disabled', false);
            $(this).attr('disabled', false);
          }
        })
      }
    }, 1000);
  // }
}

// function to wait for certain GHL elements to display
function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}
