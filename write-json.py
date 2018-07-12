import json
import sys
import time

data = json.load(sys.stdin)

start = time.time()

with open(sys.argv[1], 'w') as handle:
    json.dump(data, handle)

print 'Duration: %s seconds' % (time.time() - start)
