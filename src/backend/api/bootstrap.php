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
function private_upload_dir(): string { $dir=dirname(__DIR__).'/private_uploads';if(!is_dir($dir)&&!mkdir($dir,0750,true))fail('Private upload storage is unavailable.',500);return $dir; }
function store_private_pdf(array $file,string $prefix='document'): string {
 if(($file['error']??UPLOAD_ERR_NO_FILE)!==UPLOAD_ERR_OK)fail('A valid PDF file is required.',422);
 $size=(int)($file['size']??0);if($size<1||$size>5*1024*1024)fail('Each PDF must be 5MB or smaller.',422);
 $tmp=(string)($file['tmp_name']??'');$mime=$tmp!==''?(new finfo(FILEINFO_MIME_TYPE))->file($tmp):'';if($mime!=='application/pdf')fail('Only PDF files are allowed.',422);
 $safePrefix=preg_replace('/[^a-z0-9-]+/i','-',trim($prefix))?:'document';$name=$safePrefix.'-'.bin2hex(random_bytes(16)).'.pdf';if(!move_uploaded_file($tmp,private_upload_dir().'/'.$name))fail('Could not securely store the PDF.',500);return $name;
}
function private_pdf_path(string $stored): ?string { $name=basename($stored);$path=private_upload_dir().'/'.$name;return is_file($path)?$path:null; }
function notify_user(mysqli $db,int $userId,string $type,string $title,string $message,array $data=[]): void {
 $json=$data?json_encode($data,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE):null;
 $stmt=$db->prepare('INSERT INTO notifications(user_id,type,title,message,data) VALUES(?,?,?,?,?)');
 $stmt->bind_param('issss',$userId,$type,$title,$message,$json);$stmt->execute();
}
function notify_admins(mysqli $db,string $type,string $title,string $message,array $data=[]): void { $rows=$db->query("SELECT u.id FROM users u JOIN roles r ON r.id=u.role_id WHERE r.name='admin' AND u.status='active'")->fetch_all(MYSQLI_ASSOC);foreach($rows as $row)notify_user($db,(int)$row['id'],$type,$title,$message,$data); }
function close_ended_auctions(mysqli $db): void {
 $db->begin_transaction();
 try {
  $rows=$db->query("SELECT a.id,a.product_id,a.highest_bidder_id,a.current_price,a.reserve_price,p.seller_id,p.title FROM auctions a JOIN products p ON p.id=a.product_id WHERE a.status='live' AND a.ends_at<=NOW() FOR UPDATE")->fetch_all(MYSQLI_ASSOC);
  foreach($rows as $a){
   $met=$a['highest_bidder_id']!==null&&($a['reserve_price']===null||(float)$a['current_price']>=(float)$a['reserve_price']);
   $stmt=$db->prepare("UPDATE auctions SET status='ended',closed_at=NOW() WHERE id=?");$stmt->bind_param('i',$a['id']);$stmt->execute();
   // Ended auctions leave the public catalog but remain claimable by the winner.
   $status='paused';$stmt=$db->prepare('UPDATE products SET status=? WHERE id=?');$stmt->bind_param('si',$status,$a['product_id']);$stmt->execute();
   if($met){
    notify_user($db,(int)$a['highest_bidder_id'],'auction_won','You won the auction','Complete your purchase for '.$a['title'].'.',['auction_id'=>(int)$a['id'],'product_id'=>(int)$a['product_id']]);
    notify_user($db,(int)$a['seller_id'],'auction_ended','Auction ended','The winning bid for '.$a['title'].' is $'.number_format((float)$a['current_price'],2).'.',['auction_id'=>(int)$a['id']]);
   }else notify_user($db,(int)$a['seller_id'],'auction_ended','Auction ended','The auction for '.$a['title'].' ended without a qualifying winner.',['auction_id'=>(int)$a['id']]);
  }
  $db->commit();
 }catch(Throwable $e){$db->rollback();throw $e;}
}

set_exception_handler(function(Throwable $e):never { error_log($e->__toString()); fail('An unexpected server error occurred.',500); });
