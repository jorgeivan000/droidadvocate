
function postProcessingDetail(data){
  var smartphone = data[0];
  var html_code = "";
  html_code = html_code + '<div class="col-md-4 pull-left" style="padding:0px;"><table width="100%;" style="text-align:center;"><tr class="sidesBorderDivider"><td><button id="close_item_one" class="btn pull-right close-circle" data-id="'+smartphone.id+'"style="font-size:25px; color:#FF5722; background-color:transparent;" type="button"><span  class="glyphicon glyphicon-remove-circle"></span></button></td></tr><tr class="sidesBorderDivider"><td ><div class="col-md-12" style="text-align:center;"><img src="'+smartphone.image_url+'" width="90px" height="150px"></img></div></td></tr><tr class="tableBorderDivider"><td><a href="javascript:getSmartphoneDetail('+smartphone.id+');"  class="a-green" ><h4>'+smartphone.model+'</h4></a></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.release_date+'</p></td></tr><tr><td class="tableBorderDivider" ><div style="font-size:15px; color:#FF5722; padding: 4px;">'+getStarsHTML(smartphone.amazon_rating,smartphone.amazon_reviews,0)+'</div></td></tr><tr><td class="tableBorderDivider" ><p style="font-size:16px;">$'+smartphone.amazon_price+'</p></td></tr><tr><td style="height:37px;"><p>&nbsp;</p></td></tr><tr><td class="fullBorderDivider" ><p>'+smartphone.screen_size+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.weight+'</p></td></tr><tr><td class="tableBorderDivider"><p>'+smartphone.color+'</p></td></tr><tr><td style="height:39px;"><p>&nbsp;</p></td></tr><tr><td class="fullBorderDivider"><p>'+smartphone.camera+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.flash+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.front_face_camera+'</p></td></tr><tr><td style="height:39px;"><p>&nbsp;</p></td></tr><tr><td class="fullBorderDivider" ><p class="td-small-text">'+smartphone.processor+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.system_memory+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.storage+'</p></td></tr><tr><td style="height:36px;"><p>&nbsp;</p></td></tr><tr><td class="fullBorderDivider" ><p>'+smartphone.talk_time+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.video_playback+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.battery+'</p></td></tr><tr><td style="height:35px;"><p>&nbsp;</p></td></tr><tr><td class="fullBorderDivider" ><p class="td-small-text">'+smartphone.data+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.storage_expansion+'</p></td></tr><tr><td class="tableBorderDivider" ><p>'+smartphone.android_version+'</p></td></tr><tr><td style="height:36px;"><p>&nbsp;</p></td></tr><tr><td class="fullBorderDivider" ><p class="td-small-text">'+smartphone.pro_1+'</p></td></tr><tr><td class="tableBorderDivider" ><p class="td-small-text">'+smartphone.pro_2+'</p></td></tr><tr><td class="tableBorderDivider" ><p class="td-small-text">'+smartphone.pro_3+'</p></td></tr><tr><td style="height:36px;"><p>&nbsp;</p></td></tr><tr><td class="fullBorderDivider" ><p class="td-small-text">'+smartphone.con_1+'/p></td></tr><tr><td class="tableBorderDivider" ><p class="td-small-text">'+smartphone.con_2+'</p></td></tr><tr><td class="tableBorderDivider" ><p class="td-small-text">'+smartphone.con_3+'</p></td></tr></table></div>';
  $("#compare_smartphones" ).append(html_code);
  $(".close-circle").click(function() {
    $(this).parent().parent().parent().parent().parent().remove();
    var data_id=  $(this).attr('data-id');
    removeSmartphoneToCompareList(data_id);
    //loadSmartphonesCompareList();
  });

}

function getDetail(id){
  //alert('./rest/api.php?rquest=detail&id='+id+'');
  $.ajax({
    url: './rest/api.php?rquest=detail&id='+id+'',
    type: 'get',
    dataType: 'json',
    cache: false,
    success: postProcessingDetail,
    async:true,
  });
}

function loadSmartphonesCompareList(){
  $("#compare_smartphones").html(" ");
  for (var i = 0; i < sessionStorage.length; i++){
    var obj = sessionStorage.getItem(sessionStorage.key(i));
    var smartphone = obj.split('@');
    getDetail(smartphone[0]);
  }
}


function getLocalResultsHTML(smartphones){
  var html_code="";
  $.each(smartphones, function(i, smartphone) {
    html_code=html_code+'<div style="height:35px; padding-top:5px;" class="bottomBorderDivider"><span class="col-md-2"><img  src="'+smartphone.image_url+'" width="20px" height="25px"></img></span><span class="col-md-7" style="font-size:10px;">'+smartphone.model+'</span><span class="col-md-3"><a style="cursor:pointer" class="a-green" href="javascript:addToCompareList('+smartphone.id+')">add</a></span></div>';
  });

  return html_code;

}

function addToCompareList(id){
  addSmartphoneToCompareList(id);
  getDetail(id);
}

function postProcessingLocalSearch(data){
    $("#local_search_results").html(getLocalResultsHTML(data));
}

function localSearch(keywords){
  var api_search= './rest/api.php?rquest=search&key='+keywords;
  $.ajax({
    url: api_search,
    type: 'get',
    dataType: 'json',
    cache: false,
    success: postProcessingLocalSearch,
    async:true,
  });

}
