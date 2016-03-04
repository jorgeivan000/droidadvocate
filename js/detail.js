
function getPricesArray(smartphone){
  var a = [[smartphone.amazon_price, 'Amazon', smartphone.amazon_url, smartphone.amazon_rating, smartphone.amazon_reviews], [smartphone.bestbuy_price, 'Bestbuy', smartphone.bestbuy_url, smartphone.bestbuy_rating, smartphone.bestbuy_reviews], [smartphone.newegg_price, 'Newegg', smartphone.newegg_url, smartphone.newegg_rating, smartphone.newegg_reviews]];
  a.sort(sortFunction);

  // Find and remove item from an array
  for(var i = a.length; i--;){
	if (a[i][0] === "0") a.splice(i, 1);
  }

  return a;
}


function getVendorsHTML(smartphone, sortedPrices){
  var html_code="";

  for (var i = 0; i<sortedPrices.length; i++) {
    if(sortedPrices[i][1]=="Amazon"){
      html_code = html_code+'<tr><td>Amazon</td><td>'+getStarsHTML(smartphone.amazon_rating,smartphone.amazon_reviews,0)+'</td><td>Free Shipping</td><td style="color:#FF5722; font-size:17px;">$'+formatPrice(smartphone.amazon_price)+'</td><td style="text-align:center;"><a class="btn btn-green" href="'+smartphone.amazon_url+'" target="_blank">Shop now!</a></td></tr>';

    }else if(sortedPrices[i][1]=="Bestbuy"){

      html_code=html_code+'<tr><td>Bestbuy</td><td>'+getStarsHTML(smartphone.bestbuy_rating,smartphone.bestbuy_reviews,0)+'</td><td>Free Shipping</td><td style="color:#FF5722; font-size:17px;">$'+formatPrice(smartphone.bestbuy_price)+'</td><td style="text-align:center;"><a class="btn btn-green" href="'+smartphone.bestbuy_url+'" target="_blank">Shop now!</a></td></tr>';

    }else if(sortedPrices[i][1]=="Newegg"){
      html_code=html_code+'<tr><td>Newegg</td><td>'+getStarsHTML(smartphone.newegg_rating,smartphone.newegg_reviews,0)+'</td><td>Free Shipping</td><td style="color:#FF5722; font-size:17px;">$'+formatPrice(smartphone.newegg_price)+'</td><td style="text-align:center;"><a class="btn btn-green" href="'+smartphone.newegg_url+'" target="_blank">Shop now!</a></td></tr>';
    }
}
  return html_code;
}




function getStarsHTML(rating, text, mod){

  var res = rating.split(".");
  var integer = res[0];
  var decimal = res[1];
  var html_code="";
  for(i=0; i<integer; i++){
    //add star
    html_code = html_code + '<span style="color:#FF5722;"><i class="icon-star"></i></span>';
  }

  if(decimal!=0){
    //add half star
    html_code = html_code + '<span style="color:#FF5722;"><i class="icon-star-half-empty"></i></span>';
  }

  if(mod==0){
    html_code = html_code + '<span style="color:#000000;"><b>('+text+')</b></span>';
  }else{
    html_code = html_code + '<span style="color:#000000;"><b>'+text+'</b></span>';
  }

  return html_code;
}


function getReviewRowHTML(good_review, bad_review){

  var good = String(good_review).split('@');
  var bad = String(bad_review).split('@');

  return '<td class="col-md-6"><div class="col-md-12" style="padding:0px;"><div style="font-size:15px; color:#FF5722; text-align:left;">'+ getStarsHTML(good[0],good[1],1) +'</div></div><div class="col-md-12" style="padding:0px;"><span >'+good[2]+'</span></div></td><td class="col-md-6"><div class="col-md-12" style="padding:0px;"><div style="font-size:15px; color:#FF5722; text-align:left;">'+ getStarsHTML(bad[0],bad[1],1) +'</div></div><div class="col-md-12" style="padding:0px;"><span> '+bad[2] +'</span></div></td>';

}


function postProcessingSmartphoneDetail(data) {
  var myArray = data;
  var smartphone = data[0];
  var sortedPrices=getPricesArray(smartphone);

  $('#model').text(smartphone.model);
  $('#price').text("$"+formatPrice(sortedPrices[0][0]));
  $('#best_price_vendor').text(sortedPrices[0][1]);
  $('#best_price_vendor').attr("href", sortedPrices[0][2]);

  if(sortedPrices[0][1]=="Amazon"){
    $('#stars_best').html(getStarsHTML(smartphone.amazon_rating,smartphone.amazon_reviews,0));

  }else if(sortedPrices[0][1]=="Bestbuy"){
    $('#stars_best').html(getStarsHTML(smartphone.bestbuy_rating,smartphone.bestbuy_reviews,0));

  }else if(sortedPrices[0][1]=="Newegg"){
    $('#stars_best').html(getStarsHTML(smartphone.newegg_rating,smartphone.newegg_reviews,0));

  }

  $('#vendor_list').html(getVendorsHTML(smartphone,sortedPrices));




  $('#description').text(smartphone.description);
  $('#image').attr("src", smartphone.image_url);

  $('#screen_size').text(smartphone.screen_size);
  $('#weight').text(smartphone.weight);
  $('#colors').text(smartphone.colors);
  $('#camera').text(smartphone.camera);
  $('#flash').text(smartphone.flash);

  $('#compare_detail').attr("data-id",smartphone.id);
  $('#compare_detail').attr("data-model",smartphone.model);
  $('#compare_detail').attr("data-url",smartphone.image_url);

  $('#front_face_camera').text(smartphone.front_face_camera);
  $('#processor').text(smartphone.processor);
  $('#system_memory').text(smartphone.system_memory);
  $('#builtin_storage').text(smartphone.builtin_storage);
  $('#talk_time').text(smartphone.talk_time);
  $('#video_playback').text(smartphone.video_playback);
  $('#capacity').text(smartphone.capacity);
  $('#data').text(smartphone.data);
  $('#storage_expansion').text(smartphone.storage_expansion);
  $('#android_version').text(smartphone.android_version);



  $('#review_row_one').html(getReviewRowHTML(smartphone.rev_g1,smartphone.rev_b1));
  $('#review_row_two').html(getReviewRowHTML(smartphone.rev_g2,smartphone.rev_b2));
  $('#review_row_three').html(getReviewRowHTML(smartphone.rev_g3,smartphone.rev_b3));



  $('#pro_two').text(smartphone.pro_2);
  $('#con_two').text(smartphone.con_2);
  $('#pro_three').text(smartphone.pro_3);
  $('#con_three').text(smartphone.con_3);

  $('#pro_one').text(smartphone.pro_1);
  $('#con_one').text(smartphone.con_1);
  $('#pro_two').text(smartphone.pro_2);
  $('#con_two').text(smartphone.con_2);
  $('#pro_three').text(smartphone.pro_3);
  $('#con_three').text(smartphone.con_3);

$('#compare_detail').attr('checked', false);
toggleCompareList();
$('#smartphoneModal').modal('show');

}


function getSmartphoneDetail(id){
  $.ajax({
    url: './rest/api.php?rquest=detail&id='+id+'',
    type: 'get',
    dataType: 'json',
    cache: false,
    success: postProcessingSmartphoneDetail,
    async:true,
  });
};
