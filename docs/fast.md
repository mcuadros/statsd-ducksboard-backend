Quick and dirty metrics.yaml example:

```
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
