import os
import re

def main(request, response):
    name = os.path.join(request.doc_root, request.GET.first('pathname')[1:])

    with open(name) as handle:
        contents = handle.read()

    response.writer.write_raw_content(
        re.search(r'<!--BEGIN\n(.*)\nEND-->', contents, re.DOTALL).group(1)
    )
    response.close_connection = True
