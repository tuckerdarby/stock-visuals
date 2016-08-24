'use strict';

angular.module('myApp.version', [
  'maroonApp.version.interpolate-filter',
  'maroonApp.version.version-directive'
])

.value('version', '0.1');
