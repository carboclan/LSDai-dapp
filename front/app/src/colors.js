const Colors = {
    beige: "#f5f5dc",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    yellow: "#ffff00"
};

const randomColor = function(existingArray) {
    var result;
    var count = 0;
    for (var prop in Colors)
        if (Math.random() < 1 / ++count) result = Colors[prop];
    if (
        existingArray.length <= Object.keys(Colors).length &&
        existingArray.includes(result)
    )
        return randomColor([...existingArray, result]);
    return result;
};

export default randomColor;
