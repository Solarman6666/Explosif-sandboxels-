elements.explosif_selectif = {
    color: "#ff3333",
    behavior: behaviors.SOLID,
    category: "weapons",
    density: 1400,
    desc: "Explose au contact d’un élément choisi via prompt au placement.",
    tick: function(pixel) {
        // Ne demande le choix qu'une seule fois
        if (pixel.custom_trigger === undefined) {
            let choix = prompt("Entrez l'ID de l'élément déclencheur de l'explosion (ex: fire, water, acid) :");
            
            if (choix && elements[choix]) {
                pixel.custom_trigger = choix;
                pixel.color = "#cc0000";
                alert("Explosion armée avec l’élément : " + choix);
            } else {
                pixel.custom_trigger = null; // désarmé
                pixel.color = "#888888";
                alert("Élément invalide, explosif désarmé.");
            }

            return; // On quitte pour éviter d'exécuter la suite
        }

        // Si désarmé, on ne fait rien
        if (pixel.custom_trigger === null) {
            return;
        }

        // Détection d'élément déclencheur autour
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
