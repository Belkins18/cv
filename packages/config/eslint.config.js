// The package lints itself with its own preset: otherwise `eslint .` walks up
// to the root config, and that one ignores packages — each has its own.
export { default } from './eslint/index.js'
