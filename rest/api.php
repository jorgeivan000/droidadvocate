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

		if($_REQUEST['rquest']=="list"){
			$this->getBestDeals();
		}else if($_REQUEST['rquest']=="detail"){
			$this->getSmartphoneDetail();
		}else if($_REQUEST['rquest']=="recommended"){
			$this->getMostRecommended();
		}else if($_REQUEST['rquest']=="search"){
			$this->search();
		}else if($_REQUEST['rquest']=="scount"){
			$this->searchCount();
		}






	}

	private function getBestDeals(){
		// Cross validation if the request method is GET else it will return "Not Acceptable" status

		//$sql = mysql_query("SELECT id, model, best_price FROM smartphones WHERE user_status = 0", $this->db);
		$sql = mysql_query("SELECT id, model, description, image_url, amazon_price, bestbuy_price, newegg_price, amazon_url, bestbuy_url, newegg_url, amazon_rating, bestbuy_rating, newegg_rating, amazon_reviews, bestbuy_reviews, newegg_reviews, LEAST(amazon_price, bestbuy_price, newegg_price) AS lowest_price FROM smartphones WHERE amazon_reviews > 50 HAVING lowest_price !=0 ORDER BY lowest_price LIMIT 0,6", $this->db);

		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($rlt = mysql_fetch_array($sql,MYSQL_ASSOC)){
				$result[] = $rlt;
			}
			// If success everythig is good send header as "OK" and return list of users in JSON format
			$this->response($this->json($result), 200);
		}
		$this->response('',204);	// If no records "No Content" status
	}


	private function getMostRecommended(){
		// Cross validation if the request method is GET else it will return "Not Acceptable" status

		//$sql = mysql_query("SELECT id, model, best_price FROM smartphones WHERE user_status = 0", $this->db);
		$sql = mysql_query("SELECT id, model, image_url, amazon_price, bestbuy_price, newegg_price, amazon_url, bestbuy_url, newegg_url FROM smartphones WHERE amazon_reviews > 50 ORDER BY amazon_rating DESC LIMIT 0,6", $this->db);
		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($rlt = mysql_fetch_array($sql,MYSQL_ASSOC)){
				$result[] = $rlt;
			}
			// If success everythig is good send header as "OK" and return list of users in JSON format
			$this->response($this->json($result), 200);
		}
		$this->response('',204);	// If no records "No Content" status
	}




private function searchCount(){

			$keyword = $_REQUEST['key'];
			$budget_start = $_REQUEST['bs'];
			$budget_end = $_REQUEST['be'];
			$order = $_REQUEST['ord'];
			$brand = $_REQUEST['bnd'];
			$fct = $_REQUEST['fct'];
			$pg = $_REQUEST['pg'];
			$size = $_REQUEST['sz'];


			$sql = "SELECT id, model, description, image_url, amazon_price, bestbuy_price, newegg_price, amazon_url, bestbuy_url, newegg_url, amazon_rating, bestbuy_rating, newegg_rating, amazon_reviews, bestbuy_reviews, newegg_reviews, LEAST(amazon_price, bestbuy_price, newegg_price) AS lowest_price FROM smartphones WHERE model LIKE '%$keyword%' ";

			if(!is_null($brand)){
				$sql .= " AND brand LIKE '%$brand%' ";
			}

			if(!is_null($size)){
				if($size=="big"){
					$sql .= " AND screen_size > 5.51";
				}else if($size=="mid"){
					$sql .= " AND screen_size > 4.51 AND screen_size < 5.51";
				}else if($size=="sml"){
					$sql .= " AND screen_size < 4.51";
				}
			}

			if(!is_null($fct)){
				if($fct == 'bd'){
					$order = 'plh';
					$sql .= "AND amazon_reviews > 50";
				}else if($fct == 'ph'){
				$sql .= " AND screen_size > 5.4";
			}else if($fct == 'cp'){
				$sql .= " AND screen_size < 5.1";
			}else if($fct == 'mr'){
				$order = 'rv';
				$sql .= "AND amazon_reviews > 50";
			}else if($fct == 're'){
				$sql .= "AND amazon_rating > 3.5";
			}
		}

			$sql .= " HAVING lowest_price > 0";





			if(!is_null($budget_start)){
				$sql .= " AND lowest_price > $budget_start";
			}
			if(!is_null($budget_end)){
				$sql .= " AND lowest_price < $budget_end";

			}

			//Best Deals - least price order by DESC
			//High End - least price less than 200 usd
			//Affordable - least price less than 200 usd
			//Recommended - order by amazon_rating ASC
			//phablets - screen size > 5.0
			//compact - screen size <5.0
			//most reviewed - order by amazon_rating ASC

			if($fct == 'he'){
				$sql .= " AND lowest_price > 400";
			}else if($fct == 'af'){
				$sql .= " AND lowest_price < 250";
			}else if($fct == 're'){
				$sql .= " AND lowest_price < 300";
			}


			if($order == 'phl'){
				$sql .= " ORDER BY lowest_price DESC";
			}else if($order == 'plh'){
				$sql .= " ORDER BY lowest_price ASC";
			}else if ($order == 'rv'){
				$sql .= " ORDER BY amazon_rating DESC";
			}

			if(!is_null($pg)){
				$ITEMS_PER_PAGE = 3;
				$limit = $ITEMS_PER_PAGE*$pg;
				$sql .= " LIMIT $limit,$ITEMS_PER_PAGE;";
			}





	//echo $sql;


	$sql_query = mysql_query($sql, $this->db);
	$result = array();
	$result=array("rows"=>mysql_num_rows($sql_query));

	// If success everythig is good send header as "OK" and return list of users in JSON format
	$this->response($this->json($result), 200);
	//$this->response('',204);	// If no records "No Content" status


}



private function testMessage($message){
	$array=array("Message"=>$message);
	$this->response($this->json($array), 200);
}



	private function search(){
		// Cross validation if the request method is GET else it will return "Not Acceptable" status
		//search&key='+keyword

		$keyword = $_REQUEST['key'];
		$budget_start = $_REQUEST['bs'];
		$budget_end = $_REQUEST['be'];
		$order = $_REQUEST['ord'];
		$brand = $_REQUEST['bnd'];
		$fct = $_REQUEST['fct'];
		$pg = $_REQUEST['pg'];
		$size = $_REQUEST['sz'];


		$sql = "SELECT id, model, description, image_url, amazon_price, bestbuy_price, newegg_price, amazon_url, bestbuy_url, newegg_url, amazon_rating, bestbuy_rating, newegg_rating, amazon_reviews, bestbuy_reviews, newegg_reviews, LEAST(amazon_price, bestbuy_price, newegg_price) AS lowest_price FROM smartphones WHERE model LIKE '%$keyword%' ";

		if(!is_null($brand)){
			$sql .= " AND brand LIKE '%$brand%' ";
		}

		if(!is_null($size)){
			if($size=="big"){
				$sql .= " AND screen_size > 5.51";
			}else if($size=="mid"){
				$sql .= " AND screen_size > 4.51 AND screen_size < 5.51";
			}else if($size=="sml"){
				$sql .= " AND screen_size < 4.51";
			}
		}

		if(!is_null($fct)){
			if($fct == 'bd'){
				$order = 'plh';
				$sql .= "AND amazon_reviews > 50";
			}else if($fct == 'ph'){
			$sql .= " AND screen_size > 5.4";
		}else if($fct == 'cp'){
			$sql .= " AND screen_size < 5.1";
		}else if($fct == 'mr'){
			$order = 'rv';
			$sql .= "AND amazon_reviews > 50";
		}else if($fct == 're'){
			$sql .= "AND amazon_rating > 3.5";
		}
	}



		$sql .= " HAVING lowest_price > 0";





		if(!is_null($budget_start)){
			$sql .= " AND lowest_price > $budget_start";
		}
		if(!is_null($budget_end)){
			$sql .= " AND lowest_price < $budget_end";

		}

		//Best Deals - least price order by DESC
		//High End - least price less than 200 usd
		//Affordable - least price less than 200 usd
		//Recommended - order by amazon_rating ASC
		//phablets - screen size > 5.0
		//compact - screen size <5.0
		//most reviewed - order by amazon_rating ASC

		if($fct == 'he'){
			$sql .= " AND lowest_price > 400";
		}else if($fct == 'af'){
			$sql .= " AND lowest_price < 250";
		}else if($fct == 're'){
			$sql .= " AND lowest_price < 300";
		}


		if($order == 'phl'){
			$sql .= " ORDER BY lowest_price DESC";
		}else if($order == 'plh'){
			$sql .= " ORDER BY lowest_price ASC";
		}else if ($order == 'rv'){
			$sql .= " ORDER BY amazon_rating DESC";

		}

		if(!is_null($pg)){
			$ITEMS_PER_PAGE = 3;
			$limit = $ITEMS_PER_PAGE*$pg;
			$sql .= " LIMIT $limit,$ITEMS_PER_PAGE;";
		}


		//$array=array("Message"=>$sql);
		//$this->response($this->json($array), 200);



		$sql_query = mysql_query($sql, $this->db);
		if(mysql_num_rows($sql_query) > 0){
			$result = array();
			while($rlt = mysql_fetch_array($sql_query,MYSQL_ASSOC)){
				$result[] = $rlt;
			}
			// If success everythig is good send header as "OK" and return list of users in JSON format
			$this->response($this->json($result), 200);
		}
		$this->response('',204);	// If no records "No Content" status


	}






	private function getSmartphoneDetail(){
		// Cross validation if the request method is GET else it will return "Not Acceptable" status

		//$sql = mysql_query("SELECT id, model, best_price FROM smartphones WHERE user_status = 0", $this->db);
		$id=$_GET['id'];
		$sql = mysql_query("SELECT id, model, description, brand, release_date, image_url, storage, amazon_price, bestbuy_price, newegg_price,amazon_rating, bestbuy_rating, newegg_rating, amazon_url, bestbuy_url, newegg_url, amazon_reviews, bestbuy_reviews, newegg_reviews, pro_1, pro_2, pro_3, con_1, con_2, con_3, rev_g1, rev_g2, rev_g3, rev_b1, rev_b2, rev_b3, screen_size, weight, color, camera, flash, front_face_camera, processor, system_memory, storage, talk_time, video_playback, battery, data, storage_expansion, android_version  FROM smartphones WHERE id = $id", $this->db);

		if(mysql_num_rows($sql) > 0){
			$result = array();
			while($rlt = mysql_fetch_array($sql,MYSQL_ASSOC)){
				$result[] = $rlt;
			}
			// If success everythig is good send header as "OK" and return list of users in JSON format
			$this->response($this->json($result), 200);
		}
		$this->response('',204);	// If no records "No Content" status
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
