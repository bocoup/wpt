'use strict';

parent.postMessage('child running', '*');

addEventListener('message', async (event) => {
	if (!event.data) {
		return;
	}
	if (event.data.name === 'back') {
		history.back();
	} else if (event.data.name === 'readReferer') {
		parent.postMessage({
			id: event.data.id,
			value: await readReferer(window)
		}, '*');
	} else if (event.data.name === 'createMeta') {
		createMeta(window, ...event.data.values);
		parent.postMessage({
			id: event.data.id,
			value: 'meta created'
		}, '*');
	} else if (event.data.name === 'navigate') {
		location = event.data.values[0];
	}
});
