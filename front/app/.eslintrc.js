module.exports = {
    root: true,
    env: {
      "node": true
    },
    extends: [
      "plugin:vue/essential",
      "@vue/prettier"
    ],
    parserOptions: {
        "ecmaVersion": 2018,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
    },
    globals: {
        "web3": true,
        "ethereum": true
    },
    rules: {
        "parser": "babel-eslint",
        "no-console": "off",
        "quotes": [
            "error",
            "double"
        ],
    }
};
