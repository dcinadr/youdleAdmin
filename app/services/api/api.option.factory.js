(function()
{
  'use strict';

  angular
    .module('app')
    .factory('optionApiFactory', optionApiFactory);

  optionApiFactory.$inject = ['$http'];

  function optionApiFactory($http)
  {
    var service = {
      deleteBulk: deleteBulk
    };

    return service;

    function deleteBulk(objectIds)
    {
      var objectIdsUrlSnippet = objectIds.join();
      // replaces all the commas with "' or objectId='"
      objectIdsUrlSnippet = objectIdsUrlSnippet.replace(/,/g, '%27%20or%20objectId%3D%27');
      // puts a single quote at the end
      objectIdsUrlSnippet = objectIdsUrlSnippet.concat('%27');
      // puts "objectId='" at the beginning
      var whereClauseBegin = 'objectId%3D%27';
      objectIdsUrlSnippet = whereClauseBegin.concat(objectIdsUrlSnippet);

      return $http(
        {
          method: 'DELETE',
          url: 'https://api.backendless.com/v1/data/bulk/option?where=' + objectIdsUrlSnippet,
          headers: {
            'application-id': 'E11DA057-CE8C-0C31-FF22-59965520EB00',
            'secret-key': '6E12B29C-A78E-4C99-FFFA-698C1EE7D200',
            'application-type': 'REST'
          }
        });
    }
  }
})();
