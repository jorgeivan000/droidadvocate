<?php

require_once("Rest.inc.php");

class API extends REST {

	public $data = "";

	const DB_SERVER = "localhost";
	const DB_USER = "root";
	const DB_PASSWORD = "123";
	const DB = "droidadvocate";

	private $db = NULL;

	public function __construct(){
		parent::__construct();				// Init parent contructor
		$this->dbConnect();					// Initiate Database connection
	}

	/*
	*  Database connection
	*/
	private function dbConnect(){
		$this->db = mysql_connect(self::DB_SERVER,self::DB_USER,self::DB_PASSWORD);
		if($this->db)
		mysql_select_db(self::DB,$this->db);
	}

	/*
	* Public method for access api.
	* This method dynmically call the method based on the query string
	*
	*/
	public function processApi(){


		if($_REQUEST['rquest']=="update"){
			$this->updatePrices();
		}

	}


	public function updatePrices(){

		$result = mysql_query("SELECT * FROM smartphones");

		while ($row = mysql_fetch_assoc($result)) {


			//Update Bestbuy Price
			$a_url = $row["amazon_url"];
			$a_price =  0;
			$a_rating = 0;
			$a_reviews = 0;
			if(!empty($a_url)){
			$output = file_get_contents($a_url);
			libxml_use_internal_errors(true);
			$DOM = new DOMDocument;
			$DOM->loadHTML($output);
			$xpath = new DomXPath($DOM);
			$a_price =  $this->getAmazonPrice($DOM);
			$a_rating = $this->getAmazonRating($xpath);
			$a_reviews = $this->getAmazonReviews($DOM);
			}

			//Update Bestbuy Price
			$b_url = $row["bestbuy_url"];
			$b_price = 0;
			$b_rating = 0;
			$b_reviews = 0;
			if(!empty($b_url)){
			libxml_use_internal_errors(true);
			$context = stream_context_create(array("http" => array("header" => "User-Agent: Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")));
			print_r($row["model"]);
			$output = file_get_contents($b_url,false,$context);
			//print_r($output);
			$DOM = new DOMDocument;
			$DOM->loadHTML($output);
			$xpath = new DomXPath($DOM);

			$b_price = $this->getBestBuyPrice($xpath);
			$b_rating = $this->getBestBuyRatings($xpath);
			$b_reviews = $this->getBestBuyReviews($xpath);
			}

			//Update Newegg Price
			$n_url = $row["newegg_url"];
			$n_price = 0;
			$n_rating = 0;
			$n_reviews = 0;
			if(!empty($n_url)){
			$output = file_get_contents($n_url);
			$n_price = $this->getNeweggPrice($output);
			$n_rating = $this->getNeweggRating($output);
			$n_reviews = $this->getNeweggReviews($output);
			}

			$sql = mysql_query("UPDATE smartphones SET amazon_price='".$a_price."',amazon_rating='".$a_rating."',amazon_reviews='".$a_reviews."', bestbuy_price=".$b_price.",bestbuy_rating=".$b_rating.",bestbuy_reviews=".$b_reviews.", newegg_price=".$n_price.",newegg_rating=".$n_rating.",newegg_reviews=".$n_reviews." WHERE id=".$row["id"]."");
			//print_r("UPDATE smartphones SET amazon_price='".$a_price."',amazon_rating='".$a_rating."',amazon_reviews='".$a_reviews."', bestbuy_price=".$b_price.",bestbuy_rating=".$b_rating.",bestbuy_reviews=".$b_reviews.", newegg_price=".$n_price.",newegg_rating=".$n_rating.",newegg_reviews=".$n_reviews." WHERE id=".$row["id"]."");


			if ($sql == 1){
				print_r ($row["model"] ." prices updated successfully");
			} else {
				print_r($row["model"] . " error updating record: " . $conn->error);
			}

}


}


function getAmazonPrice($DOM){
	$price = $DOM->getElementById('priceblock_ourprice');
	if($price->nodeValue == NULL){
		$price = $DOM->getElementById('priceblock_dealprice');
		if($price->nodeValue == NULL){
			$price = $DOM->getElementById('priceblock_saleprice');
		}
	}
	return substr($price->nodeValue, 1);
}

function getAmazonRating($xpath){

	$stars = $xpath->query('	//*[@id="acrPopover"]/span[1]/a/i[1]/span');

	$star_string = $this->extractValue($stars);

	$a_rating = substr($star_string, 0, 3);
	if (strpos($a_rating, '.') === false) {
		$a_rating = substr($star_string, 0, 1);
	}

	return $a_rating;
}

function getAmazonReviews($DOM){
	$reviews = $DOM->getElementById('acrCustomerReviewText');
	return preg_replace("/[^0-9,.]/", "", $reviews->nodeValue);

}

function getBestBuyPrice($xpath){
	$prices = $xpath->query('//*[@id="priceblock-wrapper-wrapper"]/div[1]/div[2]/div[2]');
	if($prices->length == 0){
		$prices = $xpath->query('//*[@id="priceblock-wrapper-wrapper"]/div[1]/div[1]/div[2]');
	}
	$price = $this->extractValue($prices);
	return substr($price, 2);
}

function getBestBuyRatings($xpath){
	$ratings = $xpath->query('//*[@id="sku-model"]/ul/li[3]/a/span');
	$b_rating = $this->extractValue($ratings);
	$b_rating = $this->setDefaultValueIfUndefined($b_rating);
	return $b_rating;
}

function getBestBuyReviews($xpath){
	$reviews = $xpath->query('//*[@id="sku-model"]/ul/li[3]/span[2]/a');
	$b_reviews = $this->extractValue($reviews);
	$b_reviews = $this->setDefaultValueIfUndefined(preg_replace("/[^0-9,.]/", "", $b_reviews));
	return $b_reviews;
}


function getNeweggPrice($source){
	$unformattedPrice = strpos($source, 'product_sale_price');
	$formattedPrice= substr($source, $unformattedPrice+21, 6);
	return $formattedPrice;
}

function getNeweggRating($source){
	$unformattedRating = strpos($source, 'ratingValue');
	$rating= $this->setDefaultValueIfUndefined(substr($source, $unformattedRating+22, 1));
	return $rating;
}

function getNeweggReviews($source){
	$puss = strpos($source, 'reviewCount');
	$review= substr($source, $puss+13, 6);
	$review_end = strpos($review, '<');
	$final= substr($review, 0, ($review_end));
	$final = $this->setDefaultValueIfUndefined($final);
	return $final;
}


function extractValue($node_list){
	$value_string = "";
	foreach($node_list as $node) {
		$value_string  = $value_string  . $node->nodeValue;

	}
	return $value_string;
}


function setDefaultValueIfUndefined($number_string){
	if(!is_numeric($number_string) || is_null($number_string) || empty($number_string)){
		return 0;
	}else{
		return $number_string;
	}
}



/*
*	Encode array into JSON
*/
private function json($data){
	if(is_array($data)){
		return json_encode($data);
	}
}
}

// Initiiate Library

$api = new API;
$api->processApi();


?>
