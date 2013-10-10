var _; //globals

describe("About Applying What We Have Learnt", function() {

  var products;

  beforeEach(function () { 
    products = [
       { name: "Sonoma", ingredients: ["artichoke", "sundried tomatoes", "mushrooms"], containsNuts: false },
       { name: "Pizza Primavera", ingredients: ["roma", "sundried tomatoes", "goats cheese", "rosemary"], containsNuts: false },
       { name: "South Of The Border", ingredients: ["black beans", "jalapenos", "mushrooms"], containsNuts: false },
       { name: "Blue Moon", ingredients: ["blue cheese", "garlic", "walnuts"], containsNuts: true },
       { name: "Taste Of Athens", ingredients: ["spinach", "kalamata olives", "sesame seeds"], containsNuts: true }
    ];
  });

  /*********************************************************************************/

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (imperative)", function () {

    var i,j,hasMushrooms, productsICanEat = [];

    for (i = 0; i < products.length; i+=1) {
        if (products[i].containsNuts === false) {
            hasMushrooms = false;
            for (j = 0; j < products[i].ingredients.length; j+=1) {
               if (products[i].ingredients[j] === "mushrooms") {
                  hasMushrooms = true;
               }
            }
            if (!hasMushrooms) productsICanEat.push(products[i]);
        }
    }

    expect(productsICanEat.length).toBe(1);
  });

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (functional)", function () {

      var productsICanEat = [];

      /* solve using filter() & all() / any() */
      productsICanEat.push(_(products).filter(function(pizza) { 
        return !pizza.containsNuts && _(pizza.ingredients).all(function(ingredient) {
          return ingredient !== "mushrooms";
        }); 
      }))

      expect(productsICanEat.length).toBe(1);
  });

  /*********************************************************************************/

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (imperative)", function () {
    
    var sum = 0;
    for(var i=1; i<1000; i+=1) {
      if (i % 3 === 0 || i % 5 === 0) {
        sum += i;
      }
    }
    
    expect(sum).toBe(233168);
  });

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (functional)", function () {

    var sum = _.chain(_.range(1000))
      .reduce(function(memo, num) { 
        if (num % 3 == 0 || num % 5 == 0) {
          return memo + num; 
        } else {
          return memo;
        }
      }, 0)
      .value();    /* try chaining range() and reduce() */

    expect(233168).toBe(sum);
  });

  /*********************************************************************************/
   it("should count the ingredient occurrence (imperative)", function () {
    var ingredientCount = { "{ingredient name}": 0 };

    for (i = 0; i < products.length; i+=1) {
        for (j = 0; j < products[i].ingredients.length; j+=1) {
            ingredientCount[products[i].ingredients[j]] = (ingredientCount[products[i].ingredients[j]] || 0) + 1;
        }
    }

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  it("should count the ingredient occurrence (functional)", function () {
    var ingredientCount = { "{ingredient name}": 0 };

    /* chain() together map(), flatten() and reduce() */
    ingredientCount = _.chain(products)
      .map(function(pizza) { return pizza.ingredients; })
      .flatten()
      //why is this not defining the other ingredientCount as well?
      .reduce(function(ingredientCount, ingredient){
        ingredientCount[ingredient] = (ingredientCount[ingredient] || 0) + 1;
        return ingredientCount; 
      }, {})
      .value();
    expect(ingredientCount['mushrooms']).toBe(2);
  });

  /*********************************************************************************/

  it("should find the largest prime factor of a composite number", function () {
    
    var isPrime = function(num) {
      for (var i = 2; i < num; i++) {
        if (num % i === 0) return false;
      }
      return true;
    }

    var largestPrimeFactor = function(num) {
      var primeFactors = [];
      var i = 2;
      while (num !== 1) {
        if (isPrime(i)) {
          while (num % i === 0) {
            primeFactors.push(i);
            num /= i;
          }
        }
        i++;
      }
      return _(primeFactors.sort()).last();
    }

    expect(largestPrimeFactor(20)).toBe(5);

  });

  it("should find the largest palindrome made from the product of two 3 digit numbers", function () {

    var isPalindrome = function(num) {
      var reverse = parseInt(num.toString().split('').reverse().join(''));
      return num === reverse;
    }

    var threeDigits = function() {
      var combinations = [];
      var threeDigits = _.range(100, 1000);
      _.each(threeDigits, function(num1) {
        _.each(threeDigits, function(num2) {
          combinations.push(num1 * num2);
        })
      })
      return combinations;
    }

    var largestPalindrome = function(array) {
      var palindromes = [];
      _.each(array, function(num) {
        if (isPalindrome(num)) {
          palindromes.push(num); 
        }
      })
      //sort needs a comparison function!!!
      var sorted = palindromes.sort(function(a,b) {return a - b});
      return sorted[sorted.length -1];
    }

    expect(largestPalindrome(threeDigits())).toBe(906609);
  });

  it("should find the smallest number divisible by each of the numbers 1 to 20", function () {

    // takes too long to loop through each number
    // instead, take highest power of each prime factor in (1-20), and multiply them together
    var isPrime = function(num) {
      if (num <= 1) return false;
      for (var i = 2; i < num; i++) {
        if (num % i === 0) return false;
      }
      return true;
    }

    var highestPowerOfPrimeFactors = function(range) {
      // {prime factor: highest power}
      var primesCount = {};
      _(range).each(function(num) {
        // calculate prime factors and their exponent
        for (var div = 2; div <= num; div++) {
          var counter = 0; //to count exponent
          if (isPrime(div) && num % div === 0) {
            while (num % div === 0) {
              num /= div;
              counter++;
            }
            if (primesCount[div] === undefined || counter > primesCount[div]) {
              primesCount[div] = counter;
            }
          }
        }
      })
      return primesCount;
    }
    
    var smallestDivisible = function(range) {
      var primesCount = highestPowerOfPrimeFactors(range);
      var results = [];
      _(primesCount).each(function(value, prop) {
        results.push(Math.pow(prop, value));
      })
      return _(results).reduce(function(memo,num){return memo*num;});
    }

    var range = _.range(1, 21);
    expect(smallestDivisible(range)).toBe(232792560);
  });

  it("should find the difference between the sum of the squares and the square of the sums", function () {
  
    var sumOfSquares = function(numbers) {
      var squaredNums = [];
      _(numbers).each(function(num) {
        squaredNums.push(num * num);
      })
      return _(squaredNums).reduce(function(memo,num) {return memo+num});
    }

    var squareOfSum = function(numbers) {
      var sum = _(numbers).reduce(function(memo,num) {return memo+num});
      return sum * sum;
    }

    var difference = function(numbers) {
      return squareOfSum(numbers) - sumOfSquares(numbers);
    }

    var range = _.range(1,101);

    expect(difference(range)).toBe(25164150);

  });

  it("should find the 10001st prime", function () {
    
    var isPrime = function(num) {
      if (num <= 1) return false;
      for (var i = 2; i < num; i++) {
        if (num % i === 0) return false;
      }
      return true;
    }

    var nthPrime = function(n) {
      var num = 1;
      var counter = 0;
      while (counter < n) {
        num++;
        if (isPrime(num)) {
          counter++;
        }
      }
      return num;
    }

    expect(nthPrime(10001)).toBe(104743);
  });

});
