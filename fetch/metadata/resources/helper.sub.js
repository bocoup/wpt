'use strict';

function makeRequestURL(key, origins, params) {
    const byName = {
        sameOrigin: 'https://{{host}}:{{ports[https][0]}}',
        httpOrigin: 'http://{{host}}:{{ports[http][0]}}',
        crossSite: 'https://{{hosts[alt][]}}:{{ports[https][0]}}',
        sameSite: 'https://{{hosts[][www]}}:{{ports[https][0]}}'
    };
    const redirectPath = '/fetch/api/resources/redirect.py?location=';
    const path = '/fetch/metadata/resources/record-headers.py?key=' + key;

    let requestUrl = path;
    if (params) {
      requestUrl += '&' + new URLSearchParams(params).toString();
    }

    if (origins && origins.length) {
      requestUrl = byName[origins.pop()] + requestUrl;

      while (origins.length) {
        requestUrl = byName[origins.pop()] + redirectPath +
          encodeURIComponent(requestUrl);
      }
    }

    return requestUrl;
}

function retrieve(key, options) {
  return fetch('/fetch/metadata/resources/record-headers.py?retrieve&key=' + key)
    .then((response) => {
      if (response.status === 204 && options && options.poll) {
        return new Promise((resolve) => setTimeout(resolve, 300))
          .then(() => retrieve(key, options));
      }

      if (response.status !== 200) {
        throw new Error('Failed to query for recorded headers.');
      }

      return response.text().then((text) => JSON.parse(text));
    });
}
