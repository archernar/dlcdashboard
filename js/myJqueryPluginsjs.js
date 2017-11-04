// ******************************************************************************
// PLUGIN
// ******************************************************************************
(function ( $ ) {
    $.fn.myUnderlineBlue = function() {
         this.css('text-decoration', 'underline').css({ 'color': 'Blue' });
         return this;
    };
}( jQuery ));
