import argparse
import sys
import time

def throttle(iterable, bytes_per_millisecond):
    '''Iterate through a stream of bytes, emitting values at a rate not
    exceeding the provided bytes_per_millisecond'''
    window_start = 0
    window_count = 0

    if not isinstance(bytes_per_millisecond, int) or bytes_per_millisecond <= 0:
        raise ValueError('The rate must be a non-negative integer')

    for data in iterable:
        while data:
            now = time.time()

            # Create a new measurement window whenever more than one
            # millisecond has passed
            if now - window_start > 0.001:
                window_start = now
                window_count = 0
            # When the current winow reaches capacity, delay iteration until
            # the current measurement window has expired
            elif window_count == bytes_per_millisecond:
                time.sleep(0.001 - (now - window_start))
                continue

            remaining = len(data)
            to_print = min(bytes_per_millisecond - window_count, remaining)
            yield data[:to_print]
            window_count += to_print
            data = data[to_print:]

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=throttle.__doc__)
    parser.add_argument('bytes_per_millisecond', type=int)

    for data in throttle(sys.stdin, parser.parse_args().bytes_per_millisecond):
        sys.stdout.write(data)
        sys.stdout.flush()
