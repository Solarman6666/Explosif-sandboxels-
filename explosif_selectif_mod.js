// ==UserScript==
// @name         Explosif UI Mod
// @version      1.0
// @description  Ajoute un explosif personnalisable avec une interface graphique pour choisir le déclencheur
// @author       Ahmad
// @match        *://*sandboxels*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function showTriggerSelector(pixel) {
        let existing = document.getElementById("explosif-ui-selector");
        if (existing) existing.remove();

        let div = document.createElement("div");
        div.id = "explosif-ui-selector";
        Object.assign(div.style, {
            position: "fixed",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(34, 34, 34, 0.95)",
            color: "#fff",
            padding: "14px 20px",
            border: "2px solid #66ccff",
            borderRadius: "12px",
            zIndex: "99999",
            fontFamily: "monospace",
            boxShadow: "0 0 12px #000",
        });

        let title = document.createElement("div");
        title.textContent = "Sélectionner un déclencheur :";
        title.style.marginBottom = "8px";
        title.style.fontWeight = "bold";
        div.appendChild(title);

        let select = document.createElement("select");
        select.style.padding = "6px";
        select.style.borderRadius = "6px";
        select.style.border = "1px solid #ccc";
        select.style.marginRight = "10px";
        for (let key in elements) {
            let opt = document.createElement("option");
            opt.value = key;
            opt.textContent = key;
            select.appendChild(opt);
        }

        let button = document.createElement("button");
        button.textContent = "✅ Armer";
        button.style.padding = "6px 10px";
        button.style.backgroundColor = "#66ccff";
        button.style.color = "#000";
        button.style.border = "none";
        button.style.borderRadius = "6px";
        button.style.cursor = "pointer";
        button.onclick = function() {
            let selected = select.value;
            pixel.custom_trigger = selected;
            div.remove();
        };

        div.appendChild(select);
        div.appendChild(button);

        document.body.appendChild(div);
    }

    elements.explosif_ui = {
        color: "#ff5555",
        behavior: behaviors.SOLID,
        category: "weapons",
        density: 1400,
        desc: "Explose au contact d’un élément choisi dans une interface graphique.",

        tick: function(pixel) {
            if (!pixel.initialized) {
                pixel.initialized = true;
                pixel.color = "#cc0000";
                showTriggerSelector(pixel);
                return;
            }

            if (!pixel.custom_trigger) return;

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
})();
