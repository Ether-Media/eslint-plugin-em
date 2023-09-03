module.exports = {
  meta: {
    type: 'layout',
    fixable: 'code',
  },
  create: function (context) {
    return {
      ObjectExpression(node) {
        const properties = node.properties;

        const styleProperties = properties
          .filter((prop) => prop.type === 'Property')
          .map((prop) => prop.key.name);

        const sortedStyleProperties = [...styleProperties].sort();

        if (
          JSON.stringify(styleProperties) !==
          JSON.stringify(sortedStyleProperties)
        ) {
          context.report({
            node: properties[0],
            messageId: 'alphabeticalOrder',
            fix(fixer) {
              const fixes = sortedStyleProperties.map((propName, index) => {
                const propertyNode = properties[index];
                const sourceCode = context.getSourceCode();

                const propertyText = sourceCode.getText(propertyNode);
                const fixedText = `${propName}: ${propertyText}`;

                return fixer.replaceText(propertyNode, fixedText);
              });

              return fixes;
            },
            // Specify 'error' severity level for the report
            severity: 'error',
          });
        }
      },
    };
  },
};
