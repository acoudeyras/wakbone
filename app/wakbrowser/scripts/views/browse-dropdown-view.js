(function() {
  define(['marionette'], function() {
    var BrowseDropDownView;
    return BrowseDropDownView = Backbone.View.extend({
      initialize: function(_arg) {
        this.catalog = _arg.catalog;
        return Backbone.View.prototype.initialize.apply(this, arguments);
      },
      events: {
        "click li": "select"
      },
      _renderItem: function(dataClass) {
        var name;
        name = dataClass.className;
        return $("<li><a href=\"#cols/" + name + "\">" + name + "</a></li>");
      },
      highlight: function() {
        return this.$el.parent().addClass('animated shake');
      },
      render: function() {
        var _this = this;
        this.$el.empty();
        _.each(this.catalog.$classNames, function(className) {
          return _this._renderItem(_this.catalog[className]).appendTo(_this.el);
        });
        this.$el.dropdown();
        return this;
      },
      select: function(event) {
        var selected;
        selected = $(event.currentTarget).find('a').text();
        this.trigger('change', this.catalog[selected]);
        return this;
      }
    });
  });

}).call(this);
