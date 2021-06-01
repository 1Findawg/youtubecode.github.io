import java.util.Arrays;

public class Player {
	private String name;
	private int balance;
	private StandardCard[] holeCards = new StandardCard[2];
	private boolean isInGame;
	
	public Player(String name, int balance, StandardCard[] holeCards) {
		this.name = name;
		this.balance = balance;
		this.holeCards = holeCards;
		this.isInGame = true;
	}
	
	public String getName() {
		return this.name;
	}

	public int getBalance() {
		return this.balance;
	}
	
	public void addToBalance(int additionAmount) {
		this.balance += additionAmount;
	}
	
	public void reduceFromBalance(int reduceAmount) {
		this.balance -= reduceAmount;
	}
	
	public StandardCard[] getHoleCards() {
		return this.holeCards;
	}
	
	public void setHoleCards(StandardCard[] holeCards) {
		this.holeCards = holeCards;
	}
	
	public boolean getIsInGame() {
		return this.isInGame;
	}
	
	public void setIsInGame(boolean isInGame) {
		this.isInGame = isInGame;
	}

	public String toString() {
		return ("Player: " + this.name + " has a balance of " + this.balance + 
				".\nHole cards: " + Arrays.toString(this.holeCards) + ".\nIn the game: " + this.isInGame);
	}
	
	public static void main(String[] args) {
		// Name -Done
		// - get name - Done
		// Balance - Done
		// - get balance, reduce balance, increase balance - Done
		// Hand list of cards - Done
		// boolean isInGame - Done
		StandardCard[] holeCards = {new StandardCard(1,"Hearts"),new StandardCard(2,"Hearts")};
		Player p1 = new Player("1Findawg", 100, holeCards);
		System.out.println(p1.getName());
		System.out.println(p1.getBalance());
		p1.addToBalance(2);
		System.out.println(p1.getBalance());
		p1.reduceFromBalance(2);
		System.out.println(p1.getBalance());
		System.out.println(Arrays.toString(p1.getHoleCards()));
		System.out.println(p1.toString());
		StandardCard[] holeCards2 = {new StandardCard(10,"Hearts"),new StandardCard(14,"Diamonds")};
		p1.setHoleCards(holeCards2);
		System.out.println(Arrays.toString(p1.getHoleCards()));
	}

}
