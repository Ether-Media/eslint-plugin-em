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
          const styles = [];

          properties.forEach((property, index) => {
            if (property.type === 'Property') {
              styles.push({
                name: property.key.name,
                node: property,
              });
            }
          });

          const sortedStyles = styles
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name));

          for (let i = 0; i < styles.length; i++) {
            if (styles[i] !== sortedStyles[i]) {
              context.report({
                node: styles[i].node,
                message: 'Styles should be in alphabetical order.',
                fix: (fixer) => {
                  const startIndex = styles[i].node.range[0];
                  const endIndex = styles[i].node.range[1];

                  const sortedStyle = sortedStyles[i];
                  const sortedNode = sortedStyle.node;

                  return [
                    fixer.replaceTextRange(
                      [startIndex, endIndex],
                      context.getSourceCode().getText(sortedNode),
                    ),
                    fixer.replaceTextRange(
                      sortedNode.range,
                      context.getSourceCode().getText(styles[i].node),
                    ),
                  ];
                },
              });
            }
          }
        }
      },
    };
  },
};
