def main(req, res):
    return (
        (('Access-Control-Allow-Origin', '*'),),
        req.headers.get('Referer', '')
    )
