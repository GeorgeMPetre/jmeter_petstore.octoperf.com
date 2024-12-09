/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.99994380614469, "KoPercent": 5.619385531430909E-5};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999701149958203, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "02 - 06 ClickOnAddToCart"], "isController": true}, {"data": [0.9983471074380166, 500, 1500, "02 - 08 EnterPaymentDetailsAndClickContinue"], "isController": true}, {"data": [0.9992138364779874, 500, 1500, "06 - 03 EnterTheCredentialsAndClickLogin"], "isController": true}, {"data": [1.0, 500, 1500, "06 - 05 ClickOnProduct"], "isController": true}, {"data": [0.9991896272285251, 500, 1500, "01 - 05 ClickOnProduct"], "isController": true}, {"data": [0.9965870307167235, 500, 1500, "05 - 09 ClickOnConfirm"], "isController": true}, {"data": [0.999185667752443, 500, 1500, "02 - 04 ClickOnDogs"], "isController": true}, {"data": [0.9992806790389872, 500, 1500, "07 - 01 ClickEnterTheStoreUrl"], "isController": true}, {"data": [1.0, 500, 1500, "04 - 03 EnterTheCredentialsAndClickLogin-0"], "isController": false}, {"data": [1.0, 500, 1500, "04 - 03 EnterTheCredentialsAndClickLogin-1"], "isController": false}, {"data": [0.9990215264187867, 500, 1500, "04 - 02 ClickSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "03 - 06 ClickOnAddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "05 - 07 ClickProceedToCheckout"], "isController": true}, {"data": [0.998989898989899, 500, 1500, "04 - 08 EnterPaymentDetailsAndClickContinue"], "isController": true}, {"data": [0.9989816700610998, 500, 1500, "04 - 10 ClickSignOut "], "isController": true}, {"data": [0.999633054454719, 500, 1500, "07 - 04 ClickSignOut "], "isController": true}, {"data": [0.9977814753189129, 500, 1500, "02 - 10 ClickSignOut "], "isController": true}, {"data": [0.999983955046869, 500, 1500, "Search"], "isController": false}, {"data": [0.998991935483871, 500, 1500, "03 - 10 ClickSignOut -0"], "isController": false}, {"data": [1.0, 500, 1500, "03 - 10 ClickSignOut -1"], "isController": false}, {"data": [1.0, 500, 1500, "05 - 02 ClickSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "01 - 04 ClickOnFish"], "isController": true}, {"data": [1.0, 500, 1500, "02 - 07 ClickProceedToCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "04 - 06 ClickOnAddToCart"], "isController": true}, {"data": [0.9991680532445923, 500, 1500, "02 - 10 ClickSignOut -0"], "isController": false}, {"data": [1.0, 500, 1500, "02 - 10 ClickSignOut -1"], "isController": false}, {"data": [0.9983606557377049, 500, 1500, "05 - 01 ClickEnterTheStoreUrl"], "isController": true}, {"data": [0.9968454258675079, 500, 1500, "01 -01 ClickEnterTheStoreUrl"], "isController": true}, {"data": [1.0, 500, 1500, "03 - 03 EnterTheCredentialsAndClickLogin-1"], "isController": false}, {"data": [0.9991961414790996, 500, 1500, "02 - 02 ClickSignIn"], "isController": true}, {"data": [0.9970588235294118, 500, 1500, "03 - 03 EnterTheCredentialsAndClickLogin-0"], "isController": false}, {"data": [1.0, 500, 1500, "05 - 05 ClickOnProduct"], "isController": true}, {"data": [1.0, 500, 1500, "01 - 06 ClickOnAddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "07 - 02 ClickSignIn"], "isController": true}, {"data": [0.9994068801897983, 500, 1500, "06 - 04 ClickOnBirds"], "isController": true}, {"data": [0.999001996007984, 500, 1500, "04 - 05 ClickOnProduct"], "isController": true}, {"data": [0.9981333333333333, 500, 1500, "01 - 03 EnterTheCredentialsAndClickLogin"], "isController": true}, {"data": [0.9980587909040488, 500, 1500, "05 - 03 EnterTheCredentialsAndClickLogin"], "isController": true}, {"data": [0.99640522875817, 500, 1500, "03 - 03 EnterTheCredentialsAndClickLogin"], "isController": true}, {"data": [1.0, 500, 1500, "02 - 01 ClickEnterTheStoreUrl"], "isController": false}, {"data": [0.9975530179445351, 500, 1500, "01 - 08 EnterPaymentDetailsAndClickContinue"], "isController": true}, {"data": [0.9983471074380166, 500, 1500, "02 - 09 ClickOnConfirm"], "isController": true}, {"data": [0.9980811403508771, 500, 1500, "01 - 10 ClickSignOut "], "isController": true}, {"data": [1.0, 500, 1500, "05 - 04 ClickOnBirds"], "isController": true}, {"data": [0.997589833479404, 500, 1500, "07 - 03 EnterTheCredentialsAndClickLogin"], "isController": true}, {"data": [1.0, 500, 1500, "06 - 06 ClickOnAddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "03 - 08 EnterPaymentDetailsAndClickContinue"], "isController": true}, {"data": [1.0, 500, 1500, "01 - 10 ClickSignOut -1"], "isController": false}, {"data": [0.9990059642147118, 500, 1500, "04 - 04 ClickOnCats"], "isController": true}, {"data": [1.0, 500, 1500, "02 - 03 EnterTheCredentialsAndClickLogin-1"], "isController": false}, {"data": [1.0, 500, 1500, "02 - 03 EnterTheCredentialsAndClickLogin-0"], "isController": false}, {"data": [0.9991776315789473, 500, 1500, "01 - 10 ClickSignOut -0"], "isController": false}, {"data": [1.0, 500, 1500, "05 - 06 ClickOnAddToCart"], "isController": true}, {"data": [0.997431506849315, 500, 1500, "05 - 10 ClickSignOut "], "isController": true}, {"data": [0.9996056782334385, 500, 1500, "01 - 01 ClickEnterTheStoreUrl"], "isController": false}, {"data": [1.0, 500, 1500, "01 - 07 ClickProceedToCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "03 - 09 ClickOnConfirm"], "isController": true}, {"data": [0.9983198924731183, 500, 1500, "03 - 10 ClickSignOut "], "isController": true}, {"data": [1.0, 500, 1500, "07 - 04 ClickSignOut -0"], "isController": false}, {"data": [1.0, 500, 1500, "07 - 04 ClickSignOut -1"], "isController": false}, {"data": [1.0, 500, 1500, "05 - 08 EnterPaymentDetailsAndClickContinue"], "isController": true}, {"data": [0.9991438356164384, 500, 1500, "05 - 10 ClickSignOut -1"], "isController": false}, {"data": [0.9991438356164384, 500, 1500, "05 - 10 ClickSignOut -0"], "isController": false}, {"data": [0.9996744791666666, 500, 1500, "04 - 01 ClickEnterTheStoreUrl"], "isController": true}, {"data": [0.998019801980198, 500, 1500, "03 - 05 ClickOnProduct"], "isController": true}, {"data": [0.9968152866242038, 500, 1500, "02 -01 ClickEnterTheStoreUrl"], "isController": true}, {"data": [1.0, 500, 1500, "04 - 07 ClickProceedToCheckout"], "isController": true}, {"data": [1.0, 500, 1500, "01 - 09 ClickOnConfirm"], "isController": true}, {"data": [0.9984152139461173, 500, 1500, "01 - 02 ClickSignIn"], "isController": true}, {"data": [0.9988304093567252, 500, 1500, "06 - 02 ClickSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "05 - 03 EnterTheCredentialsAndClickLogin-1"], "isController": false}, {"data": [1.0, 500, 1500, "03 - 04 ClickOnReptiles"], "isController": true}, {"data": [1.0, 500, 1500, "01 - 03 EnterTheCredentialsAndClickLogin-0"], "isController": false}, {"data": [1.0, 500, 1500, "01 - 03 EnterTheCredentialsAndClickLogin-1"], "isController": false}, {"data": [1.0, 500, 1500, "03 - 07 ClickProceedToCheckout"], "isController": true}, {"data": [0.9991680532445923, 500, 1500, "05 - 03 EnterTheCredentialsAndClickLogin-0"], "isController": false}, {"data": [0.9979716024340771, 500, 1500, "04 - 09 ClickOnConfirm"], "isController": true}, {"data": [0.9996776273372018, 500, 1500, "03 - 01 ClickEnterTheStoreUrl"], "isController": true}, {"data": [0.9988399071925754, 500, 1500, "06 - 01 ClickEnterTheStoreUrl"], "isController": true}, {"data": [0.9991883116883117, 500, 1500, "02 - 03 EnterTheCredentialsAndClickLogin"], "isController": true}, {"data": [0.9991830065359477, 500, 1500, "02 - 05 ClickOnProduct"], "isController": true}, {"data": [1.0, 500, 1500, "04 - 03 EnterTheCredentialsAndClickLogin"], "isController": true}, {"data": [0.9990253411306043, 500, 1500, "03 - 02 ClickSignIn"], "isController": true}, {"data": [1.0, 500, 1500, "04 - 10 ClickSignOut -1"], "isController": false}, {"data": [1.0, 500, 1500, "04 - 10 ClickSignOut -0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7118216, 4, 5.619385531430909E-5, 31.753965881340907, 24, 1456, 30.0, 34.0, 37.0, 49.0, 2016.6020408481256, 7764.068576653501, 624.938083382197], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02 - 06 ClickOnAddToCart", 1220, 0, 0.0, 52.2049180327869, 30, 274, 48.0, 57.0, 88.0, 181.3799999999992, 0.3573513469656038, 1.6814981587252165, 0.24797027821706283], "isController": true}, {"data": ["02 - 08 EnterPaymentDetailsAndClickContinue", 1210, 0, 0.0, 79.9619834710744, 31, 766, 55.0, 127.0, 136.9000000000001, 316.3400000000006, 0.3573357636102843, 1.6415111640847435, 0.46062813277888215], "isController": true}, {"data": ["06 - 03 EnterTheCredentialsAndClickLogin", 2544, 0, 0.0, 65.95047169811305, 25, 1161, 49.0, 119.0, 129.0, 176.0, 0.7577820101835894, 4.51312696668857, 0.8628650623770168], "isController": true}, {"data": ["06 - 05 ClickOnProduct", 1678, 0, 0.0, 64.6686531585223, 30, 455, 48.0, 98.0, 119.0, 180.05000000000018, 0.5082499753901606, 1.9003351197552645, 0.35140720954710325], "isController": true}, {"data": ["01 - 05 ClickOnProduct", 1234, 0, 0.0, 71.78444084278777, 30, 542, 50.0, 101.0, 128.0, 320.6500000000019, 0.35712745658976847, 1.4537989686425308, 0.2469201555327696], "isController": true}, {"data": ["05 - 09 ClickOnConfirm", 1172, 4, 0.3412969283276451, 53.296928327645034, 30, 270, 49.0, 60.0, 80.04999999999973, 160.0, 0.3570478721378668, 1.8976974448837813, 0.2325692682773019], "isController": true}, {"data": ["02 - 04 ClickOnDogs", 1228, 0, 0.0, 55.41205211726387, 30, 1114, 45.0, 85.0, 93.0, 231.07000000000062, 0.35643959800115177, 1.513824034870126, 0.23530582836794783], "isController": true}, {"data": ["07 - 01 ClickEnterTheStoreUrl", 6951, 0, 0.0, 73.1929218817438, 25, 775, 57.0, 106.0, 120.39999999999964, 209.47999999999956, 2.0636755691807824, 28.994767808850675, 1.5781576485142783], "isController": true}, {"data": ["04 - 03 EnterTheCredentialsAndClickLogin-0", 506, 0, 0.0, 69.65415019762841, 30, 339, 52.5, 96.0, 112.29999999999995, 233.39000000000016, 0.1494072724137483, 0.03355827407730675, 0.15276309982147898], "isController": false}, {"data": ["04 - 03 EnterTheCredentialsAndClickLogin-1", 506, 0, 0.0, 31.768774703557316, 25, 273, 30.0, 34.0, 40.64999999999998, 76.30000000000007, 0.14940718418244447, 0.7505376517914985, 0.11526530810950307], "isController": false}, {"data": ["04 - 02 ClickSignIn", 1022, 0, 0.0, 68.89236790606653, 30, 537, 52.0, 95.0, 105.0, 177.86999999999944, 0.2978805883578823, 1.191224623131506, 0.20421110647190754], "isController": true}, {"data": ["03 - 06 ClickOnAddToCart", 1008, 0, 0.0, 52.640873015872955, 27, 406, 47.0, 57.10000000000002, 86.09999999999991, 202.90999999999997, 0.29768997892248633, 1.3997207504460183, 0.20669685059949977], "isController": true}, {"data": ["05 - 07 ClickProceedToCheckout", 1178, 0, 0.0, 48.794567062818274, 30, 446, 46.0, 53.0, 58.0, 117.0, 0.3560367727351996, 1.9366453360693965, 0.23990759100321069], "isController": true}, {"data": ["04 - 08 EnterPaymentDetailsAndClickContinue", 990, 0, 0.0, 80.06666666666665, 30, 1381, 53.0, 127.0, 135.0, 320.0, 0.2970963780650443, 1.3647864867362973, 0.38297579984947117], "isController": true}, {"data": ["04 - 10 ClickSignOut ", 1473, 0, 0.0, 88.95994568906987, 25, 547, 89.0, 152.0, 165.0, 255.53999999999974, 0.4456098804991072, 2.9739237532528313, 0.5848629681550783], "isController": true}, {"data": ["07 - 04 ClickSignOut ", 6813, 0, 0.0, 75.23645970937896, 25, 784, 74.0, 109.0, 126.0, 285.0199999999977, 2.0635268226684462, 13.771623345816565, 2.708378954752336], "isController": true}, {"data": ["02 - 10 ClickSignOut ", 1803, 0, 0.0, 90.20188574597898, 25, 878, 93.0, 149.0, 166.0, 315.3600000000006, 0.5348857975805836, 3.5697358795563563, 0.7020376093245161], "isController": true}, {"data": ["Search", 7042713, 0, 0.0, 31.468000044868393, 24, 1120, 30.0, 34.0, 37.0, 47.0, 2108.7886442358827, 8089.185334907728, 642.5204551973069], "isController": false}, {"data": ["03 - 10 ClickSignOut -0", 496, 0, 0.0, 71.25000000000011, 28, 1094, 50.5, 97.0, 110.29999999999995, 235.2099999999998, 0.14915552711442995, 0.033501729722967666, 0.09875727283553078], "isController": false}, {"data": ["03 - 10 ClickSignOut -1", 496, 0, 0.0, 31.395161290322587, 25, 268, 29.0, 34.0, 39.0, 62.20999999999981, 0.149157949246602, 0.7353020779266083, 0.09744791801364916], "isController": false}, {"data": ["05 - 02 ClickSignIn", 1212, 0, 0.0, 70.68811881188121, 30, 497, 50.0, 98.0, 121.34999999999991, 218.4399999999987, 0.35556494340884687, 1.4219136882235248, 0.24375643581348683], "isController": true}, {"data": ["01 - 04 ClickOnFish", 1238, 0, 0.0, 51.762520193861164, 29, 294, 45.0, 81.0, 90.0, 136.8299999999997, 0.3559400295677485, 1.4129845900321265, 0.23497603514433396], "isController": true}, {"data": ["02 - 07 ClickProceedToCheckout", 1216, 0, 0.0, 48.52960526315792, 28, 228, 46.0, 52.0, 60.0, 150.76999999999862, 0.35691915370241983, 1.9414450059789827, 0.24050216411588834], "isController": true}, {"data": ["04 - 06 ClickOnAddToCart", 996, 0, 0.0, 53.27911646586351, 30, 409, 48.0, 61.0, 91.0, 183.0, 0.2967718021497482, 1.3947283040742955, 0.20605932746920994], "isController": true}, {"data": ["02 - 10 ClickSignOut -0", 601, 0, 0.0, 71.65224625623951, 30, 606, 53.0, 97.0, 123.79999999999995, 251.94000000000005, 0.17906089858181384, 0.0402187565173996, 0.11855789964694315], "isController": false}, {"data": ["02 - 10 ClickSignOut -1", 601, 0, 0.0, 31.891846921797033, 25, 207, 29.0, 35.0, 41.0, 118.30000000000064, 0.1790636194269428, 0.882727686393757, 0.11698589980139133], "isController": false}, {"data": ["05 - 01 ClickEnterTheStoreUrl", 1830, 0, 0.0, 74.31584699453536, 25, 688, 58.0, 109.0, 133.44999999999982, 176.83000000000038, 0.5354041086852787, 7.528068852968377, 0.4090102020082628], "isController": true}, {"data": ["01 -01 ClickEnterTheStoreUrl", 634, 0, 0.0, 115.33911671924292, 81, 785, 102.0, 145.5, 167.0, 419.6499999999968, 0.17963713864672035, 3.78846605963103, 0.20586207568872], "isController": true}, {"data": ["03 - 03 EnterTheCredentialsAndClickLogin-1", 510, 0, 0.0, 32.36862745098043, 25, 387, 29.0, 35.0, 40.89999999999998, 101.01999999999975, 0.14914382670306164, 0.7492146919536613, 0.11506213192911983], "isController": false}, {"data": ["02 - 02 ClickSignIn", 1244, 0, 0.0, 69.7331189710611, 29, 537, 51.5, 97.0, 122.5, 188.64999999999895, 0.3557191431515057, 1.422501266034169, 0.24386214696519243], "isController": true}, {"data": ["03 - 03 EnterTheCredentialsAndClickLogin-0", 510, 0, 0.0, 76.26470588235293, 28, 1107, 59.5, 94.0, 124.34999999999997, 449.0099999999999, 0.1491430416290397, 0.033498925365897596, 0.15249293416562948], "isController": false}, {"data": ["05 - 05 ClickOnProduct", 1188, 0, 0.0, 71.10942760942739, 33, 422, 50.0, 104.0, 122.0, 304.0, 0.3566602549880648, 1.3811478626578815, 0.24659712942534168], "isController": true}, {"data": ["01 - 06 ClickOnAddToCart", 1232, 0, 0.0, 52.456168831168796, 30, 325, 47.5, 56.0, 89.0, 186.34000000000015, 0.35729304119600364, 1.677682348686977, 0.24781970948189608], "isController": true}, {"data": ["07 - 02 ClickSignIn", 4604, 0, 0.0, 48.0842745438749, 27, 492, 45.0, 50.5, 57.0, 188.94999999999618, 1.3746295456974753, 5.497116289807976, 0.9423729893355738], "isController": true}, {"data": ["06 - 04 ClickOnBirds", 1686, 0, 0.0, 66.04151838671417, 28, 588, 47.0, 99.0, 122.0, 182.90999999999917, 0.5066163616050905, 1.8137261539494742, 0.33494070000649045], "isController": true}, {"data": ["04 - 05 ClickOnProduct", 1002, 0, 0.0, 70.95209580838316, 30, 689, 51.0, 99.0, 114.69999999999982, 194.3400000000006, 0.2976516709041927, 1.2355372191209413, 0.20608890104596936], "isController": true}, {"data": ["01 - 03 EnterTheCredentialsAndClickLogin", 1875, 0, 0.0, 89.4613333333334, 25, 863, 91.0, 149.0, 160.0, 305.48, 0.5348461539997508, 3.6624426092248554, 0.8840979069045358], "isController": true}, {"data": ["05 - 03 EnterTheCredentialsAndClickLogin", 1803, 0, 0.0, 91.84914032168604, 25, 743, 95.0, 151.0, 165.0, 369.84000000000106, 0.533349267746657, 3.6521924467183196, 0.8816235617244546], "isController": true}, {"data": ["03 - 03 EnterTheCredentialsAndClickLogin", 1530, 0, 0.0, 94.34771241830077, 25, 1168, 95.0, 151.0, 163.0, 438.7600000000002, 0.44351978460592106, 3.037071025055389, 0.7331358939547094], "isController": true}, {"data": ["02 - 01 ClickEnterTheStoreUrl", 1256, 0, 0.0, 56.50318471337585, 26, 485, 52.0, 64.0, 90.44999999999959, 205.0, 0.35918923896494015, 3.7876241388824066, 0.20580914686407203], "isController": false}, {"data": ["01 - 08 EnterPaymentDetailsAndClickContinue", 1226, 0, 0.0, 81.67210440456779, 28, 1135, 58.0, 129.0, 146.0, 275.87000000000035, 0.35817769937730837, 1.6453788065145103, 0.46171344060356156], "isController": true}, {"data": ["02 - 09 ClickOnConfirm", 1210, 2, 0.1652892561983471, 52.89586776859504, 32, 375, 49.0, 56.0, 67.45000000000005, 131.8900000000001, 0.357954805987016, 1.8975371932793246, 0.23316001522787078], "isController": true}, {"data": ["01 - 10 ClickSignOut ", 1824, 0, 0.0, 91.14254385964907, 25, 1148, 91.5, 149.0, 159.75, 418.5, 0.5381237360066439, 3.5913453240912157, 0.7062874035087202], "isController": true}, {"data": ["05 - 04 ClickOnBirds", 1194, 0, 0.0, 52.492462311557745, 28, 364, 45.0, 81.0, 91.0, 168.0, 0.35576744012812395, 1.3212730222727103, 0.23520952828783195], "isController": true}, {"data": ["07 - 03 EnterTheCredentialsAndClickLogin", 6846, 0, 0.0, 90.94157172071284, 24, 1504, 92.0, 135.0, 157.0, 385.0599999999995, 2.056186821662586, 12.246087132943922, 2.3413221035728276], "isController": true}, {"data": ["06 - 06 ClickOnAddToCart", 1674, 0, 0.0, 51.42174432497018, 31, 281, 48.0, 57.0, 68.0, 130.75, 0.5077771192111438, 2.5123316386322534, 0.3525679021085187], "isController": true}, {"data": ["03 - 08 EnterPaymentDetailsAndClickContinue", 998, 0, 0.0, 77.28056112224453, 30, 362, 58.0, 127.0, 135.0, 220.0, 0.2967043225479231, 1.3629854817045217, 0.38247041578443214], "isController": true}, {"data": ["01 - 10 ClickSignOut -1", 608, 0, 0.0, 32.218749999999986, 25, 403, 29.0, 34.0, 40.0, 76.65999999999917, 0.18018247624658565, 0.8882433008718402, 0.11771687168844316], "isController": false}, {"data": ["04 - 04 ClickOnCats", 1006, 0, 0.0, 53.33797216699799, 29, 501, 45.0, 82.0, 91.0, 179.8799999999992, 0.2968874041239608, 1.101440672135671, 0.19599207537870852], "isController": true}, {"data": ["02 - 03 EnterTheCredentialsAndClickLogin-1", 616, 0, 0.0, 31.90584415584416, 25, 291, 30.0, 34.0, 39.0, 70.47000000000037, 0.17892174090853905, 0.898802182845239, 0.13803532745873617], "isController": false}, {"data": ["02 - 03 EnterTheCredentialsAndClickLogin-0", 616, 0, 0.0, 69.76136363636358, 28, 424, 54.0, 94.0, 107.14999999999998, 233.65000000000225, 0.1789207015318052, 0.040187266945620304, 0.18293942822636722], "isController": false}, {"data": ["01 - 10 ClickSignOut -0", 608, 0, 0.0, 72.5148026315789, 29, 1088, 52.0, 94.0, 116.09999999999991, 295.00999999999965, 0.18017921905347825, 0.04046994177958984, 0.11929835011548658], "isController": false}, {"data": ["05 - 06 ClickOnAddToCart", 1182, 0, 0.0, 53.47546531302876, 31, 425, 48.0, 58.700000000000045, 86.0, 205.0, 0.355539940941868, 1.672293307441884, 0.24686415821256655], "isController": true}, {"data": ["05 - 10 ClickSignOut ", 1752, 0, 0.0, 91.10388127853898, 25, 952, 91.5, 149.70000000000005, 164.0, 410.82000000000016, 0.5354233588219708, 3.5733234708880355, 0.7027431584538366], "isController": true}, {"data": ["01 - 01 ClickEnterTheStoreUrl", 1268, 0, 0.0, 57.66955835962144, 26, 742, 53.0, 69.0, 96.0, 211.6199999999999, 0.3593284412145188, 3.7890372059379875, 0.20589311130113452], "isController": false}, {"data": ["01 - 07 ClickProceedToCheckout", 1228, 0, 0.0, 48.16612377850167, 29, 269, 45.0, 52.0, 58.0, 149.71000000000004, 0.35859165754613515, 1.9505425122382545, 0.24162914424495432], "isController": true}, {"data": ["03 - 09 ClickOnConfirm", 994, 0, 0.0, 53.5573440643863, 31, 281, 49.0, 62.0, 89.0, 131.0, 0.29735355337496283, 1.5700473049043593, 0.19368634775498067], "isController": true}, {"data": ["03 - 10 ClickSignOut ", 1488, 0, 0.0, 89.9731182795698, 25, 1150, 89.0, 150.0, 160.54999999999995, 309.9899999999991, 0.4454402988760715, 2.972791994647532, 0.5846403922748439], "isController": true}, {"data": ["07 - 04 ClickSignOut -0", 2271, 0, 0.0, 48.291061206516936, 26, 474, 44.0, 54.0, 75.20000000000027, 165.1200000000008, 0.6906751554931485, 0.1551321150033439, 0.45730249553159635], "isController": false}, {"data": ["07 - 04 ClickSignOut -1", 2271, 0, 0.0, 32.34346103038314, 25, 390, 29.0, 35.0, 41.0, 93.0, 0.6906879690124105, 3.4048758472408673, 0.45124047975517834], "isController": false}, {"data": ["05 - 08 EnterPaymentDetailsAndClickContinue", 1174, 0, 0.0, 78.87052810902907, 30, 433, 61.0, 129.0, 138.25, 264.0, 0.35552120802109144, 1.6331755493468887, 0.45828905721468816], "isController": true}, {"data": ["05 - 10 ClickSignOut -1", 584, 0, 0.0, 32.417808219178056, 25, 590, 29.0, 34.0, 39.0, 63.14999999999998, 0.17928177999792475, 0.8838031498335197, 0.11712842853380045], "isController": false}, {"data": ["05 - 10 ClickSignOut -0", 584, 0, 0.0, 71.53595890410958, 29, 721, 54.0, 99.0, 116.75, 273.9999999999991, 0.17928128466092044, 0.04026825729688643, 0.11870381933603913], "isController": false}, {"data": ["04 - 01 ClickEnterTheStoreUrl", 1536, 0, 0.0, 76.33072916666666, 25, 750, 58.0, 112.0, 144.0, 239.0, 0.4460624533899585, 6.271806597767539, 0.34076502887063725], "isController": true}, {"data": ["03 - 05 ClickOnProduct", 1010, 0, 0.0, 73.73069306930681, 32, 657, 50.0, 99.0, 126.0, 297.02999999999963, 0.29740784037738405, 1.1971033654200076, 0.20562963963592568], "isController": true}, {"data": ["02 -01 ClickEnterTheStoreUrl", 628, 0, 0.0, 113.00636942675149, 82, 602, 102.0, 141.0, 158.54999999999995, 392.8200000000015, 0.17960237521281308, 3.7877877060958705, 0.20581803465954054], "isController": true}, {"data": ["04 - 07 ClickProceedToCheckout", 994, 0, 0.0, 48.01810865191147, 28, 272, 46.0, 52.0, 61.0, 108.0, 0.29763196938642605, 1.6189551459788991, 0.20055279187171282], "isController": true}, {"data": ["01 - 09 ClickOnConfirm", 1222, 0, 0.0, 53.54173486088377, 32, 328, 49.0, 60.0, 86.0, 158.6199999999999, 0.35908942913596387, 1.894235995732654, 0.23389907151727332], "isController": true}, {"data": ["01 - 02 ClickSignIn", 1262, 0, 0.0, 71.54992076069733, 29, 1087, 50.0, 97.0, 119.0, 226.13999999998668, 0.3577641047506084, 1.430744690980546, 0.24526406399895223], "isController": true}, {"data": ["06 - 02 ClickSignIn", 1710, 0, 0.0, 65.5426900584795, 29, 695, 47.0, 96.0, 118.0, 226.0, 0.5062808431618926, 2.0245618792508346, 0.3470792499020006], "isController": true}, {"data": ["05 - 03 EnterTheCredentialsAndClickLogin-1", 601, 0, 0.0, 31.316139767054928, 25, 122, 30.0, 37.0, 41.89999999999998, 57.86000000000013, 0.1793130609127363, 0.9007679544288238, 0.1383372247275993], "isController": false}, {"data": ["03 - 04 ClickOnReptiles", 1012, 0, 0.0, 52.72529644268776, 27, 327, 45.0, 81.0, 93.34999999999991, 177.61, 0.29656894348779145, 1.1019969042686, 0.1969403140348615], "isController": true}, {"data": ["01 - 03 EnterTheCredentialsAndClickLogin-0", 625, 0, 0.0, 70.31999999999995, 28, 478, 53.0, 96.0, 114.0, 224.62000000000012, 0.17974950683925303, 0.040373424387722845, 0.1837868492780253], "isController": false}, {"data": ["01 - 03 EnterTheCredentialsAndClickLogin-1", 625, 0, 0.0, 31.841600000000003, 25, 285, 30.0, 36.0, 42.0, 66.70000000000005, 0.17975059245795275, 0.902965866800497, 0.1386747734783034], "isController": false}, {"data": ["03 - 07 ClickProceedToCheckout", 1004, 0, 0.0, 50.09960159362555, 32, 352, 46.0, 53.0, 59.5, 203.95000000000005, 0.29798147231933164, 1.6208562507994897, 0.20078829677767465], "isController": true}, {"data": ["05 - 03 EnterTheCredentialsAndClickLogin-0", 601, 0, 0.0, 74.00332778702169, 28, 537, 59.0, 100.80000000000007, 124.0, 341.2600000000007, 0.1793122584244688, 0.04027521429455842, 0.18333977985392463], "isController": false}, {"data": ["04 - 09 ClickOnConfirm", 986, 2, 0.2028397565922921, 53.154158215010135, 28, 240, 49.0, 60.0, 86.0, 135.0, 0.29723030193594596, 1.5743122715192779, 0.19360606581179293], "isController": true}, {"data": ["03 - 01 ClickEnterTheStoreUrl", 1551, 0, 0.0, 76.59574468085114, 25, 556, 58.0, 112.79999999999995, 141.0, 318.9200000000001, 0.4463025516938347, 6.275087658094262, 0.34095572177280237], "isController": true}, {"data": ["06 - 01 ClickEnterTheStoreUrl", 2586, 0, 0.0, 85.84222737819033, 26, 880, 62.0, 143.0, 158.0, 314.2600000000002, 0.7608193901264708, 10.692607581215116, 0.5815886948152188], "isController": true}, {"data": ["02 - 03 EnterTheCredentialsAndClickLogin", 1848, 0, 0.0, 89.05194805194789, 25, 660, 92.5, 149.0, 159.0, 278.4199999999996, 0.5323583416922427, 3.6454069257285213, 0.8799855661175809], "isController": true}, {"data": ["02 - 05 ClickOnProduct", 1224, 0, 0.0, 69.06535947712422, 29, 534, 50.0, 99.0, 117.0, 151.25, 0.3577700403835856, 1.498953868819698, 0.24736444198396348], "isController": true}, {"data": ["04 - 03 EnterTheCredentialsAndClickLogin", 1518, 0, 0.0, 89.00263504611347, 25, 462, 89.0, 150.0, 162.04999999999995, 294.0499999999997, 0.4442765155960666, 3.042252858749628, 0.7343867663401127], "isController": true}, {"data": ["03 - 02 ClickSignIn", 1026, 0, 0.0, 70.2475633528265, 30, 770, 48.0, 96.0, 118.0, 294.57000000000016, 0.29714557787429696, 1.1882615848763327, 0.20370722233179345], "isController": true}, {"data": ["04 - 10 ClickSignOut -1", 491, 0, 0.0, 31.61710794297351, 25, 177, 30.0, 34.0, 40.0, 89.0399999999998, 0.14917238190317225, 0.7353732264132944, 0.09745734716134982], "isController": false}, {"data": ["04 - 10 ClickSignOut -0", 491, 0, 0.0, 69.88391038696538, 28, 453, 49.0, 102.80000000000001, 122.0, 203.87999999999982, 0.1491680312554115, 0.03350453827025845, 0.09876555194450098], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 4, 100.0, 5.619385531430909E-5], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7118216, 4, "500", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["05 - 09 ClickOnConfirm", 586, 2, "500", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["02 - 09 ClickOnConfirm", 605, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["04 - 09 ClickOnConfirm", 493, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
