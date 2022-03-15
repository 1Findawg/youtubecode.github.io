#!/usr/bin/python
import matplotlib.pyplot as plt
import random
import math
import sys
 
# Paramaters:
# xyList - list of data point x values on index 0 and a list of data point y values on index 1
# Returns: nothing
def createChart(xyList):
    # plotting the points
    plt.scatter(xyList[0], xyList[1], label= "Dots", color= "green",
                marker= ".", s=30)
     
    # naming the x axis
    plt.xlabel('x - axis')
    # naming the y axis
    plt.ylabel('y - axis')
     
    # giving a title to my graph
    plt.title('Graph the Data')
     
    # function to show the plot
    plt.show()

# Paramaters:
# numOfDataPoints - Number of data points
# xMin - x minimum value
# xMax - x maximum value
# yMin - y minimum value
# yMax - y maximum value
# Returns: 2d array, index 0 will be the x points, index 1 will be the y points
def generateRandomData(numOfDataPoints, xMin, xMax, yMin, yMax):
    tempX = []
    tempY = []
    for x in range(numOfDataPoints):
        tempX.append(round(random.uniform(xMin, xMax),5))
        tempY.append(round(random.uniform(yMin, yMax),5))
        
    return [tempX, tempY]
    
# Paramaters:
# data - 2d array with index 0 x axis values and index 1 y axis values
# xMin - x minimum value
# xMax - x maximum value
# yMin - y minimum value
# yMax - y maximum value
# precision - how many decimals to be used for rounding on stats
# Returns: array of data statistics (dataSize, xMean, yMean, xStandardDeviation, yStandardDeviation, xMin, xMax, yMin, yMax, xMiddle, yMiddle)
def calculateDataStatistics(data, xMin, xMax, yMin, yMax, precision):
    dataSize = len(data[0])
    xMean = 0
    yMean = 0
    xStandardDeviation = 0
    yStandardDeviation = 0

    if (dataSize <= 10):
        print('X: ' + str(data[0]))
        print('Y: ' + str(data[1]))
        
    for i in range(dataSize):
        xMean += data[0][i]
        yMean += data[1][i]
        
    xMean = round(xMean/dataSize,precision)
    yMean = round(yMean/dataSize,precision)
    
    # Standard Deviation
    for i in range(dataSize):
        xStandardDeviation += ((data[0][i] - xMean)**2)
        yStandardDeviation += ((data[1][i] - yMean)**2)
    
    xStandardDeviation = round(math.sqrt(xStandardDeviation / dataSize),precision)
    yStandardDeviation = round(math.sqrt(yStandardDeviation / dataSize),precision)
    
    xMiddle = ((abs(xMax)+abs(xMin)) / 2) + xMin
    yMiddle = ((abs(yMax)+abs(yMin)) / 2) + yMin

    return [dataSize, xMean, yMean, xStandardDeviation, yStandardDeviation, xMin, xMax, yMin, yMax, xMiddle, yMiddle]
    
# Paramaters:
# dataStatistics - array of data statistics (dataSize, xMean, yMean, xStandardDeviation, yStandardDeviation, xMin, xMax, yMin, yMax, xMiddle, yMiddle)
# dataPoints - original 2d array with index 0 x axis values and index 1 y axis values
# precision - how many decimals to be used for rounding on stats
# Returns: 2d array with index 0 x axis values and index 1 y axis values that is in the X formation
def createXChart(dataStatistics, dataPoints, precision):
    tempDataPoints = dataPoints
    yMeanStep = .1
    yStandardDeviationStep = .1
    for i in range(dataStatistics[0]):
    
        if (tempDataPoints[0][i] < dataStatistics[9] and tempDataPoints[1][i] < dataStatistics[10]) or (tempDataPoints[0][i] > dataStatistics[9] and tempDataPoints[1][i] > dataStatistics[10]):
            tempDataPoints[1][i] = ((1 * tempDataPoints[0][i]) + 0)
            
        if (tempDataPoints[0][i] < dataStatistics[9] and tempDataPoints[1][i] > dataStatistics[10]) or (tempDataPoints[0][i] > dataStatistics[9] and tempDataPoints[1][i] < dataStatistics[10]):
            tempDataPoints[1][i] = ((-1 * tempDataPoints[0][i]) + dataStatistics[8])
            
        # Change Y to get the mean the same
        while dataStatistics[2] != calculateDataStatistics(tempDataPoints, dataStatistics[5], dataStatistics[5], dataStatistics[5], dataStatistics[5], precision)[2]:
            yMean = calculateDataStatistics(tempDataPoints, dataStatistics[5], dataStatistics[5], dataStatistics[5], dataStatistics[5], precision)[2]
            tempIndex = random.randrange(dataStatistics[0]-1)
            if yMean < dataStatistics[2] and (tempDataPoints[1][tempIndex] + yMeanStep) < dataStatistics[8]:
                tempDataPoints[1][tempIndex] += yMeanStep
            elif (tempDataPoints[1][tempIndex] - yMeanStep) > dataStatistics[7]:
                tempDataPoints[1][tempIndex] -= yMeanStep

        # Change Y to get the standard deviation the same
        while dataStatistics[4] != calculateDataStatistics(tempDataPoints, dataStatistics[5], dataStatistics[5], dataStatistics[5], dataStatistics[5], precision)[4]:
            yStandardDeviation = calculateDataStatistics(tempDataPoints, dataStatistics[5], dataStatistics[5], dataStatistics[5], dataStatistics[5], precision)[4]
            tempIndexFirstPoint = random.randrange(dataStatistics[0]-1)
            tempIndexSecondPoint = random.randrange(dataStatistics[0]-1)
            if (tempIndexFirstPoint == tempIndexSecondPoint):
                tempIndexSecondPoint += 1

            if (yStandardDeviation < dataStatistics[4]):
                if (tempDataPoints[1][tempIndexFirstPoint] < tempDataPoints[1][tempIndexSecondPoint]):
                    if (tempDataPoints[1][tempIndexFirstPoint] - yStandardDeviationStep) > dataStatistics[7] and (tempDataPoints[1][tempIndexSecondPoint] + yStandardDeviationStep) < dataStatistics[8]:
                        tempDataPoints[1][tempIndexFirstPoint] -= yStandardDeviationStep
                        tempDataPoints[1][tempIndexSecondPoint] += yStandardDeviationStep

                else:
                    if (tempDataPoints[1][tempIndexSecondPoint] - yStandardDeviationStep) > dataStatistics[7] and (tempDataPoints[1][tempIndexFirstPoint] + yStandardDeviationStep) < dataStatistics[8]:
                        tempDataPoints[1][tempIndexSecondPoint] -= yStandardDeviationStep
                        tempDataPoints[1][tempIndexFirstPoint] += yStandardDeviationStep

            elif (yStandardDeviation > dataStatistics[4]):
                if (tempDataPoints[1][tempIndexFirstPoint] < tempDataPoints[1][tempIndexSecondPoint]):
                    if (tempDataPoints[1][tempIndexFirstPoint] + yStandardDeviationStep) < dataStatistics[8] and (tempDataPoints[1][tempIndexSecondPoint] - yStandardDeviationStep) > dataStatistics[7]:
                        tempDataPoints[1][tempIndexFirstPoint] += yStandardDeviationStep
                        tempDataPoints[1][tempIndexSecondPoint] -= yStandardDeviationStep

                else:
                    if (tempDataPoints[1][tempIndexSecondPoint] - yStandardDeviationStep) < dataStatistics[8] and (tempDataPoints[1][tempIndexFirstPoint] + yStandardDeviationStep) > dataStatistics[7]:
                        tempDataPoints[1][tempIndexSecondPoint] += yStandardDeviationStep
                        tempDataPoints[1][tempIndexFirstPoint] -= yStandardDeviationStep
        
    return tempDataPoints

# Paramaters:
# numOfDataPoints - Number of data points
# xMin - x minimum value
# xMax - x maximum value
# yMin - y minimum value
# yMax - y minimum value
# precision - how many decimals to be used for rounding on stats
def displayRandomAndCreatedData(numOfDataPoints, xMin, xMax, yMin, yMax, precision):
    dataPoints = generateRandomData(numOfDataPoints, xMin, xMax, yMin, yMax)
    dataStatistics = calculateDataStatistics(dataPoints, xMin, xMax, yMin, yMax, precision)
    print("Number of Data Points: " + str(dataStatistics[0]))
    print("xMean: " + str(dataStatistics[1]))
    print("yMean: " + str(dataStatistics[2]))
    print("xStandardDeviation: " + str(dataStatistics[3]))
    print("yStandardDeviation: " + str(dataStatistics[4]))
    createChart(dataPoints)
    newDataPoints = createXChart(dataStatistics, dataPoints, precision)
    newDataStatistics = calculateDataStatistics(newDataPoints, xMin, xMax, yMin, yMax, precision)
    print("New Number of Data Points: " + str(newDataStatistics[0]))
    print("New xMean: " + str(newDataStatistics[1]))
    print("New yMean: " + str(newDataStatistics[2]))
    print("New xStandardDeviation: " + str(newDataStatistics[3]))
    print("New yStandardDeviation: " + str(newDataStatistics[4]))
    createChart(newDataPoints)
    

if len(sys.argv) == 1:
    displayRandomAndCreatedData(100, 0, 10, 0, 10, 2)

elif len(sys.argv) == 2:
    displayRandomAndCreatedData(int(sys.argv[1]), 0, 10, 0, 10, 2)
    
elif len(sys.argv) == 3:
    displayRandomAndCreatedData(int(sys.argv[1]), 0, int(sys.argv[2]), 0, int(sys.argv[2]), 2)

elif len(sys.argv) == 4:
    displayRandomAndCreatedData(int(sys.argv[1]), 0, int(sys.argv[2]), 0, int(sys.argv[2]), int(sys.argv[3]))
