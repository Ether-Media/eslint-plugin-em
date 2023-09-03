const allRules = {
  'sort-style-alphabetically': sort_style_alphabetically,
};

const rulesConfig = {
  parserOptions: {
    ecmaFeatures: {jsx: true},
  },
  rules: {
    'sort-style-alphabetically': 2,
  },
};

module.exports = {
  rules: allRules,
  configs: {
    recommended: rulesConfig,
    all: rulesConfig,
  },
};
