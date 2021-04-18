import java.util.ArrayList;
import java.util.Arrays;

public class StandardDeck {
	private ArrayList<StandardCard> deck = new ArrayList<StandardCard>();
	
	public StandardDeck() {
		reset();
		shuffleDeck();
	}
	
	public void reset() {
		this.deck.clear();
		// Adding in hearts suit
		for (int i = 2; i < 15; i++) {
			deck.add(new StandardCard(i,"Hearts"));
		}
		
		// Adding in diamonds suit
		for (int j = 2; j < 15; j++) {
			deck.add(new StandardCard(j,"Diamonds"));
		}
		
		// Adding in spades suit
		for (int k = 2; k < 15; k++) {
			deck.add(new StandardCard(k,"Spades"));
		}
		
		// Adding in clubs suit
		for (int l = 2; l < 15; l++) {
			deck.add(new StandardCard(l,"Clubs"));
		}
	}
	
	public void shuffleDeck() {
		ArrayList<StandardCard> tempDeck = new ArrayList<StandardCard>();
		while (this.deck.size() > 0) {
			int randomIndex = ((int) (Math.random() * 100)) % this.deck.size();
			tempDeck.add(this.deck.remove(randomIndex));
		}
		this.deck = tempDeck;
	}
	
	public StandardCard getNextCard() {
		return this.deck.remove(this.deck.size()-1);
	}
	
	public int getRemainingCardCount() {
		return this.deck.size();
	}
	
	public static void main(String[] args) {
		// List of StandardCard's - Done
		// reset (clears and adds new list of cards) - Done
		// shuffle deck - Done
		// get next card - Done
		// get remaining number of cards - Done
		
		StandardDeck sd = new StandardDeck();
		System.out.println(sd.deck.toString());
		System.out.println(sd.getNextCard());
		System.out.println(sd.getNextCard());
		System.out.println(sd.getNextCard());
		System.out.println(sd.getNextCard());
		System.out.println(sd.getRemainingCardCount());

	}

}
