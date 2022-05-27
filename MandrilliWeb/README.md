# MandrilliWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Frontend architecture

Our application can be divided into several different modules:

* Feature Modules – These modules are used to create a component for every feature, in our implementation every feature module represents a particular screen of the application.

* Routing Modules – Inside every feature module there's also the relative routing module. This module just define the routing for a feature.

* Core Module – Anything that will be shared throughout the application.  Inside this module there's also the models of every data type we use (User, Messages, Match, ...) and the various HTTP Services we use to interact with the webserver.

* Shared Modules – Here you can have all the reusable directives, pipes, components. The shared modules can be imported multiple times into the feature modules.


## Graphical partition

In order to know what's should be the correct graphic re-partition of our appliation in modules and components we can consult the
sketches in [docs/Partitioned Graphical Interfaces](../docs/Partitioned%20Graphical%20Interfaces)


## Graphical implementation

For graphic implementation we use an alternative to the vanilla bootstrap framework called Bulma.
It's a framework that provides CSS classes to help you style your HTML code.
Link: [Bulma](https://bulma.io/documentation/)

## Icons 

In these websites you have a list of all the icons you can import in a component: 
 * [FortAwesome/free-regular-svg-icons](https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-regular-svg-icons)

 * [FortAwesome/free-solid-svg-icons](https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-solid-svg-icons)

 * [FortAwesome/free-brands-svg-icons](https://github.com/FortAwesome/Font-Awesome/tree/master/js-packages/%40fortawesome/free-brands-svg-icons)