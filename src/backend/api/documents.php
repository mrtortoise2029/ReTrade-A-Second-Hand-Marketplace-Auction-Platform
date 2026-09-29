<?php
require __DIR__.'/bootstrap.php';
require_role('admin');
if(method()!=='GET')fail('Method not allowed.',405);

$type=$_GET['type']??'';$stored='';$downloadName='document.pdf';
if($type==='product'){
 $id=int_value($_GET['id']??null,'document');$stmt=$db->prepare('SELECT original_name,stored_name FROM product_documents WHERE id=?');$stmt->bind_param('i',$id);$row=db_one($stmt);if(!$row)fail('Document not found.',404);$stored=$row['stored_name'];$downloadName=$row['original_name'];
}elseif(in_array($type,['nid','trade'],true)){
 $userId=int_value($_GET['user_id']??null,'seller');$column=$type==='nid'?'nid_document':'trade_license';$stmt=$db->prepare("SELECT $column stored_name FROM seller_profiles WHERE user_id=?");$stmt->bind_param('i',$userId);$row=db_one($stmt);if(!$row||!$row['stored_name'])fail('Document not found.',404);$stored=$row['stored_name'];$downloadName='seller-'.$userId.'-'.($type==='nid'?'nid':'trade-licence').'.pdf';
}else fail('Invalid document type.',422);

$path=private_pdf_path($stored);if(!$path){$legacy=dirname(__DIR__).'/uploads/'.basename($stored);if(is_file($legacy)&&(new finfo(FILEINFO_MIME_TYPE))->file($legacy)==='application/pdf')$path=$legacy;}if(!$path)fail('The stored PDF is unavailable.',404);
$downloadName=preg_replace('/[^a-z0-9._-]+/i','-',basename($downloadName));if(!str_ends_with(strtolower($downloadName),'.pdf'))$downloadName.='.pdf';
header_remove('Content-Type');header('Content-Type: application/pdf');header('Content-Length: '.filesize($path));header('Content-Disposition: attachment; filename="'.$downloadName.'"');header('X-Content-Type-Options: nosniff');readfile($path);exit;
