(function () {
  "use strict";
  const api = window.ReTradeAPI;
  if (!api) return;
  const file = window.location.pathname.split("/").pop().toLowerCase();
  const params = new URLSearchParams(window.location.search);
  let currentUser = null;

  function message(text) {
    if (typeof window.showToast === "function") window.showToast(text);
    else window.alert(text);
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[char],
    );
  }
  function money(value) {
    return (
      "$" +
      Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  window.bindSellerRatingCard = function (product) {
    const stars = document.querySelector(".seller-top .stars");
    if (!stars || !product?.id) return;
    const render = (rating, count) => {
      stars.innerHTML = `<span class="seller-rating-buttons" aria-label="Rate this seller">${[1, 2, 3, 4, 5].map((value) => `<button type="button" data-seller-rating="${value}" aria-label="Rate ${value} star${value === 1 ? "" : "s"}" title="Rate seller ${value}/5" style="border:0;background:transparent;color:#f59e0b;padding:0 1px;font:inherit;font-size:24px;cursor:pointer">★</button>`).join("")}</span> <small>${Number(rating || 0).toFixed(2)} · (${Number(count || 0)})</small>`;
    };
    render(product.seller_rating, product.rating_count);
    if (stars.dataset.ratingBound === "1") return;
    stars.dataset.ratingBound = "1";
    stars.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-seller-rating]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      if (!currentUser) {
        window.location.href = "login.html";
        return;
      }
      if (currentUser.role !== "buyer")
        return message("Only buyers can rate sellers.");
      try {
        const orders = await api.get("orders.php");
        let eligible = null;
        for (const order of orders) {
          for (const item of order.items || []) {
            if (
              Number(item.product_id) === Number(product.id) &&
              item.status === "delivered"
            ) {
              eligible = item;
              break;
            }
          }
          if (eligible) break;
        }
        if (!eligible)
          return message(
            "You can rate this seller after this product is delivered.",
          );
        const comment = window.prompt("Optional review comment:") || "";
        const result = await api.post("reviews.php", {
          order_item_id: Number(eligible.id),
          rating: Number(button.dataset.sellerRating),
          comment,
        });
        render(result.rating, result.rating_count);
        message("Seller rating submitted");
      } catch (error) {
        message(error.message);
      }
    });
  };
  function renderLineChart(svg, series, color) {
    if (!svg) return;
    const rows = series.length ? series : [{ month: "—", total: 0 }];
    const width = 700,
      height = 220,
      left = 45,
      right = 12,
      top = 15,
      bottom = 30,
      max = Math.max(1, ...rows.map((row) => Number(row.total)));
    const x = (index) =>
      rows.length === 1
        ? (left + width - right) / 2
        : left + (index * (width - left - right)) / (rows.length - 1);
    const y = (value) =>
      top + (1 - Number(value) / max) * (height - top - bottom);
    const points = rows
      .map((row, index) => `${x(index)},${y(row.total)}`)
      .join(" ");
    svg.innerHTML = `<line x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}" stroke="#eceef1"/><polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${rows.map((row, index) => `<text x="${x(index)}" y="${height - 7}" font-size="10.5" fill="#8a8f98" text-anchor="middle">${escapeHtml(row.month)}</text><circle cx="${x(index)}" cy="${y(row.total)}" r="5" fill="#fff" stroke="${color}" stroke-width="2.5"><title>${escapeHtml(row.month)}: ${money(row.total)}</title></circle>`).join("")}`;
  }
  function destination(role) {
    if (role === "admin") return "admin/adminOverview.html";
    if (role === "seller") return "seller/SellerOverview.html";
    return "landingwithlogin.html";
  }
  function saveUser(user) {
    currentUser = user;
    localStorage.setItem(
      "userRole",
      user.role === "buyer" ? "user" : user.role,
    );
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem(
      "userName",
      user.name || user.first_name + " " + user.last_name,
    );
  }
  async function session() {
    try {
      const user = await api.get("auth.php?action=me");
      saveUser(user);
      return user;
    } catch (_) {
      currentUser = null;
      localStorage.removeItem("userRole");
      return null;
    }
  }
  async function syncCart() {
    return api.get("cart.php");
  }

  document.addEventListener("DOMContentLoaded", async function () {
    const user = await session();
    const protectedArea = /\/(admin|buyer|seller)\//.test(
      window.location.pathname,
    );
    const authenticatedPage = [
      "cart.html",
      "payment.html",
      "chat.html",
      "sell.html",
    ].includes(file);
    if (protectedArea && !user) {
      window.location.href = "../login.html";
      return;
    }
    if (authenticatedPage && !user) {
      window.location.href = "login.html";
      return;
    }
    if (
      /\/admin\//.test(window.location.pathname) &&
      user &&
      user.role !== "admin"
    ) {
      window.location.href = "../landingwithlogin.html";
      return;
    }
    if (
      /\/seller\//.test(window.location.pathname) &&
      user &&
      user.role !== "seller"
    ) {
      window.location.href = "../landingwithlogin.html";
      return;
    }
    if (
      /\/buyer\//.test(window.location.pathname) &&
      user &&
      user.role !== "buyer"
    ) {
      window.location.href = "../landingwithlogin.html";
      return;
    }
    if (file === "sellerlisting.html" && params.get("create") === "1") {
      window.location.href = "../sell.html";
      return;
    }
    if (user) {
      const initials = (user.first_name[0] + user.last_name[0]).toUpperCase();
      document
        .querySelectorAll(".user-card .name,.profile-info strong")
        .forEach((node) => (node.textContent = user.name));
      document
        .querySelectorAll(".user-card .avatar,.avatar-top,.avatar-admin")
        .forEach((node) => (node.textContent = initials));
      document.querySelectorAll(".topbar p").forEach((node) => {
        if (node.textContent.trim().toLowerCase().startsWith("welcome back"))
          node.textContent = "Welcome back, " + user.first_name + "!";
      });
      if (user.role === "admin") {
        const subtitle = document.querySelector(
          ".header > div:first-child > p",
        );
        if (subtitle) {
          subtitle.innerHTML =
            '<span class="admin-live-dot" aria-hidden="true"></span> Live platform data <span class="admin-live-time">Updated now</span>';
        }
      }
    }

    document
      .querySelectorAll('a.logout, a[data-page="Logout"]')
      .forEach((link) =>
        link.addEventListener(
          "click",
          async (event) => {
            event.preventDefault();
            try {
              await api.post("auth.php?action=logout", {});
            } finally {
              localStorage.clear();
              window.location.href = link.closest(".shell")
                ? "../landing.html"
                : "landing.html";
            }
          },
          true,
        ),
      );

    if (file === "login.html") bindLogin();
    if (file === "signup.html") bindSignup();
    if (file === "landing.html" || file === "landingwithlogin.html")
      bindLanding();
    if (file === "fixedproductview.html") bindFixedProduct();
    if (file === "productview.html") bindAuctionProduct();
    if (file === "cart.html" && user) bindCart();
    if (file === "payment.html" && user) bindCheckout();
    if (file === "sell.html" && user) bindSell();
    if (file === "chat.html" && user) bindChat();
    if (file === "buyerwishlist.html" && user) bindWishlist();
    if (file === "buyernotification.html" && user) bindNotifications();
    if (file === "admincategorymanage.html" && user) bindCategories();
    if (file === "buyerauction.html" && user) bindBuyerAuctions();
    if (file === "sellerorders.html" && user) bindSellerOrders();
    if (file === "buyerorders.html" && user) bindBuyerOrders();
    if (file === "buyermessages.html" && user) bindMessagesPage();
    if (file === "sellermessages.html" && user) bindMessagesPage();
    if (file === "sellerlisting.html" && user) bindSellerListings();
    if (file === "sellerauctions.html" && user) bindSellerAuctions();
    if (file === "sellerwallet.html" && user) bindWalletPage();
    if (file === "sellernotifications.html" && user) bindSellerNotifications();
    if (
      (file === "selleranalytics.html" || file === "adminanalytics.html") &&
      user
    )
      bindAnalytics();
    if (protectedArea && user) bindDashboard();
    if (/\/admin\//.test(window.location.pathname) && user) bindAdmin();
    bindCommonActions();
  });

  function bindLogin() {
    const form = document.querySelector(".login-form");
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        try {
          const user = await api.post("auth.php?action=login", {
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
          });
          saveUser(user);
          window.location.href = destination(user.role);
        } catch (error) {
          message(error.message);
        }
      },
      true,
    );
  }
  function bindSignup() {
    const form = document.querySelector(".login-form");
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const password = document.getElementById("password").value;
        const confirmPassword =
          document.getElementById("confirmPassword").value;
        if (password !== confirmPassword)
          return message("Password and Confirm Password must match.");
        if (
          password.length < 8 ||
          !/[A-Za-z]/.test(password) ||
          !/[0-9]/.test(password)
        )
          return message(
            "Password must be at least 8 characters and include a letter and number.",
          );
        const role = document.getElementById("role").value;
        if (role === "seller") {
          const nid = document.getElementById("nidUpload").files[0];
          const license = document.getElementById("tradeLicense").files[0];
          const isPdf = (file) =>
            file &&
            (file.type === "application/pdf" ||
              file.name.toLowerCase().endsWith(".pdf"));
          if (!nid || !license)
            return message("NID and Trade Licence PDFs are required.");
          if (!isPdf(nid) || !isPdf(license))
            return message("NID and Trade Licence must be PDF files.");
        }
        try {
          const data = new FormData();
          data.append("first_name", document.getElementById("firstName").value);
          data.append("last_name", document.getElementById("lastName").value);
          data.append("email", document.getElementById("email").value);
          data.append("phone", document.getElementById("phone").value);
          data.append("role", role);
          data.append("password", password);
          data.append("confirm_password", confirmPassword);
          data.append(
            "business_name",
            document.getElementById("businessName").value,
          );
          data.append(
            "business_description",
            document.getElementById("businessDescription").value,
          );
          const nid = document.getElementById("nidUpload").files[0];
          const license = document.getElementById("tradeLicense").files[0];
          if (nid) data.append("nid_document", nid);
          if (license) data.append("trade_license", license);
          const result = await api.request("auth.php?action=register", {
            method: "POST",
            body: data,
          });
          message(
            result.approval_required
              ? "Account created. An admin must approve your seller account."
              : "Account created. You can now sign in.",
          );
          setTimeout(() => {
            window.location.href = "login.html";
          }, 800);
        } catch (error) {
          message(error.message);
        }
      },
      true,
    );
  }
  async function bindLanding() {
    try {
      const categorySlug = params.get("category") || "";
      const search = params.get("search") || "";
      const view = params.get("view") || "";
      const condition = params.get("condition") || "";
      const productQuery = new URLSearchParams();
      if (categorySlug) productQuery.set("category", categorySlug);
      if (search) productQuery.set("search", search);
      if (condition) productQuery.set("condition", condition);
      if (!categorySlug && !search && view !== "products")
        productQuery.set("sale_type", "fixed");
      const [products, categories, allAuctions] = await Promise.all([
        api.get("products.php?" + productQuery.toString()),
        api.get("categories.php"),
        api.get("auctions.php"),
      ]);
      const fixedProducts = products.filter(
        (product) => product.sale_type === "fixed",
      );
      let auctions = allAuctions;
      if (categorySlug)
        auctions = auctions.filter(
          (auction) => auction.category_slug === categorySlug,
        );
      if (condition)
        auctions = auctions.filter(
          (auction) => auction.condition_label === condition,
        );
      if (search) {
        const term = search.toLowerCase();
        auctions = auctions.filter((auction) =>
          (auction.title + " " + auction.description + " " + auction.category)
            .toLowerCase()
            .includes(term),
        );
      }
      const marketplaceProducts =
        view === "products" ? products : fixedProducts;
      const limitProducts =
        view === "products" || categorySlug || search
          ? marketplaceProducts
          : marketplaceProducts.slice(0, 4);
      const limitAuctions =
        view === "auctions" || categorySlug || search
          ? auctions
          : auctions.slice(0, 3);
      const auctionByProduct = new Map(
        allAuctions.map((auction) => [Number(auction.product_id), auction]),
      );
      const productGrid = document.querySelector(".product-grid");
      if (productGrid)
        productGrid.innerHTML = limitProducts.length
          ? limitProducts
              .map((p) => {
                const auction = auctionByProduct.get(Number(p.id));
                const open =
                  p.sale_type === "auction"
                    ? "openProduct"
                    : "openFixedProduct";
                const price =
                  p.sale_type === "auction"
                    ? Number(auction?.current_price || 0)
                    : Number(p.price);
                return `<div class="product-card" data-product="${escapeHtml(p.slug)}" onclick="${open}('${escapeHtml(p.slug)}')"><div class="product-image"><img src="${escapeHtml(p.images[0] || "")}" alt="${escapeHtml(p.title)}"><span>${escapeHtml(p.sale_type === "auction" ? "Live Auction" : p.condition_label)}</span></div><div class="product-info"><h3>${escapeHtml(p.title)}</h3><div class="price"><span>${money(price)}</span></div><div class="seller"><span>${escapeHtml((p.first_name || "") + " " + (p.last_name || "").slice(0, 1) + ".")}</span><span class="rating">★ ${Number(p.seller_rating || 0).toFixed(1)}</span></div></div></div>`;
              })
              .join("")
          : '<p class="catalog-empty">No products found.</p>';
      const auctionGrid = document.querySelector(".auction-grid");
      if (auctionGrid)
        auctionGrid.innerHTML = limitAuctions.length
          ? limitAuctions
              .map(
                (a) =>
                  `<div class="auction-card" data-product="${escapeHtml(a.slug)}" onclick="openProduct('${escapeHtml(a.slug)}')"><img src="${escapeHtml(a.images[0] || "")}" alt="${escapeHtml(a.title)}"><div class="auction-content"><span class="live-label">● ${new Date(a.ends_at).getTime() - Date.now() <= 86400000 ? "ENDING SOON" : escapeHtml(a.status.toUpperCase())}</span><h3>${escapeHtml(a.title)}</h3><div class="auction-price"><span>Current Bid</span><h2>${money(a.current_price)}</h2></div><div class="auction-bottom"><span>${Number(a.bid_count)} bidders</span><span>${escapeHtml(new Date(a.ends_at).toLocaleString())}</span></div></div></div>`,
              )
              .join("")
          : '<p class="catalog-empty">No live auctions found.</p>';
      const categoryGrid = document.querySelector(".categories-grid");
      if (categoryGrid) {
        const colors = [
          "blue",
          "pink",
          "green",
          "orange",
          "purple",
          "red",
          "cyan",
          "brown",
        ];
        const visibleCategories =
          view === "categories" ? categories : categories.slice(0, 8);
        categoryGrid.innerHTML = visibleCategories
          .map(
            (category, index) =>
              `<div class="category-card" role="link" tabindex="0" data-category="${escapeHtml(category.slug)}"><div class="category-icon ${colors[index % colors.length]}">${escapeHtml(category.icon || "📦")}</div><h4>${escapeHtml(category.name)}</h4><p>${Number(category.product_count).toLocaleString()} ${Number(category.product_count) === 1 ? "item" : "items"}</p></div>`,
          )
          .join("");
        const openCategory = (card) => {
          window.location.href =
            file +
            "?category=" +
            encodeURIComponent(card.dataset.category) +
            "#products";
        };
        categoryGrid.addEventListener("click", (event) => {
          const card = event.target.closest("[data-category]");
          if (card) openCategory(card);
        });
        categoryGrid.addEventListener("keydown", (event) => {
          const card = event.target.closest("[data-category]");
          if (card && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openCategory(card);
          }
        });
      }
      const sectionHeaders = document.querySelectorAll(".section-header");
      sectionHeaders.forEach((header) => {
        const title = header.querySelector("h2")?.textContent.trim() || "";
        const link = header.querySelector(".outline-btn");
        if (!link) return;
        if (title.includes("Popular Categories"))
          link.href = file + "?view=categories#categories";
        if (title.includes("Featured Products"))
          link.href = file + "?view=products#products";
        if (title.includes("Live Auctions"))
          link.href = file + "?view=auctions#auctions";
      });
      const cta = document.querySelector(".cta-primary");
      if (cta) cta.href = file + "?view=products#products";
      const marketplaceFooter = [
        ...document.querySelectorAll(".footer-column"),
      ].find(
        (column) =>
          column.querySelector("h4")?.textContent.trim() === "Marketplace",
      );
      if (marketplaceFooter) {
        const links = marketplaceFooter.querySelectorAll("a");
        if (links[0]) links[0].href = file + "?view=products#products";
        if (links[1]) links[1].href = file + "?view=auctions#auctions";
        if (links[2]) links[2].href = file + "?view=products#products";
        if (links[3]) links[3].href = file + "?view=auctions#auctions";
      }
      const sellFooter = [...document.querySelectorAll(".footer-column")].find(
        (column) => column.querySelector("h4")?.textContent.trim() === "Sell",
      );
      if (sellFooter) {
        const links = sellFooter.querySelectorAll("a");
        if (links[0]) links[0].href = currentUser ? "sell.html" : "login.html";
        if (links[1])
          links[1].href = currentUser
            ? currentUser.role === "seller"
              ? "seller/SellerOverview.html"
              : "buyer/BuyerOverview.html"
            : "login.html";
      }
      const selectedCategory = categories.find(
        (category) => category.slug === categorySlug,
      );
      const productTitle = document.querySelector(
        "#products .section-header h2",
      );
      if (
        productTitle &&
        (selectedCategory || search || view === "products" || condition)
      )
        productTitle.textContent = selectedCategory
          ? selectedCategory.name + " Products"
          : search
            ? "Search Results"
            : "All Marketplace Products";
      const productHeader = document.querySelector("#products .section-header");
      if (productHeader && !document.getElementById("conditionFilter")) {
        const filter = document.createElement("select");
        filter.id = "conditionFilter";
        filter.setAttribute("aria-label", "Filter by condition");
        filter.style.cssText =
          "margin-left:auto;padding:9px 12px;border:1px solid #dce3ec;border-radius:9px;background:#fff";
        filter.innerHTML =
          '<option value="">All conditions</option>' +
          ["New", "Like New", "Excellent", "Good", "Fair"]
            .map(
              (value) =>
                `<option value="${value}" ${condition === value ? "selected" : ""}>${value}</option>`,
            )
            .join("");
        filter.addEventListener("change", () => {
          const next = new URL(window.location.href);
          if (filter.value) next.searchParams.set("condition", filter.value);
          else next.searchParams.delete("condition");
          next.hash = "products";
          window.location.href = next.toString();
        });
        productHeader.appendChild(filter);
      }
      const runSearch = (input) => {
        const value = input.value.trim();
        if (value)
          window.location.href =
            file + "?search=" + encodeURIComponent(value) + "#products";
      };
      document
        .querySelectorAll(".nav-search input,.search-box input")
        .forEach((input) => {
          if (search) input.value = search;
          input.addEventListener(
            "keydown",
            (event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.stopImmediatePropagation();
                runSearch(input);
              }
            },
            true,
          );
        });
      document.querySelector(".search-box button")?.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          runSearch(document.querySelector(".search-box input"));
        },
        true,
      );
      document.querySelectorAll(".popular-search button").forEach((button) =>
        button.addEventListener("click", () => {
          window.location.href =
            file +
            "?search=" +
            encodeURIComponent(button.textContent.trim()) +
            "#products";
        }),
      );
      const stats = await api.get("stats.php");
      const sales = document.querySelector(".sales-card h2");
      if (sales) sales.textContent = money(stats.today_sales);
      const co2 = document.querySelector(".co2-card h2");
      if (co2)
        co2.textContent = Number(stats.co2_saved).toLocaleString() + " kg";
      const mini = document.querySelector(".mini-product");
      if (mini && stats.featured) {
        const img = mini.querySelector("img");
        if (img) img.src = stats.featured.image || "";
        mini.querySelector("h4").textContent = stats.featured.title;
        mini.querySelector("h3").textContent = money(stats.featured.price);
        mini.onclick = () =>
          (location.href =
            "fixedproductview.html?id=" +
            encodeURIComponent(stats.featured.slug));
      }
      if (categorySlug || search || view) {
        const target = document.getElementById(
          view === "auctions"
            ? "auctions"
            : view === "categories"
              ? "categories"
              : "products",
        );
        requestAnimationFrame(() => target?.scrollIntoView({ block: "start" }));
      }
    } catch (error) {
      console.error("Catalog sync failed", error);
    }
  }
  function bindFixedProduct() {
    window.addToCart = async function () {
      if (!currentUser) {
        window.location.href = "login.html";
        return;
      }
      try {
        const p = await api.get(
          "products.php?slug=" +
            encodeURIComponent(params.get("id") || "tissot-pr100"),
        );
        const quantity = Number(
          document.getElementById("quantity")?.value || 1,
        );
        await api.post("cart.php", { product_id: p.id, quantity });
        window.location.href = "cart.html";
      } catch (error) {
        message(error.message);
      }
    };
    document
      .querySelector(".purchase-actions button:first-child")
      ?.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!currentUser) {
          window.location.href = "login.html";
          return;
        }
        try {
          const product = await api.get(
            "products.php?slug=" +
              encodeURIComponent(params.get("id") || "tissot-pr100"),
          );
          await api.post("wishlist.php", { product_id: product.id });
          message("Saved to wishlist");
        } catch (error) {
          message(error.message);
        }
      });
  }
  function bindAuctionProduct() {
    let selectedAuction = null;
    async function refreshAuction() {
      const slug = params.get("id") || "leica";
      selectedAuction = await api.get(
        "auctions.php?slug=" + encodeURIComponent(slug),
      );
      const current = document.querySelector(".current-bid h2");
      if (current) current.textContent = money(selectedAuction.current_price);
      const minimum = document.querySelector(".bid-panel h3 strong");
      if (minimum)
        minimum.textContent =
          selectedAuction.status === "live"
            ? money(
                Number(selectedAuction.current_price) +
                  Number(selectedAuction.bid_increment),
              )
            : selectedAuction.can_purchase
              ? "You won this auction"
              : "Auction ended";
      const input = document.querySelector('.bid-panel input[type="number"]');
      if (input) {
        input.min =
          Number(selectedAuction.current_price) +
          Number(selectedAuction.bid_increment);
        input.disabled = selectedAuction.status !== "live";
      }
      const place = document.querySelector(".place-bid");
      if (place) {
        place.hidden = selectedAuction.status !== "live";
        place.style.display = selectedAuction.status === "live" ? "" : "none";
      }
      const buy = document.querySelector(".buy-now");
      if (buy) {
        buy.hidden = !selectedAuction.can_purchase;
        buy.style.display = selectedAuction.can_purchase ? "" : "none";
        buy.textContent =
          "Complete Purchase — " + money(selectedAuction.current_price);
      }
      const count = document.querySelector(".current-bid p");
      if (count)
        count.innerHTML =
          Number(selectedAuction.bid_count) +
          " bids · Starting at " +
          money(selectedAuction.starting_price);
      const history = document.querySelector(".bid-history");
      if (history && selectedAuction.bids)
        history.innerHTML = selectedAuction.bids
          .map(
            (bid) =>
              `<div class="bid-row"><div><span class="bid-user">${escapeHtml(bid.bidder)}</span><span class="bid-time">${escapeHtml(new Date(bid.placed_at).toLocaleString())}</span></div><span class="bid-amount">${money(bid.amount)}</span></div>`,
          )
          .join("");
    }
    window.placeBid = async function () {
      if (!currentUser) {
        window.location.href = "login.html";
        return;
      }
      const amount = Number(
        document.querySelector('.bid-panel input[type="number"]')?.value || 0,
      );
      try {
        if (!selectedAuction) await refreshAuction();
        const result = await api.post("auctions.php?action=bid", {
          auction_id: selectedAuction.id,
          amount,
        });
        await refreshAuction();
        document.querySelector('.bid-panel input[type="number"]').value =
          result.minimum_next_bid;
        message("Bid placed successfully.");
      } catch (error) {
        message(error.message);
      }
    };
    window.goToPayment = function () {
      if (!currentUser) {
        window.location.href = "login.html";
        return;
      }
      if (!selectedAuction?.can_purchase) {
        message("Only the highest bidder can purchase after the auction ends.");
        return;
      }
      window.location.href =
        "payment.html?id=" +
        encodeURIComponent(selectedAuction.slug) +
        "&source=" +
        encodeURIComponent(params.get("source") || "landingwithlogin") +
        "&page=productView.html&qty=1";
    };
    refreshAuction().catch((error) => message(error.message));
    setInterval(() => refreshAuction().catch(() => {}), 3000);
    document.addEventListener(
      "retrade:auction-ended",
      () => refreshAuction().catch((error) => message(error.message)),
      { once: true },
    );
    document
      .querySelector(".bid-actions button:first-child")
      ?.addEventListener("click", async (event) => {
        event.preventDefault();
        if (!currentUser) {
          window.location.href = "login.html";
          return;
        }
        try {
          const product = await api.get(
            "products.php?slug=" +
              encodeURIComponent(params.get("id") || "leica"),
          );
          await api.post("wishlist.php", { product_id: product.id });
          message("Saved to wishlist");
        } catch (error) {
          message(error.message);
        }
      });
    (async function () {
      try {
        const product = await api.get(
          "products.php?slug=" +
            encodeURIComponent(params.get("id") || "leica"),
        );
        const comments = await api.get("comments.php?product_id=" + product.id);
        const list = document.getElementById("commentList");
        if (list)
          list.innerHTML = comments
            .map(
              (item) =>
                `<article class="comment-card"><span class="comment-author">${escapeHtml(item.author)}</span><span class="comment-date">${escapeHtml(new Date(item.created_at).toLocaleString())}</span><p>${escapeHtml(item.body)}</p></article>`,
            )
            .join("");
        const form = document.getElementById("commentForm");
        if (form)
          form.addEventListener(
            "submit",
            async (event) => {
              event.preventDefault();
              event.stopImmediatePropagation();
              if (!currentUser) {
                window.location.href = "login.html";
                return;
              }
              const input = document.getElementById("commentInput");
              try {
                const item = await api.post("comments.php", {
                  product_id: product.id,
                  body: input.value,
                });
                const article = document.createElement("article");
                article.className = "comment-card";
                article.innerHTML = `<span class="comment-author">${escapeHtml(item.author)}</span><span class="comment-date">Just now</span><p>${escapeHtml(item.body)}</p>`;
                list.prepend(article);
                input.value = "";
              } catch (e) {
                message(e.message);
              }
            },
            true,
          );
        const reviews = await api.get("reviews.php?product_id=" + product.id);
        const reviewList = document.querySelector(".review-list");
        if (reviewList && reviews.length)
          reviewList.innerHTML = reviews
            .map(
              (item) =>
                `<article class="review-card"><span class="review-author">${escapeHtml(item.author)}</span><span class="review-date">${escapeHtml(new Date(item.created_at).toLocaleDateString())}</span><div class="review-rating">${"★".repeat(Number(item.rating))}${"☆".repeat(5 - Number(item.rating))}</div><p>${escapeHtml(item.comment || "")}</p></article>`,
            )
            .join("");
      } catch (error) {
        console.error("Product discussion sync failed", error);
      }
    })();
  }
  async function bindCart() {
    const container = document.getElementById("cartItems");
    async function render() {
      const cart = await syncCart();
      container.innerHTML = cart.items
        .map(
          (item) =>
            `<div class="cart-item"><div class="item-image" style="background-image:url('${escapeHtml(item.image || "")}')"></div><div class="item-info"><span class="item-tag">Available</span><h3 class="item-name">${escapeHtml(item.title)}</h3><div class="item-meta"><span>Marketplace listing</span></div><div class="qty-box"><button type="button" data-action="decrease" data-id="${Number(item.product_id)}">−</button><input type="number" min="1" value="${Number(item.quantity)}" data-action="qty" data-id="${Number(item.product_id)}"><button type="button" data-action="increase" data-id="${Number(item.product_id)}">+</button></div></div><div class="item-price"><div class="price-value">${money(Number(item.price) * Number(item.quantity))}</div><button class="remove-btn" data-action="remove" data-id="${Number(item.product_id)}">Remove</button></div></div>`,
        )
        .join("");
      document
        .getElementById("emptyState")
        .classList.toggle("show", !cart.items.length);
      document.getElementById("cartCount").textContent = cart.count + " items";
      document.getElementById("summaryItems").textContent = money(
        cart.subtotal,
      );
      document.getElementById("summaryShipping").textContent = money(
        cart.items.length ? 15 : 0,
      );
      document.getElementById("summaryTax").textContent = money(0);
      document.getElementById("summaryTotal").textContent = money(
        Number(cart.subtotal) + (cart.items.length ? 15 : 0),
      );
      return cart;
    }
    await render();
    container.addEventListener(
      "click",
      async (event) => {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const id = Number(button.dataset.id);
        try {
          if (button.dataset.action === "remove")
            await api.delete("cart.php", { product_id: id });
          else {
            const input = container.querySelector(
              `[data-action="qty"][data-id="${id}"]`,
            );
            const delta = button.dataset.action === "increase" ? 1 : -1;
            await api.patch("cart.php", {
              product_id: id,
              quantity: Math.max(1, Number(input.value) + delta),
            });
          }
          await render();
        } catch (error) {
          message(error.message);
        }
      },
      true,
    );
    container.addEventListener(
      "change",
      async (event) => {
        const input = event.target.closest('[data-action="qty"]');
        if (!input) return;
        event.stopImmediatePropagation();
        try {
          await api.patch("cart.php", {
            product_id: Number(input.dataset.id),
            quantity: Math.max(1, Number(input.value)),
          });
          await render();
        } catch (error) {
          message(error.message);
        }
      },
      true,
    );
    document.getElementById("checkoutBtn").addEventListener(
      "click",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const cart = await syncCart();
        if (!cart.items.length) return message("Your cart is empty");
        window.location.href = "payment.html";
      },
      true,
    );
  }
  async function bindCheckout() {
    const form = document.getElementById("checkoutForm");
    const returnSlug = params.get("id");
    const requestedPage = params.get("page");
    const returnPage = ["productView.html", "fixedproductview.html"].includes(
      requestedPage,
    )
      ? requestedPage
      : null;
    const goBack = () => {
      if (!returnSlug) {
        window.location.href = "cart.html";
        return;
      }
      window.location.href =
        (returnPage ||
          (file === "payment.html"
            ? "fixedproductview.html"
            : "landingwithlogin.html")) +
        "?id=" +
        encodeURIComponent(returnSlug) +
        "&source=" +
        encodeURIComponent(params.get("source") || "landingwithlogin");
    };
    document.querySelectorAll("#backToProductBtn,#cancelLink").forEach((node) =>
      node.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          goBack();
        },
        true,
      ),
    );
    document.getElementById("fullName").value = currentUser.name || "";
    document.getElementById("email").value = currentUser.email || "";
    try {
      let item,
        subtotal = 0;
      const slug = params.get("id");
      if (slug) {
        item = await api.get("products.php?slug=" + encodeURIComponent(slug));
        let unit = Number(item.price);
        if (item.sale_type === "auction") {
          const auction = await api.get(
            "auctions.php?slug=" + encodeURIComponent(slug),
          );
          if (!auction.can_purchase)
            throw new Error(
              "Only the highest bidder can purchase this ended auction.",
            );
          unit = Number(auction.current_price || 0);
        }
        item.checkout_price = unit;
        subtotal = unit * Number(params.get("qty") || 1);
      } else {
        const cart = await api.get("cart.php");
        item = cart.items[0];
        subtotal = Number(cart.subtotal);
      }
      if (item) {
        const image = document.getElementById("summaryImage");
        if (image && (item.images?.[0] || item.image))
          image.src = item.images?.[0] || item.image;
        document.getElementById("summaryName").textContent = item.title;
        document.getElementById("summaryPrice").textContent = money(
          item.checkout_price ?? item.price,
        );
        const count = slug
          ? Number(params.get("qty") || 1)
          : (await api.get("cart.php")).count;
        document.getElementById("summaryQuantity").textContent = count;
        document.getElementById("subtotalValue").textContent = money(subtotal);
        document.getElementById("deliveryValue").textContent = money(15);
        const taxNode = document.getElementById("taxValue");
        if (taxNode) taxNode.textContent = money(0);
        document.getElementById("totalValue").textContent = money(
          subtotal + 15,
        );
      }
    } catch (error) {
      message(error.message);
    }
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (typeof window.validateForm === "function" && !window.validateForm())
          return;
        const selected =
          document.querySelector('input[name="paymentMethod"]:checked')
            ?.value || "cod";
        const methods = {
          cod: "cash_on_delivery",
          mobile: "wallet",
          card: "card",
        };
        let items = [];
        const slug = params.get("id");
        if (slug) {
          try {
            const p = await api.get(
              "products.php?slug=" + encodeURIComponent(slug),
            );
            items = [
              { product_id: p.id, quantity: Number(params.get("qty") || 1) },
            ];
          } catch (_) {}
        }
        try {
          const result = await api.post("orders.php?action=checkout", {
            shipping_name: document.getElementById("fullName").value,
            shipping_email: document.getElementById("email").value,
            shipping_phone: document.getElementById("phone").value,
            shipping_address: [
              document.getElementById("address").value,
              document.getElementById("city").value,
              document.getElementById("postalCode").value,
            ].join(", "),
            payment_method: methods[selected],
            items,
          });
          const box = document.getElementById("confirmationBox");
          box.innerHTML =
            '<h3>Order placed successfully!</h3><p>Your order has been securely recorded.</p><p style="margin-top:10px;font-weight:700">Order ID: ' +
            escapeHtml(result.order_number) +
            "</p>";
          box.classList.add("show");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          message(error.message);
        }
      },
      true,
    );
  }
  function bindSell() {
    const form = document.getElementById("sellForm");
    const categorySelect = document.getElementById("category");
    const categoriesPromise = api.get("categories.php").then((categories) => {
      categorySelect.innerHTML =
        '<option value="">Select category</option>' +
        categories
          .map(
            (category) =>
              `<option value="${escapeHtml(category.name)}">${escapeHtml(category.name)}</option>`,
          )
          .join("");
      return categories;
    });
    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        try {
          const categories = await categoriesPromise;
          const categoryName = document
            .getElementById("category")
            .value.toLowerCase();
          const category = categories.find(
            (c) => c.name.toLowerCase() === categoryName,
          );
          if (!category) throw new Error("Choose a valid category.");
          const documentFiles = Array.from(
            document.getElementById("documents").files,
          );
          if (!documentFiles.length)
            throw new Error("Upload at least one product paper in PDF format.");
          if (
            documentFiles.some(
              (file) =>
                file.type !== "application/pdf" &&
                !file.name.toLowerCase().endsWith(".pdf"),
            )
          )
            throw new Error("Product papers must be PDF files.");
          const formData = new FormData();
          Array.from(document.getElementById("images").files)
            .slice(0, 5)
            .forEach((file) => formData.append("images[]", file));
          const images = await api.request("upload.php", {
            method: "POST",
            body: formData,
          });
          const documentData = new FormData();
          documentFiles
            .slice(0, 5)
            .forEach((file) => documentData.append("documents[]", file));
          const documents = await api.request("upload.php?type=documents", {
            method: "POST",
            body: documentData,
          });
          let condition = document.getElementById("condition").value;
          if (condition === "Brand New") condition = "New";
          const saleType =
            document.getElementById("listingType").value === "auction"
              ? "auction"
              : "fixed";
          await api.post("products.php", {
            title: document.getElementById("title").value,
            category_id: category.id,
            condition,
            sale_type: saleType,
            price: Number(document.getElementById("price").value),
            description: document.getElementById("description").value,
            location: document.getElementById("location").value,
            images,
            documents: documents.map((document) => document.token),
            auction_end_time:
              saleType === "auction"
                ? document.getElementById("auctionEndTime").value
                : null,
            bid_increment: Number(
              document.getElementById("bidIncrement").value || 10,
            ),
            reserve_price: document.getElementById("reservePrice").value,
          });
          message("Listing submitted for approval");
          setTimeout(() => {
            window.location.href = "seller/SellerListing.html";
          }, 700);
        } catch (error) {
          message(error.message);
        }
      },
      true,
    );
  }
  async function bindChat() {
    try {
      const product = await api.get(
        "products.php?slug=" +
          encodeURIComponent(params.get("id") || "tissot-pr100"),
      );
      let displayPrice = Number(product.price || 0);
      if (product.sale_type === "auction") {
        const auction = await api.get(
          "auctions.php?slug=" + encodeURIComponent(product.slug),
        );
        displayPrice = Number(auction.current_price || 0);
      }
      const sellerName = (
        (product.first_name || "") +
        " " +
        (product.last_name || "")
      ).trim();
      const sellerInitials = (
        (product.first_name?.[0] || "") + (product.last_name?.[0] || "")
      ).toUpperCase();
      const image = document.getElementById("chatProductImage");
      if (image && product.images[0]) image.src = product.images[0];
      document.getElementById("chatProductName").textContent = product.title;
      document.getElementById("chatProductPrice").textContent =
        money(displayPrice);
      const sellerHeading = document.querySelector(".seller-profile h3");
      if (sellerHeading) sellerHeading.textContent = sellerName;
      const sellerAvatar = document.querySelector(
        ".seller-profile .chat-avatar",
      );
      if (sellerAvatar) sellerAvatar.textContent = sellerInitials;
      const chatList = document.querySelector(".chat-list");
      if (chatList)
        chatList.innerHTML = `<div class="chat-item active"><div class="chat-avatar">${escapeHtml(sellerInitials)}</div><div class="chat-user"><h4>${escapeHtml(sellerName)}</h4><p>${escapeHtml(product.title)}</p></div></div>`;
      const messages = document.getElementById("messages");
      async function loadHistory() {
        const history = await api.get(
          `messages.php?user_id=${Number(product.seller_id)}&product_id=${Number(product.id)}`,
        );
        messages.innerHTML = history
          .map(
            (item) =>
              `<div class="message ${Number(item.sender_id) === Number(currentUser.id) ? "outgoing" : "incoming"}">${escapeHtml(item.body)}</div>`,
          )
          .join("");
        messages.scrollTop = messages.scrollHeight;
      }
      await loadHistory();
      setInterval(() => loadHistory().catch(() => {}), 3000);
      window.sendMessage = async function () {
        const input = document.getElementById("messageInput");
        const body = input.value.trim();
        if (!body) return;
        try {
          await api.post("messages.php", {
            receiver_id: product.seller_id,
            product_id: product.id,
            body,
          });
          input.value = "";
          await loadHistory();
        } catch (error) {
          message(error.message);
        }
      };
      const button = document.getElementById("sendButton");
      button.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.sendMessage();
        },
        true,
      );
      document.getElementById("messageInput").addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.sendMessage();
          }
        },
        true,
      );
    } catch (error) {
      message(error.message);
    }
  }
  async function bindWishlist() {
    const grid = document.getElementById("wishGrid");
    try {
      const items = await api.get("wishlist.php");
      grid.innerHTML = items
        .map(
          (item) =>
            `<div class="card" data-product-id="${Number(item.id)}" data-slug="${escapeHtml(item.slug)}" data-name="${escapeHtml(item.title)}"><div class="img" style="background-image:url('${escapeHtml(item.image || "")}')"><div class="tag">${escapeHtml(item.condition_label)}</div>${item.sale_type === "auction" ? '<div class="tag live">Live Auction</div>' : ""}<button class="heart-btn" data-action="heart">❤</button></div><div class="body"><div class="name">${escapeHtml(item.title)}</div><div class="price-row"><span class="${item.sale_type === "auction" ? "bid-val" : "price"}">$${Number(item.current_price || item.price || 0).toLocaleString()}</span></div><div class="card-actions"><button class="btn ${item.sale_type === "auction" ? "btn-bid" : "btn-buy"}" data-action="${item.sale_type === "auction" ? "bid" : "buy"}">${item.sale_type === "auction" ? "Place Bid" : "Buy Now"}</button><button class="btn btn-remove" data-action="remove">✕</button></div></div></div>`,
        )
        .join("");
      if (typeof window.checkEmpty === "function") window.checkEmpty();
      grid.addEventListener(
        "click",
        async (event) => {
          const button = event.target.closest("[data-action]");
          if (!button) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          const card = button.closest(".card");
          const action = button.dataset.action;
          if (action === "buy")
            window.location.href =
              "../payment.html?id=" +
              encodeURIComponent(card.dataset.slug) +
              "&source=landingwithlogin&page=fixedproductview.html";
          else if (action === "bid")
            window.location.href =
              "../productView.html?id=" +
              encodeURIComponent(card.dataset.slug) +
              "&source=landingwithlogin";
          else {
            try {
              await api.delete("wishlist.php", {
                product_id: Number(card.dataset.productId),
              });
              card.remove();
              if (typeof window.checkEmpty === "function") window.checkEmpty();
              message("Removed from wishlist");
            } catch (e) {
              message(e.message);
            }
          }
        },
        true,
      );
    } catch (error) {
      message(error.message);
    }
  }
  async function bindNotifications() {
    const list = document.getElementById("notifList");
    if (!list) return;
    try {
      const items = await api.get("notifications.php");
      list.innerHTML = items
        .map(
          (item) =>
            `<div class="notif-item ${item.read_at ? "" : "unread"}" data-id="${Number(item.id)}"><div class="notif-ic ic-bell">🔔</div><div class="notif-body"><div class="notif-title">${escapeHtml(item.title)}</div><div class="notif-desc">${escapeHtml(item.message)}</div></div><div class="notif-right"><div class="notif-time">${escapeHtml(new Date(item.created_at).toLocaleDateString())}</div><div class="unread-dot ${item.read_at ? "hidden" : ""}"></div></div></div>`,
        )
        .join("");
      if (typeof window.updateUnreadCount === "function")
        window.updateUnreadCount();
      document.getElementById("markAllBtn")?.addEventListener(
        "click",
        async (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          try {
            await api.patch("notifications.php", { all: true });
            list
              .querySelectorAll(".unread")
              .forEach((node) => node.classList.remove("unread"));
            if (typeof window.updateUnreadCount === "function")
              window.updateUnreadCount();
            message("All notifications marked as read");
          } catch (e) {
            message(e.message);
          }
        },
        true,
      );
      list.addEventListener(
        "click",
        async (event) => {
          const item = event.target.closest(".notif-item");
          if (!item || !item.classList.contains("unread")) return;
          event.stopImmediatePropagation();
          try {
            await api.patch("notifications.php", {
              id: Number(item.dataset.id),
            });
            item.classList.remove("unread");
            if (typeof window.updateUnreadCount === "function")
              window.updateUnreadCount();
          } catch (e) {
            message(e.message);
          }
        },
        true,
      );
    } catch (error) {
      message(error.message);
    }
  }
  async function bindCategories() {
    const list = document.querySelector(".category-list");
    const form = document.querySelector(".category-form");
    async function render() {
      const categories = await api.get("categories.php");
      list.innerHTML = categories
        .map(
          (item, index) =>
            `<div class="category-row"><div class="category-left"><div class="category-avatar avatar-${(index % 4) + 1}">${escapeHtml(item.icon || item.name.slice(0, 1))}</div><div class="category-details"><h3>${escapeHtml(item.name)}</h3><p>${Number(item.product_count)} listings</p></div></div><button class="view-btn" data-id="${Number(item.id)}">Edit</button></div>`,
        )
        .join("");
    }
    try {
      await render();
      form.addEventListener(
        "submit",
        async (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          const input = form.querySelector("input");
          try {
            await api.post("categories.php", { name: input.value });
            input.value = "";
            await render();
            message("Category created");
          } catch (e) {
            message(e.message);
          }
        },
        true,
      );
      list.addEventListener("click", async (event) => {
        const button = event.target.closest(".view-btn");
        if (!button) return;
        const name = prompt(
          "Category name:",
          button.closest(".category-row").querySelector("h3").textContent,
        );
        if (!name) return;
        try {
          await api.patch("categories.php", {
            id: Number(button.dataset.id),
            name,
          });
          await render();
          message("Category updated");
        } catch (e) {
          message(e.message);
        }
      });
    } catch (error) {
      message(error.message);
    }
  }
  async function bindBuyerAuctions() {
    try {
      let auctions = [],
        selected = null;
      const list = document.getElementById("auctionList");
      async function render() {
        auctions = await api.get("auctions.php?scope=mine");
        list.innerHTML = auctions
          .map((auction) => {
            const winning =
              Number(auction.highest_bidder_id) === Number(currentUser.id);
            const label =
              auction.status === "live"
                ? winning
                  ? "Winning"
                  : "Outbid"
                : auction.can_purchase
                  ? "Won — payment due"
                  : auction.status;
            const action =
              auction.status === "live"
                ? '<button class="bid-btn" data-action="bid">Raise Bid</button>'
                : auction.can_purchase
                  ? '<button class="bid-btn" data-action="purchase">Complete Purchase</button>'
                  : "";
            return `<div class="auction-card" data-auction-id="${Number(auction.id)}" data-slug="${escapeHtml(auction.slug)}" data-name="${escapeHtml(auction.title)}" data-current="${Number(auction.current_price)}"><img class="a-thumb" src="${escapeHtml(auction.images?.[0] || "")}" alt=""><div class="a-info"><div class="a-title">${escapeHtml(auction.title)}</div><div class="a-meta"><div>Your Bid<b>${money(auction.user_bid)}</b></div><div class="current">Current<b>${money(auction.current_price)}</b></div><div class="ends">Ends<b>${escapeHtml(new Date(auction.ends_at).toLocaleString())}</b></div></div></div><div class="a-right"><div class="status-pill ${winning ? "status-live" : "status-outbid"}">${escapeHtml(label)}</div>${action}</div></div>`;
          })
          .join("");
        const active = document.getElementById("activeBidsCount");
        if (active)
          active.textContent = auctions.filter(
            (a) => a.status === "live",
          ).length;
        const winning = document.getElementById("winningCount");
        if (winning)
          winning.textContent = auctions.filter(
            (a) => a.status === "live" && a.is_highest_bidder,
          ).length;
      }
      await render();
      list.addEventListener(
        "click",
        (event) => {
          const button = event.target.closest("[data-action]");
          if (!button) return;
          selected = button.closest(".auction-card");
          if (button.dataset.action === "purchase") {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location.href =
              "../payment.html?id=" +
              encodeURIComponent(selected.dataset.slug) +
              "&source=landingwithlogin&page=productView.html&qty=1";
          }
        },
        true,
      );
      document.getElementById("confirmBid").addEventListener(
        "click",
        async (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          if (!selected) return;
          const amount = Number(document.getElementById("bidAmount").value);
          try {
            await api.post("auctions.php?action=bid", {
              auction_id: Number(selected.dataset.auctionId),
              amount,
            });
            await render();
            message("Bid placed successfully");
            document.getElementById("bidModal")?.classList.remove("show");
          } catch (e) {
            message(e.message);
          }
        },
        true,
      );
      setInterval(() => render().catch(() => {}), 3000);
    } catch (error) {
      message(error.message);
    }
  }
  async function bindSellerOrders() {
    try {
      let orders = [];
      const body = document.querySelector(".data-table tbody");
      async function render() {
        orders = await api.get("orders.php");
        body.innerHTML = orders
          .map(
            (order) =>
              `<tr data-item-id="${Number(order.item_id)}"><td><strong>#${escapeHtml(order.order_number)}</strong></td><td>${escapeHtml(order.shipping_name)}</td><td><div class="order-item">${order.image ? `<img src="${escapeHtml(order.image)}" alt="">` : ""}<span class="order-item-name">${escapeHtml(order.title_snapshot)}</span></div></td><td>${money(Number(order.unit_price) * Number(order.quantity))}</td><td><span class="status ${order.item_status === "rejected" ? "red" : order.item_status === "delivered" ? "green" : "amber"}">${escapeHtml(order.item_status)}</span></td><td>${escapeHtml(new Date(order.placed_at).toLocaleDateString())}</td><td><div class="order-actions"><button class="order-action handover-action" data-action="details">Details</button><button class="order-action" data-action="receipt" data-order-id="${Number(order.id)}">Receipt</button>${order.item_status === "pending" ? '<button class="order-action approve-action" data-action="approve">Approve</button><button class="order-action reject-action" data-action="reject">Reject</button>' : ""}</div></td></tr>`,
          )
          .join("");
      }
      await render();
      async function update(button, status) {
        const row = button.closest("tr");
        try {
          await api.patch("orders.php", {
            item_id: Number(row.dataset.itemId),
            status,
          });
          await render();
          message("Order status updated");
        } catch (e) {
          message(e.message);
        }
      }
      let active = null;
      function details(button) {
        const row = button.closest("tr");
        active = orders.find(
          (o) => Number(o.item_id) === Number(row.dataset.itemId),
        );
        if (!active) return;
        const values = {
          orderDetailsProduct: active.title_snapshot,
          orderDetailsOrder:
            "#" + active.order_number + " · " + active.shipping_name,
          detailTitle: active.title_snapshot,
          detailCategory: active.category,
          detailCondition: active.condition_label,
          detailListingType: active.sale_type,
          detailPrice: money(
            Number(active.unit_price) * Number(active.quantity),
          ),
          detailOriginalPrice: "—",
          detailBuyer: active.shipping_name,
          detailDate: new Date(active.placed_at).toLocaleString(),
          detailLocation: active.location || active.shipping_address,
          detailShipping: money(active.shipping_amount),
          detailTags: "—",
          detailStatus: active.item_status,
          detailDescription: active.description || "",
          detailDocuments: "—",
        };
        Object.entries(values).forEach(([id, value]) => {
          const node = document.getElementById(id);
          if (node) node.textContent = value;
        });
        const image = document.getElementById("orderDetailsImage");
        if (image) image.src = active.image || "";
        document.getElementById("orderDetailsModal").hidden = false;
      }
      body.addEventListener(
        "click",
        (event) => {
          const button = event.target.closest("[data-action]");
          if (!button) return;
          event.preventDefault();
          if (button.dataset.action === "receipt") {
            window.location.href =
              api.base +
              "reports.php?type=receipt&order_id=" +
              Number(button.dataset.orderId);
            return;
          }
          if (button.dataset.action === "details") details(button);
          if (button.dataset.action === "approve") update(button, "approved");
          if (button.dataset.action === "reject") update(button, "rejected");
        },
        true,
      );
      window.closeOrderDetails = () => {
        document.getElementById("orderDetailsModal").hidden = true;
        active = null;
      };
      window.updateOrderStatus = async (label) => {
        if (!active) return;
        const map = {
          "Awaiting shipment": "approved",
          "In transit": "shipped",
          "Handed over to delivery": "shipped",
          Delivered: "delivered",
        };
        try {
          await api.patch("orders.php", {
            item_id: Number(active.item_id),
            status: map[label] || "processing",
          });
          document.getElementById("orderDetailsModal").hidden = true;
          active = null;
          await render();
          message("Order status updated");
        } catch (error) {
          message(error.message);
        }
      };
      setInterval(async () => {
        try {
          const activeId = active ? Number(active.item_id) : null;
          await render();
          if (activeId) {
            active =
              orders.find((order) => Number(order.item_id) === activeId) ||
              null;
            const status = document.getElementById("detailStatus");
            if (status && active) status.textContent = active.item_status;
          }
        } catch (_) {}
      }, 8000);
    } catch (error) {
      message(error.message);
    }
  }
  async function bindBuyerOrders() {
    try {
      let orders = await api.get("orders.php");
      const list = document.getElementById("orderList");
      const pagination = document.getElementById("pagination");
      let rows = orders.flatMap((order) =>
        order.items.map((item) => ({ order, item })),
      );
      let filter = "all",
        page = 1,
        activeTracking = null;
      const pageSize = 5;
      const group = (order) => {
        const status = (
          order.delivery_status ||
          order.status ||
          ""
        ).toLowerCase();
        if (status === "delivered") return "delivered";
        if (["shipped", "in_transit", "out_for_delivery"].includes(status))
          return "transit";
        return "pending";
      };
      function render() {
        const filtered = rows.filter(
          (row) => filter === "all" || group(row.order) === filter,
        );
        const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
        page = Math.min(page, pages);
        const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
        list.innerHTML = visible.length
          ? visible
              .map(
                ({ order, item }) =>
                  `<div class="order-card" data-status="${group(order)}" data-order-id="${Number(order.id)}" data-item-id="${Number(item.id)}"><img class="order-thumb" src="${escapeHtml(item.image || "")}" alt=""><div class="order-info"><div class="order-title">${escapeHtml(item.title_snapshot)}</div><div class="order-sub">#${escapeHtml(order.order_number)}</div><div class="order-price">${money(Number(item.unit_price) * Number(item.quantity))}</div></div><div class="order-right"><div class="order-status ${group(order) === "delivered" ? "status-delivered" : group(order) === "transit" ? "status-shipping" : "status-pending"}">${escapeHtml(order.delivery_status || order.status)}</div><div class="order-actions"><button class="btn" data-action="receipt">↓ Receipt</button>${order.tracking_number && group(order) !== "delivered" ? '<button class="btn btn-track" data-action="track">🚚 Track</button>' : ""}${group(order) === "delivered" ? '<button class="btn btn-review" data-action="review">★ Review</button>' : ""}</div></div></div>`,
              )
              .join("")
          : "<p>No orders found for this status.</p>";
        pagination.innerHTML = `<button class="page-btn nav" data-page="prev" ${page === 1 ? "disabled" : ""}>‹</button>${Array.from({ length: pages }, (_, index) => `<button class="page-btn ${index + 1 === page ? "active" : ""}" data-page="${index + 1}">${index + 1}</button>`).join("")}<button class="page-btn nav" data-page="next" ${page === pages ? "disabled" : ""}>›</button>`;
      }
      render();
      document.querySelectorAll(".tabs .tab").forEach((tab) =>
        tab.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            document
              .querySelectorAll(".tabs .tab")
              .forEach((node) => node.classList.remove("active"));
            tab.classList.add("active");
            filter = tab.dataset.filter;
            page = 1;
            render();
          },
          true,
        ),
      );
      pagination.addEventListener(
        "click",
        (event) => {
          const button = event.target.closest("[data-page]");
          if (!button || button.disabled) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          page =
            button.dataset.page === "prev"
              ? page - 1
              : button.dataset.page === "next"
                ? page + 1
                : Number(button.dataset.page);
          render();
        },
        true,
      );
      list.addEventListener(
        "click",
        async (event) => {
          const button = event.target.closest("[data-action]");
          if (!button) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          const card = button.closest(".order-card");
          const order = orders.find(
            (row) => Number(row.id) === Number(card.dataset.orderId),
          );
          const item = order.items.find(
            (row) => Number(row.id) === Number(card.dataset.itemId),
          );
          if (button.dataset.action === "receipt") {
            window.location.href =
              api.base +
              "reports.php?type=receipt&order_id=" +
              Number(order.id);
            return;
          }
          if (button.dataset.action === "review") {
            const rating = Number(prompt("Rating from 1 to 5:"));
            if (!Number.isInteger(rating) || rating < 1 || rating > 5)
              return message("Enter a rating from 1 to 5.");
            const comment = prompt("Write your review:") || "";
            try {
              await api.post("reviews.php", {
                order_item_id: Number(item.id),
                rating,
                comment,
              });
              button.remove();
              message("Review published");
            } catch (error) {
              message(error.message);
            }
            return;
          }
          activeTracking = order;
          document.getElementById("trackingProduct").textContent =
            item.title_snapshot;
          document.getElementById("trackingOrderId").textContent =
            "#" + order.order_number;
          document.getElementById("trackingImage").src = item.image || "";
          document.getElementById("trackingPlaced").textContent = new Date(
            order.placed_at,
          ).toLocaleString();
          document.getElementById("trackingEstimated").textContent =
            order.estimated_delivery
              ? new Date(order.estimated_delivery).toLocaleDateString()
              : "Pending";
          document.getElementById("trackingAddress").textContent =
            order.shipping_address;
          const person = document.getElementById("trackingPerson");
          if (person) person.textContent = order.carrier || "Delivery partner";
          const deliveryLabel = String(
            order.delivery_status || order.status || "pending",
          ).replaceAll("_", " ");
          const pill = document.querySelector(".tracking-pill");
          if (pill)
            pill.textContent =
              "● " +
              deliveryLabel.replace(/\b\w/g, (char) => char.toUpperCase());
          const note = document.getElementById("trackingNote");
          if (note) note.textContent = "● " + deliveryLabel;
          const expected = document.getElementById("trackingExpected");
          if (expected)
            expected.textContent = order.estimated_delivery
              ? "Expected " +
                new Date(order.estimated_delivery).toLocaleDateString()
              : "Pending";
          const confirmButton = document.getElementById(
            "deliveryConfirmButton",
          );
          if (confirmButton) confirmButton.hidden = group(order) !== "transit";
          document.getElementById("trackingModal").hidden = false;
        },
        true,
      );
      window.openDeliveryConfirm = () => {
        if (!activeTracking) return;
        document.getElementById("trackingModal").hidden = true;
        document.getElementById("deliveryWarningModal").hidden = false;
      };
      window.closeDeliveryConfirm = () => {
        document.getElementById("deliveryWarningModal").hidden = true;
        document.getElementById("trackingModal").hidden = false;
      };
      window.closeTracking = () => {
        document.getElementById("trackingModal").hidden = true;
        activeTracking = null;
      };
      document.getElementById("confirmDeliveryYes")?.addEventListener(
        "click",
        async (event) => {
          event.preventDefault();
          if (!activeTracking) return;
          const button = event.currentTarget;
          button.disabled = true;
          try {
            await api.patch("orders.php?action=confirm-delivery", {
              order_id: Number(activeTracking.id),
            });
            orders = await api.get("orders.php");
            rows = orders.flatMap((order) =>
              order.items.map((item) => ({ order, item })),
            );
            document.getElementById("deliveryWarningModal").hidden = true;
            document.getElementById("trackingModal").hidden = true;
            activeTracking = null;
            render();
            message("Order marked as delivered");
          } catch (error) {
            message(error.message);
            document.getElementById("deliveryWarningModal").hidden = true;
            document.getElementById("trackingModal").hidden = false;
          } finally {
            button.disabled = false;
          }
        },
        true,
      );
      document.getElementById("bellBtn")?.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.location.href = "BuyerNotification.html";
        },
        true,
      );
    } catch (error) {
      message(error.message);
    }
  }
  async function bindMessagesPage() {
    const conversations =
      document.getElementById("convList") ||
      document.querySelector(".conversation");
    const chat =
      document.getElementById("chatBody") ||
      document.querySelector(".chat-body");
    const input =
      document.getElementById("msgInput") || document.getElementById("message");
    const send =
      document.getElementById("sendBtn") ||
      document.querySelector(".chat-compose button");
    if (!conversations || !chat || !input || !send) return;
    let selected = null;
    try {
      const rows = await api.get("messages.php?action=conversations");
      conversations.innerHTML = rows
        .map(
          (row, index) =>
            `<div class="${document.getElementById("convList") ? "conv-item" : "conversation-item"} ${index === 0 ? "active" : ""}" data-user-id="${Number(row.user_id)}"><div class="${document.getElementById("convList") ? "conv-av" : "avatar"}">${escapeHtml(
              row.name
                .split(" ")
                .map((v) => v[0])
                .join("")
                .slice(0, 2),
            )}</div><div><div class="${document.getElementById("convList") ? "conv-name" : "row-title"}">${escapeHtml(row.name)}</div><div class="${document.getElementById("convList") ? "conv-last" : "row-sub"}">${escapeHtml(row.last_message || "")}</div></div></div>`,
        )
        .join("");
      async function open(userId) {
        selected = Number(userId);
        const selectedRow = rows.find(
          (row) => Number(row.user_id) === selected,
        );
        const chatName = document.getElementById("chatName");
        if (chatName && selectedRow) chatName.textContent = selectedRow.name;
        const sellerHead = document.querySelector(".chat-head");
        if (sellerHead && !chatName && selectedRow)
          sellerHead.textContent = selectedRow.name;
        const messages = await api.get("messages.php?user_id=" + selected);
        chat.innerHTML = messages
          .map(
            (item) =>
              `<div class="${document.getElementById("chatBody") ? "bubble " + (Number(item.sender_id) === Number(currentUser.id) ? "sent" : "received") : "bubble " + (Number(item.sender_id) === Number(currentUser.id) ? "mine" : "")}">${escapeHtml(item.body)}</div>`,
          )
          .join("");
        chat.scrollTop = chat.scrollHeight;
      }
      if (rows[0]) await open(rows[0].user_id);
      conversations.addEventListener("click", (event) => {
        const row = event.target.closest("[data-user-id]");
        if (row) open(row.dataset.userId);
      });
      async function submit(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const body = input.value.trim();
        if (!body || !selected) return;
        try {
          await api.post("messages.php", { receiver_id: selected, body });
          input.value = "";
          await open(selected);
        } catch (error) {
          message(error.message);
        }
      }
      send.addEventListener("click", submit, true);
      input.addEventListener(
        "keydown",
        (event) => {
          if (event.key === "Enter") submit(event);
        },
        true,
      );
      setInterval(() => {
        if (selected) open(selected).catch(() => {});
      }, 3000);
    } catch (error) {
      message(error.message);
    }
  }
  async function bindSellerListings() {
    try {
      const products = await api.get("products.php?scope=mine");
      const grid = document.querySelector(".listing-grid");
      grid.innerHTML = products
        .map((product) => {
          const mutable = !["sold", "rejected"].includes(product.status);
          return `<article class="listing-card" data-id="${Number(product.id)}" data-status="${escapeHtml(product.status)}" data-sale-type="${escapeHtml(product.sale_type)}"><div class="listing-thumb">${product.images[0] ? `<img src="${escapeHtml(product.images[0])}" alt="">` : "📦"}</div><div class="listing-body"><div class="listing-title">${escapeHtml(product.title)}</div><div class="listing-meta">L${String(product.id).padStart(3, "0")} · ${escapeHtml(product.condition_label)} · ${escapeHtml(product.sale_type === "auction" ? "Auction" : product.category)}</div><div class="listing-foot"><span class="listing-price">${product.sale_type === "auction" ? "Auction" : money(product.price)}</span><span class="status ${product.status === "active" ? "green" : product.status === "pending" ? "amber" : "gray"}">${escapeHtml(product.status)}</span></div><div class="listing-actions">${product.status === "active" ? '<button class="btn" data-action="paused">Pause</button>' : product.status === "paused" ? '<button class="btn" data-action="active">Activate</button>' : ""}${mutable ? '<button class="btn" data-action="edit">Edit</button><button class="btn listing-delete" data-action="delete">Delete</button>' : ""}${product.sale_type === "auction" ? '<button class="btn" data-action="view-auction">View auction</button>' : ""}</div></div></article>`;
        })
        .join("");
      window.filterListings = (button) => {
        document
          .querySelectorAll(".tabs .tab")
          .forEach((tab) => tab.classList.remove("active"));
        button.classList.add("active");
        const filter = button.dataset.filter;
        grid.querySelectorAll(".listing-card").forEach((card) => {
          card.style.display =
            filter === "all" ||
            card.dataset.status === filter ||
            (filter === "auction" && card.dataset.saleType === "auction")
              ? "block"
              : "none";
        });
      };
      const stats = document.querySelectorAll(".grid-4 .value");
      if (stats[0])
        stats[0].textContent = products.filter(
          (p) => p.status === "active",
        ).length;
      if (stats[1])
        stats[1].textContent = products.filter(
          (p) => p.sale_type === "auction" && p.status === "active",
        ).length;
      if (stats[2])
        stats[2].textContent = products.filter(
          (p) => p.status === "sold",
        ).length;
      if (stats[3])
        stats[3].textContent = products
          .reduce((sum, p) => sum + Number(p.views), 0)
          .toLocaleString();
      grid.onclick = async (event) => {
        const button = event.target.closest("[data-action]");
        if (!button) return;
        event.preventDefault();
        const card = button.closest(".listing-card");
        const product = products.find(
          (row) => Number(row.id) === Number(card.dataset.id),
        );
        if (!product) return;
        if (button.dataset.action === "view-auction") {
          window.location.href = "SellerAuctions.html";
          return;
        }
        try {
          if (button.dataset.action === "edit") {
            const title = prompt("Listing title:", product.title);
            if (title === null) return;
            const description = prompt("Description:", product.description);
            if (description === null) return;
            let price = Number(product.price);
            if (product.sale_type === "fixed") {
              const entered = prompt("Price:", product.price);
              if (entered === null) return;
              price = Number(entered);
            }
            await api.patch("products.php", {
              id: Number(product.id),
              action: "edit",
              title: title.trim(),
              description: description.trim(),
              price,
            });
            message("Listing details updated");
          } else if (button.dataset.action === "delete") {
            if (!confirm(`Delete "${product.title}"? This cannot be undone.`))
              return;
            await api.delete("products.php", { id: Number(product.id) });
            message("Listing deleted");
          } else {
            await api.patch("products.php", {
              id: Number(product.id),
              status: button.dataset.action,
            });
            message(
              button.dataset.action === "paused"
                ? "Listing paused"
                : "Listing activated",
            );
          }
          await bindSellerListings();
        } catch (error) {
          message(error.message);
        }
      };
    } catch (error) {
      message(error.message);
    }
  }
  async function bindSellerAuctions() {
    try {
      const auctions = await api.get("auctions.php?scope=mine");
      const body = document.querySelector(".data-table tbody");
      body.innerHTML = auctions
        .map(
          (a) =>
`<tr><td><strong>${escapeHtml(a.title)}</strong><br><span class="muted">L${String(a.product_id).padStart(3, "0")} · ${escapeHtml(a.category)}</span><br><a class="bid-history-btn" style="display:inline-block;margin-top:8px;padding:7px 13px;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#374151;text-decoration:none;font-size:13px;font-weight:600" href="../productView.html?id=${encodeURIComponent(a.slug)}&source=landingwithlogin">View details & bid history</a></td><td>${money(a.current_price)}</td><td>${Number(a.bid_count)}</td><td>${escapeHtml(new Date(a.ends_at).toLocaleString())}</td><td><span class="status ${a.status === "live" ? "green" : "amber"}">${escapeHtml(a.status)}</span></td></tr>`,        )
        .join("");
      const stats = document.querySelectorAll(".grid-4 .value");
      if (stats[0])
        stats[0].textContent = auctions.filter(
          (a) => a.status === "live",
        ).length;
      if (stats[1])
        stats[1].textContent = auctions.reduce(
          (sum, a) => sum + Number(a.bid_count),
          0,
        );
      if (stats[2])
        stats[2].textContent = money(
          Math.max(0, ...auctions.map((a) => Number(a.current_price))),
        );
      const live = document.querySelector(".panel-head .status");
      if (live)
        live.textContent =
          auctions.filter((a) => a.status === "live").length + " live";
    } catch (error) {
      message(error.message);
    }
  }
  async function bindWalletPage() {
    try {
      const wallet = await api.get("wallet.php");
      const amount = document.querySelector(".wallet-amount");
      if (amount) amount.textContent = money(wallet.available_balance);
      const meta = document.querySelectorAll(".wallet-meta strong");
      if (meta[0]) meta[0].textContent = money(wallet.pending_balance);
      if (meta[1]) meta[1].textContent = money(0);
      if (meta[2])
        meta[2].textContent = money(
          wallet.transactions
            .filter((t) => Number(t.amount) > 0)
            .reduce((s, t) => s + Number(t.amount), 0),
        );
      const list = document.querySelector(".panel .list");
      if (list)
        list.innerHTML = wallet.transactions
          .map(
            (t) =>
              `<tr><td><strong>${escapeHtml(a.title)}</strong><br><span class="muted">L${String(a.product_id).padStart(3, "0")} · ${escapeHtml(a.category)}</span><br><a class="bid-history-btn" href="../productView.html?id=${encodeURIComponent(a.slug)}&source=landingwithlogin">View details &amp; bid history</a></td><td>${money(a.current_price)}</td><td>${Number(a.bid_count)}</td><td>${escapeHtml(new Date(a.ends_at).toLocaleString())}</td><td><span class="status ${a.status === "live" ? "green" : "amber"}">${escapeHtml(a.status)}</span></td></tr>`,
          )
          .join("");
    } catch (error) {
      message(error.message);
    }
  }
  async function bindSellerNotifications() {
    const list = document.querySelector(".panel .list");
    if (!list) return;
    try {
      const items = await api.get("notifications.php");
      list.innerHTML = items
        .map(
          (item) =>
            `<div class="list-row ${item.read_at ? "" : "unread"}"><div class="row-main"><div class="row-icon">●</div><div><div class="row-title">${escapeHtml(item.title)}</div><div class="row-sub">${escapeHtml(item.message)} · ${escapeHtml(new Date(item.created_at).toLocaleString())}</div></div></div></div>`,
        )
        .join("");
    } catch (error) {
      message(error.message);
    }
  }
  async function bindAnalytics() {
    try {
      const stats = await api.get("dashboard.php");
      const series = await api.get("dashboard.php?action=analytics");
      if (file === "selleranalytics.html") {
        const values = document.querySelectorAll(".grid-4 .value");
        if (values[0]) values[0].textContent = money(stats.revenue);
        if (values[1])
          values[1].textContent = Number(stats.profile_views).toLocaleString();
        if (values[2])
          values[2].textContent =
            (Number(stats.profile_views)
              ? (Number(stats.orders) / Number(stats.profile_views)) * 100
              : 0
            ).toFixed(1) + "%";
        if (values[3]) values[3].textContent = Number(stats.favorites);
        const chart = document.querySelector(".bar-chart");
        const max = Math.max(1, ...series.map((row) => Number(row.total)));
        if (chart)
          chart.innerHTML = series
            .map(
              (row) =>
                `<div class="bar" style="height:${Math.max(5, (Number(row.total) / max) * 100)}%"><span>${escapeHtml(row.month)}</span></div>`,
            )
            .join("");
        const panels = document.querySelectorAll(".grid-3 .value");
        if (panels[0]) panels[0].textContent = stats.top_category || "—";
        if (panels[1]) panels[1].textContent = stats.best_listing?.title || "—";
        if (panels[2])
          panels[2].textContent = Number(stats.rating || 0).toFixed(1) + " / 5";
      } else {
        const values = document.querySelectorAll(".stats .stat h2");
        if (values[0])
          values[0].textContent = Array.isArray(series)
            ? series.reduce((s, r) => s + Number(r.total), 0).toLocaleString()
            : "0";
        if (values[1])
          values[1].textContent = Number(stats.users)
            ? ((Number(stats.orders) / Number(stats.users)) * 100).toFixed(1) +
              "%"
            : "0%";
        if (values[2]) values[2].textContent = Number(stats.orders);
        if (values[3]) values[3].textContent = "—";
      }
    } catch (error) {
      message(error.message);
    }
  }
  async function bindDashboard() {
    try {
      const data = await api.get("dashboard.php");
      let values = document.querySelectorAll(".stat-card .stat-value");
      let sequence =
        currentUser.role === "seller"
          ? [
              money(data.revenue),
              data.active_listings,
              Number(data.rating || 0).toFixed(1) + "★",
              money(data.commission),
            ]
          : [money(data.spent), data.orders, data.won_auctions, data.wishlist];
      values.forEach((node, i) => {
        if (sequence[i] !== undefined) node.textContent = sequence[i];
      });
      if (currentUser.role === "admin" && file === "adminoverview.html") {
        const auctions = await api.get("auctions.php");
        const deliveries = await api.get("admin.php?action=deliveries");
        values = document.querySelectorAll(".stats .stat h2");
        sequence = [
          data.users,
          money(data.volume),
          auctions.filter((a) => a.status === "live").length,
          data.fraud_alerts,
          data.pending_users,
          data.pending_listings,
          money(data.commission),
          deliveries.filter((d) => d.status !== "delivered").length,
        ];
        values.forEach((node, i) => (node.textContent = sequence[i]));
      }
      const walletAmount = document.querySelector(".wallet-amount");
      if (walletAmount && data.wallet)
        walletAmount.textContent =
          "$" +
          Number(data.wallet.available_balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          });
      const walletMeta = document.querySelectorAll(".wallet-mid b");
      if (walletMeta[0] && data.wallet)
        walletMeta[0].textContent = money(data.wallet.pending_balance);
      if (walletMeta[1]) walletMeta[1].textContent = money(0);
      if (file === "buyeroverview.html" || file === "selleroverview.html") {
        const series = await api.get("dashboard.php?action=analytics");
        renderLineChart(
          document.getElementById(
            file === "buyeroverview.html" ? "spendChart" : "revChart",
          ),
          series,
          file === "buyeroverview.html" ? "#5b6df8" : "#1fbf75",
        );
      }
      const confirmWithdraw = document.getElementById("confirmWithdraw");
      if (confirmWithdraw)
        confirmWithdraw.addEventListener(
          "click",
          async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const input = document.getElementById("withdrawAmount");
            const amount = Number(input.value);
            if (amount <= 0) return message("Enter a valid withdrawal amount.");
            try {
              const withdrawal = await api.post("wallet.php?action=withdraw", {
                amount,
              });
              if (walletAmount)
                walletAmount.textContent = money(
                  Math.max(
                    0,
                    Number(data.wallet?.available_balance || 0) -
                      Number(withdrawal.total_deducted),
                  ),
                );
              document
                .getElementById("withdrawModal")
                ?.classList.remove("show");
              input.value = "";
              message("Withdrawal submitted. Fee: " + money(withdrawal.fee));
            } catch (error) {
              message(error.message);
            }
          },
          true,
        );
      if (file === "buyeroverview.html") {
        const orders = await api.get("orders.php");
        const heading = [...document.querySelectorAll(".card-head h3")].find(
          (node) => node.textContent.trim() === "Recent Orders",
        );
        const card = heading?.closest(".card");
        if (card) {
          card.querySelectorAll(".order-row").forEach((row) => row.remove());
          card.insertAdjacentHTML(
            "beforeend",
            orders
              .slice(0, 3)
              .flatMap((order) =>
                order.items
                  .slice(0, 1)
                  .map(
                    (item) =>
                      `<div class="order-row" data-page="Orders"><img class="order-thumb" src="${escapeHtml(item.image || "")}" alt=""><div class="order-info"><div class="order-title">${escapeHtml(item.title_snapshot)}</div><div class="order-sub">#${escapeHtml(order.order_number)} · ${escapeHtml(new Date(order.placed_at).toLocaleDateString())}</div></div><div><div class="order-price">${money(item.unit_price)}</div><div class="order-status ${order.status === "delivered" ? "status-delivered" : "status-shipping"}">${escapeHtml(order.status)}</div></div></div>`,
                  ),
              )
              .join(""),
          );
        }
        const products = await api.get("products.php?sale_type=fixed");
        const grid = document.querySelector(".rec-grid");
        if (grid)
          grid.innerHTML = products
            .slice(0, 3)
            .map(
              (p) =>
                `<div class="rec-card" data-item="${escapeHtml(p.title)}" onclick="location.href='../fixedproductview.html?id=${encodeURIComponent(p.slug)}&source=landingwithlogin'"><div class="rec-img" style="background-image:url('${escapeHtml(p.images[0] || "")}')"><div class="rec-tag">${escapeHtml(p.condition_label)}</div></div><div class="rec-body"><div class="rec-name">${escapeHtml(p.title)}</div><div class="rec-price-row"><span class="rec-price">${money(p.price)}</span></div></div></div>`,
            )
            .join("");
      }
      if (currentUser.role === "admin" && file === "adminoverview.html")
        setInterval(async () => {
          try {
            const [live, auctionRows, deliveryRows] = await Promise.all([
              api.get("dashboard.php"),
              api.get("auctions.php"),
              api.get("admin.php?action=deliveries"),
            ]);
            const nodes = document.querySelectorAll(".stats .stat h2");
            const latest = [
              live.users,
              money(live.volume),
              auctionRows.filter((a) => a.status === "live").length,
              live.fraud_alerts,
              live.pending_users,
              live.pending_listings,
              money(live.commission),
              deliveryRows.filter((d) => d.status !== "delivered").length,
            ];
            nodes.forEach((node, index) => {
              if (latest[index] !== undefined) node.textContent = latest[index];
            });
          } catch (_) {}
        }, 8000);
    } catch (error) {
      console.error("Dashboard sync failed", error);
    }
  }
  async function bindAdmin() {
    let listings = [],
      sellers = [],
      auctions = [];
    try {
      if (file === "adminlisting.html")
        listings = await api.get("admin.php?action=listings");
      if (file === "adminseller.html")
        sellers = await api.get("admin.php?action=sellers");
      if (file === "adminauction.html")
        auctions = await api.get("auctions.php?scope=all");
      if (file === "adminwalletcommission.html") {
        const settings = await api.get("admin.php?action=settings");
        const totals = await api.get("admin.php?action=wallet");
        const stats = document.querySelectorAll(".stats .card h2");
        if (stats[0]) stats[0].textContent = money(totals.volume);
        if (stats[1]) stats[1].textContent = money(totals.commission);
        if (stats[2]) stats[2].textContent = money(totals.pending_payouts);
        if (stats[3]) stats[3].textContent = "100%";
        const map = {
          standardCommission: "standard_commission",
          auctionCommission: "auction_commission",
          minimumCommission: "minimum_commission",
          withdrawalFee: "withdrawal_fee",
        };
        Object.keys(map).forEach((id) => {
          const input = document.getElementById(id);
          if (input && settings[map[id]] !== undefined)
            input.value = settings[map[id]];
        });
        window.saveCommissionSettings = async function () {
          try {
            await api.patch("admin.php?action=settings", {
              standard_commission:
                document.getElementById("standardCommission").value,
              auction_commission:
                document.getElementById("auctionCommission").value,
              minimum_commission:
                document.getElementById("minimumCommission").value,
              withdrawal_fee: document.getElementById("withdrawalFee").value,
            });
            message("Commission settings saved");
          } catch (e) {
            message(e.message);
          }
        };
        setInterval(async () => {
          try {
            const liveTotals = await api.get("admin.php?action=wallet");
            const liveStats = document.querySelectorAll(".stats .card h2");
            if (liveStats[0])
              liveStats[0].textContent = money(liveTotals.volume);
            if (liveStats[1])
              liveStats[1].textContent = money(liveTotals.commission);
            if (liveStats[2])
              liveStats[2].textContent = money(liveTotals.pending_payouts);
          } catch (_) {}
        }, 8000);
      }
      if (file === "admindeliveries.html") {
        const deliveries = await api.get("admin.php?action=deliveries");
        const stats = document.querySelectorAll(".stats .card h2");
        const completed = deliveries.filter((d) => d.status === "delivered");
        const deliveryDays = completed
          .map(
            (d) =>
              (new Date(d.delivered_at) - new Date(d.placed_at)) / 86400000,
          )
          .filter((value) => Number.isFinite(value) && value >= 0);
        if (stats[0])
          stats[0].textContent = deliveries.filter(
            (d) => d.status !== "delivered",
          ).length;
        if (stats[1]) stats[1].textContent = completed.length;
        if (stats[2])
          stats[2].textContent = deliveryDays.length
            ? (
                deliveryDays.reduce((sum, value) => sum + value, 0) /
                deliveryDays.length
              ).toFixed(1) + " days"
            : "—";
        const section = document.createElement("section");
        section.className = "admin-data-card delivery-panel";
        section.innerHTML = `<div class="admin-card-heading"><div><h2>Delivery activity</h2><p>Live order fulfilment and tracking status</p></div><span class="admin-record-count">${deliveries.length} records</span></div><div class="delivery-list">${deliveries.length ? deliveries.map((row) => `<article class="delivery-row"><div class="delivery-order"><strong>#${escapeHtml(row.order_number)}</strong><span>${escapeHtml(row.shipping_name)}</span></div><div class="delivery-address"><strong>${escapeHtml(row.carrier || "Seller delivery")}</strong><span>${escapeHtml(row.shipping_address || "Address unavailable")}</span></div><div class="delivery-tracking"><strong>${escapeHtml(row.tracking_number || "Not assigned")}</strong><span>${escapeHtml(row.estimated_delivery ? "ETA " + new Date(row.estimated_delivery).toLocaleDateString() : "No ETA")}</span></div><span class="status-chip status-${escapeHtml(row.status)}">${escapeHtml(row.status.replaceAll("_", " "))}</span></article>`).join("") : '<div class="admin-empty"><span>▱</span><strong>No deliveries yet</strong><p>Delivery records will appear after orders are processed.</p></div>'}</div>`;
        document
          .querySelector(".stats")
          ?.insertAdjacentElement("afterend", section);
      }
      if (file === "adminfraudmonitor.html") {
        const reports = await api.get("admin.php?action=fraud");
        const list = document.querySelector(".seller-list");
        list.innerHTML = reports.length
          ? reports
              .map(
                (row, index) =>
                  `<div class="seller-row"><div class="seller-left"><div class="seller-avatar avatar-${(index % 2) + 1}">F${Number(row.id)}</div><div class="seller-details"><h3>${escapeHtml(row.status)}</h3><p>${escapeHtml(row.reason)} · Reported by ${escapeHtml(row.reporter)}</p></div></div><div class="admin-row-actions"><span class="status-chip status-${escapeHtml(row.status)}">${escapeHtml(row.status)}</span><button class="view-btn">${row.status === "open" ? "Investigate" : "Review"}</button></div></div>`,
              )
              .join("")
          : '<div class="admin-empty"><span>✓</span><strong>No fraud reports</strong><p>The review queue is currently clear.</p></div>';
        const alert = document.querySelector(".alert-message span:last-child");
        if (alert)
          alert.textContent =
            reports.filter((r) => ["open", "investigating"].includes(r.status))
              .length + " suspicious activities need review";
      }
      if (file === "adminnotifications.html") {
        const items = await api.get("notifications.php");
        const card = document.querySelector(".messages-card");
        card.innerHTML = items.length
          ? items
              .map(
                (item) =>
                  `<div class="message-row ${item.read_at ? "" : "unread"}"><div class="message-icon listing">●</div><div class="message-content"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.message)}</p></div><div class="message-time"><span>${escapeHtml(new Date(item.created_at).toLocaleString())}</span></div></div>`,
              )
              .join("")
          : '<div class="admin-empty"><span>♧</span><strong>No notifications</strong><p>New platform updates will appear here.</p></div>';
      }
      if (file === "adminoverview.html") {
        const orders = await api.get("admin.php?action=orders");
        const recent = document.querySelector(".recent");
        recent.querySelectorAll(".sale").forEach((node) => node.remove());
        recent.insertAdjacentHTML(
          "beforeend",
          orders
            .map(
              (order) =>
                `<div class="sale"><div class="product"><div class="product-img">${order.image ? `<img src="${escapeHtml(order.image)}" alt="">` : "📦"}</div><div><h3>${escapeHtml(order.title_snapshot)}</h3><p>#${escapeHtml(order.order_number)} · ${escapeHtml(new Date(order.placed_at).toLocaleDateString())}</p><div class="price">${money(order.total_amount)}</div></div></div><div class="seller"><div class="seller-avatar">${escapeHtml(
                  order.seller
                    .split(" ")
                    .map((v) => v[0])
                    .join("")
                    .slice(0, 2),
                )}</div><div><strong>${escapeHtml(order.seller)}</strong><div class="rating">★ ${Number(order.rating).toFixed(1)}</div></div></div></div>`,
            )
            .join(""),
        );
      }
    } catch (error) {
      message(error.message);
    }
    if (file === "adminlisting.html") {
      const pending = listings.filter((row) => row.status === "pending");
      const list = document.querySelector(".seller-list");
      list.innerHTML = pending.length
        ? pending
            .map(
              (row, index) =>
                `<div class="seller-row"><div class="seller-left"><div class="seller-avatar avatar-${(index % 3) + 1}">${row.image ? `<img src="${escapeHtml(row.image)}" alt="">` : "📦"}</div><div class="seller-details"><h3>${escapeHtml(row.title)}</h3><p>${escapeHtml(row.seller)} · Applied ${escapeHtml(new Date(row.created_at).toLocaleDateString())}</p></div></div><button class="view-btn" data-id="${Number(row.id)}">◉ &nbsp;View Details</button></div>`,
            )
            .join("")
        : '<div class="admin-empty"><span>✓</span><strong>All listings reviewed</strong><p>There are no pending listings right now.</p></div>';
      const alert = document.querySelector(".alert-message span:last-child");
      if (alert)
        alert.textContent = pending.length + " listings pending approval";
      list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-id]");
        if (!button) return;
        const row = listings.find(
          (item) => Number(item.id) === Number(button.dataset.id),
        );
        document.getElementById("listingModalName").textContent = row.title;
        document.getElementById("listingModalSeller").textContent = row.seller;
        document.getElementById("listingTitle").textContent = row.title;
        document.getElementById("listingCategory").textContent = row.category;
        document.getElementById("listingPrice").textContent =
          row.price === null ? "Auction" : money(row.price);
        document.getElementById("listingOriginalPrice").textContent = "—";
        document.getElementById("listingCondition").textContent =
          row.condition_label;
        document.getElementById("listingType").textContent = row.sale_type;
        document.getElementById("listingDate").textContent = new Date(
          row.created_at,
        ).toLocaleDateString();
        document.getElementById("listingLocation").textContent =
          row.location || "Not provided";
        document.getElementById("listingShipping").textContent =
          row.shipping_days || "Not provided";
        document.getElementById("listingTags").textContent = row.category;
        document.getElementById("listingSellerDetail").textContent = row.seller;
        document.getElementById("listingStatus").textContent = row.status;
        document.getElementById("listingSummary").textContent = row.description;
        const gallery = document.getElementById("listingImageGallery");
        gallery.innerHTML = row.image
          ? `<img src="${escapeHtml(row.image)}" alt="">`
          : "";
        const documents = document.getElementById("listingDocumentList");
        documents.innerHTML = row.documents?.length
          ? row.documents
              .map(
                (document) =>
                  `<a class="document-link" href="${api.base}documents.php?type=product&id=${Number(document.id)}" download><span><strong>Product paper</strong><small>${escapeHtml(document.original_name)}</small></span><span class="download-label">Download</span></a>`,
              )
              .join("")
          : "<p>No PDF submitted for this legacy listing.</p>";
        document.getElementById("listingModal").classList.remove("hidden");
      });
      function finishListingModeration(row) {
        listings = listings.filter(
          (item) => Number(item.id) !== Number(row.id),
        );
        list
          .querySelector(`[data-id="${Number(row.id)}"]`)
          ?.closest(".seller-row")
          ?.remove();
        const remaining = list.querySelectorAll(".seller-row").length;
        if (alert) alert.textContent = remaining + " listings pending approval";
        if (!remaining)
          list.innerHTML =
            '<div class="admin-empty"><span>✓</span><strong>All listings reviewed</strong><p>There are no pending listings right now.</p></div>';
        window.closeListingModal();
      }
      window.approveListing = async function () {
        const name = document.getElementById("listingModalName").textContent;
        const row = listings.find((x) => x.title === name);
        if (!row) return message("Listing not found in database.");
        try {
          await api.patch("admin.php?action=listing", {
            id: row.id,
            status: "active",
          });
          document.getElementById("listingStatus").textContent = "Approved";
          message(name + " has been approved.");
          finishListingModeration(row);
        } catch (e) {
          message(e.message);
        }
      };
      window.rejectListing = async function () {
        const name = document.getElementById("listingModalName").textContent;
        const row = listings.find((x) => x.title === name);
        if (!row) return message("Listing not found in database.");
        try {
          await api.patch("admin.php?action=listing", {
            id: row.id,
            status: "rejected",
          });
          document.getElementById("listingStatus").textContent = "Rejected";
          message(name + " has been rejected.");
          finishListingModeration(row);
        } catch (e) {
          message(e.message);
        }
      };
    }
    if (file === "adminseller.html") {
      const pending = sellers.filter(
        (row) => row.verification_status === "pending",
      );
      const list = document.querySelector(".seller-list");
      list.innerHTML = pending.length
        ? pending
            .map(
              (row, index) =>
                `<div class="seller-row"><div class="seller-left"><div class="seller-avatar avatar-${(index % 3) + 1}">${escapeHtml(row.first_name[0] + row.last_name[0])}</div><div class="seller-details"><h3>${escapeHtml(row.name)}</h3><p>${escapeHtml(row.email)} · Applied ${escapeHtml(new Date(row.created_at).toLocaleDateString())}</p></div></div><button class="view-btn" data-id="${Number(row.id)}">◉ &nbsp;View</button></div>`,
            )
            .join("")
        : '<div class="admin-empty"><span>✓</span><strong>All seller applications reviewed</strong><p>There are no pending sellers right now.</p></div>';
      const alert = document.querySelector(".alert-message span:last-child");
      if (alert)
        alert.textContent = pending.length + " sellers pending approval";
      list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-id]");
        if (!button) return;
        const row = sellers.find(
          (item) => Number(item.id) === Number(button.dataset.id),
        );
        document.getElementById("sellerModalAvatar").textContent =
          row.first_name[0] + row.last_name[0];
        document.getElementById("sellerModalName").textContent = row.name;
        document.getElementById("sellerModalEmail").textContent = row.email;
        document.getElementById("sellerFirstName").textContent = row.first_name;
        document.getElementById("sellerLastName").textContent = row.last_name;
        document.getElementById("sellerEmailDetail").textContent = row.email;
        document.getElementById("sellerPhone").textContent =
          row.phone || "Not provided";
        document.getElementById("sellerApplied").textContent = new Date(
          row.created_at,
        ).toLocaleDateString();
        document.getElementById("sellerStatus").textContent =
          row.verification_status;
        document.getElementById("sellerBusiness").textContent =
          row.business_name || "Not provided";
        document.getElementById("sellerDocs").textContent =
          [row.nid_document, row.trade_license].filter(Boolean).length +
          " / 2 submitted";
        document.getElementById("sellerLocation").textContent = "Not provided";
        document.getElementById("sellerVerification").textContent =
          row.verification_status;
        document.getElementById("sellerSummary").textContent =
          row.business_description || "";
        const nid = document.getElementById("sellerNidLink");
        nid.href = row.nid_document
          ? api.base + "documents.php?type=nid&user_id=" + Number(row.id)
          : "#";
        nid.hidden = !row.nid_document;
        nid.querySelector("small").textContent = row.nid_document
          ? "NID document (PDF)"
          : "Not submitted";
        const license = document.getElementById("sellerTradeLink");
        license.href = row.trade_license
          ? api.base + "documents.php?type=trade&user_id=" + Number(row.id)
          : "#";
        license.hidden = !row.trade_license;
        license.querySelector("small").textContent = row.trade_license
          ? "Trade Licence (PDF)"
          : "Not submitted";
        document.getElementById("sellerModal").classList.remove("hidden");
      });
      async function moderate(status) {
        const name = document.getElementById("sellerModalName").textContent;
        const row = sellers.find(
          (x) => x.name === name || x.business_name === name,
        );
        if (!row) return message("Seller not found in database.");
        try {
          await api.patch("admin.php?action=seller", { id: row.id, status });
          document.getElementById("sellerStatus").textContent =
            status === "approved" ? "Approved" : "Rejected";
          sellers = sellers.filter(
            (item) => Number(item.id) !== Number(row.id),
          );
          list
            .querySelector(`[data-id="${Number(row.id)}"]`)
            ?.closest(".seller-row")
            ?.remove();
          const remaining = list.querySelectorAll(".seller-row").length;
          if (alert)
            alert.textContent = remaining + " sellers pending approval";
          if (!remaining)
            list.innerHTML =
              '<div class="admin-empty"><span>✓</span><strong>All seller applications reviewed</strong><p>There are no pending sellers right now.</p></div>';
          message("Seller status updated.");
          window.closeSellerModal();
        } catch (e) {
          message(e.message);
        }
      }
      window.approveSeller = () => moderate("approved");
      window.rejectSeller = () => moderate("rejected");
    }
    if (file === "adminauction.html") {
      const list = document.querySelector(".auction-list");
      list.innerHTML = auctions.length
        ? auctions
            .map(
              (row) =>
                `<div class="auction-card"><div class="auction-product-image"><img src="${escapeHtml(row.images[0] || "")}" alt=""></div><div class="auction-info"><h3>${escapeHtml(row.title)}</h3><div class="auction-values"><div class="auction-value"><label>Starting</label><strong>${money(row.starting_price)}</strong></div><div class="auction-value current"><label>Current</label><strong>${money(row.current_price)}</strong></div><div class="auction-value"><label>Ends</label><strong>${escapeHtml(new Date(row.ends_at).toLocaleString())}</strong></div></div></div><div class="auction-actions"><button class="auction-pill pill-review" data-id="${Number(row.id)}">Review</button><span class="status-chip status-${escapeHtml(row.status)}">● ${escapeHtml(row.status)}</span></div></div>`,
            )
            .join("")
        : '<div class="admin-empty"><span>♧</span><strong>No auctions found</strong><p>Auctions will appear here when sellers create them.</p></div>';
      const stat = document.querySelectorAll(".auction-stat h2");
      if (stat[0])
        stat[0].textContent = auctions.filter(
          (a) => a.status === "live",
        ).length;
      if (stat[1])
        stat[1].textContent = auctions.filter(
          (a) => a.status === "ended",
        ).length;
      if (stat[2])
        stat[2].textContent = auctions.filter(
          (a) => a.status === "cancelled",
        ).length;
      list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-id]");
        if (!button) return;
        const row = auctions.find(
          (item) => Number(item.id) === Number(button.dataset.id),
        );
        document.getElementById("auctionModalName").textContent = row.title;
        document.getElementById("auctionModalSeller").textContent =
          (row.first_name || "") + " " + (row.last_name || "");
        document.getElementById("auctionTitle").textContent = row.title;
        document.getElementById("auctionCategory").textContent = row.category;
        document.getElementById("auctionPrice").textContent = money(
          row.current_price,
        );
        document.getElementById("auctionOriginalPrice").textContent = money(
          row.starting_price,
        );
        document.getElementById("auctionCondition").textContent =
          row.condition_label;
        document.getElementById("auctionDate").textContent = new Date(
          row.created_at,
        ).toLocaleDateString();
        document.getElementById("auctionLocation").textContent =
          row.location || "Not provided";
        document.getElementById("auctionShipping").textContent =
          row.shipping_days;
        document.getElementById("auctionTags").textContent = row.category;
        document.getElementById("auctionBid").textContent = money(
          row.current_price,
        );
        document.getElementById("auctionEnds").textContent = new Date(
          row.ends_at,
        ).toLocaleString();
        document.getElementById("auctionBidCount").textContent = row.bid_count;
        document.getElementById("auctionStatus").textContent = row.status;
        document.getElementById("auctionDescription").textContent =
          row.description;
        document.getElementById("auctionImageGallery").innerHTML = (
          row.images || []
        )
          .map((image) => `<img src="${escapeHtml(image)}" alt="">`)
          .join("");
        document.getElementById("auctionDocumentList").innerHTML = "";
        document.getElementById("auctionModal").classList.remove("hidden");
      });
      async function updateAuction(status) {
        const name = document.getElementById("auctionModalName").textContent;
        const row = auctions.find((x) => x.title === name);
        if (!row) return message("Auction not found in database.");
        try {
          await api.patch("auctions.php", { id: row.id, status });
          document.getElementById("auctionStatus").textContent = status;
          message("Auction updated.");
        } catch (e) {
          message(e.message);
        }
      }
      window.pauseAuctionFromModal = () => updateAuction("paused");
      window.stopAuctionFromModal = () => updateAuction("cancelled");
    }
  }
  function bindCommonActions() {
    const catalogPage = currentUser ? "landingwithlogin.html" : "landing.html";
    const roleRoutes = currentUser
      ? {
          dashboard:
            currentUser.role === "admin"
              ? "admin/adminOverview.html"
              : currentUser.role === "seller"
                ? "seller/SellerOverview.html"
                : "buyer/BuyerOverview.html",
          profile:
            currentUser.role === "seller"
              ? "seller/SellerOverview.html"
              : currentUser.role === "admin"
                ? "admin/adminOverview.html"
                : "buyer/BuyerOverview.html",
          listings:
            currentUser.role === "seller"
              ? "seller/SellerListing.html"
              : "buyer/BuyerWishlist.html",
          orders:
            currentUser.role === "seller"
              ? "seller/SellerOrders.html"
              : currentUser.role === "admin"
                ? "admin/adminOverview.html"
                : "buyer/BuyerOrders.html",
          bids:
            currentUser.role === "seller"
              ? "seller/SellerAuctions.html"
              : currentUser.role === "admin"
                ? "admin/adminAuction.html"
                : "buyer/BuyerAuction.html",
          settings:
            currentUser.role === "admin"
              ? "admin/adminSystemSettings.html"
              : currentUser.role === "seller"
                ? "seller/SellerOverview.html"
                : "buyer/BuyerOverview.html",
          notifications:
            currentUser.role === "admin"
              ? "admin/adminNotifications.html"
              : currentUser.role === "seller"
                ? "seller/SellerNotifications.html"
                : "buyer/BuyerNotification.html",
        }
      : {};
    const routeMap = {
      "marketplace.html": catalogPage + "?view=products#products",
      "auction.html": catalogPage + "?view=auctions#auctions",
      "dashboard.html": roleRoutes.dashboard,
      "profile.html": roleRoutes.profile,
      "my-listings.html": roleRoutes.listings,
      "orders.html": roleRoutes.orders,
      "my-bids.html": roleRoutes.bids,
      "settings.html": roleRoutes.settings,
    };
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (routeMap[raw]) link.href = routeMap[raw];
    });
    if (currentUser) {
      const initials = (
        currentUser.first_name[0] + currentUser.last_name[0]
      ).toUpperCase();
      document
        .querySelectorAll(".profile-name,.dropdown-header h4")
        .forEach((node) => (node.textContent = currentUser.name));
      document
        .querySelectorAll(".profile-avatar,.dropdown-avatar")
        .forEach((node) => (node.textContent = initials));
      document
        .querySelector('.action-btn[title="Saved Items"]')
        ?.addEventListener("click", () => {
          window.location.href = "buyer/BuyerWishlist.html";
        });
      document
        .querySelector(".action-btn.notification")
        ?.addEventListener("click", () => {
          window.location.href = roleRoutes.notifications;
        });
      if (currentUser.role === "seller") {
        document
          .querySelectorAll(".sell-item-btn,.create-btn")
          .forEach((node) => {
            node.hidden = true;
            node.style.display = "none";
          });
      }
      const setBadge = (node, value) => {
        if (!node) return;
        node.textContent = value;
        node.hidden = Number(value) === 0;
      };
      async function refreshBadges() {
        if (currentUser.role === "admin") {
          const counts = await api.get("admin.php?action=counts");
          const badgeMap = {
            "adminSeller.html": "pending_sellers",
            "adminListing.html": "pending_listings",
            "adminAuction.html": "live_auctions",
            "adminFraudMonitor.html": "fraud_alerts",
          };
          Object.entries(badgeMap).forEach(([href, key]) =>
            document
              .querySelectorAll(`a[href$="${href}"] .badge`)
              .forEach((node) => setBadge(node, counts[key])),
          );
          document
            .querySelectorAll(
              '.notification-badge,a[href$="adminNotifications.html"] .badge',
            )
            .forEach((node) => setBadge(node, counts.unread_notifications));
          return;
        }
        const items = await api.get("notifications.php");
        const unread = items.filter((item) => !item.read_at).length;
        document
          .querySelectorAll(
            '.notification-badge,a[href*="Notification"] .badge,a[href*="Notifications"] .badge',
          )
          .forEach((node) => setBadge(node, unread));
      }
      refreshBadges().catch(() => {});
      setInterval(() => refreshBadges().catch(() => {}), 10000);
    }
    if (file !== "landing.html" && file !== "landingwithlogin.html") {
      document.querySelectorAll(".nav-search input").forEach((input) =>
        input.addEventListener(
          "keydown",
          (event) => {
            if (event.key !== "Enter") return;
            const value = input.value.trim();
            if (!value) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location.href =
              catalogPage +
              "?search=" +
              encodeURIComponent(value) +
              "#products";
          },
          true,
        ),
      );
    }
    if (typeof window.markRead === "function")
      window.markRead = async function () {
        try {
          await api.patch("notifications.php", { all: true });
          document
            .querySelectorAll(".unread")
            .forEach((x) => x.classList.remove("unread"));
          message("All notifications marked as read");
        } catch (e) {
          message(e.message);
        }
      };
    if (typeof window.withdraw === "function")
      window.withdraw = async function () {
        const amount = Number(prompt("Enter withdrawal amount"));
        if (!amount) return;
        try {
          const result = await api.post("wallet.php?action=withdraw", {
            amount,
          });
          message("Withdrawal submitted. Fee: " + money(result.fee));
        } catch (e) {
          message(e.message);
        }
      };
    if (currentUser?.role === "admin")
      document.querySelectorAll(".actions button").forEach((button) => {
        const label = button.textContent.trim().toLowerCase();
        if (!label.includes("export") && !label.includes("pdf")) return;
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            const format = label.includes("csv") ? "csv" : "pdf";
            const type =
              file === "adminwalletcommission.html"
                ? "admin-commissions"
                : "admin-sales";
            window.location.href =
              api.base + `reports.php?type=${type}&format=${format}`;
          },
          true,
        );
      });
    if (currentUser?.role === "seller") {
      const reportButtons = [
        document.getElementById("exportBtn"),
        ...[...document.querySelectorAll("button")].filter((button) =>
          /export|statement/i.test(button.textContent),
        ),
      ].filter(Boolean);
      reportButtons.forEach((button) =>
        button.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location.href =
              api.base + "reports.php?type=seller-earnings";
          },
          true,
        ),
      );
    }
  }
})();
