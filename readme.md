all code can be reviewed at https://github.com/BindelsSteve/BindelsSteve.github.io

this app shows the local time, you can add other clocks from other timezones.
you can also remove your clocks, but the local time will always be shown.
the clocks are made with a w3schools tutorial on clocks,
for the timezones I used a library called moment.js
and to store things client side I used localforage.
ofcourse it wouldn't be a pwa without a manifest and serviceworker.

you can check the website at BindelsSteve.github.io

I did not implement any security headers but if i would i would use:
Strict-Transport-Security :(this one get's automaticly done by github pages) just to enforce the use of https,
X-Frame-Options as defense against clickjacking,
X-Content-Type-Options: nosniff to tell the browser that the content type is the content type i say it is,
"X-XSS-Protection: 1; mode=block" :configuration of the cross-site scripting filter built into most browsers,
Referrer-Policy : because privacy is a good thing to have,
Content-Security-Policy, to protect against xss attacks,
Feature-Policy to control which features and api's can be used.