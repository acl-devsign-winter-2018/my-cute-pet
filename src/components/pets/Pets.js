import Template from '../Template';
import html from './pets.html';
import './pets.css';
import AddPet from './add/AddPet';
import PetDetail from './detail/PetDetail.js';
import PetList from './list/PetList';
import { removeChildren } from '../dom';
import { auth, db } from '../../services/firebase';

const template = new Template(html);
const petsByUser = db.ref('petsByUser');

export default class Pets {
  constructor() {
    this.hashChange = () => this.setChildPage();
    window.addEventListener('hashchange', this.hashChange);
  }

  updateHeader(mine) {
    this.header.textContent = `${mine ? 'My ' : ''}Really Cute Pets`;
  }

  setChildPage() {
    const routes = window.location.hash.split('/');
    // force the comparison against undefined
    // to fail by using an empty string
    const childPage = routes[1] || '';
    if(this.childPage === childPage) return;

    this.childPage = childPage;
    if(this.childComponent) this.childComponent.unrender();
    removeChildren(this.section);

    let childComponent;
    if(childPage === 'add') childComponent = new AddPet();
    else if(childPage === 'my') childComponent = new PetList(petsByUser.child(auth.currentUser.uid));
    else if(childPage) childComponent = new PetDetail(childPage);
    else childComponent = new PetList();

    this.updateHeader(childPage === 'my');

    this.childComponent = childComponent;
    this.section.appendChild(childComponent.render());
  }

  render() {
    const dom = template.clone();
    this.header = dom.querySelector('h1');
    this.section = dom.querySelector('section');
    this.setChildPage();
    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}
