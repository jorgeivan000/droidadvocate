    function loadMostRecommended(){

    var carousel_recommended = $("#carousel-recommended");


    $("#carousel-recommended").owlCarousel({
      items : 4,
      lazyLoad : true
    });


    carousel_recommended.owlCarousel();
    // Custom Navigation Events
    $(".next2").click(function(){
      carousel_recommended.trigger('owl.next');
    })
    $(".prev2").click(function(){
      carousel_recommended.trigger('owl.prev');
    })
    $(".play2").click(function(){
      carousel_recommended.trigger('owl.play',1000);
    })
    $(".stop2").click(function(){
      carousel_recommended.trigger('owl.stop');
    })

  }


  function loadBestDeals(){

    var carousel_bestdeals = $("#carousel-bestdeals");

    $("#carousel-bestdeals").owlCarousel({
      items : 4,
      lazyLoad : true
    });



    carousel_bestdeals.owlCarousel();


    // Custom Navigation Events
    $(".next").click(function(){
      carousel_bestdeals.trigger('owl.next');
    })
    $(".prev").click(function(){
      carousel_bestdeals.trigger('owl.prev');
    })
    $(".play").click(function(){
      carousel_bestdeals.trigger('owl.play',1000);
    })
    $(".stop").click(function(){
      carousel_bestdeals.trigger('owl.stop');
    })


  }





    function postProcessingMostRecommended(data) {
      var myArray = data;
      //var jsonObject = $.parseJSON(myArray);

      $.each(data, function(i, obj) {
        //alert(obj);
        //$("#item-one").attr("src", obj.image_url);
        $("#carousel-recommended").append("<div class='item' style='text-align:center; height:200px;'><img src="+obj.image_url+" class='image-carousel'></img><p style='margin-top:5px'><a class='a-green' data-id='"+obj.id+"' href='javascript:getSmartphoneDetail("+obj.id+");'>"+obj.model+"</a></p><p style='margin-top:-5px;'>$"+formatPrice(obj.amazon_price)+"</p></div>");
      });

      loadMostRecommended();


    }


    function getMostRecommended(){
      $.ajax({
        url: './rest/api.php?rquest=recommended',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessingMostRecommended,
        async:true,
      });
    };


    function postProcessingBestDeals(data) {
      var myArray = data;
      //var jsonObject = $.parseJSON(myArray);

      $.each(data, function(i, obj) {
        //alert(obj);
        //$("#item-one").attr("src", obj.image_url);
        $("#carousel-bestdeals").append("<div class='item' style='text-align:center; height:200px;'><img src="+obj.image_url+" class='image-carousel'></img><p style='margin-top:5px'><a class='a-green' data-id='"+obj.id+"' href='javascript:getSmartphoneDetail("+obj.id+");'>"+obj.model+"</a></p><p style='margin-top:-5px;'>$"+formatPrice(obj.amazon_price)+"</p></div>");
      });

      loadBestDeals();


    }


    function getBestDeals(){
      $.ajax({
        url: './rest/api.php?rquest=list',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessingBestDeals,
        async:true,
      });
    };
