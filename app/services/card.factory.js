(function()
{
  'use strict';

  angular
    .module('app')
    .factory('cardFactory', cardFactory);

  cardFactory.$inject = ['$q', 'cardApiFactory'];

  function cardFactory($q, cardApiFactory)
  {
    var service = {
      getCard: getCard,
      getAll: getAll,
      addPollCard: addPollCard,
      deletePollCard: deletePollCard
    };

    return service;

    function getCard(objectId)
    {
      return cardApiFactory.get(objectId)
        .then(function(response)
        {
          return response;
        },
        function(errors)
        {
          return $q.reject(errors);
        });
    }

    function getAll()
    {
      return cardApiFactory.getAll()
        .then(function(response)
        {
          return response;
        },
        function(errors)
        {
          return $q.reject(errors);
        });
    }

    // questionText (string) - text for the question being added
    // options (array<string>) - collection of options (text)
    function addPollCard(questionText, options, category, closeDate)
    {
      var cardData = createAddPollCardData(questionText, options, category, closeDate);

      return cardApiFactory.post(cardData)
        .then(function(response)
        {
          return response;
        },
        function(errors)
        {
          return $q.reject(errors);
        });
    }

    function createAddPollCardData(questionText, options, category, closeDate)
    {
      var data = {
        question: questionText,
        options: [],
        category: category,
        closeDate: closeDate
      };
      angular.forEach(options, function(option, optionIndex)
      {
        this.push({text: option, ___class: 'option'});
      }, data.options);

      return data;
    }

    function deletePollCard(objectId)
    {
      return cardApiFactory.delete(objectId)
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
