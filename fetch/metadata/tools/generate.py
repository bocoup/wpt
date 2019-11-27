#!/usr/bin/env python3

import os
import yaml

HERE = os.path.abspath(os.path.dirname(__file__))
OUT_DIR = os.path.join(HERE, '..', 'generated')

templates = {
  'video-poster': '''<!DOCTYPE html>
<!-- This test was procedurally generated. Please do not modify it directly. -->
<html lang="en">
  <meta encoding="utf-8">
  <script src="/resources/testharness.js"></script>
  <script src="/resources/testharnessreport.js"></script>
  <script src="/fetch/metadata/resources/helper.js"></script>
  <body>
  <script>
  'use strict';
  promise_test(function() {
    var video = document.createElement('video');
    var id = 'image-{{uuid()}}';
    video.setAttribute(
      'poster',
      '%(domain)s/fetch/metadata/resources/record-header.py?file=' + id
    );
    document.body.appendChild(video);

    return pollForRequestRecording(id)
      .then(function(actual) {
%(validation)s
      });
  }, '%(title)s');
  </script>
  </body>
</html>''',
  'js-module-via-script': '''
<!-- This test was procedurally generated. Please do not modify it directly. -->
<html lang="en">
  <meta encoding="utf-8">
  <script src="/resources/testharness.js"></script>
  <script src="/resources/testharnessreport.js"></script>
  <script src="/fetch/metadata/resources/helper.js"></script>
  <script type="module"
    src="%(domain)s/fetch/metadata/resources/record-header.py?file=script-{{$id:uuid()}}"></script>
  <body>
  <script>
  'use strict';
  promise_test(function() {
    return pollForRequestRecording('script-{{$id}}')
      .then(function(actual) {
%(validation)s
      });
  }, '%(title)s');
  </script>
</html>
''',
  'js-module-via-static-import': '''
<!-- This test was procedurally generated. Please do not modify it directly. -->
<html lang="en">
  <meta encoding="utf-8">
  <script src="/resources/testharness.js"></script>
  <script src="/resources/testharnessreport.js"></script>
  <script src="/fetch/metadata/resources/helper.js"></script>
  <script>
    window.moduleExecuted = new Promise((resolve) => window.resolve = resolve);
  </script>
  <script type="module">
    import '%(domain)s/fetch/metadata/resources/record-header.py?file=script-{{$id:uuid()}}';
    resolve();
  </script>
  <body>
  <script>
  'use strict';
  promise_test(function() {
    const url = '/fetch/metadata/resources/record-header.py?retrieve&file=script-{{$id}}';
    return window.moduleExecuted
      .then(() => fetch(url))
      .then((response) => response.text())
      .then((text) => {
        const actual = JSON.parse(text);
%(validation)s
      });
  }, '%(title)s');
  </script>
</html>
''',
  'js-module-via-dynamic-import': '''
<!-- This test was procedurally generated. Please do not modify it directly. -->
<html lang="en">
  <meta encoding="utf-8">
  <script src="/resources/testharness.js"></script>
  <script src="/resources/testharnessreport.js"></script>
  <script src="/fetch/metadata/resources/helper.js"></script>
  <script type="module">
  </script>
  <body>
  <script type="module">
  'use strict';
  promise_test(async function() {
    const id = 'script-{{uuid()}}';
    await import(
      '%(domain)s/fetch/metadata/resources/record-header.py?file=' + id
    );
    const response = await fetch(
      '/fetch/metadata/resources/record-header.py?retrieve&file=' + id
    );
    const actual = JSON.parse(await response.text());
%(validation)s
  }, '%(title)s');
  </script>
</html>
'''
}

cases = {
  'video-poster': '''
cross-site.tentative.https:
  title: something across domains
  domain: https://{{hosts[alt][]}}:{{ports[https][0]}}
  validation: |
    var expected = {
      dest: 'image',
      mode: 'no-cors',
      site: 'cross-site',
      user: ''
    };
    assert_header_equals(actual, expected);

same-origin.tentative.https:
  title: something across domains
  domain: ''
  validation: |
    var expected = {
      dest: 'image',
      mode: 'no-cors',
      site: 'same-origin',
      user: ''
    };
    assert_header_equals(actual, expected);

same-site.tentative.https:
  title: something across domains
  domain: https://{{domains[www2]}}:{{ports[https][0]}}
  validation: |
    var expected = {
      dest: 'image',
      mode: 'no-cors',
      site: 'same-site',
      user: ''
    };
    assert_header_equals(actual, expected);

unstrustworthy-url.tentative:
  title: poster image fetched via an untrustworthy URL
  domain: ''
  validation: |
    var expected = {
      dest: '',
      mode: '',
      site: '',
      user: ''
    };
    assert_header_equals(actual, expected);
''',
  'js-module-via-script': '''
same-domain.tentative:
  title: something
  domain: ''
  validation: |
    var expected = {
      dest: 'script',
      mode: '',
      site: '',
      user: ''
    };
    assert_header_equals(actual, expected);

cross-domain.tentative:
  title: something across domains
  domain: http://{{domains[www2]}}:{{ports[http][0]}}
  validation: |
    var expected = {
      dest: 'script',
      mode: '',
      site: '',
      user: ''
    };
    assert_header_equals(actual, expected);
''',
  'js-module-via-static-import': '''
same-domain.tentative:
  title: something
  domain: ''
  validation: |
    var expected = {
      dest: 'script',
      mode: '',
      site: '',
      user: ''
    };
    assert_header_equals(actual, expected);

cross-domain.tentative:
  title: something across domains
  domain: http://{{domains[www2]}}:{{ports[http][0]}}
  validation: |
    var expected = {
      dest: 'script',
      mode: '',
      site: '',
      user: ''
    };
    assert_header_equals(actual, expected);
''',
  'js-module-via-dynamic-import': '''
same-domain.tentative:
  title: something
  domain: ''
  validation: |
    var expected = {
      dest: 'script',
      mode: '',
      site: '',
      user: ''
    };
    assert_header_equals(actual, expected);

cross-domain.tentative:
  title: something across domains
  domain: http://{{domains[www2]}}:{{ports[http][0]}}
  validation: |
    var expected = {
      dest: 'script',
      mode: '',
      site: '',
      user: ''
    };
    assert_header_equals(actual, expected);
'''
}

def main():
    for template_name, template in templates.items():
        c = yaml.safe_load(cases[template_name])

        for name, values in c.items():
            output_file = os.path.join(
                OUT_DIR, template_name + '-' + name + '.sub.html'
            )

            with open(output_file, 'w') as handle:
                handle.write(template % values)

if __name__ == '__main__':
    main()
