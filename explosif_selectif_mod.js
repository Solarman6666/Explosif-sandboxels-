elements.explosif_selectif = {
    color: "#ff3333",
    behavior: behaviors.SOLID,
    category: "weapons",
    density: 1400,
    desc: "Explose au contact d’un élément choisi via prompt au placement.",
    tick: function(pixel) {
        // Initialisation une seule fois
        if (!pixel.initialized) {
            pixel.initialized = true;

            let choix = prompt("Entrez l'ID de l'élément déclencheur de l'explosion (ex: fire, water, acid) :");

            if (choix && elements[choix]) {
                pixel.custom_trigger = choix;
                pixel.color = "#cc0000";
                alert("Explosion armée avec l’élément : " + choix);
            } else {
                pixel.custom_trigger = null;
                pixel.color = "#888888";
                alert("Élément invalide, explosif désarmé.");
            }

            return;
        }

        // Si désarmé, ne rien faire
        if (pixel.custom_trigger === null) {
            return;
        }

        // Sinon, surveille les alentours
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
