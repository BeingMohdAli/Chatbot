const Chatbot = {
  defaultResponses: {
   
    'hi': 'Hello! 👋 How can I help you today?',
    'hello': 'Hello! 👋 How can I help you today?',
    'hey': 'Hey there! 😄 How can I help you?',
    'hello hi': 'Hello! 👋 How can I help you?',
    'good morning': 'Good morning! ☀️ How can I assist you?',
    'good afternoon': 'Good afternoon! 🌤️ How can I assist you?',
    'good evening': 'Good evening! 🌙 How can I assist you?',

  
    'how are you': 'I am good! 😎 How about you?',
    'how are you doing': 'I am doing great! 😊 What about you?',
    'how is it going': 'I am good! 😃 How is your day?',


    'what is the date today': () => {
      const now = new Date();
      return `📅 Today is ${now.toDateString()}`;
    },
    "what's the date": () => {
      const now = new Date();
      return `📅 Today is ${now.toDateString()}`;
    },
    'date': () => {
      const now = new Date();
      return `📅 Today is ${now.toDateString()}`;
    },

   
    'what time is it': () => {
      const now = new Date();
      return `⏰ Current time is ${now.toLocaleTimeString()}`;
    },
    'tell me the time': () => {
      const now = new Date();
      return `⏰ Current time is ${now.toLocaleTimeString()}`;
    },
    'time': () => {
      const now = new Date();
      return `⏰ Current time is ${now.toLocaleTimeString()}`;
    },

 
    'tell me a joke': () => Chatbot.getJoke(),
    'another one': () => Chatbot.getJoke(),
    'another joke': () => Chatbot.getJoke(),
    'make me laugh': () => Chatbot.getJoke(),


    'flip a coin': () => Chatbot.flipCoin(),
    'flip': () => Chatbot.flipCoin(),
    'coin': () => Chatbot.flipCoin(),


    'roll a dice': () => Chatbot.rollDice(),
    'roll': () => Chatbot.rollDice(),
    'dice': () => Chatbot.rollDice(),


    'thank': 'No problem! 🙏 Let me know if you need more help!',
    'thanks': 'You are welcome! 😊',
  },

  additionalResponses: {},
  unsuccessfulResponse: `😅 Sorry, I didn't understand that. Try greetings, date/time, math, jokes, coin flip, or dice roll!`,
  emptyMessageResponse: `💬 Please type a message to get a response.`,

  jokes: [
    "Why did the scarecrow win an award? Because he was outstanding in his field! 🤣",
    "Why don't scientists trust atoms? Because they make up everything! 😆",
    "Why did the math book look sad? Because it had too many problems. 😢",
    "Why was the computer cold? Because it left its Windows open! 🥶"
  ],
  lastJokeIndex: -1,

  getJoke: function() {
    let index;
    do {
      index = Math.floor(Math.random() * this.jokes.length);
    } while (index === this.lastJokeIndex);
    this.lastJokeIndex = index;
    return this.jokes[index];
  },

  flipCoin: function() {
    return Math.random() < 0.5 ? '🪙 Heads!' : '🪙 Tails!';
  },

  rollDice: function() {
    const number = Math.floor(Math.random() * 6) + 1;
    return `🎲 You rolled a ${number}!`;
  },

  getResponse: function(message) {
    if (!message) return this.emptyMessageResponse;

    const lowerMsg = message.toLowerCase().trim();

    
    try {
      const mathResult = Function('"use strict";return (' + lowerMsg + ')')();
      if (!isNaN(mathResult)) return `🧮 The result is ${mathResult}`;
    } catch(e) {}

   
    const responses = { ...this.defaultResponses, ...this.additionalResponses };


    const { ratings, bestMatchIndex } = this.stringSimilarity(lowerMsg, Object.keys(responses));
    const bestResponseRating = ratings[bestMatchIndex].rating;

    if (bestResponseRating <= 0.3) return this.unsuccessfulResponse;

    const bestResponseKey = ratings[bestMatchIndex].target;
    const response = responses[bestResponseKey];

    return typeof response === 'function' ? response(message) : response;
  },

  compareTwoStrings: function(first, second) {
    first = first.replace(/\s+/g, '');
    second = second.replace(/\s+/g, '');
    if (first === second) return 1;
    if (first.length < 2 || second.length < 2) return 0;

    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2);
      firstBigrams.set(bigram, (firstBigrams.get(bigram) || 0) + 1);
    }

    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2);
      if ((firstBigrams.get(bigram) || 0) > 0) {
        firstBigrams.set(bigram, firstBigrams.get(bigram) - 1);
        intersectionSize++;
      }
    }

    return (2.0 * intersectionSize) / (first.length + second.length - 2);
  },

  stringSimilarity: function(mainString, targetStrings) {
    const ratings = [];
    let bestMatchIndex = 0;

    for (let i = 0; i < targetStrings.length; i++) {
      const currentTargetString = targetStrings[i];
      const currentRating = this.compareTwoStrings(mainString, currentTargetString);
      ratings.push({ target: currentTargetString, rating: currentRating });
      if (currentRating > ratings[bestMatchIndex].rating) bestMatchIndex = i;
    }

    return { ratings, bestMatchIndex };
  }
};


function uuidPolyfill() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
    const randomNumber = Math.random() * 16 | 0;
    return (char === 'x' ? randomNumber : (randomNumber & 0x3 | 0x8)).toString(16);
  });
}


(function (root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else {
    if (typeof root.crypto === 'undefined') root.crypto = {};
    if (root.crypto && typeof root.crypto.randomUUID !== 'function') root.crypto.randomUUID = uuidPolyfill;
    root.Chatbot = factory();
    root.chatbot = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () { return Chatbot; }));
