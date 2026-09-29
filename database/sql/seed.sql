USE retrade_db;
INSERT INTO roles(id,name) VALUES (1,'admin'),(2,'seller'),(3,'buyer');
INSERT INTO users(id,role_id,first_name,last_name,email,phone,password_hash,status,email_verified_at) VALUES
(1,1,'Amina','Rahman','admin@retrade.com','+8801700000001','$2y$10$IjXtCmYCnQhGEwu.wTPw4uBPDyly/SVmGZQWVng3tSlw84kd5jzwK','active',NOW()),
(2,2,'James','Wilson','seller@retrade.com','+8801700000002','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','active',NOW()),
(3,2,'Olivia','Khan','olivia@retrade.com','+8801700000003','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','active',NOW()),
(4,3,'Sarah','Chen','buyer@retrade.com','+8801700000004','$2y$10$.wDMT/q3DVYozg11kU.1j.jq08vbny28vYw4BY59stXmeLOHS0B7.','active',NOW()),
(5,3,'David','Park','user@retrade.com','+8801700000005','$2y$10$.wDMT/q3DVYozg11kU.1j.jq08vbny28vYw4BY59stXmeLOHS0B7.','active',NOW()),
(6,2,'Nadia','Islam','nadia.seller@retrade.com','+8801700000006','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','pending',NULL);
INSERT INTO seller_profiles(user_id,business_name,business_description,verification_status,rating,rating_count,approved_at) VALUES
(2,'JW Premium Resale','Verified electronics, watches and accessories.','approved',4.90,312,NOW()),(3,'Olivia Vintage','Curated cameras and vintage gear.','approved',5.00,211,NOW()),(6,'Nadia Home Finds','Quality pre-owned home and lifestyle products.','pending',0,0,NULL);
INSERT INTO categories(id,name,slug,icon) VALUES (1,'Watches','watches','⌚'),(2,'Audio','audio','🎧'),(3,'Laptops','laptops','💻'),(4,'Footwear','footwear','👟'),(5,'Cameras','cameras','📷'),(6,'Accessories','accessories','👜'),(7,'Electronics','electronics','🔌'),(8,'Fashion','fashion','👕'),(9,'Home & Living','home-living','🏠'),(10,'Mobiles','mobiles','📱'),(11,'Fitness','fitness','🏋️');
INSERT INTO products(id,seller_id,category_id,slug,title,description,condition_label,sale_type,price,quantity,brand,year_purchased,accessories,location,shipping_days,specifications,co2_saved_kg,status,views,approved_by,approved_at) VALUES
(1,2,1,'tissot-pr100','Tissot PR100 Swiss Automatic Watch — Steel Blue Dial','Gorgeous Tissot PR100 in immaculate condition. Comes with original box, papers, and spare links.','Like New','fixed',1450,1,'Tissot',2022,'Box, Papers','Dhaka','2-4 days','{"caseDiameter":"40mm","caseMaterial":"Stainless Steel","movement":"Automatic ETA 2824-2","waterResistance":"100m"}',4.2,'active',1248,1,NOW()),
(2,2,2,'sony-wh-1000xm5','Sony WH-1000XM5 Noise Canceling Headphones','Outstanding active noise cancellation and sound clarity. Includes case and cable.','Excellent','fixed',195,2,'Sony',2023,'Case, Cable','Dhaka','2-4 days','{"movement":"Wireless","material":"Plastic"}',2.2,'active',880,1,NOW()),
(3,2,3,'macbook-pro-m2','MacBook Pro M2 16-inch — Space Gray','Powerful MacBook Pro with excellent battery life. Includes charger and sleeve.','Good','fixed',1650,1,'Apple',2023,'Charger, Sleeve','Chattogram','3-5 days','{"screen":"16 inch","processor":"Apple M2"}',6.1,'active',1150,1,NOW()),
(4,2,4,'jordan-1','Nike Air Jordan 1 Retro High OG','Barely worn, authenticated, cleaned, with original box.','Like New','fixed',240,1,'Nike',2024,'Original Box','Dhaka','2-4 days','{"size":"US 9","material":"Leather"}',1.3,'active',1240,1,NOW()),
(5,3,5,'leica','Vintage Leica M6 Film Camera','Classic Leica M6, inspected and fully working with case and lens.','Excellent','auction',NULL,1,'Leica',1989,'Case, Lens','Dhaka','2-5 days','{"format":"35mm","focus":"Manual"}',3.8,'active',1348,1,NOW()),
(6,2,1,'apple-watch','Apple Watch Ultra 2 Titanium','Apple Watch Ultra 2 with original braided band and charging cable.','Excellent','auction',NULL,1,'Apple',2024,'Band, Charger','Dhaka','1-3 days','{"caseDiameter":"49mm","material":"Titanium"}',2.6,'active',980,1,NOW()),
(7,2,2,'bose','Bose QuietComfort 45 Bundle','Like-new headphones with case, cable and travel pouch.','Like New','auction',NULL,1,'Bose',2023,'Case, Cable','Sylhet','2-4 days','{"movement":"Wireless","material":"Fabric"}',1.9,'active',740,1,NOW()),
(8,2,6,'mechanical-keyboard','Custom Mechanical Keyboard','Hot-swappable compact keyboard with tactile switches.','Good','fixed',185,1,'Keychron',2023,'Cable, spare switches','Dhaka','2-4 days','{"layout":"75%"}',1.1,'pending',95,NULL,NULL);
INSERT INTO product_images(product_id,image_url,sort_order,is_primary) VALUES
(1,'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80',0,1),(1,'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=80',1,0),(2,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',0,1),(3,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',0,1),(4,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',0,1),(5,'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',0,1),(6,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',0,1),(7,'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80',0,1);
INSERT INTO auctions(id,product_id,starting_price,reserve_price,bid_increment,current_price,buy_now_price,highest_bidder_id,starts_at,ends_at,status) VALUES
(1,5,700,1100,20,1240,1480,4,DATE_SUB(NOW(),INTERVAL 1 DAY),DATE_ADD(NOW(),INTERVAL 2 DAY),'live'),(2,6,420,600,20,680,820,5,DATE_SUB(NOW(),INTERVAL 4 HOUR),DATE_ADD(NOW(),INTERVAL 1 DAY),'live'),(3,7,140,180,10,195,260,4,DATE_SUB(NOW(),INTERVAL 2 HOUR),DATE_ADD(NOW(),INTERVAL 3 DAY),'live');
INSERT INTO bids(auction_id,bidder_id,amount,is_winning,placed_at) VALUES (1,5,1180,0,DATE_SUB(NOW(),INTERVAL 3 HOUR)),(1,4,1240,1,DATE_SUB(NOW(),INTERVAL 1 HOUR)),(2,4,620,0,DATE_SUB(NOW(),INTERVAL 2 HOUR)),(2,5,680,1,DATE_SUB(NOW(),INTERVAL 30 MINUTE)),(3,5,185,0,DATE_SUB(NOW(),INTERVAL 1 HOUR)),(3,4,195,1,DATE_SUB(NOW(),INTERVAL 20 MINUTE));
INSERT INTO carts(id,user_id) VALUES (1,4),(2,5); INSERT INTO cart_items(cart_id,product_id,quantity) VALUES (1,2,1); INSERT INTO wishlist_items(user_id,product_id) VALUES (4,1),(4,5),(4,3);
INSERT INTO orders(id,order_number,buyer_id,subtotal,shipping_amount,tax_amount,total_amount,status,shipping_name,shipping_email,shipping_phone,shipping_address,placed_at) VALUES
(1,'RT-5862',4,195,15,0,210,'shipped','Sarah Chen','buyer@retrade.com','+8801700000004','Dhanmondi, Dhaka',DATE_SUB(NOW(),INTERVAL 3 DAY)),(2,'RT-5814',5,240,15,0,255,'delivered','David Park','user@retrade.com','+8801700000005','Gulshan, Dhaka',DATE_SUB(NOW(),INTERVAL 10 DAY));
INSERT INTO order_items(id,order_id,product_id,seller_id,title_snapshot,unit_price,quantity,status) VALUES (1,1,2,2,'Sony WH-1000XM5 Noise Canceling Headphones',195,1,'shipped'),(2,2,4,2,'Nike Air Jordan 1 Retro High OG',240,1,'delivered');
INSERT INTO payments(order_id,method,amount,transaction_reference,status,paid_at) VALUES (1,'card',210,'PAY-RT-5862','completed',DATE_SUB(NOW(),INTERVAL 3 DAY)),(2,'wallet',255,'PAY-RT-5814','completed',DATE_SUB(NOW(),INTERVAL 10 DAY));
INSERT INTO deliveries(order_id,carrier,tracking_number,status,estimated_delivery,delivered_at) VALUES (1,'Pathao','TRK-RT-5862','in_transit',DATE_ADD(NOW(),INTERVAL 2 DAY),NULL),(2,'Steadfast','TRK-RT-5814','delivered',DATE_SUB(NOW(),INTERVAL 7 DAY),DATE_SUB(NOW(),INTERVAL 7 DAY));
INSERT INTO reviews(order_item_id,reviewer_id,seller_id,product_id,rating,comment) VALUES (2,5,2,4,5,'Exactly as described and delivered quickly.');
INSERT INTO product_comments(product_id,user_id,body,created_at) VALUES (5,4,'Does the original case and lens come with the camera?',DATE_SUB(NOW(),INTERVAL 1 DAY)),(5,3,'Yes, both the case and lens shown are included.',DATE_SUB(NOW(),INTERVAL 20 HOUR));
INSERT INTO wallets(id,user_id,available_balance,pending_balance) VALUES (1,1,3250,0),(2,2,8420,1280),(3,3,3760,640),(4,4,1250,0),(5,5,680,0),(6,6,0,0);
INSERT INTO wallet_transactions(wallet_id,type,amount,reference,description,created_at) VALUES (2,'sale',195,'RT-5862','Sale payout · Sony WH-1000XM5',DATE_SUB(NOW(),INTERVAL 3 DAY)),(2,'commission',-5.85,'RT-5862','Marketplace commission',DATE_SUB(NOW(),INTERVAL 3 DAY)),(2,'sale',240,'RT-5814','Sale payout · Nike Air Jordan 1',DATE_SUB(NOW(),INTERVAL 10 DAY));
INSERT INTO commissions(order_item_id,percentage,amount) VALUES (1,3,5.85),(2,3,7.20);
INSERT INTO messages(sender_id,receiver_id,product_id,body,read_at,created_at) VALUES (4,2,1,'Hi James, is the Tissot watch still available?',NOW(),DATE_SUB(NOW(),INTERVAL 2 HOUR)),(2,4,1,'Yes, it is available and ready to ship.',NULL,DATE_SUB(NOW(),INTERVAL 90 MINUTE));
INSERT INTO notifications(user_id,type,title,message,data) VALUES (4,'bid','You are the highest bidder','Your Leica M6 bid is currently winning.','{"auction_id":1}'),(4,'delivery','Order is in transit','Order RT-5862 is on its way.','{"order_id":1}'),(2,'order','New order received','A buyer ordered Sony WH-1000XM5.','{"order_id":1}'),(1,'seller','Seller approval required','Nadia Islam submitted a seller application.','{"user_id":6}'),(1,'listing','Listing approval required','Custom Mechanical Keyboard is awaiting review.','{"product_id":8}');
INSERT INTO fraud_reports(reporter_id,reported_user_id,product_id,reason,status) VALUES (5,3,5,'Please verify that the camera serial number matches the listing.','investigating');
INSERT INTO system_settings(setting_key,setting_value,updated_by) VALUES ('standard_commission','3.00',1),('auction_commission','5.00',1),('minimum_commission','1.00',1),('withdrawal_fee','0.50',1);

-- Expanded presentation dataset: broad catalog coverage and realistic admin queues.
INSERT INTO users(id,role_id,first_name,last_name,email,phone,password_hash,status,email_verified_at,created_at) VALUES
(10,2,'Rafi','Hossain','rafi.seller@retrade.com','+8801711000010','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','active',NOW(),DATE_SUB(NOW(),INTERVAL 9 MONTH)),
(11,2,'Mehjabin','Noor','mehjabin.seller@retrade.com','+8801711000011','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','active',NOW(),DATE_SUB(NOW(),INTERVAL 7 MONTH)),
(12,2,'Tanvir','Ahmed','tanvir.pending@retrade.com','+8801711000012','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','pending',NULL,DATE_SUB(NOW(),INTERVAL 3 DAY)),
(13,2,'Nusrat','Jahan','nusrat.pending@retrade.com','+8801711000013','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','pending',NULL,DATE_SUB(NOW(),INTERVAL 2 DAY)),
(14,2,'Siam','Rahman','siam.pending@retrade.com','+8801711000014','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','pending',NULL,DATE_SUB(NOW(),INTERVAL 1 DAY)),
(15,2,'Farzana','Kabir','farzana.pending@retrade.com','+8801711000015','$2y$10$0v82WG8uoGanFtfqNQYECuzqsoF5o1lxu6ER0cjLOWIbmSSlAeVv.','pending',NULL,DATE_SUB(NOW(),INTERVAL 8 HOUR)),
(16,3,'Arif','Mahmud','arif.buyer@retrade.com','+8801711000016','$2y$10$.wDMT/q3DVYozg11kU.1j.jq08vbny28vYw4BY59stXmeLOHS0B7.','active',NOW(),DATE_SUB(NOW(),INTERVAL 5 MONTH)),
(17,3,'Maliha','Sultana','maliha.buyer@retrade.com','+8801711000017','$2y$10$.wDMT/q3DVYozg11kU.1j.jq08vbny28vYw4BY59stXmeLOHS0B7.','active',NOW(),DATE_SUB(NOW(),INTERVAL 4 MONTH));

INSERT INTO seller_profiles(user_id,business_name,business_description,nid_document,trade_license,verification_status,rating,rating_count,approved_at) VALUES
(10,'Dhaka Device Hub','Tested electronics, mobile devices and fitness gear from Dhaka.','/src/backend/uploads/demo-rafi-nid.pdf','/src/backend/uploads/demo-rafi-trade.pdf','approved',4.82,146,DATE_SUB(NOW(),INTERVAL 8 MONTH)),
(11,'Noor Lifestyle Closet','Curated fashion, footwear, home decor and accessories.','/src/backend/uploads/demo-noor-nid.pdf','/src/backend/uploads/demo-noor-trade.pdf','approved',4.76,98,DATE_SUB(NOW(),INTERVAL 6 MONTH)),
(12,'Tanvir Tech Corner','Pre-owned laptops and accessories with inspection reports.','/src/backend/uploads/demo-tanvir-nid.pdf','/src/backend/uploads/demo-tanvir-trade.pdf','pending',0,0,NULL),
(13,'Nusrat Home Studio','Sustainable home decor and modest fashion collection.','/src/backend/uploads/demo-nusrat-nid.pdf',NULL,'pending',0,0,NULL),
(14,'Siam Sports Zone','Fitness and outdoor equipment for everyday athletes.','/src/backend/uploads/demo-siam-nid.pdf','/src/backend/uploads/demo-siam-trade.pdf','pending',0,0,NULL),
(15,'Farzana Finds','Handpicked accessories, cameras and collectible pieces.','/src/backend/uploads/demo-farzana-nid.pdf',NULL,'pending',0,0,NULL);

INSERT INTO wallets(id,user_id,available_balance,pending_balance) VALUES
(10,10,6840,925),(11,11,4920,610),(12,12,0,0),(13,13,0,0),(14,14,0,0),(15,15,0,0),(16,16,920,0),(17,17,1450,0);
INSERT INTO carts(id,user_id) VALUES (10,10),(11,11),(12,12),(13,13),(14,14),(15,15),(16,16),(17,17);

INSERT INTO products(id,seller_id,category_id,slug,title,description,condition_label,sale_type,price,quantity,brand,year_purchased,accessories,location,shipping_days,specifications,co2_saved_kg,status,views,approved_by,approved_at,created_at) VALUES
(100,10,1,'seiko-presage-demo','Seiko Presage Cocktail Time Automatic','Elegant automatic watch with blue sunburst dial, original box and warranty card.','Excellent','fixed',520,1,'Seiko',2022,'Box, warranty card','Dhaka','2-3 days','{"caseDiameter":"40.5mm","movement":"Automatic","waterResistance":"50m"}',3.5,'active',726,1,NOW(),DATE_SUB(NOW(),INTERVAL 20 DAY)),
(101,11,1,'casio-gshock-demo','Casio G-Shock GA-2100 Carbon Core','Lightweight carbon-core watch with excellent battery and minimal wear.','Like New','fixed',145,2,'Casio',2024,'Tin box, manual','Chattogram','2-4 days','{"caseDiameter":"45mm","movement":"Quartz","waterResistance":"200m"}',1.4,'active',418,1,NOW(),DATE_SUB(NOW(),INTERVAL 10 DAY)),
(102,10,2,'airpods-pro-demo','Apple AirPods Pro 2nd Generation USB-C','Genuine AirPods Pro with strong battery health and clean charging case.','Excellent','fixed',185,2,'Apple',2024,'Charging case, cable, ear tips','Dhaka','1-2 days','{"connectivity":"Bluetooth 5.3","battery":"Up to 30 hours"}',1.2,'active',963,1,NOW(),DATE_SUB(NOW(),INTERVAL 18 DAY)),
(103,11,2,'marshall-major-demo','Marshall Major IV Wireless Headphones','Warm signature sound with foldable design and more than 70 hours battery.','Good','fixed',95,1,'Marshall',2022,'Charging cable','Rajshahi','2-4 days','{"connectivity":"Bluetooth","battery":"70+ hours"}',1.7,'active',341,1,NOW(),DATE_SUB(NOW(),INTERVAL 13 DAY)),
(104,10,3,'dell-xps-demo','Dell XPS 13 Plus OLED Laptop','Compact premium laptop with OLED display, Core i7 and 16GB RAM.','Excellent','fixed',1180,1,'Dell',2023,'Original charger, sleeve','Dhaka','2-4 days','{"screen":"13.4 inch OLED","processor":"Intel Core i7","ram":"16GB"}',5.8,'active',1106,1,NOW(),DATE_SUB(NOW(),INTERVAL 16 DAY)),
(105,10,3,'thinkpad-x1-demo','Lenovo ThinkPad X1 Carbon Gen 10','Business ultrabook in great condition with excellent keyboard and battery.','Good','auction',NULL,1,'Lenovo',2022,'65W charger','Sylhet','3-5 days','{"screen":"14 inch","processor":"Intel Core i7","ram":"16GB"}',5.1,'active',804,1,NOW(),DATE_SUB(NOW(),INTERVAL 8 DAY)),
(106,11,4,'adidas-ultraboost-demo','Adidas Ultraboost 22 Running Shoes','Comfortable daily running shoes, professionally cleaned and lightly used.','Excellent','fixed',110,1,'Adidas',2023,'Original box','Dhaka','2-3 days','{"size":"EU 42","material":"Primeknit"}',1.1,'active',534,1,NOW(),DATE_SUB(NOW(),INTERVAL 14 DAY)),
(107,11,4,'new-balance-demo','New Balance 550 White Green','Classic leather sneakers with minor creasing and original laces.','Good','fixed',88,1,'New Balance',2023,'Original box, spare laces','Khulna','2-4 days','{"size":"EU 41","material":"Leather"}',1.0,'active',477,1,NOW(),DATE_SUB(NOW(),INTERVAL 6 DAY)),
(108,10,5,'canon-eos-demo','Canon EOS R Mirrorless Camera Body','Full-frame mirrorless camera with low shutter count and clean sensor.','Excellent','fixed',1280,1,'Canon',2021,'Battery, charger, strap','Dhaka','2-4 days','{"sensor":"30.3MP Full Frame","shutterCount":"18400"}',4.0,'active',1289,1,NOW(),DATE_SUB(NOW(),INTERVAL 21 DAY)),
(109,11,5,'fujifilm-xt4-demo','Fujifilm X-T4 Silver Camera Kit','Beautiful Fujifilm kit with 18-55mm lens and two original batteries.','Like New','auction',NULL,1,'Fujifilm',2022,'18-55mm lens, batteries, charger','Chattogram','2-5 days','{"sensor":"26.1MP APS-C","lens":"18-55mm"}',4.3,'active',1175,1,NOW(),DATE_SUB(NOW(),INTERVAL 9 DAY)),
(110,11,6,'coach-tote-demo','Coach Willow Leather Tote Bag','Authentic leather tote in neutral tan with dust bag and receipt copy.','Excellent','fixed',210,1,'Coach',2023,'Dust bag, receipt copy','Dhaka','2-3 days','{"material":"Leather","color":"Tan"}',1.5,'active',612,1,NOW(),DATE_SUB(NOW(),INTERVAL 12 DAY)),
(111,10,6,'keychron-k8-demo','Keychron K8 Pro Mechanical Keyboard','Wireless hot-swappable keyboard with tactile switches and RGB backlight.','Like New','fixed',105,2,'Keychron',2024,'Cable, keycap puller, box','Dhaka','1-3 days','{"layout":"TKL","switch":"Gateron Brown"}',1.0,'active',885,1,NOW(),DATE_SUB(NOW(),INTERVAL 5 DAY)),
(112,10,7,'ps5-slim-demo','Sony PlayStation 5 Slim Disc Edition','Fully working PS5 Slim with controller, stand and retail packaging.','Excellent','fixed',545,1,'Sony',2024,'DualSense controller, stand, box','Dhaka','1-3 days','{"storage":"1TB","edition":"Disc"}',4.8,'active',1533,1,NOW(),DATE_SUB(NOW(),INTERVAL 17 DAY)),
(113,10,7,'nintendo-switch-demo','Nintendo Switch OLED Zelda Edition','Limited edition Switch OLED with dock, Joy-Con and carrying case.','Like New','auction',NULL,1,'Nintendo',2023,'Dock, Joy-Con, case, charger','Cumilla','2-4 days','{"display":"7 inch OLED","storage":"64GB"}',2.6,'active',1204,1,NOW(),DATE_SUB(NOW(),INTERVAL 7 DAY)),
(114,11,8,'jamdani-saree-demo','Handwoven Dhakai Jamdani Saree','Elegant handwoven Jamdani saree worn once and professionally cleaned.','Like New','fixed',175,1,'Artisan',2024,'Matching blouse piece','Dhaka','2-3 days','{"fabric":"Cotton muslin","color":"Ivory and red"}',1.8,'active',691,1,NOW(),DATE_SUB(NOW(),INTERVAL 15 DAY)),
(115,11,8,'levis-jacket-demo','Levi’s Vintage Trucker Denim Jacket','Classic medium-wash denim jacket with an excellent broken-in feel.','Good','fixed',72,1,'Levi’s',2022,'None','Sylhet','2-4 days','{"size":"Medium","material":"Denim"}',1.2,'active',386,1,NOW(),DATE_SUB(NOW(),INTERVAL 4 DAY)),
(116,11,9,'ikea-armchair-demo','IKEA POÄNG Armchair with Footstool','Comfortable birch armchair and matching footstool with washable cushions.','Good','fixed',135,1,'IKEA',2021,'Matching footstool','Dhaka','3-6 days','{"material":"Birch veneer","color":"Beige"}',7.2,'active',573,1,NOW(),DATE_SUB(NOW(),INTERVAL 19 DAY)),
(117,11,9,'coffee-table-demo','Solid Teak Mid-Century Coffee Table','Locally crafted solid teak table with restored natural oil finish.','Excellent','auction',NULL,1,'Local Craft',2019,'Care kit','Gazipur','3-6 days','{"material":"Solid teak","dimensions":"110x55cm"}',9.5,'active',742,1,NOW(),DATE_SUB(NOW(),INTERVAL 11 DAY)),
(118,10,10,'iphone-14-pro-demo','Apple iPhone 14 Pro 256GB Deep Purple','Factory unlocked phone with 89% battery health and clean display.','Excellent','fixed',820,1,'Apple',2022,'Box, cable, case','Dhaka','1-2 days','{"storage":"256GB","batteryHealth":"89%"}',3.2,'active',1884,1,NOW(),DATE_SUB(NOW(),INTERVAL 22 DAY)),
(119,10,10,'pixel-8-demo','Google Pixel 8 128GB Obsidian','Smooth Android flagship with excellent cameras and remaining warranty.','Like New','fixed',520,1,'Google',2024,'Box, cable, case','Chattogram','2-3 days','{"storage":"128GB","ram":"8GB"}',2.8,'active',995,1,NOW(),DATE_SUB(NOW(),INTERVAL 6 DAY)),
(120,10,11,'treadmill-demo','Xiaomi WalkingPad R2 Foldable Treadmill','Space-saving treadmill with remote control and low operating noise.','Good','fixed',490,1,'WalkingPad',2022,'Remote, safety clip','Dhaka','3-5 days','{"maxSpeed":"12 km/h","maxWeight":"110kg"}',8.4,'active',634,1,NOW(),DATE_SUB(NOW(),INTERVAL 13 DAY)),
(121,11,11,'bowflex-dumbbell-demo','Bowflex SelectTech 552 Adjustable Dumbbells','Space-efficient adjustable dumbbell pair covering 2.3kg to 23.8kg.','Excellent','auction',NULL,1,'Bowflex',2023,'Storage trays','Narayanganj','3-5 days','{"range":"2.3-23.8kg","set":"Pair"}',6.6,'active',812,1,NOW(),DATE_SUB(NOW(),INTERVAL 5 DAY)),
(130,10,7,'drone-pending-demo','DJI Mini 3 Pro Fly More Combo','Compact camera drone with extra batteries and carrying bag.','Excellent','fixed',760,1,'DJI',2023,'Fly More kit','Dhaka','2-3 days','{"flightTime":"34 minutes"}',2.4,'pending',126,NULL,NULL,DATE_SUB(NOW(),INTERVAL 3 DAY)),
(131,11,8,'muslin-dress-pending-demo','Designer Muslin Embroidered Dress','Hand embroidered formal muslin dress in pristine condition.','Like New','fixed',125,1,'Local Designer',2024,'Matching scarf','Dhaka','2-3 days','{"size":"Medium"}',1.1,'pending',84,NULL,NULL,DATE_SUB(NOW(),INTERVAL 2 DAY)),
(132,10,10,'samsung-s23-pending-demo','Samsung Galaxy S23 Ultra 512GB','Phantom black flagship phone with S Pen and original accessories.','Excellent','fixed',790,1,'Samsung',2023,'Box, cable, case','Sylhet','2-4 days','{"storage":"512GB"}',3.0,'pending',193,NULL,NULL,DATE_SUB(NOW(),INTERVAL 36 HOUR)),
(133,11,9,'bookshelf-pending-demo','Solid Mango Wood Bookshelf','Five-tier handcrafted bookshelf with natural walnut stain.','New','fixed',260,1,'Local Craft',2025,'Assembly hardware','Gazipur','4-7 days','{"material":"Mango wood"}',10.2,'pending',61,NULL,NULL,DATE_SUB(NOW(),INTERVAL 28 HOUR)),
(134,10,3,'asus-rog-pending-demo','ASUS ROG Zephyrus G14 Gaming Laptop','Portable gaming laptop with Ryzen 9, RTX 4060 and 32GB RAM.','Excellent','fixed',1490,1,'ASUS',2024,'Charger, sleeve','Dhaka','2-4 days','{"processor":"Ryzen 9","gpu":"RTX 4060"}',6.4,'pending',244,NULL,NULL,DATE_SUB(NOW(),INTERVAL 20 HOUR)),
(135,11,6,'sunglasses-pending-demo','Ray-Ban Clubmaster Classic Sunglasses','Authentic Clubmaster sunglasses with case and cleaning cloth.','Like New','fixed',115,1,'Ray-Ban',2023,'Case, cloth','Chattogram','2-3 days','{"frame":"Tortoise gold"}',0.7,'pending',108,NULL,NULL,DATE_SUB(NOW(),INTERVAL 14 HOUR)),
(136,10,5,'sony-a7-pending-demo','Sony Alpha A7 IV Camera Body','Hybrid full-frame camera with low shutter count and warranty.','Excellent','auction',950,1,'Sony',2024,'Battery, charger, box','Dhaka','2-4 days','{"sensor":"33MP Full Frame"}',4.1,'pending',311,NULL,NULL,DATE_SUB(NOW(),INTERVAL 9 HOUR)),
(137,11,11,'exercise-bike-pending-demo','NordicTrack Indoor Exercise Bike','Quiet indoor cycle with adjustable resistance and tablet holder.','Good','fixed',420,1,'NordicTrack',2022,'Mat, bottle holder','Dhaka','3-6 days','{"resistance":"Magnetic"}',7.8,'pending',79,NULL,NULL,DATE_SUB(NOW(),INTERVAL 5 HOUR));

INSERT INTO product_images(product_id,image_url,sort_order,is_primary) VALUES
(100,'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=80',0,1),(101,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',0,1),
(102,'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1200&q=80',0,1),(103,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',0,1),
(104,'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',0,1),(105,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',0,1),
(106,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',0,1),(107,'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1200&q=80',0,1),
(108,'https://images.unsplash.com/photo-1606980707986-6127f3c8d2a0?w=1200&q=80',0,1),(109,'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',0,1),
(110,'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80',0,1),(111,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=80',0,1),
(112,'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=1200&q=80',0,1),(113,'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=1200&q=80',0,1),
(114,'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80',0,1),(115,'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=1200&q=80',0,1),
(116,'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80',0,1),(117,'https://images.unsplash.com/photo-1532372320572-cda25653a694?w=1200&q=80',0,1),
(118,'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&q=80',0,1),(119,'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80',0,1),
(120,'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1200&q=80',0,1),(121,'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80',0,1),
(130,'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80',0,1),(131,'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=80',0,1),
(132,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80',0,1),(133,'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=1200&q=80',0,1),
(134,'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=80',0,1),(135,'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=80',0,1),
(136,'https://images.unsplash.com/photo-1606980707986-6127f3c8d2a0?w=1200&q=80',0,1),(137,'https://images.unsplash.com/photo-1591741543032-bf439b4fd46c?w=1200&q=80',0,1);

INSERT INTO auctions(id,product_id,starting_price,reserve_price,bid_increment,current_price,buy_now_price,highest_bidder_id,starts_at,ends_at,status) VALUES
(10,105,650,850,25,775,980,16,DATE_SUB(NOW(),INTERVAL 1 DAY),DATE_ADD(NOW(),INTERVAL 2 DAY),'live'),
(11,109,900,1200,25,1050,1380,17,DATE_SUB(NOW(),INTERVAL 8 HOUR),DATE_ADD(NOW(),INTERVAL 3 DAY),'live'),
(12,113,230,320,10,285,390,4,DATE_SUB(NOW(),INTERVAL 6 HOUR),DATE_ADD(NOW(),INTERVAL 1 DAY),'live'),
(13,117,160,260,10,230,340,5,DATE_SUB(NOW(),INTERVAL 2 DAY),DATE_ADD(NOW(),INTERVAL 4 DAY),'live'),
(14,121,350,500,20,440,590,16,DATE_SUB(NOW(),INTERVAL 12 HOUR),DATE_ADD(NOW(),INTERVAL 2 DAY),'live');
INSERT INTO bids(auction_id,bidder_id,amount,is_winning,placed_at) VALUES
(10,4,700,0,DATE_SUB(NOW(),INTERVAL 8 HOUR)),(10,16,775,1,DATE_SUB(NOW(),INTERVAL 2 HOUR)),
(11,5,975,0,DATE_SUB(NOW(),INTERVAL 5 HOUR)),(11,17,1050,1,DATE_SUB(NOW(),INTERVAL 1 HOUR)),
(12,17,260,0,DATE_SUB(NOW(),INTERVAL 3 HOUR)),(12,4,285,1,DATE_SUB(NOW(),INTERVAL 40 MINUTE)),
(13,16,210,0,DATE_SUB(NOW(),INTERVAL 1 DAY)),(13,5,230,1,DATE_SUB(NOW(),INTERVAL 3 HOUR)),
(14,4,400,0,DATE_SUB(NOW(),INTERVAL 4 HOUR)),(14,16,440,1,DATE_SUB(NOW(),INTERVAL 50 MINUTE));

INSERT INTO wishlist_items(user_id,product_id) VALUES (4,102),(4,109),(5,118),(16,104),(16,113),(17,110),(17,121);
INSERT INTO cart_items(cart_id,product_id,quantity) VALUES (16,102,1),(16,115,1),(17,110,1);

INSERT INTO orders(id,order_number,buyer_id,subtotal,shipping_amount,tax_amount,total_amount,status,shipping_name,shipping_email,shipping_phone,shipping_address,placed_at) VALUES
(10,'RT-DEMO-6010',16,520,15,0,535,'delivered','Arif Mahmud','arif.buyer@retrade.com','+8801711000016','Uttara, Dhaka',DATE_SUB(NOW(),INTERVAL 28 DAY)),
(11,'RT-DEMO-6011',17,175,15,0,190,'shipped','Maliha Sultana','maliha.buyer@retrade.com','+8801711000017','Panchlaish, Chattogram',DATE_SUB(NOW(),INTERVAL 5 DAY)),
(12,'RT-DEMO-6012',4,545,15,0,560,'processing','Sarah Chen','buyer@retrade.com','+8801700000004','Dhanmondi, Dhaka',DATE_SUB(NOW(),INTERVAL 2 DAY)),
(13,'RT-DEMO-6013',5,210,15,0,225,'approved','David Park','user@retrade.com','+8801700000005','Gulshan, Dhaka',DATE_SUB(NOW(),INTERVAL 1 DAY)),
(14,'RT-DEMO-6014',16,110,15,0,125,'paid','Arif Mahmud','arif.buyer@retrade.com','+8801711000016','Uttara, Dhaka',DATE_SUB(NOW(),INTERVAL 12 HOUR)),
(15,'RT-DEMO-6015',17,820,15,0,835,'delivered','Maliha Sultana','maliha.buyer@retrade.com','+8801711000017','Panchlaish, Chattogram',DATE_SUB(NOW(),INTERVAL 18 DAY)),
(16,'RT-DEMO-6016',4,135,15,0,150,'shipped','Sarah Chen','buyer@retrade.com','+8801700000004','Dhanmondi, Dhaka',DATE_SUB(NOW(),INTERVAL 4 DAY)),
(17,'RT-DEMO-6017',5,95,15,0,110,'delivered','David Park','user@retrade.com','+8801700000005','Gulshan, Dhaka',DATE_SUB(NOW(),INTERVAL 35 DAY));
INSERT INTO order_items(id,order_id,product_id,seller_id,title_snapshot,unit_price,quantity,status) VALUES
(10,10,100,10,'Seiko Presage Cocktail Time Automatic',520,1,'delivered'),(11,11,114,11,'Handwoven Dhakai Jamdani Saree',175,1,'shipped'),
(12,12,112,10,'Sony PlayStation 5 Slim Disc Edition',545,1,'processing'),(13,13,110,11,'Coach Willow Leather Tote Bag',210,1,'approved'),
(14,14,106,11,'Adidas Ultraboost 22 Running Shoes',110,1,'pending'),(15,15,118,10,'Apple iPhone 14 Pro 256GB Deep Purple',820,1,'delivered'),
(16,16,116,11,'IKEA POÄNG Armchair with Footstool',135,1,'shipped'),(17,17,103,11,'Marshall Major IV Wireless Headphones',95,1,'delivered');
INSERT INTO payments(order_id,method,amount,transaction_reference,status,paid_at) VALUES
(10,'wallet',535,'PAY-DEMO-6010','completed',DATE_SUB(NOW(),INTERVAL 28 DAY)),(11,'card',190,'PAY-DEMO-6011','completed',DATE_SUB(NOW(),INTERVAL 5 DAY)),
(12,'card',560,'PAY-DEMO-6012','completed',DATE_SUB(NOW(),INTERVAL 2 DAY)),(13,'cash_on_delivery',225,'PAY-DEMO-6013','pending',NULL),
(14,'wallet',125,'PAY-DEMO-6014','completed',DATE_SUB(NOW(),INTERVAL 12 HOUR)),(15,'card',835,'PAY-DEMO-6015','completed',DATE_SUB(NOW(),INTERVAL 18 DAY)),
(16,'cash_on_delivery',150,'PAY-DEMO-6016','pending',NULL),(17,'wallet',110,'PAY-DEMO-6017','completed',DATE_SUB(NOW(),INTERVAL 35 DAY));
INSERT INTO deliveries(order_id,carrier,tracking_number,status,estimated_delivery,delivered_at) VALUES
(10,'Pathao','TRK-DEMO-6010','delivered',DATE_SUB(NOW(),INTERVAL 25 DAY),DATE_SUB(NOW(),INTERVAL 25 DAY)),
(11,'RedX','TRK-DEMO-6011','in_transit',DATE_ADD(NOW(),INTERVAL 2 DAY),NULL),(12,'Steadfast','TRK-DEMO-6012','picked_up',DATE_ADD(NOW(),INTERVAL 3 DAY),NULL),
(13,'Pathao','TRK-DEMO-6013','pending',DATE_ADD(NOW(),INTERVAL 4 DAY),NULL),(14,'RedX','TRK-DEMO-6014','pending',DATE_ADD(NOW(),INTERVAL 4 DAY),NULL),
(15,'Steadfast','TRK-DEMO-6015','delivered',DATE_SUB(NOW(),INTERVAL 15 DAY),DATE_SUB(NOW(),INTERVAL 15 DAY)),
(16,'Pathao','TRK-DEMO-6016','out_for_delivery',DATE_ADD(NOW(),INTERVAL 1 DAY),NULL),(17,'RedX','TRK-DEMO-6017','delivered',DATE_SUB(NOW(),INTERVAL 31 DAY),DATE_SUB(NOW(),INTERVAL 31 DAY));
INSERT INTO reviews(order_item_id,reviewer_id,seller_id,product_id,rating,comment) VALUES
(10,16,10,100,5,'Beautiful watch, carefully packed and exactly as described.'),(15,17,10,118,5,'Phone condition and battery health were completely accurate.'),(17,5,11,103,4,'Great sound and fast delivery; only minor cosmetic marks.');
INSERT INTO commissions(order_item_id,percentage,amount) VALUES (10,3,15.60),(11,3,5.25),(12,3,16.35),(13,3,6.30),(14,3,3.30),(15,3,24.60),(16,3,4.05),(17,3,2.85);

INSERT INTO wallet_transactions(wallet_id,type,amount,reference,description,created_at) VALUES
(10,'sale',520,'RT-DEMO-6010','Sale payout · Seiko Presage',DATE_SUB(NOW(),INTERVAL 25 DAY)),(10,'commission',-15.60,'RT-DEMO-6010','Marketplace commission',DATE_SUB(NOW(),INTERVAL 25 DAY)),
(10,'sale',820,'RT-DEMO-6015','Sale payout · iPhone 14 Pro',DATE_SUB(NOW(),INTERVAL 15 DAY)),(11,'sale',95,'RT-DEMO-6017','Sale payout · Marshall Major IV',DATE_SUB(NOW(),INTERVAL 31 DAY)),
(11,'sale',175,'RT-DEMO-6011','Pending Jamdani order payout',DATE_SUB(NOW(),INTERVAL 5 DAY)),(16,'purchase',-535,'RT-DEMO-6010','Marketplace purchase',DATE_SUB(NOW(),INTERVAL 28 DAY));

INSERT INTO messages(sender_id,receiver_id,product_id,body,read_at,created_at) VALUES
(16,10,104,'Is the Dell XPS battery still holding a full workday?',NOW(),DATE_SUB(NOW(),INTERVAL 3 DAY)),(10,16,104,'Yes, it gives around eight hours in normal office use.',NOW(),DATE_SUB(NOW(),INTERVAL 3 DAY)),
(17,11,114,'Can you deliver the Jamdani before this weekend?',NOW(),DATE_SUB(NOW(),INTERVAL 2 DAY)),(11,17,114,'Yes, express delivery is available for Chattogram.',NULL,DATE_SUB(NOW(),INTERVAL 2 DAY)),
(4,10,112,'Does the PS5 include the original controller?',NOW(),DATE_SUB(NOW(),INTERVAL 1 DAY)),(10,4,112,'Yes, the original DualSense and box are included.',NULL,DATE_SUB(NOW(),INTERVAL 20 HOUR)),
(5,11,110,'Can you share the authenticity receipt for the Coach bag?',NULL,DATE_SUB(NOW(),INTERVAL 6 HOUR));

INSERT INTO product_comments(product_id,user_id,body,created_at) VALUES
(105,16,'What is the current battery cycle count?',DATE_SUB(NOW(),INTERVAL 2 DAY)),(105,10,'It is at 214 cycles with 87% health.',DATE_SUB(NOW(),INTERVAL 1 DAY)),
(109,17,'Is the 18-55mm lens free from fungus?',DATE_SUB(NOW(),INTERVAL 12 HOUR)),(109,11,'Yes, the optics are clean and recently inspected.',DATE_SUB(NOW(),INTERVAL 10 HOUR));

INSERT INTO notifications(user_id,type,title,message,data,created_at) VALUES
(1,'seller','New seller application','Tanvir Ahmed submitted Tech Corner for verification.','{"user_id":12}',DATE_SUB(NOW(),INTERVAL 3 DAY)),
(1,'seller','New seller application','Nusrat Jahan submitted Home Studio for verification.','{"user_id":13}',DATE_SUB(NOW(),INTERVAL 2 DAY)),
(1,'seller','New seller application','Siam Rahman submitted Sports Zone for verification.','{"user_id":14}',DATE_SUB(NOW(),INTERVAL 1 DAY)),
(1,'seller','New seller application','Farzana Kabir submitted Farzana Finds for verification.','{"user_id":15}',DATE_SUB(NOW(),INTERVAL 8 HOUR)),
(1,'listing','Listing approval required','DJI Mini 3 Pro is awaiting marketplace review.','{"product_id":130}',DATE_SUB(NOW(),INTERVAL 3 DAY)),
(1,'listing','Listing approval required','Samsung Galaxy S23 Ultra is awaiting marketplace review.','{"product_id":132}',DATE_SUB(NOW(),INTERVAL 36 HOUR)),
(1,'listing','Listing approval required','ASUS ROG Zephyrus G14 is awaiting marketplace review.','{"product_id":134}',DATE_SUB(NOW(),INTERVAL 20 HOUR)),
(1,'listing','Listing approval required','Sony Alpha A7 IV is awaiting auction review.','{"product_id":136}',DATE_SUB(NOW(),INTERVAL 9 HOUR)),
(1,'fraud','New risk report','A buyer reported a serial-number mismatch concern.','{"report_id":2}',DATE_SUB(NOW(),INTERVAL 5 HOUR)),
(10,'order','New order received','Order RT-DEMO-6012 for PlayStation 5 needs processing.','{"order_id":12}',DATE_SUB(NOW(),INTERVAL 2 DAY)),
(11,'order','New order received','Order RT-DEMO-6013 for Coach Willow Tote needs approval.','{"order_id":13}',DATE_SUB(NOW(),INTERVAL 1 DAY)),
(16,'bid','You are winning','Your ThinkPad X1 Carbon bid is currently highest.','{"auction_id":10}',DATE_SUB(NOW(),INTERVAL 2 HOUR)),
(17,'bid','You are winning','Your Fujifilm X-T4 bid is currently highest.','{"auction_id":11}',DATE_SUB(NOW(),INTERVAL 1 HOUR)),
(4,'delivery','Out for delivery','Your IKEA POÄNG order is arriving soon.','{"order_id":16}',DATE_SUB(NOW(),INTERVAL 2 HOUR));

INSERT INTO fraud_reports(id,reporter_id,reported_user_id,product_id,order_id,reason,status,created_at) VALUES
(2,16,10,118,15,'Buyer requested verification of IMEI and original purchase receipt.','open',DATE_SUB(NOW(),INTERVAL 5 HOUR)),
(3,17,11,109,NULL,'Auction photos may not clearly show the camera serial number.','investigating',DATE_SUB(NOW(),INTERVAL 1 DAY)),
(4,4,10,112,12,'Payment was confirmed but packing status was delayed.','open',DATE_SUB(NOW(),INTERVAL 2 DAY)),
(5,5,11,110,13,'Buyer requested additional authenticity documentation.','open',DATE_SUB(NOW(),INTERVAL 8 HOUR)),
(6,16,11,117,NULL,'Please verify dimensions and restoration details before auction close.','resolved',DATE_SUB(NOW(),INTERVAL 4 DAY));
