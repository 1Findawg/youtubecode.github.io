#!/usr/bin/python
import os
import sys
import math
import json

def getDividendArray(dividendList):
    # smallest, average, largest, last
    dividendArray = [1000.00,0.00,0.00,dividendList[len(dividendList)-1]]
    allDividends = 0
    for dividend in dividendList:
        if dividend < dividendArray[0]:
            dividendArray[0] = dividend
        if dividend > dividendArray[2]:
            dividendArray[2] = dividend
    
        allDividends += dividend

    dividendArray[1] = allDividends / len(dividendList)
    return dividendArray

def printDividendEstimates(shares, dividendList):
    dividendArray = getDividendArray(dividendList)
    print("Smallest: $" + str(round(dividendArray[0], 4)) + " per share for a total of $" + str(round(float(shares) * dividendArray[0],2)))
    print("Average: $" + str(round(dividendArray[1], 4)) + " per share for a total of $" + str(round(float(shares) * dividendArray[1],2)))
    print("Largest: $" + str(round(dividendArray[2], 4)) + " per share for a total of $" + str(round(float(shares) * dividendArray[2],2)))
    print("Last: $" + str(round(dividendArray[3], 4)) + " per share for a total of $" + str(round(float(shares) * dividendArray[3],2)))

def printSharesEstimates(totalDividend, dividendList, shares):
    dividendArray = getDividendArray(dividendList)
    sharesArray = [float(totalDividend) / dividendArray[0],
                   float(totalDividend) / dividendArray[1],
                   float(totalDividend) / dividendArray[2],
                   float(totalDividend) / dividendArray[3]]
    print("Smallest: $" + str(round(dividendArray[0], 4)) + " per share for a total share count of " + str(round(sharesArray[0],4)) + ". You would need " + str(round(sharesArray[0] - float(shares),4)) + " more shares.")
          
    print("Average: $" + str(round(dividendArray[1], 4)) + " per share for a total share count of " + str(round(sharesArray[1],4)) + ". You would need " + str(round(sharesArray[1] - float(shares),4)) + " more shares.")
    print("Largest: $" + str(round(dividendArray[2], 4)) + " per share for a total share count of " + str(round(sharesArray[2],4)) + ". You would need " + str(round(sharesArray[2] - float(shares),4)) + " more shares.")
    print("Last: $" + str(round(dividendArray[3], 4)) + " per share for a total share count of " + str(round(sharesArray[3],4)) + ". You would need " + str(round(sharesArray[3] - float(shares),4)) + " more shares.")

jsonInputFile = open(sys.argv[1],)
securities = json.load(jsonInputFile)
for security in securities:
    if len(security['dividendList']) > 0:
        print(security['ticker'])

ticker = raw_input("Please select a ticker: ")

selectedSecurity = 0
for security in securities:
    if security['ticker'] == ticker:
        selectedSecurity = security

if (selectedSecurity != 0):
    shares = raw_input("Enter Shares Qty: ")
    print(selectedSecurity['ticker'] + " | " + selectedSecurity['name'])
    printDividendEstimates(shares, selectedSecurity['dividendList'])

    totalDividend = raw_input("\nEnter Desired Total Dividend Amount (no commas): $")
    printSharesEstimates(totalDividend, selectedSecurity['dividendList'], shares)
