import Template from '../../Template';
import html from './add-pet.html';
import './add-pet.css';
import { db, auth } from '../../../services/firebase';

const template = new Template(html);
const pets = db.ref('pets');
const petsByUser = db.ref('petsByUser');

export default class AddPet {
  constructor(onAdd) {
    this.onAdd = onAdd;
    const currentUser = auth.currentUser;
    this.myPets = petsByUser.child(currentUser.uid);
  }

  handleSubmit(form) {
    this.error.textContent = '';

    const data = new FormData(form);
    const pet = {};
    data.forEach((value, key) => pet[key] = value);    
    
    pet.owner = auth.currentUser.uid;
    const ref = pets.push();
    
    const updates = {
      [ref.path]: pet,
      [this.myPets.child(ref.key).path]: true
    };

    db.ref().update(updates)
      .then(() => window.location.hash = `#pets/${ref.key}`)
      .catch(err => this.error.textContent = err);
  }

  render() {
    const dom = template.clone();
    this.error = dom.querySelector('.error');

    this.form = dom.querySelector('form');
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      this.handleSubmit(event.target);
    });

    dom.querySelector('button[type=button]').addEventListener('click', event => {
      event.preventDefault();
      window.location.hash = '#pets';
    });

    return dom;
  }

  unrender() {
    // no-op
  }
}