function showToast(itemName) {
  // Create toast element
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300 z-50";
  toast.textContent = `${itemName} added to cart!`;

  document.body.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
