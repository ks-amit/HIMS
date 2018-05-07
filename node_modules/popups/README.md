# popupS

Native Javascript Module to display beautiful popups. With react support!

## Features

* Demo: http://chieforz.github.io/popupS
* Native Javascript / No jQuery dependency
* Built in CSS spinner for asynchronous dialogs
* Smart focus on form elements
* AMD support

********

## Installation

The plugin can be used as a Common JS module, an AMD module, or a global.

### Usage with Browserify

Install with npm, use with [Browserify](http://browserify.org/)

```
> npm install popups
```

and in your code

```javascript
var popupS = require('popups');

popupS.alert({
    content: 'Hello World!'
});
```

For the basic styling and fade in and out to be working, you have to include the [popupS.css](css/popupS.css) in yout header.

```html
<link rel="stylesheet" href="popupS.css">
```

### Usage as browser global

You can include [popupS.js](dist/popupS.js) directly in a script tag.
For the basic styling and fade in and out to be working, you have to include the [popupS.css](css/popupS.css).

```html
<link rel="stylesheet" href="popupS.css">
<script src="popupS.js"></script>

<script>
    popupS.alert({
        content: 'Hello World!'
    });
</script>
```

> For both files `popupS.js` and `popupS.css` is a minified productive version in it's corresponding folder.

********

## How to use

Create a popup window:

```javascript
popupS.window({
    mode: 'alert',
    content: 'Hey'
});

// or

popupS.alert({
    content: 'Hello'
});
```

Here are multiple ways to create popupS:

### Alerts

```javascript
popupS.alert({
    title:   'I am an',
    content: 'Alert'
});
```

### Confirm

Confirm configuration involves the use of callbacks to be applied.

```javascript
popupS.confirm({
    content:     '<b>Do you like what you see?</b>',
    labelOk:     'Yes',
    labelCancel: 'No',
    onSubmit: function() {
        console.log(':)');
    },
    onClose: function() {
        console.log(':(');
    }
});
```

### Prompt

Prompts are used for asking a single question.

```javascript
popupS.prompt({
    content:     'What is your name?',
    placeholder: '>>>',
    onSubmit: function(val) {
        if(val) {
            popupS.alert({
                content: 'Hello, ' + val
            });
        } else {
            popupS.alert({
                content: ':('
            });
        }
    }
});
```

### Modal

With Modals you are in full control.

```javascript
popupS.modal({
    title:   'Himalaya',
    content: {
        tag: 'img#himalaya.picture',
        src: 'http://static.hdw.eweb4.com/media/wallpapers_1920x1080/nature/1/1/himalaya-nature-hd-wallpaper-1920x1080-6944.jpg'
    }
});
```

> there is some magic sugar involved. learn more about it [here](#dom-generation)

### Ajax

It can also work in asynchronous mode and retrieve content from external pages.

```javascript
popupS.ajax({
    title:   'Himalaya',
    ajax: {
        url: 'http://static.hdw.eweb4.com/media/wallpapers_1920x1080/nature/1/1/himalaya-nature-hd-wallpaper-1920x1080-6944.jpg'
    }
});
```

********

## Options

```javascript
popupS.window({
    mode: 'alert'|'confirm'|'prompt'|'modal'|'modal-ajax',
    title: 'Title', 
    content : 'Text'|'<div>html</div>'|{tag : 'span#id.class'},
    className : 'additionalClass',  // for additional styling, gets append on every popup div
    placeholder : 'Input Text',     // only available for mode: 'prompt'
    ajax : {                        // only available for mode: 'modal-ajax'
        url : 'http://url.com', 
        post : true,
        str : 'post=true'
    },
    onOpen: function(){},      // gets called when popup is opened
    onSubmit: function(val){}, // gets called when submitted. val as an paramater for prompts
    onClose: function(){}      // gets called when popup is closed
});
```

### Advanced Options

```javascript
popupS.window({
    additionalBaseClass: '',            // classNames, that gets appended to the base
    additionalButtonHolderClass: '',    // classNames, that gets appended to the button holder
    additionalButtonOkClass: '',        // classNames, that gets appended to the ok button
    additionalButtonCancelClass: '',    // classNames, that gets appended to the cancel button
    additionalCloseBtnClass: '',        // classNames, that gets appended to the close button
    additionalFormClass: '',            // classNames, that gets appended to the form
    additionalOverlayClass: '',         // classNames, that gets appended to the overlay
    additionalPopupClass: '',           // classNames, that gets appended to the popup
    appendLocation: document.body,      // DOM Element, where the popup should sit
    closeBtn: '&times;',                // HTML String, to use for the close button
    flagBodyScroll: false,              // should the body be scrollable
    flagButtonReverse: false,           // should the buttons be reversed
    flagCloseByEsc: true,               // ability to clse with the esc key
    flagCloseByOverlay: true,           // ability to close with click on the overlay
    flagShowCloseBtn: true,             // should the close button be displayed
    labelOk: 'OK',                      // label for the ok button
    labelCancel: 'Cancel',              // label for the cancel button
    loader: 'spinner',                  // classname for spinner to use, take a look at the included css file for the possiblities
    zIndex: 10000                       // default z-index
});
```

********

## DOM Generation

The plugin is using some special magic to generating DOM Elements.

```javascript
popupS.alert({
    content: {
       
        tag: 'div#id.class.class2',
        css: {
            width: '100px'
        },
        html: '<h1>Hello</h1>',
        children:[
            {
                tag: 'label',
                text: 'test',
                htmlFor: 'input',
                css: {
                    width: '50%'
                }
            },
            {
                tag: 'input#input',
                type: 'checkbox',
                css: {
                    width: '50%'
                }
            }
        ]
        
    }
});
```

> All attributes, that can be applied via javascript are availabe to use.
> For example, as you can see in the example above:
> Instead of using the regular "for"-attribute on the label element,
> we have to use the "htmlFor"-attribute.

> **Note:**
> If an assigned attribute is not an valid HTML attribute, it gets assigned as an 'data-'* atribute.

********

## License

[MIT](https://opensource.org/licenses/MIT)
