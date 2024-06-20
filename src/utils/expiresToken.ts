function getTimeExpries(time: string): number {
  let result = null;
  const typeExpries = time.split('')[time.split('').length - 1];
  switch (typeExpries) {
    case 'd': {
      const indexType = time.indexOf(typeExpries);
      const numberExpries = time.slice(0, indexType);
      result = +numberExpries * 24 * 60 * 60;
      break;
    }
    case 'h': {
      const indexType = time.indexOf(typeExpries);
      const numberExpries = time.slice(0, indexType);
      result = +numberExpries * 60 * 60;
      break;
    }
    default: {
      result = time;
      break;
    }
  }
  return result;
}

export default getTimeExpries;
