const HERE = 'http://{{host}}:{{ports[http][0]}}';

const createMeta = (win, name, content) => {
	const meta = win.document.createElement('meta');

	meta.setAttribute('name', name);
	meta.setAttribute('content', content);
	win.document.head.appendChild(meta);

	return meta;
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
