// Panier boutique — stocké dans le navigateur (localStorage), sans compte client.
const KEY = "optinet_cart";

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function getCart() { return read(); }

export function addToCart(produit, qte = 1) {
  const items = read();
  const i = items.findIndex((x) => x.produit === produit.id);
  if (i >= 0) items[i].quantite += qte;
  else items.push({
    produit: produit.id,
    nom: produit.nom,
    prix: produit.prix || "",
    image: produit.image_principale || "",
    quantite: qte,
  });
  write(items);
}

export function setQuantite(id, qte) {
  const items = read();
  const i = items.findIndex((x) => x.produit === id);
  if (i >= 0) { items[i].quantite = Math.max(1, qte); write(items); }
}

export function removeFromCart(id) { write(read().filter((x) => x.produit !== id)); }
export function clearCart() { write([]); }
export function cartCount() { return read().reduce((s, x) => s + x.quantite, 0); }

// Extrait un nombre d'un prix en texte ("100 000 FCFA" -> 100000)
export function parsePrix(prix) {
  const n = parseInt(String(prix || "").replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}
export function cartTotal() {
  return read().reduce((s, x) => s + parsePrix(x.prix) * x.quantite, 0);
}
export function formatFCFA(n) {
  return (n || 0).toLocaleString("fr-FR") + " FCFA";
}
