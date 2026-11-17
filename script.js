const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const drawer = $("#cartDrawer"), overlay = $("#cartOverlay");
let cart = [];

function openCart(){drawer.classList.add("open");overlay.classList.add("show");}
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show");}
$("#cartToggle").addEventListener("click",openCart);
$("#closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
$("#viewCart").addEventListener("click",e=>{e.preventDefault();closeCart();document.querySelector("#catalogo").scrollIntoView({behavior:"smooth"});});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#searchToggle").addEventListener("click",()=>{$("#searchBar").classList.toggle("show");$("#searchInput").focus();});
$("#closeSearch").addEventListener("click",()=>$("#searchBar").classList.remove("show"));
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.toLowerCase();$$(".product-card").forEach(card=>card.classList.toggle("hidden",!card.textContent.toLowerCase().includes(q)));});
let toastTimer;
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200);}
function renderCart(){
  $("#cartCount").textContent=cart.reduce((n,item)=>n+item.qty,0);
  const wrap=$("#cartItems");
  if(!cart.length){wrap.innerHTML='<div class="empty-cart"><span>♡</span><b>Tu carrito está vacío</b><p>¡Agrega tus flores favoritas!</p></div>';$("#cartTotal").hidden=true;return;}
  wrap.innerHTML=cart.map((item,i)=>`<div class="cart-line"><div><b>${item.name}</b><br><small>$${item.price.toFixed(2)} × ${item.qty}</small></div><div><b>$${(item.price*item.qty).toFixed(2)}</b><br><button data-remove="${i}">Quitar</button></div></div>`).join("");
  $("#cartTotal").hidden=false;
  $("#totalValue").textContent="$"+cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
  $$("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{cart.splice(+btn.dataset.remove,1);renderCart();}));
}
$$(".add-btn").forEach(btn=>btn.addEventListener("click",()=>{const found=cart.find(i=>i.name===btn.dataset.name);if(found)found.qty++;else cart.push({name:btn.dataset.name,price:+btn.dataset.price,qty:1});renderCart();toast("¡"+btn.dataset.name+" agregado al carrito! ♡");}));
function filterCategory(category){
  $$(".product-card").forEach(card=>card.classList.toggle("hidden",category!=="Todos" && card.dataset.category!==category));
  $$(".category-card").forEach(card=>card.classList.toggle("selected",card.dataset.category===category));
  $("#searchInput").value="";
  document.querySelector("#catalogo").scrollIntoView({behavior:"smooth",block:"start"});
}
$$(".category-card").forEach(btn=>btn.addEventListener("click",()=>filterCategory(btn.dataset.category)));
$$("[data-filter]").forEach(link=>link.addEventListener("click",()=>filterCategory(link.dataset.filter)));
$("#resetFilter").addEventListener("click",()=>filterCategory("Todos"));
$$(".quick-view").forEach(btn=>btn.addEventListener("click",()=>toast("Descubre "+btn.dataset.name+" en nuestro catálogo ♡")));
$("#accountBtn").addEventListener("click",()=>toast("¡Pronto podrás crear tu cuenta!"));
$("#checkoutBtn").addEventListener("click",()=>toast("¡Gracias! Conecta tu pasarela de pago para finalizar la compra."));
// Small hero carousel interaction: the image remains in the supplied floral style.
let slide=0;
function moveSlide(dir){slide=(slide+dir+3)%3;$$(".hero-dots i").forEach((dot,i)=>dot.classList.toggle("selected",i===slide));$(".hero").style.backgroundPosition=["center 48%","58% 48%","42% 48%"][slide];}
$(".hero-arrow.prev").addEventListener("click",()=>moveSlide(-1));
$(".hero-arrow.next").addEventListener("click",()=>moveSlide(1));
renderCart();