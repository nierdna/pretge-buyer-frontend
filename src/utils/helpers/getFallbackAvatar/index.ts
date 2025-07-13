export const getFallbackAvatar = (address: string | undefined) => {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${
    address || Math.random().toString()
  }`;
};
