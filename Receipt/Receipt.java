/*
 * Part 1 code is commented out
 */
public class Receipt {
	private String storeName;
	private String cashierName;
	private String greeting;
	private String[][] groceryList;
	private double taxRate;
	private String paymentType;
	
	//Constructor
	public Receipt(String storeName, String cashierName, String greeting, String[][] groceryList, double taxRate,
			String paymentType) {
		this.storeName = storeName;
		this.cashierName = cashierName;
		this.greeting = greeting;
		this.groceryList = groceryList;
		this.taxRate = taxRate;
		this.paymentType = paymentType;
		System.out.println(toString());
	}
	
	public double calculateSubTotal(String[][] groceryList) {
		double result = 0.0;
		for (int i = 0; i < groceryList.length; i++) {
			result += Double.parseDouble(groceryList[i][1]);
		}
		return result;
	}

	public String toString() {
		StringBuffer receiptOutput = new StringBuffer();
		receiptOutput.append(storeName + "\n");
		receiptOutput.append(cashierName + "\n");
		receiptOutput.append(greeting + "\n");
		for (int i = 0; i < groceryList.length; i++) {
			receiptOutput.append(groceryList[i][0] + "\t\t$" + groceryList[i][1] + "\n");
		}
		double subtotal = calculateSubTotal(groceryList);
		receiptOutput.append("SubTotal\t$" + subtotal + "\n");
		receiptOutput.append("Tax\t\t$" + (taxRate * subtotal) + "\n");
		receiptOutput.append("Total\t\t$" + (subtotal + (subtotal * taxRate)) + "\n");
		receiptOutput.append("Payment Type\t" + paymentType + "\n");
		return receiptOutput.toString();
	}
	

	public static void main(String[] args) {
		/*Part 1 code
		 * System.out.println("XYZ Store");
		 * System.out.println("Cashier: 1Findawg");
		 * System.out.println("Thank you for shopping with us!");
		 * System.out.println("Gum\t\t$1.0");
		 * System.out.println("Chips\t\t$3.00");
		 * System.out.println("Donuts\t\t$2.00");
		 * System.out.println("Subtotal\t\t$6.00");
		 * System.out.println("Tax (1%)\t\t$0.06");
		 * System.out.println("Total\t\t$6.06");
		 * System.out.println("Payment Type\t\tCash");
		 */
		String[][] groceryList = {{"Gum","1.50"},{"Chips","3.23"},{"Donuts","2.74"},{"Candy","4.00"},{"Pizza","10.99"}};
		Receipt r1 = new Receipt("XYZ Store","Cashier: 1Findawg","Thank you for shopping with us!",groceryList,.01,"Cash"); 
	}
	
}
