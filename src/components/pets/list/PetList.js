import html from './pet-list.html';
import './pet-list.css';
import Template from '../../Template';
import Pet from './Pet';
import { db } from '../../../services/firebase';

const template = new Template(html);
const pets = db.ref('pets');

export default class PetList {
  constructor(list) {
    this.list = list || pets;
  }

  render() {
    const dom = template.clone();
    
    const ul = dom.querySelector('ul');

    const map = new Map();

    this.childAdded = this.list.on('child_added', data => {
      const pet = new Pet(data.key);
      const petDom = pet.render();
      map.set(data.key, {
        component: pet,
        nodes: [...petDom.childNodes]
      });

      ul.appendChild(petDom);
    });

    this.childRemoved = this.list.on('child_removed', data => {
      const toRemove = map.get(data.key);
      map.delete(data.key);
      toRemove.nodes.forEach(node => node.remove());
      toRemove.component.unrender();
    });

    // this.childChange = this.list.on('child_changed', data => {
    //   map.get(data.key).component.update(data.val());
    // });

    return dom;
  }

  unrender() {
    pets.off('child_added', this.childAdded);
    pets.off('child_removed', this.childRemoved);
    pets.off('child_changed', this.childChange);
  }
}