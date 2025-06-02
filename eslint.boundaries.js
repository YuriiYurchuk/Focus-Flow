const ELEMENT_TYPE_RULES = [
  {
    from: "shared",
    disallow: ["app", "feature"],
    message:
      "Помилка: модулі з 'shared' не повинні імпортувати код із 'app' або 'feature'. " +
      "Будь ласка, уникати таких залежностей, щоб зберігати шардинг коду чистим.",
  },
  {
    from: "feature",
    disallow: ["app"],
    message:
      "Помилка: модулі 'feature' не можуть імпортувати код із 'app'. " +
      "Перевірте архітектуру та організуйте залежності коректно.",
  },
];

const ELEMENT_POINTS_RULES = [
  {
    target: ["shared", "app"],
    allow: "**",
  },
  {
    target: ["feature"],
    allow: ["index.(ts|tsx)"],
  },
];

export const eslintBoundariesConfig = {
  plugins: { boundaries },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    "boundaries/elements": ELEMENTS,
  },
  rules: {
    "boundaries/element-types": [
      2,
      {
        default: "allow",
        rules: ELEMENT_TYPE_RULES,
      },
    ],
    "boundaries/element-points": [
      2,
      {
        default: "disallow",
        message:
          "Цей тип імпорту не дозволений. " +
          "Вкажіть явний дозвіл для точок входу (entry points) елементів у налаштуваннях.",
        rules: ELEMENT_POINTS_RULES,
      },
    ],
  },
};
