import Template from '../Template';
import html from './auth.html';
import { auth, providers } from '../../services/firebase';
import firebaseui from 'firebaseui';
// has one missing resource. doesn't seem important, but currently using <link>
// import 'firebaseui/dist/firebaseui.css';

const ui = new firebaseui.auth.AuthUI(auth);

const template = new Template(html);

export default class Auth {

  constructor() {
    // second part of route is encoded redirect hash
    const routes = window.location.hash.split('/');
    this.redirect = decodeURIComponent(routes[1] || '#');
  }

  render() {
    const dom = template.clone();

    setTimeout(() => {
      const { origin, pathname } = window.location;
      ui.start('#auth-container', {
        signInSuccessUrl: `${origin}${pathname}${this.redirect}`,
        signInOptions: [
          providers.EmailAuthProvider.PROVIDER_ID,
          providers.GithubAuthProvider.PROVIDER_ID
        ]
      });
    });
    return dom;
  }

  unrender() {
    // no-op
  }
}
