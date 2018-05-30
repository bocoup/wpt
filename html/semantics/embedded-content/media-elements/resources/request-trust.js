var requestTrust = (function() {
  var idCounter = 0;

  return  function(test_driver) {
    var button = document.createElement('button');
    button.innerHTML = 'User input required: please click here.';
    button.id = 'media-playback-handle-' + (idCounter += 1);

    document.body.appendChild(button);

    return new Promise(function(resolve, reject) {
        button.addEventListener('click', resolve);

        test_driver.click(button).catch(reject);
      }).then(function() {
        button.remove();
      });
  };
}());
