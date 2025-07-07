if (typeof window.explosifUI_currentTrigger === "undefined") {
    window.explosifUI_currentTrigger = "fire";
}

function showGlobalTriggerSelector() {
    let existing = document.getElementById("explosif-ui-selector");
    if (existing) existing.remove();

    let div = document.createElement("div");
    div.id = "explosif-ui-selector";
    Object.assign(div.style, {
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(34, 34, 34, 0.95)",
        color: "#fff",
        padding: "12px 18px",
        border: "2px solid #66ccff",
        borderRadius: "10px",
        zIndex: "99999",
        fontFamily: "monospace",
        boxShadow: "0 0 12px #000",
    });

    let label = document.createElement("div");
    label.textContent = "Déclencheur global :";
    label.style.marginBottom = "6px";
    label.style.fontWeight = "bold";
    div.appendChild(label);

    let select = document.createElement("select");
    select.style.padding = "6px";
    select.style.borderRadius = "6px";
    select.style.border = "1px solid #ccc";
    select.style.marginRight = "10px";

    for (let key in elements) {
        let opt = document.createElement("option");
        opt.value = key;
        opt.textContent = key;
        if (key === window.explosifUI_currentTrigger) {
            opt.selected = true;
        }
        select.appendChild(opt);
    }

    let button = document.createElement("button");
    button.textContent = "✅ Changer";
    button.style.padding = "6px 10px";
    button.style.backgroundColor = "#66ccff";
    button.style.color = "#000";
    button.style.border = "none";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";

    button.onclick = function() {
        let selected = select.value;
        window.explosifUI_currentTrigger = selected;
        div.remove();
        alert("Déclencheur global changé en : " + selected);
    };

    div.appendChild(select);
    div.appendChild(button);

    document.body.appendChild(div);
}

document.addEventListener("keydown", function(e) {
    if (e.key.toLowerCase() === "m") {
        showGlobalTriggerSelector();
    }
});

elements.explosif_ui = {
    color: "#ff5555",
    behavior: behaviors.SOLID,
    category: "weapons",
    density: 1400,
    desc: "Explose au contact de l'élément global sélectionné. Appuie sur 'M' pour le modifier.",

    tick: function(pixel) {
        if (!pixel.initialized) {
            pixel.initialized = true;
            pixel.color = "#cc0000";
            pixel.custom_trigger = window.explosifUI_currentTrigger;
        }

        if (!pixel.custom_trigger) return;

        const neighbors = [
            [-1, -1], [0, -1], [1, -1],
            [-1, 0],          [1, 0],
            [-1, 1],  [0, 1],  [1, 1]
        ];

        for (let i = 0; i < neighbors.length; i++) {
            let nx = pixel.x + neighbors[i][0];
            let ny = pixel.y + neighbors[i][1];

            if (nx < 0 || ny < 0 || nx >= pixelMap.length || ny >= pixelMap[0].length) continue;

            let otherPixel = pixelMap[nx][ny];

            if (otherPixel) {
                if (otherPixel.element === pixel.custom_trigger) {
                    explodeAt(pixel.x, pixel.y, 12);
                    deletePixel(pixel);
                    break;
                }
            }
        }
    }
};
