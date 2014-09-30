function EventHandler() {
}

EventHandler.prototype = {
    run: function () {
        var that = this;

        document.addEventListener("online",
                                  function () {
                                      that._onOnline.apply(that, arguments);
                                  },
                                  false);

        document.addEventListener("offline",
                                  function () {
                                      that._onOffline.apply(that, arguments);
                                  },
                                  false);
    },

    _onOnline: function () {
        $("#network-status").html('Online');
    },

    _onOffline: function () {
        $("#network-status").html('Offline');
    }
}