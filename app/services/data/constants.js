(function() {
    'use strict';

    angular
        .module('app')
        .constant('constants', {
            categories: [{
                name: 'Sports',
                icon: 'hawcons-icon-11-baseball-set'
            }, {
                name: 'News',
                icon: 'fa fa-newspaper-o'
            }, {
                name: 'Business',
                icon: 'fa fa-line-chart'
            }, {
                name: 'Life',
                icon: 'fa fa-group'
            }, {
                name: 'Technology',
                icon: 'typcn typcn-power'
            }, {
                name: 'Entertainment',
                icon: 'fa fa-music'
            }]
        });
})();
