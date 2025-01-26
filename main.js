// main.js
// Récupération des éléments HTML
const inputFile = document.querySelector("input[type='file']");
const Form = document.getElementById("Form");
const showDiv = document.getElementById("show");
const preview = document.getElementById("preview");

// Tableau pour stocker les images sélectionnées
let imageElements = [];

// Ajout d'un événement pour détecter le changement de fichier
if (inputFile && showDiv) {
  inputFile.addEventListener("change", (event) => {
    const files = Array.from(event.target.files); // Récupérer tous les fichiers sélectionnés

    // Réinitialiser le tableau d'images
    imageElements = [];

    // Vérifier et charger chaque fichier
    files.forEach((file, index) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          // Ajouter chaque image au tableau d'images
          const img = new Image();
          img.src = e.target.result;

          // Une fois l'image chargée, l'ajouter au tableau
          img.onload = () => {
            imageElements.push(img);
            console.log(
              `Image ${index + 1} chargée : ${img.width}x${img.height}`
            );

            // Optionnel : Afficher une prévisualisation des images chargées
            const imgPreview = document.createElement("div");
            imgPreview.style.backgroundImage = `url('${img.src}')`;
            imgPreview.style.width = "100px";
            imgPreview.style.height = "100px";
            imgPreview.style.backgroundSize = "cover";
            imgPreview.style.backgroundPosition = "center";
            imgPreview.style.margin = "5px";
            imgPreview.style.display = "inline-block";
            showDiv.innerText = "";
            showDiv.appendChild(imgPreview);
          };
        };

        reader.readAsDataURL(file);
      } else {
        alert("Veuillez sélectionner des fichiers d'image valides !");
      }
    });
  });
}

// Gestion de la transformation en GIF
if (Form && preview) {
  Form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (imageElements.length === 0) {
      alert("Veuillez d'abord sélectionner au moins une image !");
      return;
    }

    preview.innerHTML = "Création du GIF en cours... Veuillez patienter.";

    // Récupérer les dimensions de la première image pour le GIF
    const imgWidth = imageElements[0].width;
    const imgHeight = imageElements[0].height;

    // Créer l'instance GIF avec les dimensions de la première image
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: imgWidth,
      height: imgHeight,
      workerScript: "gif.worker.js",
    });

    // Ajouter toutes les images comme cadres au GIF
    imageElements.forEach((img, index) => {
      gif.addFrame(img, { delay: 500 }); // Délai entre les cadres en millisecondes
      console.log(`Ajout de l'image ${index + 1} au GIF`);
    });

    gif.on("finished", function (blob) {
      preview.innerHTML = ""; // Nettoie la zone

      // Afficher le GIF
      const url = URL.createObjectURL(blob);
      const ourGif = document.createElement("img");
      ourGif.src = url;
      preview.appendChild(ourGif);

      // Ajouter un bouton de téléchargement
      const showLink = document.getElementById("showLink");
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "monGIF.gif"; // Nom du fichier téléchargé
      downloadLink.textContent = "Télécharger le GIF";
      downloadLink.style.display = "block";
      downloadLink.style.color = "blue";
      downloadLink.style.textDecoration = "underline";

      showLink.innerHTML = "";
      showLink.appendChild(downloadLink);
    });

    gif.on("error", function (error) {
      console.error("Une erreur est survenue :", error);
      alert("Erreur : Impossible de générer le GIF.");
    });

    gif.render();
  });
} else {
  console.error("Les éléments requis n'ont pas été trouvés !");
}
