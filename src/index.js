import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {Notify} from 'notiflix';
import axios, {isCancel, AxiosError} from 'axios';


const URL = 'https://pixabay.com/api/'
const KEY = '34475596-b269349df24b9ffe76cf99f2a'

let hits = [];
let page = 1;
let query = '';
let per_page = 40;
let totalHits = 0;
let lastItem = '';

const refs = {
    galleryList: document.querySelector('.gallery'),
    inputEl: document.querySelector('input'),
    form: document.querySelector('form'),
    loadMore: document.querySelector('.load-more'),
    galleryContainer: document.querySelector('.gallery'),
}




refs.loadMore.classList.add('is-hidden'); //В початковому стані кнопка повинна бути прихована.


scroll()

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
    
const galleryLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
galleryLightbox.refresh()
      if(data.total === 0){
        Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      }
      // if(onSearchPhoto){
      //   refs.loadMore.classList.remove('is-hidden');
      // }

      if(onSearchPhoto){
         Notify.success(`Hooray! We found ${data.totalHits} images`);}

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


const createImgGalerry = (item) => `
 <a href="${item.largeImageURL}" class="large-img link">
<div class="photo-card">
<img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="280" height="260"/>
<div class="info">
  <p class="info-item">
    <b>Likes:${item.likes}</b>
  </p>
  <p class="info-item">
    <b>Views:${item.views}</b>
  </p>
  <p class="info-item">
    <b>Comments:${item.comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads:${item.downloads}</b>
  </p>
</div>
</div>
</a>`


const generateContent = (array) => array?.reduce((acc,item) => acc + createImgGalerry(item), "");


const insertContent = (array) => {
    const result = generateContent(array);
    refs.galleryList.insertAdjacentHTML("beforeend", result);
}

function refresh() {
    refs.galleryList.innerHTML = '';    
}




refs.form.addEventListener('submit' , onSearchPhoto )


function onSearchPhoto(e) {
    e.preventDefault()  

    const searchEl = refs.inputEl.value.trim().toLowerCase();

    if(query === searchEl  ){
      return;
    }
    query = searchEl;
    page = 1;

    getPhoto() 
    refresh()
}



// const handleLoadMore = e => {   // подгрузка контента
//   page++
//   getPhoto() 

// }

 




  function checkPosition() {
    const height = document.body.offsetHeight
    const screenHeight = window.innerHeight
    const scrolled = window.scrollY
    const threshold = height - screenHeight / 4
    const position = scrolled + screenHeight
  
    if (position >= threshold) {
      page++
      getPhoto() 
  
    }
  }
  
  function throttle(callee, timeout) {
    let timer = null
  
    return function perform(...args) {
      if (timer) return
  
      timer = setTimeout(() => {
        callee(...args)
  
        clearTimeout(timer)
        timer = null
      }, timeout)
    }
  }
  
  
  function scroll() {
    window.addEventListener('scroll', throttle(checkPosition,500))
    window.addEventListener('resize', throttle(checkPosition,500))
  }
  
  // refs.loadMore.addEventListener('click' , handleLoadMore)





//   refs.galleryContainer.addEventListener('click' , onClickImg)


//   function onClickImg(e) {
//     e.preventDefault();

//     if( e.target.nodeName !== 'IMG'){
//       return
//       }


//   }


