const { protocol } = window.location;
const PROJECT_NAME = 'alchemy-code-lab';
const FETCH_URL = `${protocol}//res.cloudinary.com/${PROJECT_NAME}/image/fetch`;

export const getUrl = (url, options = '') => {
  return `${FETCH_URL}/${options}/${encodeURIComponent(url)}`;
};