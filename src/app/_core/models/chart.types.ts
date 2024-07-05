import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexStroke, ApexTooltip, ApexPlotOptions, ApexFill, ApexLegend } from "ng-apexcharts";

export type ChartOptions = {
    series?: ApexAxisChartSeries;
    chart?: ApexChart;
    xaxis?: ApexXAxis;
    yaxis?: ApexYAxis;
    dataLabels?: ApexDataLabels;
    stroke?: ApexStroke;
    tooltip?: ApexTooltip;
    plotOptions?: ApexPlotOptions;
    fill?: ApexFill;
    legend?: ApexLegend;
    labels?: string[];
    responsive?: any[];
};