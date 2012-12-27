statsd-ducksboard-backend
=========================

## Overview

This is a pluggable backend for [StatsD][statsd], which push metrics 
to [Ducksboard](http://ducksboard.com).

ATTENTION: THIS IS A PROVISIONAL DOCUMENTS AND AN ALPHA VERSION

## Requirements

* [StatsD][statsd] versions >= 0.5.0.
* [visionmedia][js-yaml] version >= 0.2.3
* An active [Ducksboards](http://ducksboard.com) account.

## Installation

    $ cd /path/to/statsd
    $ npm install statsd-ducksboard-backend

## Enabling

Add the `statsd-ducksboard-backend` backend to the list of StatsD
backends in the StatsD configuration file:

```js
{
  backends: ["statsd-ducksboard-backend"]
}
```

## Configuration

You must include 'statsd-ducksboard-backend' in the array backeds 
from your StatsD config file to enable it.

```js
{
  ducksboard: {
    apikey: '<APIKEY from ducksboards.com>',
    cache: '/tmp/',
    definitions: './metrics.yaml'
  }
}
```

Start/restart the statsd daemon and your StatsD metrics should now be
pushed to your Librato Metrics account.

## Widget definitions

Quick and dirty metrics.yaml example:

```yaml
---
metrics:
    gearman.ymailer.iunaites.done:
        allowZero: true
        reset: day
    gearman.ymailer.iunaites.fail:
        reset: hour
widgets:
    #Counter
    101826:
        format: number
        metric: 
            name: gearman.ymailer.iunaites.done
    #Graphs
    101893:
        format: number
        metric: 
            name: gearman.ymailer.iunaites.done
            type: last
            timestamp: true
    #Gauge
    101838:
        format: gauge
        dividend: 
            name: gearman.ymailer.iunaites.fail
        divisor: 
            value: 100
    #Status Leaderboard
    100539:
        format: leaderboard.status
        limit: 5|50
        metrics: 
            - name: gearman.ymailer.iunaites.exception
            - name: gearman.ymailer.iunaites.done
              label: ejemplo
              limit: 1|1000000
            - name: gearman.ymailer.iunaites.warning
            - name: gearman.ymailer.iunaites.fail
    #Status Leaderboard using a regexp
    101998:
        format: leaderboard.status
        limit: 5|100
        type: sum
        regexp: !!js/regexp /gearman\.ymailer\.iunaites\.(.*)/i
    #Tends Leaderboard using a regexp
    102001:
        format: leaderboard.trend
        regexp: !!js/regexp /gearman\.ymailer\.iunaites\.(.*)/i
...
```

