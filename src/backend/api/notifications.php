<?php
require __DIR__.'/bootstrap.php';$u=require_user();$uid=(int)$u['id'];
if(method()==='GET'){$stmt=$db->prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100');$stmt->bind_param('i',$uid);$rows=db_all($stmt);foreach($rows as &$r)$r['data']=$r['data']?json_decode($r['data'],true):null;ok($rows);}
if(method()==='PATCH'){$in=input();if(!empty($in['all'])){$stmt=$db->prepare('UPDATE notifications SET read_at=NOW() WHERE user_id=? AND read_at IS NULL');$stmt->bind_param('i',$uid);}else{$id=int_value($in['id']??null);$stmt=$db->prepare('UPDATE notifications SET read_at=NOW() WHERE id=? AND user_id=?');$stmt->bind_param('ii',$id,$uid);}$stmt->execute();ok(null,'Notifications marked as read.');}fail('Method not allowed.',405);
