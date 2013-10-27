(function() {
  define(['marionette'], function() {
    var Welcome;
    return Welcome = Backbone.View.extend({
      initialize: function(_arg) {
        this.catalog = _arg.catalog;
        return Backbone.View.prototype.initialize.apply(this, arguments);
      },
      events: {
        'click li': 'select'
      },
      _renderItem: function(dataClass) {
        var name;
        name = dataClass.name;
        return $("<li><a href=\"#cols/" + name + "\">" + name + "</a></li>");
      },
      render: function() {
        var className, _i, _len, _ref;
        this.$el.empty();
        _ref = this.catalog.$classNames;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          className = _ref[_i];
          this._renderItem(this.catalog[className]).appendTo(this.el);
        }
        this.$el.dropdown();
        return this;
      },
      showWithStyle: function() {
        if (this.isHidden) {
          return;
        }
        this.$el.parent().show();
        this.$el.parent().addClass('animated bounceInDown');
        return this;
      },
      hideWithStyle: function() {
        var _this = this;
        if (this.isHidden) {
          return;
        }
        this.$el.parent().addClass('animated bounceOutUp');
        this.isHidden = true;
        return setTimeout(function() {
          return _this.$el.parent().hide();
        }, 600);
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
