<?php
require_once "utils.php";
require_once "dbconnection.php";
error_reporting(E_ERROR | E_PARSE);

session_start();

//isLoggedIn();
cors();

$token = $_GET["token"];

if (isset($_GET["datetime"])) {
    $date = new DateTime($_GET["datetime"]);
    $date2 = new DateTime($_GET["datetime"]);
    $date->setTime(0,0,0);
    $date2->setTime(23, 59, 59);
} else {
    $date = new DateTime('@0');
    $date2 = new DateTime();
}

$datetime1 = $date->format("Y-m-d H:i:s");
$datetime2 = $date2->format("Y-m-d H:i:s");

$query = "SELECT * 
        FROM lectures, users 
        WHERE date >= :date1 AND date <= :date2
        AND lectures.user_id = users.id 
        AND token = :tk ORDER BY date";
$stmt = $pdo->prepare($query);
$userid = $_SESSION["userid"];
$stmt->bindParam(":tk", $token);
$stmt->bindParam(":date1", $datetime1);
$stmt->bindParam(":date2", $datetime2);

$stmt->execute();

if ($stmt->rowCount() == 0) {
    echo json_encode([]);
    exit();
}

$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
$output = array();
foreach ($res as $lec) {
    $date_tmp = new DateTime($lec["date"]);
    $obj = [
        "date" => $date_tmp->format("m/d/Y"),
        "duration" => $lec["duration"],
        "title" => $lec["title"],
        "summary" => $lec["summary"],
        "emotions" => [
            "Happiness" => intval($lec["happiness"]),
            "Boredom" => intval($lec["boredom"]),
            "Anger" => intval($lec["anger"]),
            "anxiety" => intval($lec["anxiety"]),
            "sadness" => intval($lec["sadness"]),
            "boredom" => intval($lec["boredom"])
        ],
        "total" => intval($lec["total"])
    ];
    array_push($output, $obj);
}
echo json_encode($output);


