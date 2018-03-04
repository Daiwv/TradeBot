<?php

/**
 * Full wrapper for all methods documented at https://poloniex.com/support/api/
 * All command names are the same as in the API documentation except for returnTradeHistory as it exists in both the public and trading APIs..
 */

class Poloniex {

	protected $apiKey;
	protected $apiSecret;

	protected $publicUrl = "https://poloniex.com/public";
	protected $tradingApiUrl = "https://poloniex.com/tradingApi";

	public function __construct($apiKey = null, $apiSecret = null) {
		$this->apiKey = $apiKey;
		$this->apiSecret = $apiSecret;
	}

	protected function callPublic($call) {
		$uri = $this->publicUrl.'?'.http_build_query($call);
		return json_decode(file_get_contents($uri), true);
	}

	private function callTrading(array $req = array()) {
		// API settings
		$key = $this->apiKey;
		$secret = $this->apiSecret;

		// generate a nonce to avoid problems with 32bit systems
		$mt = explode(' ', microtime());
		$req['nonce'] = $mt[1].substr($mt[0], 2, 6);

		// generate the POST data string
		$post_data = http_build_query($req, '', '&');
		$sign = hash_hmac('sha512', $post_data, $secret);

		// generate the extra headers
		$headers = array(
			'Key: '.$key,
			'Sign: '.$sign,
		);

		// curl handle (initialize if required)
		static $ch = null;
	