// Import assets
import './assets/scss/style.scss';

// Imports
import { _on } from './utils/functions';

export class App {
	onLoad() {
		let element = _gs('h1');

		element.textContent = 'Yup, I\'m working just fine. Remember to replace me in app/src/app.js';
	}
}
