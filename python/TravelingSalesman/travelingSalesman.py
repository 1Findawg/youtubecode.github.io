#!/usr/bin/python
import matplotlib.pyplot as plt
import random
import math
import sys

# Parameters:
# numOfStops - number of points (or stop for the salesman) along the path
# min - minimum x and y value
# max - maximum x and y value
# Returns: 2d array with index 0 holding an array of x values and index 1 holding an array of y values
# Note: The last point will be the first point to create a loop so the size of the nested loop will be numOfStops+1
def getRandomOriginalPath(numOfStops, min, max):
    tempX = []
    tempY = []
    for i in range(numOfStops):
        tempX.append(random.randrange(min, max))
        tempY.append(random.randrange(min, max))
    tempX.append(tempX[0])
    tempY.append(tempY[0])
    return [tempX, tempY]
    
# Parameters:
# xyList - 2d array with index 0 holding an array of x values and index 1 holding an array of y values
# Returns: 2d array with index 0 holding an array of x values and index 1 holding an array of y values. This 2d array is will be in nearest neighbor order. It will start with the first data point from the input and find the next closest data point so so forth until all data points have been visited.
def nearestNeighbor(xyList):
    resultX = [xyList[0][0]]
    resultY = [xyList[1][0]]
    xyList[0].pop(0)
    xyList[1].pop(0)
    
    tempLastX = xyList[0][len(xyList[0])-1]
    tempLastY = xyList[1][len(xyList[1])-1]
    xyList[0].pop(len(xyList[0])-1)
    xyList[1].pop(len(xyList[0])-1)
    
    while len(xyList[0]) > 1:
        smallestDistance = None
        smallestDistanceIndex = None
        for i in range(len(xyList[0])):
            tempDistance = getDistanceBetweenPoints(resultX[len(resultX)-1], resultY[len(resultY)-1], xyList[0][i], xyList[1][i])
            if (smallestDistance == None or tempDistance < smallestDistance):
                smallestDistance = tempDistance
                smallestDistanceIndex = i
        resultX.append(xyList[0][smallestDistanceIndex])
        resultY.append(xyList[1][smallestDistanceIndex])
        xyList[0].pop(smallestDistanceIndex)
        xyList[1].pop(smallestDistanceIndex)
    
    resultX.append(xyList[0][0])
    resultY.append(xyList[1][0])
    resultX.append(tempLastX)
    resultY.append(tempLastY)
    return [resultX, resultY]
    
# Parameters:
# x1 - x value for data point 1
# y1 - y value for data point 1
# x2 - x value for data point 2
# y2 - y value for data point 2
# Returns: Distance between the two data points
def getDistanceBetweenPoints(x1, y1, x2, y2):
    return math.sqrt(((x2 - x1)**2) + ((y2 - y1)**2))
            
# Parameters:
# numOfStops - the number of data points to create
# min - x and y axis minumum
# max - x and y axis maximum
# Returns: nothing
# Displays the original random graph and when that is closed it will display the nearest neighbor graph
def displayGraphs(numOfStops, min, max):
    plt.title('Random Points')
    xyRandom = getRandomOriginalPath(numOfStops, min, max)
    plt.plot(xyRandom[0],xyRandom[1])
    plt.show()

    plt.title('Nearest Neighbor')
    xyNearestNeighbor = nearestNeighbor(xyRandom)
    plt.plot(xyNearestNeighbor[0],xyNearestNeighbor[1])
    plt.show()
    
# python travelingSalesman.py
if len(sys.argv) == 1:
    displayGraphs(10, 0, 10)

# python travelingSalesman.py 100
elif len(sys.argv) == 2:
    displayGraphs(int(sys.argv[1]), 0, 10)
    
# python travelingSalesman.py 20 5 10
elif len(sys.argv) == 4:
    displayGraphs(int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]))
