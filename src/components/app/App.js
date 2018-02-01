import Template from '../Template';
import html from './app.html';
import './app.css';
import Header from './header/Header';
import Auth from '../auth/Auth';
import Home from '../home/Home.js';
import Pets from '../pets/Pets.js';
import { auth } from '../../services/firebase';
import { removeChildren } from '../dom';

const template = new Template(html);

const map = new Map();
map.set('#auth', { Component: Auth, isPublic: true });
map.set('#pets', { Component: Pets, isPublic: false });

const homepage = { Component: Home, isPublic: true };

export default class App {

  constructor() {
    this.hashChange = () => this.setPage();
    window.addEventListener('hashchange', this.hashChange);

    auth.onAuthStateChanged(user => {
      if(user) {
        // TODO
      }
      // make sure we are on a public page
      else if(!this.page.isPublic) {
        window.location.hash = '#';
      }
    });
  }

  setPage() {
    const routes = window.location.hash.split('/');
    const route = routes[0];
    // if we are already at this top-level page, no need to transition
    // ( could be a subroute change: /pets --> /pets/123 )
    if(this.page && route === this.page.route) return;

    // unrender the prior component and clear from dom:
    if(this.page && this.page.component) this.page.component.unrender();
    removeChildren(this.main);

    // get the new component info from the map.
    const { Component, isPublic } = map.get(route) || homepage;
    
    if(!isPublic && !this.user) {
      console.log('oh noes! not authorized');
    }
    else {
      // create the component instance
      const component = new Component();
      // assign new stuff as the current component instance
      this.page = { route, component, isPublic };
      // add the new component's dom via render()
      this.main.appendChild(component.render());
    }

    
  }

  render() {
    const dom = template.clone();

    dom.querySelector('header').appendChild(new Header().render());
    this.main = dom.querySelector('main');
    this.setPage();

    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}
