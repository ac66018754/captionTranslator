chrome.commands.onCommand.addListener(function(command) {
    if (command === 'increase') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "increase"});
      });
    } else if (command === 'decrease') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "decrease"});
      });
    }else if (command === 'moveToStart') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "start"});
        });
      }
      else if (command === 'moveToMiddle') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "middle"});
        });
      }
  });