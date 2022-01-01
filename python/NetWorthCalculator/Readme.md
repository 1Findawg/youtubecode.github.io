I created a program that will read in a JSON file and for any publically traded security given it will look it up using Yahoo Finance. 
Then it will scrub the current price from the webpage and multiply it by the number of shares given in the JSON file. 
Then a total for each account is calculated and a total asset calculation is executed.
First the individual full detailed report is created in a folder for the current month (when the program was initiated).
Second a monthly account log is created or appeneded too so there is one file that has only account values and asset totals.

More accounts can be added to the sampleInput.json.
The type field doesn't matter too much except for added securities.
If an account is not labeled in "type" in the json file with "Investment" then it will not read the securities.
Add as many securities as you would like.
The "search" feature is so that if you have a security that is not searchable on the open market you can set to false and add the price your self.
If there is an error trying to get the prices from yahoo the program will wait for you to enter a price for the security then after enter is pressed it will proceed with the remaining list.
