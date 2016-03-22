var sharing = (function($) {
    'use strict';

    function init() {
        $('.js-fb-share').on('click', function(event) {
            event.preventDefault();
            _share();
        });
    }

    var _share = function() {
        var url = window.location.href;

        FB.ui({
          method: 'feed',
          link: url,
        }, function(response){});
    };

    return {
        init:init
    };
}(jQuery));

jQuery(document).ready(function($) {
    sharing.init();
});
