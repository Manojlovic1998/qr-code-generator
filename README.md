# qr-code-generator

This is a small PoC of a QR Code Generator which uses an external API to generate QR Code using the text input.

Feel free to try it out at [QR Code Generator](https://manojlovic1998.github.io/qr-code-generator/).
![Website preview](/public/images/website-preview.PNG)

## Feature Support

Goals:

- [x] Generate QR Code for Text
- [x] Generate QR Code for URLs
- [x] Generate QR Code with custom size
- [x] Generate QR Code with custom colored data modules
- [x] Generate QR Code in different file formats: png, jpeg, webp, svg
- [x] Generate QR Code with custom logo

## Technologies Used

- [Bootstrap 5](https://getbootstrap.com/)
  - Bootstrap 5 is used for easier implementation of responsive design and faster prototyping.
- [Google Fonts](https://fonts.google.com/icons)
  - Google Fonts is used to import font family and render icons.
- Javascript
  - Since this is a PoC and was done in the morning while drinking some coffee. At the time the language of choice was JavaScript.
- [jscolor](https://jscolor.com/)
  - I needed a configurable color picker jscolor seemed like the easiest to implement and configure at short noticeg
- [EasyQRCodeJS](https://github.com/ushelp/EasyQRCodeJS)
  - Initially I began the project by writing script that utilizes an [goqr API](https://goqr.me/api/). However, their interface does not allow for creating QR codes with logo. Therefore I have come across EasyQRCodeJS. Now so far my impression of EasyQRCodeJS is that it is a great library however in terms of incorporating logo into QR Code it lacks excavation which would prevent the logo overlap.
- [jsdelivr](https://www.jsdelivr.com/)
  - This project was created out of the blue one morning (due to my curiosity). Therefore, I decided to use CDN service to import dependencies as it seemed most time efficient for what I was trying to achieve.
