module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "@vue/standard"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    // 禁用 console.log
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // 或者使用 eslint-plugin-unicorn 来移除 console.log
    "unicorn/no-console-spaces": "off",
    "unicorn/expiring-todo-comments": "off",
    "unicorn/no-nested-ternary": "off",
    "unicorn/prefer-optional-catch-binding": "off",
    "unicorn/prefer-spread": "off",
    "unicorn/no-array-reduce": "off",
    "unicorn/no-object-as-default-parameter": "off",
    "unicorn/prefer-node-protocol": "off",
    "unicorn/prefer-module": "off",
    "unicorn/no-negated-condition": "off",
    "unicorn/no-array-for-each": "off",
    "unicorn/no-await-expression-member": "off",
    "unicorn/no-empty-file": "off",
    "unicorn/no-unsafe-regex": "off",
    "unicorn/prefer-add-event-listener": "off",
    "unicorn/prefer-query-selector": "off",
    "unicorn/prefer-string-slice": "off",
    "unicorn/prefer-text-content": "off",
    "unicorn/prefer-trim-start-end": "off",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/string-content": "off",
    "unicorn/throw-new-error": "off",
  },
};
