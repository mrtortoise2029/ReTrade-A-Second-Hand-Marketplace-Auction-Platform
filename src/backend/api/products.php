<?php
require __DIR__.'/bootstrap.php';

function product_row(mysqli $db,array $p): array {
 $stmt=$db->prepare('SELECT image_url FROM product_images WHERE product_id=? ORDER BY sort_order,id');$stmt->bind_param('i',$p['id']);$p['images']=array_column(db_all($stmt),'image_url');
 $p['specifications']=$p['specifications']?json_decode($p['specifications'],true):[];$p['price']=$p['price']===null?null:(float)$p['price'];$p['views']=(int)$p['views'];
 return $p;
}
if(method()==='GET'){
 $id=$_GET['id']??null;$slug=trim((string)($_GET['slug']??''));
 $base="SELECT p.*,c.name category,c.slug category_slug,u.first_name,u.last_name,COALESCE(sp.rating,0) seller_rating,COALESCE(sp.rating_count,0) seller_reviews FROM products p JOIN categories c ON c.id=p.category_id JOIN users u ON u.id=p.seller_id LEFT JOIN seller_profiles sp ON sp.user_id=p.seller_id";
 if($id||$slug){
  if($id){$id=int_value($id);$stmt=$db->prepare("$base WHERE p.id=? LIMIT 1");$stmt->bind_param('i',$id);}else{$stmt=$db->prepare("$base WHERE p.slug=? LIMIT 1");$stmt->bind_param('s',$slug);}$p=db_one($stmt);if(!$p)fail('Product not found.',404);
  $db->query('UPDATE products SET views=views+1 WHERE id='.(int)$p['id']);ok(product_row($db,$p));
 }
 $where=["p.status='active'"];$types='';$params=[];
 if(!empty($_GET['sale_type'])){$where[]='p.sale_type=?';$types.='s';$params[]=$_GET['sale_type'];}if(!empty($_GET['category'])){$where[]='c.slug=?';$types.='s';$params[]=$_GET['category'];}if(!empty($_GET['search'])){$where[]="(p.title LIKE CONCAT('%',?,'%') OR p.description LIKE CONCAT('%',?,'%') OR c.name LIKE CONCAT('%',?,'%'))";$types.='sss';$params[]=$_GET['search'];$params[]=$_GET['search'];$params[]=$_GET['search'];}
 if(($_GET['scope']??'')==='mine'){ $u=require_role('seller','admin');$where=["p.seller_id=?"];$types='i';$params=[(int)$u['id']]; }
 $sql=$base.' WHERE '.implode(' AND ',$where).' ORDER BY p.created_at DESC LIMIT 100';$stmt=$db->prepare($sql);if($types)$stmt->bind_param($types,...$params);$rows=db_all($stmt);foreach($rows as &$row)$row=product_row($db,$row);ok($rows);
}
$u=require_role('seller','admin');$in=input();
if(method()==='POST'){
 $title=text_value($in,'title',255);$description=text_value($in,'description',5000);$category=int_value($in['category_id']??null,'category');$condition=$in['condition']??'Good';$saleType=$in['sale_type']??'fixed';
 if(!in_array($condition,['New','Like New','Excellent','Good','Fair'],true)||!in_array($saleType,['fixed','auction'],true))fail('Invalid listing values.',422);
 $price=isset($in['price'])?(float)$in['price']:null;if($saleType==='fixed'&&(!$price||$price<=0))fail('A valid price is required.',422);
 $slug=strtolower(trim(preg_replace('/[^a-z0-9]+/i','-',$title),'-')).'-'.substr(bin2hex(random_bytes(3)),0,6);$spec=json_encode($in['specifications']??[],JSON_UNESCAPED_UNICODE);$seller=(int)$u['id'];
 $stmt=$db->prepare("INSERT INTO products(seller_id,category_id,slug,title,description,condition_label,sale_type,price,brand,accessories,location,specifications,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,'pending')");$brand=text_value($in,'brand',120,false);$accessories=text_value($in,'accessories',255,false);$location=text_value($in,'location',180,false);$stmt->bind_param('iisssssdssss',$seller,$category,$slug,$title,$description,$condition,$saleType,$price,$brand,$accessories,$location,$spec);$stmt->execute();$id=$stmt->insert_id;
 foreach(array_slice($in['images']??[],0,8) as $i=>$url){if(!is_string($url)||!filter_var($url,FILTER_VALIDATE_URL))continue;$primary=$i===0?1:0;$stmt=$db->prepare('INSERT INTO product_images(product_id,image_url,sort_order,is_primary) VALUES(?,?,?,?)');$stmt->bind_param('isii',$id,$url,$i,$primary);$stmt->execute();}
 ok(['id'=>$id,'slug'=>$slug],'Listing submitted for review.',201);
}
if(method()==='PATCH'){
 $id=int_value($in['id']??null);$status=$in['status']??'';if(!in_array($status,['active','paused'],true))fail('Invalid listing status.',422);$seller=(int)$u['id'];if($u['role']==='admin'){$stmt=$db->prepare('UPDATE products SET status=? WHERE id=?');$stmt->bind_param('si',$status,$id);}else{$stmt=$db->prepare('UPDATE products SET status=? WHERE id=? AND seller_id=?');$stmt->bind_param('sii',$status,$id,$seller);}$stmt->execute();ok(null,'Listing updated.');
}
fail('Method not allowed.',405);
