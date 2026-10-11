const products=[
{id:1,name:"Blush Ceramic Vase",cat:"Home Décor",price:299,mrp:499,rating:4.6,icon:"🏺"},
{id:2,name:"Cute Daisy Hair Clips",cat:"Fashion",price:59,mrp:99,rating:4.5,icon:"🌼"},
{id:3,name:"Heart Keychain",cat:"Cute Gifts",price:69,mrp:129,rating:4.7,icon:"💗"},
{id:4,name:"Minimal Desk Lamp",cat:"Electronics",price:499,mrp:799,rating:4.4,icon:"💡"},
{id:5,name:"Artificial Green Plant",cat:"Home Décor",price:199,mrp:349,rating:4.3,icon:"🌿"},
{id:6,name:"Pearl Charm Bracelet",cat:"Jewellery",price:149,mrp:299,rating:4.6,icon:"📿"},
{id:7,name:"Phone Stand",cat:"Electronics",price:129,mrp:249,rating:4.2,icon:"📱"},
{id:8,name:"Floral Mini Tote",cat:"Fashion",price:349,mrp:599,rating:4.5,icon:"👜"}
];
let wish=JSON.parse(localStorage.getItem("wish")||"[]"), bag=JSON.parse(localStorage.getItem("bag")||"[]");

function save(){localStorage.setItem("wish",JSON.stringify(wish));localStorage.setItem("bag",JSON.stringify(bag));updateCounts()}
function updateCounts(){document.getElementById("wishCount").textContent=wish.length;document.getElementById("bagCount").textContent=bag.reduce((a,x)=>a+x.qty,0)}
function money(n){return "₹"+n}
function card(p){let w=wish.includes(p.id);return `<div class="card"><div class="pic" onclick="detail(${p.id})">${p.icon}</div><div class="card-body"><button class="heart" onclick="toggleWish(${p.id})">${w?"♥":"♡"}</button><div class="stars">★ ${p.rating}</div><h3>${p.name}</h3><span class="price">${money(p.price)}</span><span class="mrp">${money(p.mrp)}</span><div class="discount">${Math.round((1-p.price/p.mrp)*100)}% OFF</div><button class="primary" onclick="addBag(${p.id})">Add to Bag</button></div></div>`}
function renderProducts(arr,title="Products"){document.getElementById("app").innerHTML=`<div class="page"><div class="section-head"><h2>${title}</h2><span>${arr.length} items</span></div><div class="grid">${arr.map(card).join("")||'<div class="empty">No products found.</div>'}</div></div>`}
function showPage(page){
document.querySelectorAll(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
if(page==="home")document.getElementById("app").innerHTML=`<div class="page"><section class="hero"><span class="pill">✦ CURATED FOR YOU</span><h1>Little things that make <span class="pink">home feel yours.</span></h1><p>Thoughtful finds, joyful prices, and everyday beauty delivered across India.</p><button class="primary" onclick="showPage('explore')">Shop the edit →</button><button class="secondary" onclick="renderProducts(products.slice(0,4),'Bestsellers')">Get the bestseller</button></section><div class="section-head"><h2>Trending Now</h2><button class="secondary" onclick="showPage('explore')">View all</button></div><div class="grid">${products.slice(0,4).map(card).join("")}</div></div>`;
else if(page==="explore")document.getElementById("app").innerHTML=`<div class="page"><h2>Explore</h2><div class="category-grid">${["Home Décor","Fashion","Jewellery","Electronics","Cute Gifts"].map(c=>`<div class="category" onclick="category('${c}')">${c} →</div>`).join("")}</div><h2>All Products</h2><div class="grid">${products.map(card).join("")}</div></div>`;
else if(page==="saved"){let a=products.filter(p=>wish.includes(p.id));renderProducts(a,"Saved Items")}
else if(page==="bag")renderBag();
else if(page==="account")renderAccount();
updateCounts()
}
function category(c){renderProducts(products.filter(p=>p.cat===c),c)}
function toggleWish(id){wish=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];save();showPage(document.querySelector(".bottom-nav button.active")?.dataset.page||"home");toast(wish.includes(id)?"Added to Saved":"Removed from Saved")}
function addBag(id){let x=bag.find(x=>x.id===id);if(x)x.qty++;else bag.push({id,qty:1});save();toast("Added to Bag")}
function detail(id){let p=products.find(x=>x.id===id);document.getElementById("app").innerHTML=`<div class="page"><div class="product-detail"><div class="bigpic">${p.icon}</div><h1>${p.name}</h1><div class="stars">★ ${p.rating} · Customer reviews</div><h2>${money(p.price)} <span class="mrp">${money(p.mrp)}</span></h2><p>${Math.round((1-p.price/p.mrp)*100)}% OFF</p><p>Beautiful, useful and thoughtfully selected for your ShopNest collection. Fast delivery across India.</p><button class="primary" onclick="addBag(${p.id})">Add to Bag</button><button class="secondary" onclick="toggleWish(${p.id})">♡ Save</button></div></div>`}
function renderBag(){if(!bag.length){document.getElementById("app").innerHTML='<div class="page empty"><h2>Your bag is empty</h2><p>Add something you love.</p><button class="primary" onclick="showPage('explore')">Explore Products</button></div>';return}let total=0;let rows=bag.map(x=>{let p=products.find(p=>p.id===x.id);total+=p.price*x.qty;return `<div class="list row"><div><b>${p.icon} ${p.name}</b><br>${money(p.price)}</div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${x.qty} <button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join("");document.getElementById("app").innerHTML=`<div class="page"><h2>Shopping Bag</h2>${rows}<div class="list"><div class="row"><b>Total</b><b>${money(total)}</b></div><button class="primary" onclick="checkout()">Proceed to Checkout</button></div></div>`}
function changeQty(id,d){let x=bag.find(x=>x.id===id);x.qty+=d;if(x.qty<=0)bag=bag.filter(x=>x.id!==id);save();renderBag()}
function checkout(){document.getElementById("app").innerHTML=`<div class="page"><h2>Checkout</h2><div class="form"><label>Full name</label><input id="name" placeholder="Your name"><label>Mobile number</label><input id="phone" placeholder="10-digit mobile"><label>Address</label><textarea id="address" placeholder="House, street, area"></textarea><label>PIN code</label><input id="pin" placeholder="6-digit PIN"><button class="primary" onclick="placeOrder()">Place Demo Order</button></div></div>`}
function placeOrder(){let orders=JSON.parse(localStorage.getItem("orders")||"[]");orders.unshift({id:"SN"+Date.now().toString().slice(-6),date:new Date().toLocaleDateString(),items:bag,total:bag.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0),status:"Confirmed"});localStorage.setItem("orders",JSON.stringify(orders));bag=[];save();showPage("account");toast("Order placed successfully")}
function renderAccount(){let orders=JSON.parse(localStorage.getItem("orders")||"[]");document.getElementById("app").innerHTML=`<div class="page"><section class="account-hero"><div style="font-size:45px">♙</div><h1>Make it yours.</h1><p>Shop freely as a guest. Your bag, saved items and demo orders stay on this device.</p></section><div class="list"><h3>My Orders</h3>${orders.length?orders.slice(0,5).map(o=>`<div class="row" style="padding:12px 0;border-top:1px solid #eee"><span><b>#${o.id}</b><br>${o.date}</span><span>${money(o.total)}<br><small>${o.status}</small></span></div>`).join(""):"<p>No orders yet.</p>"}</div><div class="list"><h3>Account</h3><p>Login/signup can be connected later with a backend such as Supabase.</p></div></div>`}
function searchProducts(q){q=q.toLowerCase().trim();if(!q){showPage("home");return}renderProducts(products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q)),"Search Results")}
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",1800)}
showPage("home");
