import './css/styles.css';
// import debounce from 'lodash.debounce';
// import {fetchCountries} from './js/fetchCountries'
import {Notify} from 'notiflix';

import axios, {isCancel, AxiosError} from 'axios';

const URL = 'https://pixabay.com/api/'
const KEY = '34475596-b269349df24b9ffe76cf99f2a'

let items = [];;
let page = 1;
let query = 'cats';
let per_page = 40;

// const PARAM = '&image_type=photo&orientation=horizontal&safesearch=true&'
const param = new URLSearchParams({ hits:'webformatURL,largeImageURL,tags,likes,views,comments,downloads'
});
const refs = {
    galleryList: document.querySelector('.gallery'),
    buttonsearchPhoto: document.querySelector('button'),
}
console.log(refs.buttonsearchPhoto);console.log(refs.galleryList)

// axios
// .get(`${URL}?key=${KEY}q=yellow+flowers&${PARAM}`)
// .then(response => {console.log(response.data)})
// .catch(error => {console.log(error)})


async function getPhoto() {
    try {
      const response = await axios.get(`${URL}?key=${KEY}&q=${query}&page=${page}&per_page=${per_page}`, {
        params: {
            mage_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        }
      });
      const data = await response.data
      const hits = await data.hits
      console.log(data)
      
      insertContent(data.hits)
      if(data.total === 0){
        Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      }
    } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      }
  }


  createImgGalerry = (item) => `
  <div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="420" height="340"/>
  <div class="info">
    <p class="info-item">
      <b>${item.likes}</b>
    </p>
    <p class="info-item">
      <b>${item.views}</b>
    </p>
    <p class="info-item">
      <b>${item.comments}</b>
    </p>
    <p class="info-item">
      <b>${item.downloads}</b>
    </p>
  </div>
</div>`

const generateContent = (array) => array?.reduce((acc,item) => acc + createImgGalerry(item), "");

const insertContent = (array) => {
    const result = generateContent(array);
    refs.galleryList.insertAdjacentHTML("beforeend", result);
}

getPhoto()