app.service('d3Service', d3Service);

d3Service.$inject = ['d3Factory'];

function d3Service(d3Factory) {
    var self = this,
        d3 = d3Factory.d3().then(function (d3f) {setD3(d3f); return d3f;});
    
    self.getD3 = function() {
        return d3;
    };
    
    return self;
    
    function setD3(d3f) {
        d3 = d3f;
    }
}

