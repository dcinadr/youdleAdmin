(function()
{
  'use strict';

  angular
    .module('app')
    .factory('optionFactory', optionFactory);

  optionFactory.$inject = ['$q', 'optionApiFactory'];

  function optionFactory($q, optionApiFactory)
  {
    var service = {
      deleteOptions: deleteOptions
    };

    return service;

    function deleteOptions(objectIds)
    {
      return optionApiFactory.deleteBulk(objectIds)
        .then(function(response)
        {
          return response;
        },
        function(errors)
        {
          return $q.reject(errors);
        });
    }
  }
})();
