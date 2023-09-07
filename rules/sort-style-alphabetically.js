module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce alphabetical ordering of styles within getThemedStyles',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      ObjectExpression(node) {
        if (
          node.parent &&
          node.parent.type === 'ArrowFunctionExpression' &&
          node.parent.parent &&
          node.parent.parent.type === 'VariableDeclarator' &&
          node.parent.parent.id.name === 'getThemedStyles'
        ) {
          const properties = node.properties;
          const alphaStyles = [];
          const otherStyles = [];

          properties.forEach((property) => {
            if (property.type === 'Property') {
              // Define a helper function to extract the name based on node type
              const extractName = (keyNode) => {
                if (keyNode.type === 'Literal') {
                  return keyNode.value;
                } else if (keyNode.type === 'Identifier') {
                  return keyNode.name;
                } else {
                  // Attempt to stringify if it's an object/array/other complex types
                  try {
                    return JSON.stringify(keyNode);
                  } catch (e) {
                    // If not stringifiable, just return the type as name
                    return keyNode.type;
                  }
                }
              };

              const name = extractName(property.key);

              if (property.computed) {
                otherStyles.push({
                  name: `[${property.key.object.name}.${property.key.property.name}]`,
                  node: property,
                });
              } else if (property.key.type === 'Identifier') {
                alphaStyles.push({
                  name,
                  node: property,
                });
              }
            }
          });

          otherStyles.sort((a, b) => a.name.localeCompare(b.name));
          alphaStyles.sort((a, b) => a.name.localeCompare(b.name));

          const sortedStyles = alphaStyles.concat(otherStyles);

          properties.map((property, i) => {
            if (properties[i] !== sortedStyles[i].node) {
              context.report({
                node: property,
                message: 'Styles should be in alphabetical order.',
                fix: (fixer) => {
                  return [
                    fixer.replaceText(
                      properties[i],
                      context.getSourceCode().getText(sortedStyles[i].node),
                    ),
                  ];
                },
              });
            }
          });
        }
      },
    };
  },
};

