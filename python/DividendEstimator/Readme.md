Video: https://youtu.be/XQwcvTf2eN0

I created a python program that will read in a JSON input file that contains a list of securities with dividends.
Each security object contains a ticker, name and a list of historical dividends.
To run the program enter the command:
python dividendEstimator.py inputSample.json (you can change the name of the input file)

The program will read through all of the securities and give you a list to choose from.
The security must have at least 1 dividend price to appear in the list.
Type in the ticker you wan't and then it will ask for the amount of shares you want to calculate.
It then reads through the list of historical dividends in the file and will find the smallest, average, largest and last dividends.
For this to work place your dividends from oldest to newest so that the last dividend that was paid is last in the list.

Then it will ask for how much you want your total dividend to be on the next payout.
It will then calculate how many shares are needed based on the 4 estimates from above.
Since the user entered a share count earlier it will subtract that number from the number it calculates to give you an estimate of shares to reach the estimated total dividend.
