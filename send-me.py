import urlparse

def main(request, response):
    response.writer.write_raw_content(
        urlparse.unquote(request.GET.first('raw'))
    )
    response.close_connection = True
