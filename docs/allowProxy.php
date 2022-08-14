<?php

$domainIncludeList = [
    'http://localhost:3000',
    'https://torii2.netlify.app',
];

$allowedHost = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_HOST'];
if (!in_array($allowedHost, $domainIncludeList)) {
    http_response_code(401);
    echo "<h1>Unauthorized<h1><p>Request host isn't in include list.</p>";
    exit();
}

header('Access-Control-Allow-Origin: ' . $allowedHost);
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: User-Agent, Authorization, Origin, Content-Type, Accept');
header('Access-Control-Expose-Headers: *');
header('Access-Control-Allow-Credentials: true');
header('Vary: Origin');

if (empty($_GET['url'])) {
    http_response_code(412);
    echo "<h1>Precondition Failed<h1><p>URL request parameter required.</p>";
    exit();
}

$context = stream_context_create(['http' => ['ignore_errors' => true]]);
$result = file_get_contents($_GET['url'], false, $context);

foreach ($http_response_header as $header) {
    if (preg_match('(^(Vary|Access-))i', $header)) {
        continue;
    }

    header($header);
}

echo $result;
