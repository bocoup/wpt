def main(request, response):
    """
    Respond with a blank HTML document and a `Link` header which describes
    a link relation specified by the requests `location` and `rel` query string
    parameters
    """
    headers = [
        ('Content-Type', 'text/html'),
        ('Link', '<{}>; rel={}'.format(request.GET.first('location'), request.GET.first('rel')))
    ]
    return (200, headers, '')

