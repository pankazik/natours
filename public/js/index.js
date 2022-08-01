/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout, register } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

//dom elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const registerForm = document.querySelector('.form--register');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-settings');
const bookBtn = document.querySelector('#book-tour');
const deleteBtn = document.querySelector('.btn--delete');

//values
const email = document.getElementById('email');
const passwordCurrent = document.getElementById('password-current');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('password-confirm');
const nickname = document.getElementById('nickname');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    login(email.value, password.value);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (updateForm) {
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'details');
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateSettings(
      {
        password: passwordCurrent.value,
        newPassword: password.value,
        newPasswordConfirm: passwordConfirm.value,
      },
      'password'
    );
    passwordCurrent.value = password.value = passwordConfirm.value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    register(
      nickname.value,
      email.value,
      password.value,
      passwordConfirm.value
    );
  });
}
