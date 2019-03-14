(function() {
  var site_nav = document.querySelector(".wpt-site-nav");
  var trigger = document.querySelector(".wpt-site-nav .trigger");
  var icon = document.querySelector(".menu-icon");

  var show = function(e) {
    trigger.setAttribute("aria-hidden", "false");
  };

  var hide_if_relatedTarget_elsewhere = function(e) {
    if (!site_nav.contains(e.relatedTarget)) {
      trigger.setAttribute("aria-hidden", "true");
    }
  };

  site_nav.addEventListener("focus", show, false);
  site_nav.addEventListener("blur", hide_if_relatedTarget_elsewhere, true);

  icon.addEventListener("mouseenter", show, false);
  site_nav.addEventListener("mouseleave", hide_if_relatedTarget_elsewhere, false);

  /**
   * Intercept form submissions to ensure the search query is scoped to the
   * current domain.
   */
  var handle_submit = function(e) {
    e.preventDefault();
    var query = e.target.querySelector("[name=q]").value;

    if (!/\bsite:/.test(query)) {
      query += " site:" + location.origin;
    }

    location.href = "https://duckduckgo.com/?q=" + encodeURIComponent(query);

    return false;
  };

  document.querySelector("#site-search")
    .addEventListener("submit", handle_submit);
})();
