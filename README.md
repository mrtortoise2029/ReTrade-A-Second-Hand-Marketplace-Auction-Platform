# ReTrade - Secondhand Marketplace

ReTrade uses the original HTML/CSS/JavaScript frontend with a PHP 8 + MySQL/MariaDB backend. Authentication is session-based, passwords use PHP's secure password hashing, and database writes use prepared statements.

## Local setup (XAMPP)

1. Start Apache and MySQL in XAMPP.
2. Import the schema and demo records:

   ```bash
   /Applications/XAMPP/xamppfiles/bin/mysql -uroot < database/sql/schema.sql
   /Applications/XAMPP/xamppfiles/bin/mysql -uroot < database/sql/seed.sql
   ```

3. Open `http://localhost/ReTrade-SecondHandMarketPlace/src/frontend/`.

The default connection is `root` with no password on `localhost:3306`. Override it with `RETRADE_DB_HOST`, `RETRADE_DB_PORT`, `RETRADE_DB_NAME`, `RETRADE_DB_USER`, and `RETRADE_DB_PASS` environment variables.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@retrade.com` | `Admin@123` |
| Seller | `seller@retrade.com` | `Seller@123` |
| Seller | `rafi.seller@retrade.com` | `Seller@123` |
| Seller | `mehjabin.seller@retrade.com` | `Seller@123` |
| Buyer | `buyer@retrade.com` | `Buyer@123` |
| Buyer | `user@retrade.com` | `Buyer@123` |
| Buyer | `arif.buyer@retrade.com` | `Buyer@123` |
| Buyer | `maliha.buyer@retrade.com` | `Buyer@123` |

Seller registrations remain pending until approved by an admin. The seed also includes pending seller applications (`tanvir.pending@retrade.com`, `nusrat.pending@retrade.com`, `siam.pending@retrade.com`, and `farzana.pending@retrade.com`) using `Seller@123` for approval demonstrations.

The presentation seed contains products in every category, fixed-price and auction listings, pending listing approvals, bids, orders, payments, delivery states, reviews, conversations, wallet activity, notifications, and fraud-monitoring requests.

## Backend

JSON endpoints in `src/backend/api/` cover authentication, products/categories, auctions and transactional bidding, carts, wishlists, checkout/orders/payments/delivery, reviews, messages, notifications, wallets, dashboards, uploads, and admin moderation/settings.

Responses consistently use `{"ok":true,"message":"Success","data":{}}`. Uploaded listing images are kept in `src/backend/uploads/` and are limited to JPG, PNG, or WebP files up to 5 MB each.
