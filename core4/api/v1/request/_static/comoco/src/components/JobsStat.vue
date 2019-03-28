<template>
      <vue-highcharts :options="chartOptions" ref="chart"></vue-highcharts>
</template>

<script>

import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import streamgraph from 'highcharts/modules/streamgraph'

streamgraph(Highcharts)

// var colors = Highcharts.getOptions().colors
var colors = ['#d70f14', '#8d1407', '#d8c9c7', '#ffc107', '#f1f128', '#11dea2', '#64a505']

export default {
  name: 'JobsStat',
  components: {
    VueHighcharts: Chart
  },
  data () {
    return {
      chartOptions: {
        chart: {
          type: 'streamgraph',
          marginBottom: 30,
          zoomType: 'x',
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [
              [0, '#393939'],
              [1, '#3e3e40']
            ]
          },
          style: {
            fontFamily: '\'Unica One\', sans-serif'
          },
          plotBorderColor: '#606063'
        },

        // Make sure connected countries have similar colors
        colors: [
          colors[0],
          colors[1],
          colors[2],
          colors[3],
          colors[4],
          // East Germany, West Germany and Germany
          Highcharts.color(colors[5]).brighten(0.2).get(),
          Highcharts.color(colors[5]).brighten(0.1).get(),

          colors[5],
          colors[6],
          colors[7],
          colors[8],
          colors[9],
          colors[0],
          colors[1],
          colors[3],
          // Soviet Union, Russia
          Highcharts.color(colors[2]).brighten(-0.1).get(),
          Highcharts.color(colors[2]).brighten(-0.2).get(),
          Highcharts.color(colors[2]).brighten(-0.3).get()
        ],

        title: {
          floating: true,
          align: 'left',
          text: 'Winter Olympic Medal Wins'
        },
        subtitle: {
          floating: true,
          align: 'left',
          y: 30,
          text: 'Source: <a href="https://www.sports-reference.com/olympics/winter/1924/">sports-reference.com</a>'
        },

        xAxis: {
          maxPadding: 0,
          type: 'category',
          crosshair: true,
          categories: [
            '',
            '1924 Chamonix',
            '1928 St. Moritz',
            '1932 Lake Placid',
            '1936 Garmisch-Partenkirchen',
            '1940 <i>Cancelled (Sapporo)</i>',
            '1944 <i>Cancelled (Cortina d\'Ampezzo)</i>',
            '1948 St. Moritz',
            '1952 Oslo',
            '1956 Cortina d\'Ampezzo',
            '1960 Squaw Valley',
            '1964 Innsbruck',
            '1968 Grenoble',
            '1972 Sapporo',
            '1976 Innsbruck',
            '1980 Lake Placid',
            '1984 Sarajevo',
            '1988 Calgary',
            '1992 Albertville',
            '1994 Lillehammer',
            '1998 Nagano',
            '2002 Salt Lake City',
            '2006 Turin',
            '2010 Vancouver',
            '2014 Sochi'
          ],
          labels: {
            align: 'left',
            reserveSpace: false,
            rotation: 270,
            style: {
              color: '#E0E0E3'
            }
          },
          lineWidth: 0,
          margin: 10,
          tickWidth: 0
        },

        yAxis: {
          visible: false,
          startOnTick: false,
          endOnTick: false
        },

        legend: {
          enabled: false
        },

        annotations: [{
          labels: [{
            point: {
              x: 5.5,
              xAxis: 0,
              y: 30,
              yAxis: 0
            },
            text: 'Cancelled<br>during<br>World War II'
          }, {
            point: {
              x: 18,
              xAxis: 0,
              y: 90,
              yAxis: 0
            },
            text: 'Soviet Union fell,<br>Germany united'
          }],
          labelOptions: {
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderColor: 'silver'
          }
        }],

        plotOptions: {
          series: {
            label: {
              minFontSize: 5,
              maxFontSize: 15,
              style: {
                color: 'rgba(255,255,255,0.75)'
              }
            }
          }
        },

        // Data parsed with olympic-medals.node.js
        series: [
           {
            "name": "Germany",
            "data": [
              0, 0, 1, 2, 6, 0, 0, 0, 7, 2, 8, 9, 0, 0, 0, 0, 0, 0, 26, 24, 29, 36, 29, 30, 19
            ]
          }, {
            "name": "Russia",
            "data": [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 18, 13, 22, 15, 33
            ]
          }, {
            "name": "Japan",
            "data": [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 1, 1, 1, 7, 5, 10, 2, 1, 5, 8
            ]
          }, {
            "name": "Czechoslovakia",
            "data": [
              0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 4, 3, 1, 1, 6, 3, 3, 0, 0, 0, 0, 0, 0
            ]
          }, {
            "name": "Poland",
            "data": [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 6, 6
            ]
          },{
            "name": "Belarus",
            "data": [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 3, 6
            ]
          }, {
            "name": "Ukraine",
            "data": [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 2, 0, 2
            ]
          }]
      }
    }
  }
}
</script>

<style scoped>

</style>
