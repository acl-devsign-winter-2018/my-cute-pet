import Template from '../Template';
import html from './auth.html';
import { auth, providers } from '../../services/firebase';
import firebaseui from 'firebaseui';
// import 'firebaseui/dist/firebaseui.css';

const ui = new firebaseui.auth.AuthUI(auth);

const template = new Template(html);

export default class Auth {

  constructor(redirect = '#') {
    this.redirect = redirect;
  }

  render() {
    const dom = template.clone();

    setTimeout(() => {
      ui.start('#auth-container', {
        signInSuccessUrl: `${window.location.origin}${this.redirect}`,
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
