import Template from '../../Template';
import html from './pet.html';
import './pet.css';
import { db } from '../../../services/firebase';
import { getUrl } from '../../../services/cloudinary';

const template = new Template(html);
const petsImages = db.ref('pet-images');

export default class Pet {
  constructor(key, pet) {
    this.key = key;
    this.pet = pet;
    this.petImages = petsImages.child(key).limitToFirst(1);
  }

  update(pet) {
    this.caption.textContent = `${pet.name} the ${pet.type}`;
    this.image.alt = pet.name;
  }

  render() {
    const dom = template.clone();
    dom.querySelector('a').href = `#pets/${this.key}`;
    this.caption = dom.querySelector('h2');
    this.image = dom.querySelector('img');

    this.update(this.pet);
    
    this.onValue = this.petImages.on('child_added', data => {
      this.image.src = getUrl(data.val(), 'e_sepia:80,c_scale,w_75');
    });

    return dom;
  }

  unrender() {
    this.petImages.off('child_added', this.onValue);
  }
}