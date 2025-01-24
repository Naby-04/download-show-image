// main.js
// Récupération des éléments HTML
const inputFile = document.querySelector("input[type='file']");
const showDiv = document.querySelector(".show");

// Ajout d'un événement pour détecter le changement de fichier
inputFile.addEventListener("change", (event) => {
  const file = event.target.files[0]; // Récupérer le fichier sélectionné

  // Vérification : Est-ce un fichier valide ?
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();

    // Lorsque la lecture est terminée, on affiche l'image
    reader.onload = (e) => {
      showDiv.style.backgroundImage = `url('${e.target.result}')`;
      showDiv.style.backgroundSize = "cover";
      showDiv.style.backgroundPosition = "center";
    };

    // Lecture du fichier
    reader.readAsDataURL(file);
  } else {
    alert("Veuillez sélectionner un fichier d'image valide !");
  }
});
