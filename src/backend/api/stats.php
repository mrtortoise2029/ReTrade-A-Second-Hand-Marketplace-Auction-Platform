<?php
require __DIR__.'/bootstrap.php';
if (method() !== 'GET') fail('Method not allowed.', 405);
$stats = $db->query("SELECT COALESCE((SELECT SUM(total_amount) FROM orders WHERE DATE(placed_at)=CURDATE() AND status NOT IN('rejected','cancelled')),0) today_sales,COALESCE((SELECT SUM(co2_saved_kg) FROM products WHERE status='active'),0) co2_saved")->fetch_assoc();
$stats['featured'] = $db->query("SELECT p.slug,p.title,p.price,pi.image_url image FROM products p LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 WHERE p.status='active' AND p.sale_type='fixed' ORDER BY p.views DESC,p.id LIMIT 1")->fetch_assoc();
ok($stats);
