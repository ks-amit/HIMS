# random-token
generate a (pseudo-)random string of given length composed from alphanumeric characters

# install
`npm install random-token`

# usage
## initiate
``` javascript
var randomToken = require('random-token');
```


## default salt is "abcdefghijklmnopqrstuvwxzy0123456789"
``` javascript
var token = randomToken(16); // example output → 'xg8250nbg4klq5b3'
```

## different salt
``` javascript
var randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
var token = randomToken(16); // example output → '3ZGErMDCwxTOZYFp'
```

**Note: valid salts are strings with length > 0**
*if an invalid salt is given to `.create`, the returned generator will use the default salt*

## convenience methods
#### .create
create a different generator
``` javascript
var randomToken = require('random-token').create('Aa0');
var rt = randomToken.gen('Aa0');
var token = rt(16); // example output → 'A0aAAaA0AA0Aa0AA'
```

#### .salt
you can check a generators salt by calling `.salt()` on it
``` javascript
var randomToken = require('random-token').gen('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
randomToken.salt(); // output → 'abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
```

