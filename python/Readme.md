I created a program that will read in a JSON file and for any publically traded security given it will look it up using Yahoo Finance. 
Then it will scrub the current price from the webpage and multiply it by the number of shares given in the JSON file. 
Then a total for each account is calculated and a total asset calculation is executed.
First the individual full detailed report is created in a folder for the current month (when the program was initiated).
Second a monthly account log is created or appeneded too so there is one file that has only account values and asset totals.
