let PATH = '../assets/images/';
// let ICONPATH = '../assets/icons/';
// let JSON = '../assets/images/json/';

export const images = {
  arrowLeft: require(`${PATH}arrow-left.png`),

  closeCircle: require(`${PATH}close-circle.png`),

  arrowDown: require(`${PATH}arrowDown.png`),
  route: require(`${PATH}route.png`),

  // Toast
  success: require(`${PATH}success.png`),
  danger: require(`${PATH}danger.png`),
  warning: require(`${PATH}warning.png`),
} as const;

export type AppImage = keyof typeof images;
