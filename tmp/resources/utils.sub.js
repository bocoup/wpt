const HERE = 'http://{{host}}:{{ports[http][0]}}';

const createMeta = (win, name, content) => {
	const meta = win.document.createElement('meta');

	meta.setAttribute('name', name);
	meta.setAttribute('content', content);
	win.document.head.appendChild(meta);

	return meta;
};

const readPolicy = async (win) => {
	const response = await win.fetch(`${HERE}/tmp/resources/read-header.py`);
	const referer = await response.text();
	if (referer === '') {
		return null;
	} else if (referer === location.origin + '/') {
		return 'origin';
	} else {
		return 'unsafe-url';
	}
};
