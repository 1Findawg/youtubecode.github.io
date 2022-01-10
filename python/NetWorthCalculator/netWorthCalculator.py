#!/usr/bin/python
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
import os
import sys
import math
import datetime
import json

now = datetime.datetime.now()
tickerDictionary = {}
totalNetWorth = 0

accountsTotalLog_file = ("./" + now.strftime("%B-%Y"))

accountsTotalLog_header_row = ("Time(H:M:S),Date,")
accountsTotalLog_data_row = (now.strftime("%H:%M:%S") + "," + now.strftime("%m-%d-%Y") + ",")

try:
    os.mkdir(accountsTotalLog_file)
except OSError as error:
    print("Directory already created")

def printAccountRow(accountObject,dailyOutputFile):
    global totalNetWorth
    global accountsTotalLog_header_row
    global accountsTotalLog_data_row
    if "Checking" in i['type']:
        totalNetWorth += i['balance']
        print(i['bankName'] + ',' + i['type'] + ',$' + str(i['balance']))
        dailyOutputFile.write(i['bankName'] + ',' + i['type'] + ',$' + str(i['balance']) + "\n")
        accountsTotalLog_header_row += (i['bankName'] + " (" + i['type'] + "),")
        accountsTotalLog_data_row += ("$" + str(i['balance']) + ",")
    
    if "Savings" in i['type']:
        totalNetWorth += i['balance']
        print(i['bankName'] + ',' + i['type'] + ',$' + str(i['balance']))
        dailyOutputFile.write(i['bankName'] + ',' + i['type'] + ',$' + str(i['balance']) + "\n")
        accountsTotalLog_header_row += (i['bankName'] + " (" + i['type'] + "),")
        accountsTotalLog_data_row += ("$" + str(i['balance']) + ",")

    if "Investment" in i['type']:
        securityAccountValue = getSecurityAccountValue(i['securities'],dailyOutputFile)
        totalNetWorth += securityAccountValue
        print(i['bankName'] + ',' + i['type'] + ',$' + str(securityAccountValue))
        dailyOutputFile.write(i['bankName'] + ',' + i['type'] + ',$' + str(securityAccountValue) + "\n")
        accountsTotalLog_header_row += (i['bankName'] + " (" + i['type'] + "),")
        accountsTotalLog_data_row += ("$" + str(securityAccountValue) + ",")

    if "Cash" in i['type']:
        totalNetWorth += i['balance']
        print(i['bankName'] + ',' + i['type'] + ',$' + str(i['balance']))
        dailyOutputFile.write(i['bankName'] + ',' + i['type'] + ',$' + str(i['balance']) + "\n")
        accountsTotalLog_header_row += (i['bankName'] + " (" + i['type'] + "),")
        accountsTotalLog_data_row += ("$" + str(i['balance']) + ",")


def getSecurityAccountValue(securityListObject,dailyOutputFile):
    totalAccountValue = 0;
    for i in securityListObject:
        if i['ticker'] not in tickerDictionary and i['search']:
            searchForPrice(i['ticker'])
        if i['search']:
            securityValue = round(i['shares'] * float(tickerDictionary[i['ticker']]),2)
            print(i['ticker'] + ',' + str(i['shares']) + ',$' + str(tickerDictionary[i['ticker']]) + ',$' + str(securityValue))
            dailyOutputFile.write(',,,' + i['ticker'] + ',' + str(i['shares']) + ',$' + str(tickerDictionary[i['ticker']]) + ',$' + str(securityValue) + "\n")
        else:
            securityValue = round(i['shares'] * i['price'],2)
            print(i['ticker'] + ',' + str(i['shares']) + ',$' + str(i['price']) + ',$' + str(securityValue))
            dailyOutputFile.write(',,,' + i['ticker'] + ',' + str(i['shares']) + ',$' + str(i['price']) + ',$' + str(securityValue) + "\n")
        totalAccountValue += securityValue

    return totalAccountValue


def searchForPrice(ticker):
    # Summary driver
    driverSummary = webdriver.Chrome()
    driverSummary.get('https://finance.yahoo.com/quote/' + ticker + '?p=' + ticker)
    
    # Summary data
    try:
        name = driverSummary.find_element_by_xpath('//*[@id="quote-header-info"]/div[2]/div[1]/div[1]/h1').text.replace(',', '')
    except NoSuchElementException:
        name = "ERROR"
        print(ticker + ' Name Error')
        
    try:
        price = driverSummary.find_element_by_xpath('//*[@id="quote-header-info"]/div[3]/div[1]/div[1]/fin-streamer[1]').text.replace(',', '')

    except NoSuchElementException:
        price = input("Enter price for " + ticker + " :")
        print(ticker + ' Price Error')
        
    driverSummary.quit()
    tickerDictionary[ticker] = price

# Opening JSON file
jsonInputFile = open(sys.argv[1],)

# returns JSON object as
# a dictionary
accounts = json.load(jsonInputFile)
dailyOutputFileName = "./" + now.strftime("%B-%Y") + "/" + now.strftime("%H-%M-%S_%m-%d-%Y") + "-net-worth.csv"
dailyOutputFile = open(str(dailyOutputFileName), "a")
dailyOutputFile.write('Bank Name,Account Type,Balance,Ticker,Shares,Price,Value' + "\n")

# Account Log file
monthlyOutputFileName = "./" + now.strftime("%B-%Y") + "/accountsLog.csv"
monthlyOutputFileName = open(str(monthlyOutputFileName), "a")

# Iterating through the json
# list
for i in accounts['accounts']:
    printAccountRow(i,dailyOutputFile)

monthlyOutputFileName.write(accountsTotalLog_header_row + "Total Net Worth" + "\n")
monthlyOutputFileName.write(accountsTotalLog_data_row + "$" + str(totalNetWorth) + "\n")
print('Total Net Worth: $' + str(totalNetWorth))
dailyOutputFile.write('Total Net Worth,,$' + str(totalNetWorth) + ',,,,' + "\n")
dailyOutputFile.close()
monthlyOutputFileName.close()

# Closing file
jsonInputFile.close()
