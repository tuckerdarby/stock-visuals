app.service('brushService', brushService);

brushService.$inject = ['analystBrushFactory', 'contextBrushFactory'];

function brushService(analystBrush, contextBrush) {
    var self = this,
        brushes = {
            'analyst': analystBrush,
            'context': contextBrush
        };
    
    self.getBrush = function(brand) {
        return brushes[brand].create();
    };
    
    return self;
}