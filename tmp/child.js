'use strict';

parent.postMessage('child running', '*');

addEventListener('message', async (event) => {
	if (!event.data) {
		return;
	}
	if (event.data === 'back') {
		history.back();
	} else if (event.data === 'readReferer') {
		parent.postMessage(await readReferer(window), '*');
	} else if (event.data[0] === 'createMeta') {
		createMeta(window, event.data[1], event.data[2]);
		parent.postMessage('meta created', '*');
	}
});
