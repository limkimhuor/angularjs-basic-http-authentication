"use strict";

// declare modules
var module_authen = angular.module("Authentication", []);
var module_home = angular.module("Home", []);

var basicHttpAuthApp = angular.module("BasicHttpAuthApp", ["Authentication", "Home", "ngRoute", "ngCookies"]);

// mydomain.com/#!/a/b/c the URL will become mydomain.com/#/a/b/c
// basicHttpAuthApp.config(["$locationProvider", function($locationProvider) {
//   $locationProvider.hashPrefix('');
// }]);

basicHttpAuthApp.config(["$routeProvider", function ($routeProvider) {
  $routeProvider
    .when("/login", {
      controller: "LoginController",
      templateUrl: "angular/views/login.html",
      hideMenus: true
    })
    .when("/", {
      controller: "HomeController",
      templateUrl: "angular/views/home.html"
    })
    .otherwise({ redirectTo: "/login" });
}])

basicHttpAuthApp.run(["$rootScope", "$location", "$cookieStore", "$http",
  function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get("globals") || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common["Authorization"] = "Basic " + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on("$locationChangeStart", function (event, next, current) {
      // redirect to login page if not logged in
      if ($location.path() !== "/login" && !$rootScope.globals.currentUser) {
        $location.path("/login");
      }
    });
  }
]);
