import time

from tests.support.asserts import assert_success

def query(session, name):
    scripts = """
        let resolve = arguments[0];
        navigator.permissions.query({ name: '{name}' })
          .then(function(value) {
            resolve({ status: 'success', value: value && value.state });
          }, function(error) {
            resolve({ status: 'error', value: error && error.message });
          });
    """.format(name=name)

    return session.transport.send(
        "POST", "/session/{session_id}/execute/async".format(**vars(session)),
        {"script": script, "args": []})

def test_get_status_no_session(http):
    with http.get("/status") as response:
        # GET /status should never return an error
        assert response.status == 200


# > 1. Let parameters be the parameters argument, converted to an IDL value of
# >    type PermissionSetParameters. If this throws an exception, return a
# >    WebDriver error with WebDriver error code invalid argument. 
def test_invalid_params(session):
    pass

def set_to_granted(session):
    #response = session.transport.send(
    #    "POST", "/session/{session_id}/permissions".format(**vars(session)),
    #    { "descriptor": { "name": "geolocation" }, "state": "granted" }
    #)

    #assert_success(response)

    response = query(session, "geolocation")

    assert_success(response)
    result = response.body.get("value")

    assert isinstance(result, dict)
    assert result.get("status") == "success"
    assert result.get("value") == "granted"
