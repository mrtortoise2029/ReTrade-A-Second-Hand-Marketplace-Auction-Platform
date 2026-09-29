<?php
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('session.use_strict_mode', '1');
session_name('RETRADE_SESSION');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>!empty($_SERVER['HTTPS']),'httponly'=>true,'samesite'=>'Lax']);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

try { $db = require __DIR__ . '/../config/db.php'; }
catch (Throwable $e) { respond(['ok'=>false,'message'=>'Database service is unavailable.'], 503); }

function respond(array $payload, int $status=200): never { http_response_code($status); echo json_encode($payload, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE); exit; }
function ok(mixed $data=null, string $message='Success', int $status=200): never { respond(['ok'=>true,'message'=>$message,'data'=>$data],$status); }
function fail(string $message, int $status=400, array $errors=[]): never { $body=['ok'=>false,'message'=>$message]; if($errors)$body['errors']=$errors; respond($body,$status); }
function input(): array { static $value; if(isset($value))return $value; $type=$_SERVER['CONTENT_TYPE']??''; if(str_contains($type,'application/json')){$value=json_decode(file_get_contents('php://input'),true)?:[];}else{$value=$_POST;} return $value; }
function method(): string { return strtoupper($_SERVER['REQUEST_METHOD']??'GET'); }
function user(): ?array { return $_SESSION['user']??null; }
function require_user(): array { $u=user(); if(!$u)fail('Authentication required.',401); return $u; }
function require_role(string ...$roles): array { $u=require_user(); if(!in_array($u['role'],$roles,true))fail('You do not have permission for this action.',403); return $u; }
function text_value(array $data,string $key,int $max=500,bool $required=true): ?string { $v=trim((string)($data[$key]??'')); if($required&&$v==='')fail(ucfirst(str_replace('_',' ',$key)).' is required.',422); if(mb_strlen($v)>$max)fail(ucfirst(str_replace('_',' ',$key))." must be at most $max characters.",422); return $v===''?null:$v; }
function int_value(mixed $value,string $name='ID'): int { $v=filter_var($value,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]); if($v===false)fail("Invalid $name.",422); return $v; }
function db_all(mysqli_stmt $stmt): array { $stmt->execute(); return $stmt->get_result()->fetch_all(MYSQLI_ASSOC); }
function db_one(mysqli_stmt $stmt): ?array { $stmt->execute(); return $stmt->get_result()->fetch_assoc()?:null; }
function close_ended_auctions(mysqli $db): void {
 $db->begin_transaction();
 try {
  $rows=$db->query("SELECT id,product_id,highest_bidder_id,current_price,reserve_price FROM auctions WHERE status='live' AND ends_at<=NOW() FOR UPDATE")->fetch_all(MYSQLI_ASSOC);
  foreach($rows as $a){
   $met=$a['highest_bidder_id']!==null&&($a['reserve_price']===null||(float)$a['current_price']>=(float)$a['reserve_price']);
   $stmt=$db->prepare("UPDATE auctions SET status='ended',closed_at=NOW() WHERE id=?");$stmt->bind_param('i',$a['id']);$stmt->execute();
   $status=$met?'sold':'paused';$stmt=$db->prepare('UPDATE products SET status=? WHERE id=?');$stmt->bind_param('si',$status,$a['product_id']);$stmt->execute();
  }
  $db->commit();
 }catch(Throwable $e){$db->rollback();throw $e;}
}

set_exception_handler(function(Throwable $e):never { error_log($e->__toString()); fail('An unexpected server error occurred.',500); });
