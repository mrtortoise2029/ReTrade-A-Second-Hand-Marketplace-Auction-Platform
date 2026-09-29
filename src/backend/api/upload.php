<?php
require __DIR__.'/bootstrap.php';$u=require_role('seller','admin');
if(method()!=='POST')fail('Method not allowed.',405);
$type=$_GET['type']??'images';
if($type==='documents'){
 $files=$_FILES['documents']??null;if(!$files)fail('At least one product PDF is required.',422);$count=is_array($files['name'])?count($files['name']):1;$documents=[];
 for($i=0;$i<min($count,5);$i++){$file=[];foreach(['name','type','tmp_name','error','size'] as $key)$file[$key]=is_array($files[$key])?$files[$key][$i]:$files[$key];if(($file['error']??UPLOAD_ERR_NO_FILE)===UPLOAD_ERR_NO_FILE)continue;$stored=store_private_pdf($file,'product-'.(int)$u['id']);$original=mb_substr(basename((string)$file['name']),0,255);$token=bin2hex(random_bytes(16));$_SESSION['pending_product_documents'][$token]=['stored_name'=>$stored,'original_name'=>$original,'user_id'=>(int)$u['id'],'created_at'=>time()];$documents[]=['token'=>$token,'name'=>$original];}
 if(!$documents)fail('At least one valid product PDF is required.',422);ok($documents,'Product documents uploaded.',201);
}
$files=$_FILES['images']??null;if(!$files)fail('No images were uploaded.',422);
$dir=dirname(__DIR__).'/uploads';if(!is_dir($dir)&&!mkdir($dir,0755,true))fail('Upload storage is unavailable.',500);
$allowed=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];$urls=[];$count=is_array($files['name'])?count($files['name']):1;
for($i=0;$i<min($count,8);$i++){$error=is_array($files['error'])?$files['error'][$i]:$files['error'];if($error!==UPLOAD_ERR_OK)continue;$tmp=is_array($files['tmp_name'])?$files['tmp_name'][$i]:$files['tmp_name'];$size=is_array($files['size'])?$files['size'][$i]:$files['size'];if($size>5*1024*1024)fail('Each image must be 5MB or smaller.',422);$mime=(new finfo(FILEINFO_MIME_TYPE))->file($tmp);if(!isset($allowed[$mime]))fail('Only JPG, PNG, and WebP images are allowed.',422);$name=bin2hex(random_bytes(16)).'.'.$allowed[$mime];if(!move_uploaded_file($tmp,$dir.'/'.$name))fail('Could not save an uploaded image.',500);$base=dirname(dirname($_SERVER['SCRIPT_NAME']));$urls[]=$base.'/uploads/'.$name;}
if(!$urls)fail('No valid images were uploaded.',422);ok($urls,'Images uploaded.',201);
