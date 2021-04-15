import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class SlotMachine {
	private int numOfReels;
	private int selectionsPerReel;
	private int costPerReel;
	private int balance;
	private int viewBox;
	private int costPerPayline;
	private int paylineReward;
	
	// Constructor inputs (# reels, selections per reel, cost peer reel)
	public SlotMachine(int numOfReels, int selectionsPerReel, int costPerReel, int balance, int viewBox, int paylineReward) {
		this.numOfReels = numOfReels;
		this.selectionsPerReel = selectionsPerReel;
		this.costPerReel = costPerReel;
		this.balance = balance;
		this.viewBox = viewBox;
		this.costPerPayline = this.costPerReel * this.numOfReels;
		this.paylineReward = paylineReward;
		boolean canPlay = true;
		if (this.numOfReels < 3) {
			System.out.println("Need to increase number reels");
			canPlay = false;
		}
		if (this.selectionsPerReel < 3) { 
			System.out.println("Need to increase number Selections");
			canPlay = false;
		}
		if (this.viewBox % 2 == 0) { 
			System.out.println("Need to have an odd number of lines in the view box");
			canPlay = false;
		}
		System.out.println(toString());
		while (canPlay) {
			spin();
			// When balance is below the cost of 1 pay line then stop loop
			if (this.balance < this.costPerPayline) {
				canPlay = false;
			}
		}
		System.out.println("Game Over!!");
	}
	
	private void spin() {
		Scanner scan = new Scanner(System.in);
		System.out.println(getPaylines());
		System.out.println("Please enter the numbers of the paylines you want, seperated by commas, and press enter to play!");
		String[] paylinesSelected = scan.next().split(",");
		int spinCost = paylinesSelected.length * this.costPerPayline;
			if (spinCost <= this.balance) {
			int[][] spinResults = getSpinResults();
			checkForWinners(paylinesSelected, spinResults);
			for (int i = 0; i < spinResults.length; i++) {
				System.out.println(Arrays.toString(spinResults[i]));
			}
			this.balance -= spinCost;
			System.out.println("This spin cost you: " + spinCost);
			System.out.println("Your Balance is now : " + this.balance);
			}
			else {
				System.out.println("You do not have enough to make this bet");
			}
	}
	
	private String getPaylines() {
		StringBuffer result = new StringBuffer();
		// 1. Top Line
		// 2. Middle Line
		// 3. Bottom Line
		// 4. three line "W"
		// 5. three line "W" upside down
		// 6. "V"
		// 7. upside down "V"
		
		result.append("Payline 1: Top Line\n");
		result.append("Payline 2: Middle Line\n");
		result.append("Payline 3: Bottom Line\n");
		if (this.numOfReels == 5 && this.selectionsPerReel == 3) {
			result.append("Payline 4: 'W'\n");
			result.append("Payline 5: 'M'\n");
			result.append("Payline 6: 'V'\n");
			result.append("Payline 7: Upside down 'V'\n");
		}
		return result.toString();
	}
	
	private int[][] getSpinResults() {
		int[][] spinResults = new int[this.viewBox][this.numOfReels];
		for (int j = 0; j < spinResults[0].length; j++) {
			spinResults[0][j] = (int) (Math.floor(Math.random() * 10) % this.selectionsPerReel);
			for (int i = 1; i < spinResults.length; i++) {
				spinResults[i][j] = (spinResults[i-1][j] + 1) % this.selectionsPerReel;
			}
		}
		
		return spinResults;
	}
	
	private void checkForWinners(String[] paylinesSelected, int[][] spinReels) {
		ArrayList<Integer> selectedPaylines = new ArrayList<Integer>();
		for (int i = 0; i < paylinesSelected.length; i++) {
			selectedPaylines.add(Integer.parseInt(paylinesSelected[i]));
		}
		// Payline 1 top row
		if (paylineOneWinner(spinReels) && selectedPaylines.contains(1)) {
			System.out.println("Payline 1 is a WINNER!!!");
			this.balance += this.paylineReward;
		}
		// Payline 2 middle row
		if (paylineTwoWinner(spinReels) && selectedPaylines.contains(2)) {
			System.out.println("Payline 2 is a WINNER!!!");
			this.balance += this.paylineReward;
		}
		// Payline 3 bottom row
		if (paylineThreeWinner(spinReels)  && selectedPaylines.contains(3)) {
			System.out.println("Payline 3 is a WINNER!!!");
			this.balance += this.paylineReward;
		}
		if (this.numOfReels == 5 && this.viewBox == 3) {
			// 4. three line "W"
			if (paylineFourWinner(spinReels)  && selectedPaylines.contains(4)) {
				System.out.println("Payline 4 is a WINNER!!!");
				this.balance += this.paylineReward;
			}
			// 5. three line "M"
			if (paylineFiveWinner(spinReels) && selectedPaylines.contains(5)) {
				System.out.println("Payline 5 is a WINNER!!!");
				this.balance += this.paylineReward;
			}
			// 6. "V"
			if (paylineSixWinner(spinReels) && selectedPaylines.contains(6)) {
				System.out.println("Payline 6 is a WINNER!!!");
				this.balance += this.paylineReward;
			}
			// 7. upside down "V"
			if (paylineSevenWinner(spinReels) && selectedPaylines.contains(7)) {
				System.out.println("Payline 7 is a WINNER!!!");
				this.balance += this.paylineReward;
			}
		}
	}
	
	private boolean paylineOneWinner(int[][] spinReels) {
		int value = spinReels[0][0];
		for (int i = 1; i < spinReels[0].length; i++) {
			if (value != spinReels[0][i]) {
				return false;
			}
		}
		return true;
	}
	
	private boolean paylineTwoWinner(int[][] spinReels) {
		int middleIndex = (spinReels.length/2);
		int value = spinReels[middleIndex][0];
		for (int i = 1; i < spinReels[middleIndex].length; i++) {
			if (value != spinReels[middleIndex][i]) {
				return false;
			}
		}
		return true;
	}
	
	private boolean paylineThreeWinner(int[][] spinReels) {
		int bottomIndex = (spinReels.length-1);
		int value = spinReels[bottomIndex][0];
		for (int i = 1; i < spinReels[bottomIndex].length; i++) {
			if (value != spinReels[bottomIndex][i]) {
				return false;
			}
		}
		return true;
	}
	
	private boolean paylineFourWinner(int[][] spinReels) {
		// 5 reels and 3 in view box ("W")
		int value = spinReels[0][0];
		if (value != spinReels[2][1]) {
			return false;
		}
		if (value != spinReels[0][2]) {
			return false;
		}
		if (value != spinReels[2][3]) {
			return false;
		}
		if (value != spinReels[0][4]) {
			return false;
		}
		return true;
	}
	
	private boolean paylineFiveWinner(int[][] spinReels) {
		// 5 reels and 3 in view box ("M")
		int value = spinReels[2][0];
		if (value != spinReels[0][1]) {
			return false;
		}
		if (value != spinReels[2][2]) {
			return false;
		}
		if (value != spinReels[0][3]) {
			return false;
		}
		if (value != spinReels[2][4]) {
			return false;
		}
		return true;
	}
	
	private boolean paylineSixWinner(int[][] spinReels) {
		// 5 reels and 3 in view box ("V")
		int value = spinReels[0][0];
		if (value != spinReels[1][1]) {
			return false;
		}
		if (value != spinReels[2][2]) {
			return false;
		}
		if (value != spinReels[1][3]) {
			return false;
		}
		if (value != spinReels[0][4]) {
			return false;
		}
		return true;
	}
	
	private boolean paylineSevenWinner(int[][] spinReels) {
		// 5 reels and 3 in view box (upside down "V")
		int value = spinReels[2][2];
		if (value != spinReels[1][1]) {
			return false;
		}
		if (value != spinReels[0][3]) {
			return false;
		}
		if (value != spinReels[1][3]) {
			return false;
		}
		if (value != spinReels[2][4]) {
			return false;
		}
		return true;
	}
	
	public String toString() {
		StringBuffer result = new StringBuffer();
		result.append("Welcome to 1Findawg SlotMania!\n");
		result.append("Number of Reels: " + this.numOfReels + "\n");
		result.append("Selctions Per Reel: " + this.selectionsPerReel + "\n");
		result.append("Cost Per Pay Line: " + this.costPerPayline + "\n");
		result.append("Your balance is: " + this.balance + "\n");
		
		return result.toString();
	}


	public static void main(String[] args) {
		// adjustable number of reels minimum 3 - Done
		// adjustable selections per reel - Done
		// Cost (x * reel) * (# of pay lines) - Done
		// pay lines - Done
		// variable view box minimum 3 - Done
		
		SlotMachine s1 = new SlotMachine(5, 3, 1, 100, 3, 30);
	}

}
