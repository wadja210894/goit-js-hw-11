import axios from 'axios';

const KEY = "35173003-b6ca9ce4d0c657ae60aeaf78c";

axios.defaults.baseURL = 'https://pixabay.com/api/';

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response.data;
};

export { fetchImages };