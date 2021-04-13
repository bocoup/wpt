def main(req, res):
    return req.headers.get('Referer')
