import { createRecipe, getRecipes, deleteRecipe, updateRecipe } from "./modules/data.js";

import { setupCountries } from "./modules/setup.js";

setupCountries();
/*
Vortes form
event submit
samle data FormData()
    .get()
    .getAll()
*/
async function showRecipes() {
  const response = await getRecipes();
  const el = document.querySelector("template").content;
  const parent = document.querySelector(".recipes");
  parent.innerHTML = "";
  response.forEach((rec) => {
    const clone = el.cloneNode(true);
    clone.querySelector("[data-name]").textContent = rec.name;
    clone.querySelector("[data-ingredients]").textContent = rec.ingredients;
    clone.querySelector("[data-description]").textContent = rec.description;
    clone.querySelector("[data-origin]").textContent = rec.origin;
    clone.querySelector("[data-serves]").value = rec.serves;
    clone.querySelector("[data-time]").textContent = `${rec.time} min`; // Add this line to populate time
    if (rec.studentFriendly) {
      clone.querySelector(".status1").hidden = false;
    } else {
      clone.querySelector(".status1").hidden = true;
    }

    clone.querySelectorAll("[data-id]").forEach((e) => (e.dataset.id = rec.id));
    clone.querySelector("button[data-action='delete']").addEventListener("click", async () => {
      await deleteRecipe(rec.id);
      await showRecipes();
    });
    clone.querySelector("button[data-action='update']").addEventListener("click", async () => {
      await updateRecipe(rec.id, !rec.studentFriendly);
      await showRecipes();
    });
    parent.appendChild(clone);
  });
}

showRecipes();

function handleSubmit() {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    console.log(e);
    //stop refresh
    e.preventDefault();
    const formData = new FormData(form);
    console.log(formData.get("ingredients").split("\n"));

    await createRecipe({
      name: formData.get("name"),
      description: formData.get("description"),
      ingredients: formData.get("ingredients").split("\n "),

      serves: formData.get("serves"),
      allergens: formData.get("allergens").split("\n"),
      diet: formData.get("diet"),
      studentFriendly: formData.get("studentFriendly"),
      origin: formData.get("origin"),
      time: formData.get("time"),
    });
    showRecipes();
  });
}
handleSubmit();
