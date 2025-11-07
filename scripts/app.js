const bookBtns = document.querySelectorAll(".book-session-btn");
const modal = document.getElementById("bookingModal");
const closeModal = document.getElementById("closeModal");
const collectionButton = document.getElementById("collection-btn");
const exploreButton = document.getElementById("explore-btn");
const collections = document.getElementById("collections")

bookBtns.forEach((btn) => {
  btn.addEventListener("click", () => modal.classList.remove("hidden"));
});

closeModal.addEventListener("click", () => modal.classList.add("hidden"));

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

exploreButton.addEventListener("click", () => {
    collections.scrollIntoView({ behavior: 'smooth' })
} );
    
collectionButton.addEventListener("click", () => {
window.location.href = "collection.html"
}
   
)