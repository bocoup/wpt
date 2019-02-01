import threading

from six.moves import queue

class ExceptionThread(threading.Thread):
    '''Create a thread which, upon joining, will raise any runtime exceptions
    to the caller'''
    def __init__(self, target, *args, **kwargs):
        self._exception_store = queue.Queue()

        def wrapped(*args, **kwargs):
            try:
                target(*args, **kwargs)
            except Exception as exception:
                self._exception_store.put(exception)

        super(ExceptionThread, self).__init__(target=wrapped, *args, **kwargs)

    def join(self, *args, **kwargs):
        raise NotImplementedError('Please use the `join_and_raise` method')

    def join_and_raise(self, *args, **kwargs):
        super(ExceptionThread, self).join(*args, **kwargs)

        try:
            exception = self._exception_store.get_nowait()
        except queue.Empty:
            pass
        else:
            raise exception
