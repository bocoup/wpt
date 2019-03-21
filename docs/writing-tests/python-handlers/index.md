# Python Handlers

Python file handlers are designed to provide a vaguely PHP-like interface
where each resource corresponds to a particular python file on the
filesystem. Typically this is hooked up to a route like ``("*",
"*.py", python_file_handler)``, meaning that any .py file will be
treated as a handler file (note that this makes python files unsafe in
much the same way that .php files are when using PHP).

Unlike PHP, the python files don't work by outputting text to stdout
from the global scope. Instead they must define a single function
`main` with the signature::

    main(request, response)

The wptserver implements a number of Python APIs for controlling traffic.

```eval_rst
.. toctree::
   :maxdepth: 1

   request
   response
   stash
```
