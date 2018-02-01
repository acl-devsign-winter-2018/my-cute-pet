import Template from '../../Template';
import html from './pet-detail.html';
import './pet-detail.css';
import Images from './Images';
import { auth, db, storage } from '../../../services/firebase';

const template = new Template(html);
const pets = db.ref('pets');
const petsImages = db.ref('pet-images');
const petsByUser = db.ref('petsByUser');
const petImageStorage = storage.ref('pets');

export default class PetDetail {
  constructor(key) {
    this.key = key;
    this.pet = pets.child(key);
  }

  removePet() {
    if(!confirm('Are you sure you want to permanently remove this pet?')) return;

    const storage = petImageStorage.child(this.key);
    storage.delete()
      .catch(err => {
        if(err.code === 'storage/object-not-found') return;
        console.error(err);
      });

    const updates = {
      [pets.child(this.key).path]: null,
      [petsImages.child(this.key).path]: null,
      [petsByUser.child(auth.currentUser.uid).child(this.key).path]: null
    };  
  
    db.ref().update(updates)
      .then(() => window.location.hash = '#pets')
      .catch(console.error);
    // TODO:
    // .catch(err => this.error.textContent = err);

  }

  render() {
    const dom = template.clone();
    const header = dom.querySelector('h2');

    const imageSection = dom.querySelector('section.images');
    const removeButton = dom.querySelector('button.remove');

    this.onValue = this.pet.on('value', data => {
      const pet = data.val();
      // we might have deleted:
      if(!pet) return;

      header.textContent = `${pet.name} the ${pet.type}`;

      const isOwner = pet.owner === auth.currentUser.uid;

      this.images = new Images(this.key, isOwner);
      imageSection.append(this.images.render());

      if(isOwner) {
        removeButton.addEventListener('click', () => {
          this.removePet();
        });
      }
      else {
        removeButton.remove();
      }
    });


    return dom;
  }

  unrender() {
    pets.child(this.key).off('value', this.onValue);
    this.images.unrender();
  }
}