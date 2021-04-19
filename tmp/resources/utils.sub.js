const HERE = 'http://{{host}}:{{ports[http][0]}}';

const createMeta = (win, name, content) => {
	const meta = win.document.createElement('meta');

	meta.setAttribute('name', name);
	meta.setAttribute('content', content);
	win.document.head.appendChild(meta);

	return meta;
};

const createIframe = async (t, policy) => {
	const iframe = document.createElement('iframe');
	const pipe = policy ? `?pipe=header(Referrer-Policy,${policy})` : '';
	iframe.src = `${HERE}/tmp/resources/test-frame.html${pipe}`;

	await new Promise((resolve, reject) => {
		addEventListener('message', function handler (event) {
			if (event.source !== iframe.contentWindow) {
				return;
			}

			removeEventListener('message', handler);
			resolve();
		});
		document.body.appendChild(iframe);
		t.add_cleanup(() => iframe.remove());
	});

	return iframe.contentWindow;
};

const createPopup = async (t, win) => {
	const child = win.open(`${HERE}/tmp/resources/test-frame.html`);

	await new Promise((resolve,reject) => {
		child.addEventListener('load', resolve);
		child.addEventListener('error', reject);
		t.add_cleanup(() => child.close());
	});

	return child;
};

const dataNav = async (win) => {
	return new Promise((resolve) => {
		addEventListener('message', function handler(event) {
			removeEventListener('message', handler);
			resolve();
		});
		win.location.assign(`data:text/html,<meta charset="utf-8"><script src="${HERE}/tmp/resources/utils.sub.js"></script><script src="${HERE}/tmp/resources/test-frame.js"></script>${Math.random()}`);
	});
};

const readReferer = async (win) => {
	//const script = win.document.createElement('script');
	//const name = `fn${Math.round(Math.random() * 1000)}`;
	//script.src = `/tmp/ref.py?fn=${name}`;
	//return new Promise((resolve, reject) => {
	//	win[name] = resolve;
	//	win.document.body.appendChild(script);
	//	console.log(script);
	//});

	//await new Promise((resolve) => setTimeout(resolve, 100));
	//await new Promise((resolve, reject) => {
	//	const script = win.document.createElement('script');
	//	script.appendChild(win.document.createTextNode(`
	//	location = '/tmp/ref.py';
	//	`));
	//	win.document.body.appendChild(script);
	//	win.frameElement.onload = resolve;
	//});
	//return win.document.body.innerText.trim();

	const response = await win.fetch(`${HERE}/tmp/resources/read-header.py`);
	return response.text();
};
