<?php
require_once "utils.php";

function generateRandomToken() {
    $bytes = random_bytes(20);
    return bin2hex($bytes);
}


error_reporting(E_ERROR);

session_start();
cors();
require_once "dbconnection.php";

try{
    $user = $_GET["email"];
    $password = hash("sha256", $_GET["password"]);

    $stmt = $pdo->prepare('SELECT * from users WHERE username = :user AND password = :password');
    $stmt->bindParam(':user', $user);
    $stmt->bindParam(':password', $password);
    $stmt->execute();
    if ($stmt->rowCount() == 0) {
        $res = ["status" => "failed", "error" => "Login failed"];
    } else {
        $user_db = $stmt->fetch();
        $uid = $user_db["id"];
        $token = generateRandomToken();
        $stmt = $pdo->prepare("UPDATE users SET token = '$token' WHERE id = :uid");
        $stmt->bindParam(":uid", $uid);
        $stmt->execute();
        $res = [
            "status" => "success",
            "name" => $user_db["firstname"] . " " . $user_db["lastname"],
            "username" => $user_db["username"],
            "token" => $token
        ];
        $_SESSION["name"] = $user_db["firstname"] . " " . $user_db["lastname"];
        $_SESSION["userid"] = $user_db["id"];
    }

    http_response_code(200);
    echo json_encode($res);
} catch(PDOException $e) {
    http_response_code(500);
    $res = ["status" => "failed", "error" => $e->getMessage()];
    echo json_encode($res);
}

$pdo = null;