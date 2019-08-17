def main(request, response):
    return 'import "{}";\n'.format(request.GET.first('url'))
