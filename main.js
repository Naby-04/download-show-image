// main.js
// Récupération des éléments HTML
const inputFile = document.querySelector("input[type='file']");
const Form = document.getElementById("Form");
const showDiv = document.getElementById("show");
const preview = document.getElementById("preview");
const transformBtn = document.getElementById("transform");

// Variable pour stocker l'image sélectionnée
let imageElement = null;

// Ajout d'un événement pour détecter le changement de fichier
if (inputFile && showDiv) {
  inputFile.addEventListener("change", (event) => {
    const file = event.target.files[0]; // Récupérer le fichier sélectionné

    // Vérification : Est-ce un fichier valide ?
    if (file && file.type.startsWith("image/")) {
      // On crée un "lecteur de fichier" spécial qui aidera l'ordinateur à lire le contenu du fichier image.
      const reader = new FileReader();

      // Lorsque la lecture est terminée, on affiche l'image
      reader.onload = (e) => {
        showDiv.style.backgroundImage = `url('${e.target?.result}')`;
        showDiv.style.backgroundSize = "cover";
        showDiv.style.backgroundPosition = "center";

        // Crée une balise <img> invisible pour le GIF
        imageElement = new Image();
        imageElement.src = e.target.result; // Définir la source de l'image
      };

      // On demande au lecteur de lire le fichier image et de le convertir en un format que l'ordinateur peut afficher directement sur la page web.
      reader.readAsDataURL(file);
    } else {
      alert("Veuillez sélectionner un fichier d'image valide !");
    }
  });
}

// gestion transformation Gif

if (Form && preview) {
  Form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("hey");

    if (!imageElement) {
      alert("Veuillez d'abord sélectionner une image !");
      return;
    }

    // clean preview zone
    preview.innerHTML = "Création du GIF en cours... Veuillez patienter.";

    // Récupérer les dimensions de l'image
    const imgWidth = imageElement.width;
    const imgHeight = imageElement.height;

    // creation de notre GIF
    // preparation de notre instance
    const gif = new GIF({
      workers: 2, // Nombre de "travailleurs" pour accélérer le traitement
      quality: 10, // Qualité du GIF (plus le chiffre est bas, plus la qualité est bonne)
      width: imgWidth, // Largeur du GIF
      height: imgHeight, // Hauteur du GIF
      // Chargez le travailleur en utilisant l'option workerScript dans le constructeur gif.
      workerScript: "gif.worker.js",
    });

    // ajout des cadres d'instance
    gif.addFrame(imageElement, { delay: 5000 });

    // Quand le GIF est prêt
    gif.on("finished", function (blob) {
      const url = URL.createObjectURL(blob); // Transforme le blob en URL utilisable
      const ourGif = document.createElement("img");
      ourGif.src = url;
      const message = document.createElement("p");
      message.textContent = "GIF généré avec succès !";
      preview.innerHTML = "";
      preview.appendChild(ourGif);

      // Ajouter un bouton de téléchargement
      const downloadLink = document.createElement("a");
      downloadLink.href = url; // Lien vers le blob
      downloadLink.download = "monGIF.gif"; // Nom du fichier téléchargé
      downloadLink.textContent = "Télécharger le GIF";
      downloadLink.style.display = "block";
      downloadLink.style.marginTop = "10px";
      downloadLink.style.color = "blue";
      downloadLink.style.textDecoration = "underline";

      Form.appendChild(downloadLink);
    });

    // verification des erreurs
    gif.on("error", function (error) {
      console.error(
        "Une erreur est survenue lors de la création du GIF :",
        error
      );
      alert("Erreur : Impossible de générer le GIF. Veuillez réessayer.");
    });

    // Lancer la création du GIF
    gif.render();
  });
} else {
  console.error("error");
}
