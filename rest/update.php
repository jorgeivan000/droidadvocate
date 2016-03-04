<?php

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



	public function updatePrices(){

		$result = mysql_query("SELECT * FROM smartphones");

		while ($row = mysql_fetch_assoc($result)) {

			$url = $row["amazon_url"];
			if(!empty($url)){
				$output = file_get_contents($url);
				libxml_use_internal_errors(true);
				$DOM = new DOMDocument;
				$DOM->loadHTML($output);
				$price = $DOM->getElementById('priceblock_ourprice');
				if($price->nodeValue == NULL){
					$price = $DOM->getElementById('priceblock_dealprice');
					if($price->nodeValue == NULL){
						$price = $DOM->getElementById('priceblock_saleprice');
					}
				}

				$formattedPrice = substr($price->nodeValue, 1);

				print_r($formattedPrice);

				$sql = mysql_query("UPDATE smartphones SET amazon_price='".$formattedPrice."' WHERE id=".$row["id"]."");
				//print_r($sql);
				if ($sql == 1){
					print_r ("Record updated successfully");
				} else {
					print_r("Error updating record: " . $conn->error);
				}
			}






			//Update Bestbuy Price
			$url = $row["bestbuy_url"];
			if(!empty($url)){

				$context = stream_context_create(array("http" => array("header" => "User-Agent: Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36")));
				$output = file_get_contents($url,false,$context);
				//print_r($output);
				libxml_use_internal_errors(true);
				$DOM = new DOMDocument;
				$DOM->loadHTML($output);
				$xpath = new DomXPath($DOM);
				//$span = $xpath->query('//*[@id="priceblock-wrapper-wrapper"]/div[1]/div[2]/div[2]/span')->item(0);
				$prices = $xpath->query('//*[@id="priceblock-wrapper-wrapper"]/div[1]/div[2]/div[2]');
				if($prices->length == 0){
					$prices = $xpath->query('//*[@id="priceblock-wrapper-wrapper"]/div[1]/div[1]/div[2]');

				}
				$price = "";
				foreach($prices as $node) {
					$price = $price . $node->nodeValue;

				}
				$formattedPrice = substr($price, 2);

				$sql = mysql_query("UPDATE smartphones SET bestbuy_price=".$formattedPrice." WHERE id=".$row["id"]."");
				//print_r($sql);
				if ($sql == 1){
					print_r ("Record updated successfully");
				} else {
					print_r("Error updating record: " . $conn->error);
				}

			}


			//Update Newegg Price
			$url = $row["newegg_url"];
			if(!empty($url)){
				$output = file_get_contents($url);
				//print_r($output);
				libxml_use_internal_errors(true);
				$DOM = new DOMDocument;
				$DOM->loadHTML($output);
				$xpath = new DomXPath($DOM);

				$prices = $xpath->query('//*[@id="CombineBoxContent"]/div[1]/div/div[2]/div[2]/ul/li[3]/strong');
				print_r($prices);
				$price = "";
				//print_r($output);
				foreach($prices as $node) {
					$price = $price . $node->nodeValue;
					print_r($node->nodeValue);
				}
				print_r($price);
				$formattedPrice = substr($price, 2);

				$sql = mysql_query("UPDATE smartphones SET newegg_price=".$formattedPrice." WHERE id=".$row["id"]."");

				if ($sql == 1){
					print_r ("Record updated successfully");
				}else {
					print_r("Error updating record: " . $conn->error);
				}

			}


		}


	}

	private function getInnerHTML($Node) {
		$Body = $Node->ownerDocument->documentElement->firstChild->firstChild;
		$Document = new DOMDocument();
		$Document->appendChild($Document->importNode($Body,true));
		return $Document->saveHTML();
	}

	private function json($data){
		if(is_array($data)){
			return json_encode($data);
		}
	}


?>
