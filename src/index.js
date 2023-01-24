import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleOnInput, DEBOUNCE_DELAY));

function handleOnInput() {
  const inputValue = inputEl.value.trim();
  //   console.log(inputValue);
  if (inputValue === '') {
    listEl.innerHTML = '';
    divEl.innerHTML = '';
    return;
  }

  fetchCountries(inputValue)
    .then(data => {
      console.log(data);
      if (data.length === 1) {
        divEl.innerHTML = createOrdinaryMarkup(data);
        listEl.innerHTML = '';
        Notiflix.Notify.success('Here your result');
      } else if (data.length >= 2 && data.length < 10) {
        listEl.innerHTML = createSmallMarkup(data);
        divEl.innerHTML = '';
        Notiflix.Notify.success('Here your result');
      } else {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(() => {
      listEl.innerHTML = '';
      divEl.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
}
function createSmallMarkup(data) {
  const smallMarkup = data
    .map(({ flags, name }) => {
      console.log(flags);
      return `<li class="country-item">
    <img class="country-item--img" src="${flags.svg}" alt="country flag" width="50" height="40">
    <h2 class="country-item--title">${name.official}</h2>
    </li>`;
    })
    .join('');
  // console.log(smallMarkup);
  return smallMarkup;
}

function createOrdinaryMarkup(data) {
  const ordinaryMarkup = data
    .map(({ flags, name, population, capital, languages }) => {
      return `<div class="country-info">
    <div class="country-info--header">
    <img src="${flags.svg}" alt="Country flag" width="85" height="55">
    <h2 class="country-info--name"> ${name.official}</h2>
    </div>
    <p class="country-info--field">Capital:<span class="country-info--value">${capital}</span></p>
    <p class="country-info--field">Population:<span class="country-info--value">${population}</span></p>
    <p class="country-info--field">Languages:<span class="country-info--value">${Object.values(
      languages
    )}</span></p>
      </div>`;
    })
    .join('');
  return ordinaryMarkup;
}
