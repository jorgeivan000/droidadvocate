
    var results;
    var page;
    var order;
    var vendor='';
    var brand='';
    var ssize='';


    function getResultsHTML(smartphones){
      var html_code="";

      $.each(smartphones, function(i, smartphone) {

        if(vendor=='amazon'){
          html_code=html_code+'<div><div class="col-md-2" style="text-align:center;"><img src="'+smartphone.image_url+'" width="95px" height="155px"></img></div><div class="col-md-7" style="margin-top:25px;"><a class="a-green" style="font-size:22px;" data-id="'+smartphone.id+'" href="javascript:getSmartphoneDetail('+smartphone.id+');" >'+smartphone.model+'</a><p style="margin-top:15px; font-size:18px; color:#727272;">'+smartphone.description+'</p></div><div class="col-md-3" style="text-align:right;"><p><span>From: <a class="a-green" target="_blank" href="'+smartphone.amazon_url+'">Amazon</a></span></p><p><span style="font-size:30px; color:#FF5722;" >$'+formatPrice(smartphone.amazon_price)+'</span></p><p><span>Free Shipping</span></p><div style="font-size:15px; color:#FF5722;">'+getStarsHTML(smartphone.amazon_rating, smartphone.amazon_reviews,0)+'</div><div class="checkbox"><label><input class="checkbox-compare" type="checkbox" data-id="'+smartphone.id+'" data-model="'+smartphone.model+'"  data-url="'+smartphone.image_url+'" >Compare</label></p></div></div><hr width="100%"></div>';

        }else if(vendor=='bestbuy'){
          html_code=html_code+'<div><div class="col-md-2" style="text-align:center;"><img src="'+smartphone.image_url+'" width="95px" height="155px"></img></div><div class="col-md-7" style="margin-top:25px;"><a class="a-green" style="font-size:22px;" data-id="'+smartphone.id+'" href="javascript:getSmartphoneDetail('+smartphone.id+');" >'+smartphone.model+'</a><p style="margin-top:15px; font-size:18px; color:#727272;">'+smartphone.description+'</p></div><div class="col-md-3" style="text-align:right;"><p><span>From: <a class="a-green" target="_blank" href="'+smartphone.bestbuy_url+'">Bestbuy</a></span></p><p><span style="font-size:30px; color:#FF5722;" >$'+formatPrice(smartphone.bestbuy_price)+'</span></p><p><span>Free Shipping</span></p><div style="font-size:15px; color:#FF5722;">'+getStarsHTML(smartphone.bestbuy_rating, smartphone.bestbuy_reviews,0)+'</div><div class="checkbox"><label><input class="checkbox-compare" type="checkbox" data-id="'+smartphone.id+'" data-model="'+smartphone.model+'"  data-url="'+smartphone.image_url+'" >Compare</label></p></div></div><hr width="100%"></div>';

        }else if(vendor=='newegg'){
          html_code=html_code+'<div><div class="col-md-2" style="text-align:center;"><img src="'+smartphone.image_url+'" width="95px" height="155px"></img></div><div class="col-md-7" style="margin-top:25px;"><a class="a-green" style="font-size:22px;" data-id="'+smartphone.id+'" href="javascript:getSmartphoneDetail('+smartphone.id+');" >'+smartphone.model+'</a><p style="margin-top:15px; font-size:18px; color:#727272;">'+smartphone.description+'</p></div><div class="col-md-3" style="text-align:right;"><p><span>From: <a class="a-green" target="_blank" href="'+smartphone.newegg_url+'">Newegg</a></span></p><p><span style="font-size:30px; color:#FF5722;" >$'+formatPrice(smartphone.newegg_price)+'</span></p><p><span>Free Shipping</span></p><div style="font-size:15px; color:#FF5722;">'+getStarsHTML(smartphone.newegg_rating, smartphone.newegg_reviews,0)+'</div><div class="checkbox"><label><input class="checkbox-compare" type="checkbox" data-id="'+smartphone.id+'" data-model="'+smartphone.model+'"  data-url="'+smartphone.image_url+'" >Compare</label></p></div></div><hr width="100%"></div>';

        }else{
          var sortedArray=getPricesArray(smartphone);
          html_code=html_code+'<div><div class="col-md-2" style="text-align:center;"><img src="'+smartphone.image_url+'" width="95px" height="155px"></img></div><div class="col-md-7" style="margin-top:25px;"><a class="a-green" style="font-size:22px;" data-id="'+smartphone.id+'" href="javascript:getSmartphoneDetail('+smartphone.id+');" >'+smartphone.model+'</a><p style="margin-top:15px; font-size:18px; color:#727272;">'+smartphone.description+'</p></div><div class="col-md-3" style="text-align:right;"><p><span>From: <a class="a-green" target="_blank" href="'+sortedArray[0][2]+'">'+sortedArray[0][1]+'</a></span></p><p><span style="font-size:30px; color:#FF5722;" >$'+formatPrice(sortedArray[0][0])+'</span></p><p><span>Free Shipping</span></p><div style="font-size:15px; color:#FF5722;">'+getStarsHTML(sortedArray[0][3], sortedArray[0][4],0)+'</div><div class="checkbox"><label><input class="checkbox-compare" type="checkbox" data-id="'+smartphone.id+'" data-model="'+smartphone.model+'"  data-url="'+smartphone.image_url+'" >Compare</label></p></div></div><hr width="100%"></div>';

        }

      });
      return html_code;

    }



    function postProcessingSearch(data) {
        //loadPagination(data);
        if(typeof data !== 'undefined'){
        loadPagination(data);
        $('#results').html(getResultsHTML(data));
        //var id = $(this).attr('data-id');
        //var model = $(this).attr('data-model');
        //var url = $(this).attr('data-url');


  }else{
    $("#results").html('There are no results available');
  }
        //alert(data[0]);

    }

    function postProcessingSearchCount(data) {
      //alert(data.rows);
      loadPagination(data);


      //addToCart(productId);
        //alert(data[0]);

    }

    function loadPagination(data){


      results = data;
      var results_per_page = 3;
      var pages = String(results.rows / results_per_page);
      var pageDivided = pages.split(".");
      var currentPage = page;

      if(pageDivided[1]==0){
        pages = Number(pageDivided[0]);
      }else{
        pages = Number(pageDivided[0])+1;
      }

      //alert(pages);

      $('#result_pages').html(' ');



      for(var i=0; i< pages; i++){
        if(i==currentPage){
        $('#result_pages').append('<a class="a-green a-pagination" style="margin-right:3px; font-size:16px; text-decoration: underline;" data-page="'+i+'" href="./">'+i+'</a>');
        }else{
        $('#result_pages').append('<a class="a-green a-pagination" style="margin-right:3px; font-size:16px;" data-page="'+i+'" href="./">'+i+'</a>');
      }
      }

      $(".a-pagination").click(function(event) {
        event.preventDefault();
        page = $(this).attr('data-page');
        search();
    });





    $('#last-pag').attr('data-page',(Number(pages)-1));


    if(currentPage=='0'){
      $('#prev-pag').attr('data-page',0);
      if(currentPage==(Number(pages)-1)){
        $('#next-pag').attr('data-page',currentPage);
      }else{
      $('#next-pag').attr('data-page',Number(currentPage)+1);
    }

    }else if(currentPage==(Number(pages)-1)){

      $('#prev-pag').attr('data-page',Number(currentPage)-1);
      $('#next-pag').attr('data-page',currentPage);
    }else{

      $('#prev-pag').attr('data-page',Number(currentPage)-1);
      $('#next-pag').attr('data-page',Number(currentPage)+1);
    }




    }

    function search(){
      var keywords=$("#search_box").val();
      var budget_start=$("#budget_start").val();
      var budget_end=$("#budget_end").val();
      var facet=$("#facet_query").val();

      var api_search = './rest/api.php?rquest=search&key='+keywords+"&fct="+facet;

      if(budget_start!=''){
        api_search= api_search+"&bs="+budget_start;
      }
      if(budget_end!=''){
        api_search= api_search+"&be="+budget_end;
      }


      if(page!=''){
        api_search= api_search+"&pg="+page;
      }else{
        api_search= api_search+"&pg=0";
      }

      if(order!=''){
        api_search= api_search+"&ord="+order;
      }

      if(brand!=''){
        api_search= api_search+"&bnd="+brand;
      }

      if(ssize!=''){
        api_search= api_search+"&sz="+ssize;
      }
      //alert(api_search);
      $.ajax({
        url: api_search,
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessingSearch,
        async:true,
      });


      var api_search_count = './rest/api.php?rquest=scount&key='+keywords+"&fct="+facet;
      $.ajax({
        url: api_search_count,
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessingSearchCount,
        async:true,
      });
    }





    function loadInputParameters(){
      var keywords = getUrlParameter('key');
      var facet = getUrlParameter('fct');
      $("#facet_query").val(facet);

      $("#search_box").val(keywords);
      $("#search_button").click();
    }
