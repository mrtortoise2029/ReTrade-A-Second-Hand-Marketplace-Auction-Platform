<?php
require __DIR__.'/bootstrap.php';
$action=$_GET['action']??'';

if(method()==='GET' && $action==='me') { $u=user(); $u?ok($u):fail('Not authenticated.',401); }
if(method()==='POST' && $action==='logout') { $_SESSION=[]; if(ini_get('session.use_cookies')){ $p=session_get_cookie_params(); setcookie(session_name(),'',time()-42000,$p['path'],$p['domain']??'',(bool)$p['secure'],(bool)$p['httponly']); } session_destroy(); ok(null,'Signed out.'); }
if(method()==='POST' && $action==='login') {
 $in=input();$email=strtolower(text_value($in,'email',190));$password=(string)($in['password']??'');
 if($password==='')fail('Password is required.',422);
 $stmt=$db->prepare("SELECT u.id,u.first_name,u.last_name,u.email,u.password_hash,u.status,r.name role FROM users u JOIN roles r ON r.id=u.role_id WHERE u.email=? LIMIT 1");$stmt->bind_param('s',$email);$row=db_one($stmt);
 if(!$row||!password_verify($password,$row['password_hash']))fail('Invalid email or password.',401);
 if($row['status']!=='active')fail('This account is not active.',403);
 session_regenerate_id(true);unset($row['password_hash'],$row['status']);$row['name']=$row['first_name'].' '.$row['last_name'];$_SESSION['user']=$row;
 $stmt=$db->prepare('UPDATE users SET last_login_at=NOW() WHERE id=?');$stmt->bind_param('i',$row['id']);$stmt->execute();ok($row,'Signed in.');
}
if(method()==='POST' && $action==='register') {
 $in=input();$first=text_value($in,'first_name',80);$last=text_value($in,'last_name',80);$email=strtolower(text_value($in,'email',190));$phone=text_value($in,'phone',30);$role=$in['role']??'buyer';$password=(string)($in['password']??'');$confirmPassword=(string)($in['confirm_password']??'');
 if(!filter_var($email,FILTER_VALIDATE_EMAIL))fail('Enter a valid email address.',422);if(!in_array($role,['buyer','seller'],true))fail('Invalid account role.',422);
 if($password!==$confirmPassword)fail('Password and Confirm Password must match.',422);if(strlen($password)<8||!preg_match('/[A-Za-z]/',$password)||!preg_match('/\d/',$password))fail('Password must be at least 8 characters and include a letter and number.',422);
 if($role==='seller'){foreach(['nid_document'=>'NID','trade_license'=>'Trade Licence'] as $field=>$label){if(empty($_FILES[$field])||($_FILES[$field]['error']??UPLOAD_ERR_NO_FILE)===UPLOAD_ERR_NO_FILE)fail($label.' PDF is required for seller registration.',422);}}
 $db->begin_transaction();
 try{
  $stmt=$db->prepare('SELECT id FROM users WHERE email=?');$stmt->bind_param('s',$email);if(db_one($stmt))fail('An account with that email already exists.',409);
  $roleId=$role==='seller'?2:3;$hash=password_hash($password,PASSWORD_DEFAULT);$status=$role==='seller'?'pending':'active';
  $stmt=$db->prepare('INSERT INTO users(role_id,first_name,last_name,email,phone,password_hash,status) VALUES(?,?,?,?,?,?,?)');$stmt->bind_param('issssss',$roleId,$first,$last,$email,$phone,$hash,$status);$stmt->execute();$id=$stmt->insert_id;
  $stmt=$db->prepare('INSERT INTO wallets(user_id) VALUES(?)');$stmt->bind_param('i',$id);$stmt->execute();$stmt=$db->prepare('INSERT INTO carts(user_id) VALUES(?)');$stmt->bind_param('i',$id);$stmt->execute();
  if($role==='seller'){$business=text_value($in,'business_name',180,false);$description=text_value($in,'business_description',2000,false);$nid=store_private_pdf($_FILES['nid_document'],'seller-'.$id.'-nid');$license=store_private_pdf($_FILES['trade_license'],'seller-'.$id.'-trade');$stmt=$db->prepare('INSERT INTO seller_profiles(user_id,business_name,business_description,nid_document,trade_license) VALUES(?,?,?,?,?)');$stmt->bind_param('issss',$id,$business,$description,$nid,$license);$stmt->execute();}
  $db->commit();ok(['id'=>$id,'approval_required'=>$role==='seller'],'Account created.',201);
 }catch(Throwable $e){$db->rollback();throw $e;}
}
fail('Endpoint not found.',404);
