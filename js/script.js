$(document).ready(function() {
  $(document).on('click', '#search_btn', function () {
    filmSearch();
  });
});


function filmSearch() {
  var searchVal = $('#search_val').val().toLowerCase();
  console.log(searchVal);
}
