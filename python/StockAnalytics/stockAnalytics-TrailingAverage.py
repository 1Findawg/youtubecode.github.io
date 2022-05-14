# python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import sys
import csv
import datetime

def readFile(filename):
    tempXYArray = [[],[]]
    with open(filename) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            tempXYArray[0].append(row['Date'])
            tempXYArray[1].append(row['Close'])
#            print(row['Date'] + " - " + row['Close'])
    return tempXYArray
    
def createGraph(XYActualPrice, trailingSize):
    XYActualPrice[0] = [datetime.datetime.strptime(d,"%Y-%m-%d").date() for d in XYActualPrice[0]]
    ax = plt.gca()
    formatter = mdates.DateFormatter("%Y-%m-%d")
    ax.xaxis.set_major_formatter(formatter)

    locator = mdates.DayLocator()
    ax.xaxis.set_major_locator(locator)

    plt.plot(XYActualPrice[0], XYActualPrice[1])
    
    XYRollingAverage = (getRollingAverage(XYActualPrice, trailingSize))
    plt.plot(XYRollingAverage[0], XYRollingAverage[1])
        
    plt.show()
    
def getRollingAverage(XYActualPrice, trailingSize):
    tempXYArray = [[],[]]
    for i in range(trailingSize,len(XYActualPrice[1])):
        tempXYArray[0].append(XYActualPrice[0][i])
        tempXYArray[1].append(getAverage(XYActualPrice[1], i, trailingSize))
    return tempXYArray
        
        
def getAverage(priceArray, index, trailingSize):
    sum = 0
    for i in range(index-trailingSize, index):
        sum += float(priceArray[i])
    return (sum / trailingSize)

if len(sys.argv) == 3:
    XYActualPrice = readFile(sys.argv[1])
    createGraph(XYActualPrice, int(sys.argv[2]))
    
    
else:
    print("You need to have 2 parameters: the .csv file from Yahoo Finance and the number of trailing days")
