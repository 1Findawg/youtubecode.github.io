public class StandardCard {
	private int value;
	private String suit;
	private String color;
	
	public StandardCard(int value, String suit) {
		this.value = value;
		this.suit = suit;
		if (this.suit.equals("Hearts") || this.suit.equals("Diamonds")) {
			this.color = "Red";
		}
		if (this.suit.equals("Clubs") || this.suit.equals("Spades")) {
			this.color = "Black";
		}
	}
	
	public int getValue() {
		return this.value;
	}
	
	public String getSuit() {
		return this.suit;
	}
	
	public String getColor() {
		return this.color;
	}
	
	public String convertValueToName() {
		switch(this.value) {
			case 1: return "Ace";
			case 2: return "Two";
			case 3: return "Three";
			case 4: return "Four";
			case 5: return "Five";
			case 6: return "Six";
			case 7: return "Seven";
			case 8: return "Eight";
			case 9: return "Nine";
			case 10: return "Ten";
			case 11: return "Jack";
			case 12: return "Queen";
			case 13: return "King";
			case 14: return "Ace";
			default: return "Value not Valid";
		}
	}
	
	public String toString() {
		return (convertValueToName() + " of " + this.suit);
	}

	public static void main(String[] args) {
		// Suits - Done
		// Value - Done
		// Color - Done
		// getters - Done
		// toString - Done
		// convertValueToName - Done
		
		StandardCard card = new StandardCard(1,"Hearts");
		System.out.println(card.toString());

	}

}
