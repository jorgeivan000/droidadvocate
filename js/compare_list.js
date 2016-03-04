function addSmartphoneToCompareList(id, model, url){
  sessionStorage.setItem(id, id+"@"+model+"@"+url);
  loadCompareList();
}


function removeSmartphoneToCompareList(id){
  sessionStorage.removeItem(id);
  loadCompareList();
}

function toggleCompareList(){
  $(".checkbox-compare").change(function(){
// Holds the product ID of the clicked element
var id = $(this).attr('data-id');
var model = $(this).attr('data-model');
var url = $(this).attr('data-url');
  if(this.checked) {
  if(sessionStorage.length!=3){

  addSmartphoneToCompareList(id,model,url);
}else{
  alert('You can only have at most 3 smartphones in the compare list');
}
}else{
removeSmartphoneToCompareList(id);
}

});
}

function loadCompareList(){

  $('#list_button').html("Compare list ("+sessionStorage.length+")&nbsp;<span class='caret'></span>");

  var html_code = "";

  for (var i = 0; i < sessionStorage.length; i++){
    var obj = sessionStorage.getItem(sessionStorage.key(i));
    var smartphone = obj.split('@');
    html_code = html_code + '<div style="height:35px; margin-top:5px;" class="bottomBorderDivider"><span class="col-md-2"><img  src="'+smartphone[2]+'" width="20px" height="25px"></img></span><span class="col-md-8" style="font-size:11px;">'+smartphone[1]+'</span><span class="col-md-2"><a class="a-green" style="cursor:pointer" href="javascript:removeSmartphoneToCompareList('+smartphone[0]+')">X</a></span></div>';

  }

  $('#compare_list').html(html_code);


}
