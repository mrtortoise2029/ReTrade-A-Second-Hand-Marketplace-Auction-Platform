<?php
declare(strict_types=1);

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$host = getenv('RETRADE_DB_HOST') ?: 'localhost';
$port = (int) (getenv('RETRADE_DB_PORT') ?: 3306);
$dbName = getenv('RETRADE_DB_NAME') ?: 'retrade_db';
$dbUser = getenv('RETRADE_DB_USER') ?: 'root';
$dbPass = getenv('RETRADE_DB_PASS') ?: '';

try {
    $conn = new mysqli($host, $dbUser, $dbPass, $dbName, $port);
    $conn->set_charset('utf8mb4');
    $conn->query("SET time_zone = '+06:00'");
    return $conn;
} catch (mysqli_sql_exception $exception) {
    error_log('ReTrade database connection failed: ' . $exception->getMessage());
    throw new RuntimeException('Database service is unavailable.');
}
