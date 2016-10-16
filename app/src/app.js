// Import assets
require('./assets/scss/style.scss');

// Imports
import { _on, _gs } from './utils/functions';

export const onLoad = () => {
	let element = _gs('h1');

	console.log(element);

	element.textContent = 'Yup, I\'m working just fine. Remember to replace me in app/src/app.js';
};
