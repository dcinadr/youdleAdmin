(function()
{
  'use strict';

  angular
    .module('app')
    .controller('cmsController', cmsController);

  cmsController.$inject = ['cardFactory', 'optionFactory', 'toaster', 'constants'];

  function cmsController(cardFactory, optionFactory, toaster, constants)
  {
    var vm = this;
    var selectedCategoryDefaultValue = 'Select a Category...';

    vm.activate = function()
    {
      vm.optionsPending = [];
      vm.questionCollection = [];
      vm.selectedCategory = selectedCategoryDefaultValue;
      vm.availableCategories = constants.categories;
      vm.datepickerOpened = false;
      vm.closeDate = null;
      vm.minCloseDate = new Date();
      vm.dateOptions = {
          formatYear: 'yy',
          startingDay: 0
      };
      vm.closeTime = new Date();
      vm.closeTime.setHours(0);
      vm.closeTime.setMinutes(0);
      getAllCards();
    }

    vm.activate();

    vm.addOption = function(option)
    {
      if (!option || option === '' || vm.optionsPending.indexOf(option) > -1)
      {
        return;
      }
      vm.optionsPending.push(option);
      vm.inputOptionValue = '';
    }

    vm.submitNewPollCard = function()
    {
      if(!validatePollCard())
      {
        return;
      }

      var closeHour = vm.closeTime.getHours();
      var closeMin = vm.closeTime.getMinutes();
      vm.closeDate.setHours(closeHour);
      vm.closeDate.setMinutes(closeMin);

      cardFactory.addPollCard(vm.inputQuestionValue, vm.optionsPending, vm.selectedCategory, vm.closeDate)
        .then(function(response)
        {
          var displayCloseDate = dateFormat(vm.closeDate, 'ddd m/d/yy H:M');
          vm.questionCollection.push(
            {
              objectId: response.data.objectId,
              text: vm.inputQuestionValue,
              category: vm.selectedCategory,
              closeDate: displayCloseDate,
              numOfOptions: 0,
              totalVotes: 0,
              options: vm.optionsPending
            });
          vm.clearPollingCardPending();
          toaster.pop('success', 'Submit Poll', 'Success');
        },
        function(errors)
        {
          toaster.pop('error', 'Submit Poll', 'Failed');
          console.error('Failure submitting new poll card.', errors);
        });
    }

    vm.removeCard = function(objectId)
    {
      cardFactory.getCard(objectId)
        .then(function(response)
        {
          var card = response.data;
          if (!card)
          {
            toaster.pop('error', 'Delete Card', 'Failed');
            return;
          }

          var optionsToDelete = [];
          angular.forEach(card.options, function(option, optionIndex)
          {
            this.push(option.objectId);
          }, optionsToDelete);

          if (optionsToDelete.length == 0)
          {
            // if there are no options assigned to card that just delete card only
            deleteCard(objectId);
            return;
          }

          optionFactory.deleteOptions(optionsToDelete)
            .then(function(response)
            {
              deleteCard(objectId);
            },
            function(errors)
            {
              toaster.pop('error', 'Delete Poll', 'Failed');
              console.error('Failure deleting poll card.', errors);
            });
        },
        function(errors)
        {
          console.error('Failure retrieving card to delete.', errors);
        });
    }

    function deleteCard(objectId)
    {
      cardFactory.deletePollCard(objectId)
        .then(function(response)
        {
          // if this complete refresh begins to impact performance we
          // may want to splice the deleted item out instead of refreshing
          // the whole list
          getAllCards();
        },
        function(errors)
        {
          toaster.pop('error', 'Delete Poll', 'Failed');
          console.error('Failure deleting poll card.', errors);
        });
    }

    vm.categorySelected = function(category)
    {
      vm.selectedCategory = category;
    }

    vm.clearPollingCardPending = function()
    {
      vm.optionsPending = [];
      vm.inputQuestionValue = '';
      vm.inputOptionValue = '';
      vm.selectedCategory = selectedCategoryDefaultValue;
    }

    vm.removeOptionPending = function(option)
    {
      var optionIndex = vm.optionsPending.indexOf(option);
      vm.optionsPending.splice(optionIndex, 1);
    }

    vm.openDatepicker = function($event)
    {
        $event.preventDefault();
        $event.stopPropagation();

        vm.datepickerOpened = true;
    }

    function getAllCards()
    {
      // clear array so that it can be refreshed
      vm.questionCollection = [];

      cardFactory.getAll()
        .then(function(response)
        {
          angular.forEach(response.data.data, function(card, cardIndex)
          {
            var votes = 0;
            for (var optionIndex = 0; optionIndex < card.options.length; optionIndex++)
            {
              votes += card.options[optionIndex].users.length;
            }
            var displayCloseDate = card.closeDate ? dateFormat(card.closeDate, 'ddd m/d/yy H:M') : 'n/a';
            this.push(
              {
                objectId: card.objectId,
                text: card.question,
                category: card.category,
                closeDate: displayCloseDate,
                numOfOptions: card.options.length,
                totalVotes: votes,
                options: card.options
              })
          }, vm.questionCollection);
        },
        function(errors)
        {

        });
    }

    function validatePollCard()
    {
      var valid = true;
      if (!vm.inputQuestionValue || vm.inputQuestionValue == '')
      {
        valid = false;
        toaster.pop('error', 'Submit Poll', 'Missing Question');
      }
      if (!vm.optionsPending || vm.optionsPending.length < 2)
      {
        valid = false;
        toaster.pop('error', 'Submit Poll', 'Missing at least 2 Options');
      }
      if (!vm.selectedCategory || vm.selectedCategory == '' || vm.selectedCategory === selectedCategoryDefaultValue)
      {
        valid = false;
        toaster.pop('error', 'Submit Poll', 'Missing Category');
      }
      if (!vm.closeDate || vm.closeDate == null)
      {
        valid = false;
        toaster.pop('error', 'Submit Poll', 'Missing Close Date');
      }
      return valid;
    }
  }
})();
