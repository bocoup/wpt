import os
import uuid
import hashlib
import time
import json

def main(request, response):
  # This condition avoids false positives from CORS preflight checks, where the
  # request under test may be followed immediately by a request to the same URL
  # using a different HTTP method.
  if 'requireOPTIONS' in request.GET and request.method != 'OPTIONS':
      return

  if 'key' in request.GET:
    key = request.GET['key']
  elif 'key' in request.POST:
    key = request.POST['key']

  ## Convert the key from String to UUID valid String ##
  testId = hashlib.md5(key).hexdigest()

  ## Handle the header retrieval request ##
  if 'retrieve' in request.GET:
    response.writer.write_status(200)
    response.writer.end_headers()
    try:
      headers = request.server.stash.take(testId)
      response.writer.write(headers)
    except (KeyError, ValueError) as e:
      response.writer.write(json.dumps("No request has been recorded"))
      pass

    response.close_connection = True

  ## Record incoming fetch metadata header value
  else:
    try:
      request.server.stash.put(testId, json.dumps(request.headers))
    except KeyError:
      ## The header is already recorded or it doesn't exist
      pass

    ## Prevent the browser from caching returned responses and allow CORS ##
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    if "mime" in request.GET:
        response.headers.set("Content-Type", request.GET.first("mime"))

    return request.GET.first("body", request.POST.first("body", ""))
