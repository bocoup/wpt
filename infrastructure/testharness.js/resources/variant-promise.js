(function() {
  'use strict';
  var variantPattern = /^\?.*remove-promise/;
  var metaTags = document.getElementsByTagName('meta');
  var hasVariant = false;
  var metaTag, idx;

  for (idx = 0; idx < metaTags.length; ++idx) {
    metaTag = metaTags[idx];

    if (metaTag.getAttribute('name') !== 'variant') {
      continue;
    }
    hasVariant |= variantPattern.test(metaTag.getAttribute('content'));
  }

  if (!hasVariant) {
    throw new Error(
      '"variant-promise.js" has been included in a test which is not ' +
      'configured with a relevant variant.'
    );
  }

  if (!variantPattern.test(location.search)) {
    return;
  }

  delete window.Promise;

  var variantNode = document.createElement('p');
  variantNode.innerHTML = 'This testharness.js test was executed with the ' +
    'global Promise constructor removed.';

  function onReady() {
    if (document.readyState !== 'complete') {
      return;
    }

    document.body.insertBefore(variantNode, document.body.firstChild);
  }

  onReady();
  document.addEventListener('readystatechange', onReady);
}());
