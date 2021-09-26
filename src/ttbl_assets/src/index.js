import { ttbl } from "../../declarations/ttbl";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with ttbl actor, calling the greet method
  const greeting = await ttbl.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
