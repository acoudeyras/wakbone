(function() {
  define([], function() {
    var Welcome;
    return Welcome = Backbone.View.extend({
      events: {
        'click li': 'select'
      },
      _renderItem: function(col) {
        return $("<li><a href=\"#\">" + col.$name + "</a></li>");
      },
      render: function() {
        var _this = this;
        this.$el.empty();
        _.each(this.collection, function(col) {
          return _this._renderItem(col).appendTo(_this.el);
        });
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
        this.trigger('change', this.collection[selected]);
        return this;
      }
    });
  });

}).call(this);
