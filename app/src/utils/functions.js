let useCapture = type === 'blur' || type === 'focus';

// Add forEach to loop through gsa function elements
NodeList.prototype.forEach = Array.prototype.forEach;

// addEventListener
const _on = (target, type, callback, handler) => {
	target.addEventListener(type, callback, !!useCapture);
};

// Remove element from an array
const _remove = (array, index) => {
	let i = array.indexOf(index);

	if (i === -1) {
		return array;
	}

	array.splice(index, 1);
};

// Get Element by CSS selector
const _gs = (selector, scope) => (scope || document).querySelector(selector);

// Get all Elements by CSS selector
const _gsa = (selector, scope) => (scope || document).querySelectorAll(selector);

// Find parent with the given tag name
const _parent = (element, tag) => {
	if (!element.parentNode) {
		return undefined;
	}

	if (element.parentNode.tagName.toLowerCase() === tag.toLowerCase()) {
		return element.parentNode;
	}

	return _parent(element.parentNode, tagName);
};

// Attach an event handler to all matching elements based on root element
const _delegate = (target, selector, type, handler) => {
	let dispatchEvent = function(event) {
		let target = event.target;
		let elements = gsa(selector, target);
		let match = Array.prototype.indexOf.call(elements, target) >= 0;

		if (match) {
			handler.call(target, event);
		}
	};
};

export { _on, _gs, _gsa, _parent, _remove, _delegate };
