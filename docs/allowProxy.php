<?php

$domainIncludeList = [
    'http://localhost:3000',
    'https://torii2.netlify.app',
];

$allowedHost = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_HOST'];
if (!in_array($allowedHost, $domainIncludeList)) {
    $allowedHost = 'null';
}

header('Access-Control-Allow-Origin: ' . $allowedHost);
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept');
header('Access-Control-Allow-Credentials: true');

if (empty($_GET['url'])) {
    http_response_code(412);
    echo "<h1>Precondition Faield<h1><p>URL request parameter required.</p>";
    exit();
}

$context = stream_context_create(['http' => ['ignore_errors' => true]]);
$result = file_get_contents($_GET['url'], false, $context);

foreach ($http_response_header as $header) {
    header($header);
}

echo $result;
