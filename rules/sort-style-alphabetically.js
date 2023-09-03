module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce alphabetical order of styles in the getThemedStyles function',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    return {
      CallExpression(node) {
        const functionName = node.callee.name;
        if (functionName === 'getThemedStyles') {
          const stylesNode = node.arguments[0];
          if (stylesNode && stylesNode.type === 'ArrowFunctionExpression') {
            const source = sourceCode.getText(stylesNode.body);
            const sortedSource = source.split('\n').sort().join('\n');
            if (sortedSource !== source) {
              context.report({
                node: stylesNode.body,
                message: 'Styles should be sorted alphabetically.',
                fix(fixer) {
                  return fixer.replaceText(stylesNode.body, sortedSource);
                },
              });
            }
          }
        }
      },
    };
  },
};
