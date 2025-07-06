module.exports = {
  '*.{js,jsx,ts,tsx}': ['pnpm dlx prettier --write'],
  '*.{json,md,yml,yaml}': ['pnpm dlx prettier --write'],
  '*.{css,scss}': ['pnpm dlx prettier --write'],
};
