def main(request, response):
    with open('./suspicious.txt', 'a') as handle:
        handle.write('%s - %s\n' % (
            request.headers.get('referer'), request.GET['name']
        ))
    return ''
