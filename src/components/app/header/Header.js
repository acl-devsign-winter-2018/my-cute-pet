import html from './header.html';
import './header.css';
import Template from '../../Template';
import { auth } from '../../../services/firebase';

const template = new Template(html);

export default class Header {

  render() {
    const dom = template.clone();
    const userName = dom.querySelector('.user-name');
    const authLink = dom.querySelector('a[href="#auth"]');
    
    auth.onAuthStateChanged(user => {
      if(user) {
        userName.textContent = user.displayName;
        authLink.textContent = 'Sign Out';
        authLink.setAttribute('href', '#');
        authLink.onclick = () => {
          setTimeout(() => auth.signOut());
        };
      }
      else {
        userName.textContent = '';
        authLink.textContent = 'Sign In';
        authLink.href = '#auth';
        authLink.onclick = null;
      }
    });
    return dom;
  }
}