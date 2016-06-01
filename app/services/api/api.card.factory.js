(function()
{
  'use strict';

  angular
    .module('app')
    .factory('cardApiFactory', cardApiFactory);

  cardApiFactory.$inject = ['$http'];

  function cardApiFactory($http)
  {
    var service = {
      get: get,
      getAll: getAll,
      post: post,
      delete: del
    };

    return service;

    function getAll()
    {
      return $http(
        {
          method: 'GET',
          url: 'https://api.backendless.com/v1/data/card?loadRelations=options,user',
          headers: {
            'application-id': 'E11DA057-CE8C-0C31-FF22-59965520EB00',
            'secret-key': '6E12B29C-A78E-4C99-FFFA-698C1EE7D200',
            'application-type': 'REST'
          }
        });
    }

    function get(objectId)
    {
      return $http(
        {
          method: 'GET',
          url: 'https://api.backendless.com/v1/data/card/' + objectId + '?loadRelations=options%2Coptions.users',
          headers: {
            'application-id': 'E11DA057-CE8C-0C31-FF22-59965520EB00',
            'secret-key': '6E12B29C-A78E-4C99-FFFA-698C1EE7D200',
            'application-type': 'REST'
          }
        });
    }

    function post(data)
    {
      return $http(
        {
          method: 'POST',
          url: 'https://api.backendless.com/v1/data/card',
          headers: {
            'application-id': 'E11DA057-CE8C-0C31-FF22-59965520EB00',
            'secret-key': '6E12B29C-A78E-4C99-FFFA-698C1EE7D200',
            'Content-Type': 'application/json',
            'application-type': 'REST'
          },
          data: data
        });
    }

    function del(objectId)
    {
      return $http(
        {
          method: 'DELETE',
          url: 'https://api.backendless.com/v1/data/card/' + objectId,
          headers: {
            'application-id': 'E11DA057-CE8C-0C31-FF22-59965520EB00',
            'secret-key': '6E12B29C-A78E-4C99-FFFA-698C1EE7D200',
            'application-type': 'REST'
          }
        });
    }
  }
})();
