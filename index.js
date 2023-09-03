const sort_style_alphabetically = require('./rules/sort-style-alphabetically.js');

const allRules = {
  'sort-style-alphabetically': sort_style_alphabetically,
};

const rulesConfig = {
  plugins: ['@em'],
  parserOptions: {
    ecmaFeatures: {jsx: true},
  },
  rules: {
    '@em/sort-style-alphabetically': 2,
  },
};

module.exports = {
  rules: allRules,
  configs: {
    recommended: rulesConfig,
    all: rulesConfig,
  },
};
