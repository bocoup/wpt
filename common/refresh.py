def main(request, response):
    """
    Respond with a blank HTML document and a `Refresh` header which describes
    an immediate redirect to the URL specified by the requests `location` query
    string parameter
    """
    headers = [
        ('Content-Type', 'text/html'),
        ('Refresh', '0; URL={}'.format(request.GET.first('location')))
    ]
    return (200, headers, '')
