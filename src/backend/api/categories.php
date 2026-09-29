<?php
require __DIR__.'/bootstrap.php';
if(method()==='GET'){ $rows=$db->query("SELECT c.*,COUNT(p.id) product_count FROM categories c LEFT JOIN products p ON p.category_id=c.id AND p.status='active' WHERE c.is_active=1 GROUP BY c.id ORDER BY c.name")->fetch_all(MYSQLI_ASSOC);ok($rows); }
$admin=require_role('admin');$in=input();
if(method()==='POST'){$name=text_value($in,'name',120);$slug=strtolower(trim(preg_replace('/[^a-z0-9]+/i','-',$name),'-'));$stmt=$db->prepare('INSERT INTO categories(name,slug,icon) VALUES(?,?,?)');$icon=text_value($in,'icon',50,false);$stmt->bind_param('sss',$name,$slug,$icon);$stmt->execute();ok(['id'=>$stmt->insert_id],'Category created.',201);}
if(method()==='PATCH'){$id=int_value($in['id']??null);if(isset($in['name'])){$name=text_value($in,'name',120);$slug=strtolower(trim(preg_replace('/[^a-z0-9]+/i','-',$name),'-'));$stmt=$db->prepare('UPDATE categories SET name=?,slug=? WHERE id=?');$stmt->bind_param('ssi',$name,$slug,$id);}else{$active=isset($in['is_active'])?(int)(bool)$in['is_active']:1;$stmt=$db->prepare('UPDATE categories SET is_active=? WHERE id=?');$stmt->bind_param('ii',$active,$id);}$stmt->execute();ok(null,'Category updated.');}
fail('Method not allowed.',405);
