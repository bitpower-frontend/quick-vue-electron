module.exports = {
  "extends": ["bitpower"  , "plugin:vue/recommended"  ],
  "env": {
    "browser": true
  },
  "plugins": ["html"],
  "rules": {
    "vue/valid-v-if": "error",
    "linebreak-style": ["off"],
    "quotes": ["off"],
    "import/extensions": ["off"],
    "no-restricted-properties": ["warn"],
    "eqeqeq": ["warn"],
    "no-unused-vars": ["warn"],
    "import/newline-after-import": ["off"],
    "import/first": ["off"],
    "import/no-extraneous-dependencies": ["off"],
    "space-before-function-paren": ["off"],
    "arrow-parens": ["off"],
    "object-curly-spacing": ["warn"],
    "no-multi-spaces": ["off"],
    "prefer-destructuring": ["off"],
    "no-debugger": ["off"],
    "no-lonely-if": ["off"],
    "no-restricted-syntax": ["off"],
    "no-shadow": ["off"],
    "arrow-body-style": ["off"],                // 要求箭头函数体使用大括号
    "no-else-return": ["off"],                  // 禁止 if 语句中 return 语句之后有 else 块
    "radix": ["off"],                           // 强制在parseInt()使用基数参数
    'default-case': ['off'],                    // 要求 switch 语句中有 default 分支
    'no-var': ['warn'],                         // 要求使用let或const
    'no-continue': ['off'],                     // 禁止使用continue语句
    'dot-notation': ['off'],                    // 强制尽可能地使用点号
    'object-property-newline': ['off'],          // 强制将对象的属性放在不同的行上
    'import/no-unresolved': ['off']
  }
};
