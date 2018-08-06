if ('serviceWorker' in navigator) {
    console.log("Will the service worker register?");
    navigator.serviceWorker.register('../sw.js')
      .then(function(reg){
        console.log("Yes, it did.");
      }).catch(function(err) {
        console.log("No it didn't. This happened: ", err)
      });
  }

  let changeTab = function(){
    $('.tabHead').removeClass('active');
    $('.tabHead').addClass('clickable');
    $(this).removeClass('clickable').addClass('active');
  }
  let showClocks = function(){
  $('#clocks').removeClass('hidden');
  $('#addClock').addClass('hidden');
  }
  let showAddClock = function(){
    $('#addClock').removeClass('hidden');
    $('#clocks').addClass('hidden');
    }

  $(document).ready(function () {

    $('.tabHead').on('click', changeTab);
    $('#yourClocksTab').on('click', showClocks);
    $('#addClockTab').on('click',showAddClock);
});