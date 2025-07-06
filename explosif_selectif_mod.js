
// Définir un tableau des éléments valides
let listeDeclencheurs = Object.keys(elements).filter(e => !elements[e].hidden && elements[e].category !== "tools");

// Ajoute une interface de sélection
let choixDeclencheur = "fire"; // valeur par défaut

modInterface.addUI([
    {
        type: "label",
        text: "Déclencheur d'explosion :"
    },
    {
        id: "liste_declencheur",
        type: "dropdown",
        options: listeDeclencheurs,
        value: "fire",
        onChange: function(value) {
            choixDeclencheur = value;
        }
    }
]);

// Élément explosif
elements.explosif_selectif = {
    color: "#ff3333",
    behavior: behaviors.SOLID,
    category: "explosifs",
    density: 1400,
    desc: "Explose uniquement au contact de l’élément choisi dans la liste en haut à gauche.",
    tick: function(pixel) {
        if (!pixel.custom_trigger) {
            pixel.custom_trigger = choixDeclencheur;
            pixel.color = "#cc0000"; // armé
        }

        for (let i = 0; i < adjacentCoords.length; i++) {
            let coord = adjacentCoords[i];
            let x = pixel.x + coord[0];
            let y = pixel.y + coord[1];
            if (!isEmpty(x, y, true)) {
                let otherPixel = pixelMap[x][y];
                if (otherPixel && otherPixel.element === pixel.custom_trigger) {
                    explodeAt(pixel.x, pixel.y, 12);
                    deletePixel(pixel);
                    break;
                }
            }
        }
    }
};
