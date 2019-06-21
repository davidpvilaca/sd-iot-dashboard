import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import * as moment from 'moment';
import { SolarData } from '../../@core/data/solar';
import { DataApiService } from '../../@core/providers';
import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, AfterViewInit {

  private alive = true;
  private themeSubscription: Subscription;
  umidadeOptions: any = {};
  temperaturaOptions: any = {};
  pressaoOptions: any = {};

  solarValue: number;
  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };

  statusCards: string;

  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];

  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'secondary',
      },
    ],
  };

  constructor(private themeService: NbThemeService,
              private solarService: SolarData,
              private dataApiService: DataApiService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.statusCards = this.statusCardsByThemes[theme.name];
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
      });
  }

  ngOnDestroy() {
    this.alive = false;
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.themeSubscription = this.themeService.getJsTheme().subscribe(async config => {
      this.showUmidadeChart(config);
      this.showTemperaturaChart(config);
      this.showPressaoChart(config);
    });
  }

  private async showTemperaturaChart(config: NbJSThemeOptions) {
    const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      const temperatura = await this.dataApiService.getTemperatura();

      const dates = _.map(temperatura, d => moment(d.data).format('DD-MM-YYYY HH:mm:ss'));
      const legends = _.map(_.uniqBy(temperatura, 'id'), d => d.id);
      const grouped = _.groupBy(temperatura, 'id');
      const series = _.keys(grouped).map(key => {
        return {
          name: key,
          type: 'line',
          data: grouped[key].map(d => d.temperatura),
        };
      });

      this.temperaturaOptions = {
        backgroundColor: echarts.bg,
        color: [colors.danger, colors.primary, colors.info],
        tooltip: {
          trigger: 'item',
          formatter: '{a} - {b} : {c} ºC',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          left: 'left',
          data: legends, // legends here
          textStyle: {
            color: echarts.textColor,
          },
        },
        xAxis: [
          {
            type: 'category',
            data: dates, // dates
            axisTick: {
              alignWithLabel: false,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        series: series,
      };
  }

  private async showUmidadeChart(config: NbJSThemeOptions) {
    const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      const umidade = await this.dataApiService.getUmidade();

      const dates = _.map(umidade, d => moment(d.data).format('DD-MM-YYYY HH:mm:ss'));
      const legends = _.map(_.uniqBy(umidade, 'id'), d => d.id);
      const grouped = _.groupBy(umidade, 'id');
      const series = _.keys(grouped).map(key => {
        return {
          name: key,
          type: 'line',
          data: grouped[key].map(d => d.umidade),
        };
      });

      this.umidadeOptions = {
        backgroundColor: echarts.bg,
        color: [colors.danger, colors.primary, colors.info],
        tooltip: {
          trigger: 'item',
          formatter: '{a} - {b} : {c}',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          left: 'left',
          data: legends, // legends here
          textStyle: {
            color: echarts.textColor,
          },
        },
        xAxis: [
          {
            type: 'category',
            data: dates, // dates
            axisTick: {
              alignWithLabel: false,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        series: series,
      };
  }

  private async showPressaoChart(config: NbJSThemeOptions) {
    const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      const pressao = await this.dataApiService.getPressao();

      const dates = _.map(pressao, d => moment(d.data).format('DD-MM-YYYY HH:mm:ss'));
      const legends = _.map(_.uniqBy(pressao, 'id'), d => d.id);
      const grouped = _.groupBy(pressao, 'id');
      const series = _.keys(grouped).map(key => {
        return {
          name: key,
          type: 'line',
          data: grouped[key].map(d => d.pressao),
        };
      });

      this.pressaoOptions = {
        backgroundColor: echarts.bg,
        color: [colors.danger, colors.primary, colors.info],
        tooltip: {
          trigger: 'item',
          formatter: '{a} - {b} : {c}',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          left: 'left',
          data: legends, // legends here
          textStyle: {
            color: echarts.textColor,
          },
        },
        xAxis: [
          {
            type: 'category',
            data: dates, // dates
            axisTick: {
              alignWithLabel: false,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        series: series,
      };
  }

}
