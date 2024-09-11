// prettier need to be installled separately in the root of the project and dont follow the vercel-style-guide github repo where it says to put ` "prettier": "@vercel/style-guide/prettier"` in the package json
import vercelPrettierOptions from '@vercel/style-guide/prettier'

/** @type {import('prettier').Config} */
const config = {
  ...vercelPrettierOptions,
  semi: false,
  arrowParens: 'always',
  printWidth: 80,
  plugins: [...vercelPrettierOptions.plugins, 'prettier-plugin-tailwindcss'],
  tailwindAttributes: ['classValue', 'innerClassValue', 'outerClassValueValue'],
}

export default config
